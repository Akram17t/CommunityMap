const { query, withTransaction } = require("../../lib/db");
const { HttpError, assert } = require("../../lib/http");

const allowedStatuses = ["new", "verified", "in_progress", "resolved", "rejected"];
const allowedSorts = ["latest", "upvotes", "downvotes"];

function getDefaultImageForCategory(categorySlug) {
  const defaults = {
    pothole: "/images/report-pothole.svg",
    streetlight: "/images/report-streetlight.svg",
    puddle: "/images/report-puddle.svg",
    flood: "/images/report-flood.svg",
    other: "/images/report-road.svg",
  };

  return defaults[categorySlug] || defaults.other;
}

function deriveDistrict(address) {
  if (!address) {
    return "Wilayah belum diketahui";
  }

  const parts = address
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  return parts.at(-1) || address;
}

function generateReferenceCode() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `RPT-${year}-${month}${day}-${suffix}`;
}

function normalizeViewer(viewer) {
  if (!viewer) return null;
  if (typeof viewer === "string") return { id: viewer, role: "citizen" };
  return viewer;
}

function mapComment(row) {
  return {
    id: row.id,
    reportId: row.report_id,
    userId: row.user_id,
    userName: row.user_name || "Warga",
    userUsername: row.user_username || "warga",
    userAvatarUrl: row.user_avatar_url || null,
    parentId: row.parent_id || null,
    body: row.body,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapReportRow(row) {
  const images = Array.isArray(row.images) ? row.images : [];
  const reportImages = images.filter((image) => image.kind !== "resolution_proof");
  const resolutionImages = images.filter((image) => image.kind === "resolution_proof");

  return {
    id: row.reference_code,
    reporterId: row.reporter_id,
    reporterName: row.reporter_name || "Anonim",
    reporterUsername: row.reporter_username || "anonim",
    reporterAvatarUrl: row.reporter_avatar_url || null,
    categorySlug: row.category_slug,
    title: row.title,
    description: row.description,
    address: row.address || "",
    district: row.district || deriveDistrict(row.address),
    coordinates: {
      latitude: Number(row.latitude),
      longitude: Number(row.longitude),
    },
    status: row.status,
    isVerified: row.is_verified,
    upvoteCount: Number(row.upvote_count || 0),
    downvoteCount: Number(row.downvote_count || 0),
    commentCount: Number(row.comment_count || 0),
    rejectionReason: row.rejection_reason || null,
    rejectedAt: row.rejected_at || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    images: reportImages.length > 0 ? reportImages : images,
    resolutionImages,
    comments: Array.isArray(row.comments) ? row.comments : [],
    statusLogs: Array.isArray(row.status_logs)
      ? row.status_logs.map((log) => ({
          id: log.id,
          previousStatus: log.previousStatus || undefined,
          nextStatus: log.nextStatus,
          note: log.note,
          updatedBy: log.updatedBy,
          createdAt: log.createdAt,
        }))
      : [],
    hasUpvoted: Boolean(row.has_upvoted),
    hasDownvoted: Boolean(row.has_downvoted),
  };
}

function buildReportQuery(filters = {}) {
  const values = [];
  const conditions = [];
  const viewer = normalizeViewer(filters.viewer);
  const viewerOwnRejected =
    viewer?.id && filters.reporterId && String(filters.reporterId) === String(viewer.id);

  if (!filters.includeRejected && !viewerOwnRejected) {
    conditions.push(`r.status <> 'rejected'`);
  }

  if (filters.referenceCode) {
    values.push(filters.referenceCode);
    conditions.push(`r.reference_code = $${values.length}`);
  }

  if (filters.reporterId) {
    values.push(filters.reporterId);
    conditions.push(`r.reporter_id = $${values.length}`);
  }

  if (filters.category) {
    const categories = Array.isArray(filters.category)
      ? filters.category
      : String(filters.category)
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);

    if (categories.length > 0) {
      values.push(categories);
      conditions.push(`c.slug = ANY($${values.length})`);
    }
  }

  if (filters.status) {
    const statuses = Array.isArray(filters.status)
      ? filters.status
      : String(filters.status)
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);

    if (statuses.length > 0) {
      values.push(statuses);
      conditions.push(`r.status = ANY($${values.length})`);
    }
  }

  if (filters.district && filters.district !== "all") {
    values.push(`%${filters.district}%`);
    conditions.push(`r.district ILIKE $${values.length}`);
  }

  if (filters.search) {
    values.push(`%${filters.search}%`);
    conditions.push(
      `(r.reference_code ILIKE $${values.length} OR r.title ILIKE $${values.length} OR COALESCE(r.address, '') ILIKE $${values.length})`,
    );
  }

  if (filters.dateRange === "7d") {
    conditions.push(`r.created_at >= NOW() - INTERVAL '7 days'`);
  } else if (filters.dateRange === "30d") {
    conditions.push(`r.created_at >= NOW() - INTERVAL '30 days'`);
  }

  const sort = allowedSorts.includes(filters.sort) ? filters.sort : "latest";
  const orderBy =
    sort === "upvotes"
      ? "r.upvote_count DESC, r.created_at DESC"
      : sort === "downvotes"
        ? "r.downvote_count DESC, r.created_at DESC"
        : "r.created_at DESC";

  return {
    orderBy,
    values,
    whereClause: conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "",
  };
}

async function hydrateReports(rows, viewer) {
  if (rows.length === 0) return [];

  const reportIds = rows.map((row) => row.internal_id);
  const imagesMap = new Map();
  const logsMap = new Map();
  const commentsMap = new Map();
  const upvotedIds = new Set();
  const downvotedIds = new Set();
  const commentCounts = new Map();

  const inPlaceholders = reportIds.map((_, i) => `$${i + 1}`).join(", ");
  const imagesResult = await query(
    `
      SELECT
        id::text AS id,
        report_id,
        image_url,
        storage_key,
        COALESCE(kind, 'report') AS kind,
        COALESCE(alt_text, 'Foto laporan kondisi jalan') AS alt_text
      FROM report_images
      WHERE report_id IN (${inPlaceholders})
      ORDER BY created_at
    `,
    reportIds,
  );

  for (const image of imagesResult.rows) {
    const current = imagesMap.get(image.report_id) || [];
    current.push({
      id: image.id,
      imageUrl: image.image_url,
      storageKey: image.storage_key,
      kind: image.kind,
      alt: image.alt_text,
    });
    imagesMap.set(image.report_id, current);
  }

  const logsResult = await query(
    `
      SELECT
        rsl.id::text AS id,
        rsl.report_id,
        rsl.previous_status,
        rsl.next_status,
        COALESCE(rsl.note, '') AS note,
        COALESCE(u.full_name, 'System') AS updated_by_name,
        rsl.created_at
      FROM report_status_logs rsl
      LEFT JOIN users u ON u.id = rsl.updated_by
      WHERE rsl.report_id IN (${inPlaceholders})
      ORDER BY rsl.created_at DESC
    `,
    reportIds,
  );

  for (const log of logsResult.rows) {
    const current = logsMap.get(log.report_id) || [];
    current.push({
      id: log.id,
      previousStatus: log.previous_status,
      nextStatus: log.next_status,
      note: log.note,
      updatedBy: log.updated_by_name,
      createdAt: log.created_at,
    });
    logsMap.set(log.report_id, current);
  }

  const commentsResult = await query(
    `
      SELECT
        rc.id::text AS id,
        rc.report_id,
        rc.user_id,
        rc.parent_id,
        COALESCE(u.full_name, 'Warga') AS user_name,
        u.username AS user_username,
        u.avatar_url AS user_avatar_url,
        rc.body,
        rc.created_at,
        rc.updated_at
      FROM report_comments rc
      INNER JOIN users u ON u.id = rc.user_id
      WHERE rc.report_id IN (${inPlaceholders})
      ORDER BY rc.created_at ASC
    `,
    reportIds,
  );

  for (const commentRow of commentsResult.rows) {
    const current = commentsMap.get(commentRow.report_id) || [];
    current.push(mapComment(commentRow));
    commentsMap.set(commentRow.report_id, current);
    commentCounts.set(commentRow.report_id, (commentCounts.get(commentRow.report_id) || 0) + 1);
  }

  if (viewer?.id) {
    const upvoteResult = await query(
      `
        SELECT report_id
        FROM report_upvotes
        WHERE user_id = $1
          AND report_id IN (${reportIds.map((_, i) => `$${i + 2}`).join(", ")})
      `,
      [viewer.id, ...reportIds],
    );

    for (const upvote of upvoteResult.rows) {
      upvotedIds.add(upvote.report_id);
    }

    const downvoteResult = await query(
      `
        SELECT report_id
        FROM report_downvotes
        WHERE user_id = $1
          AND report_id IN (${reportIds.map((_, i) => `$${i + 2}`).join(", ")})
      `,
      [viewer.id, ...reportIds],
    );

    for (const downvote of downvoteResult.rows) {
      downvotedIds.add(downvote.report_id);
    }
  }

  return rows.map((row) =>
    mapReportRow({
      ...row,
      images: imagesMap.get(row.internal_id) || [
        {
          id: `${row.reference_code}-fallback`,
          imageUrl: getDefaultImageForCategory(row.category_slug),
          storageKey: `fallback/${row.category_slug}.svg`,
          kind: "report",
          alt: row.title,
        },
      ],
      status_logs: logsMap.get(row.internal_id) || [],
      comments: commentsMap.get(row.internal_id) || [],
      comment_count: commentCounts.get(row.internal_id) || 0,
      has_upvoted: upvotedIds.has(row.internal_id),
      has_downvoted: downvotedIds.has(row.internal_id),
    }),
  );
}

async function listReports(filters = {}) {
  const viewer = normalizeViewer(filters.viewer || filters.viewerId);
  const { values, whereClause, orderBy } = buildReportQuery({
    ...filters,
    viewer,
  });
  const result = await query(
    `
      SELECT
        r.id AS internal_id,
        r.reference_code,
        r.reporter_id,
        u.username AS reporter_username,
        COALESCE(u.full_name, 'Anonim') AS reporter_name,
        u.avatar_url AS reporter_avatar_url,
        c.slug AS category_slug,
        r.title,
        r.description,
        r.latitude,
        r.longitude,
        r.address,
        r.district,
        r.status,
        r.is_verified,
        r.upvote_count,
        COALESCE(r.downvote_count, 0) AS downvote_count,
        r.rejection_reason,
        r.rejected_at,
        r.created_at,
        r.updated_at
      FROM reports r
      INNER JOIN report_categories c ON c.id = r.category_id
      LEFT JOIN users u ON u.id = r.reporter_id
      ${whereClause}
      ORDER BY ${orderBy}
    `,
    values,
  );

  return hydrateReports(result.rows, viewer);
}

async function getReportByReferenceCode(referenceCode, viewerInput) {
  const viewer = normalizeViewer(viewerInput);
  const reports = await listReports({
    referenceCode,
    viewer,
    includeRejected: true,
  });
  const report = reports[0] || null;

  if (!report) return null;
  if (
    report.status === "rejected" &&
    viewer?.role !== "admin" &&
    String(viewer?.id || "") !== String(report.reporterId)
  ) {
    return null;
  }

  return report;
}

async function getInternalReport(client, referenceCode) {
  const result = await client.query(
    `
      SELECT id, reference_code, reporter_id, status
      FROM reports
      WHERE reference_code = $1
    `,
    [referenceCode],
  );
  return result.rows[0] || null;
}

async function getCategoryIdBySlug(client, slug) {
  const result = await client.query(
    "SELECT id FROM report_categories WHERE slug = $1",
    [slug],
  );
  return result.rows[0]?.id || null;
}

async function assertReportVisible(referenceCode, viewer) {
  const report = await getReportByReferenceCode(referenceCode, viewer);
  assert(report, 404, "Laporan tidak ditemukan.");
  return report;
}

async function createReport(input, reporterId) {
  assert(input.title?.trim(), 400, "Judul laporan wajib diisi.");
  assert(input.description?.trim(), 400, "Deskripsi laporan wajib diisi.");
  assert(input.categorySlug, 400, "Kategori laporan wajib dipilih.");
  assert(input.imageUrl, 400, "Foto laporan wajib diunggah.");
  assert(
    Number.isFinite(Number(input.latitude)) && Number.isFinite(Number(input.longitude)),
    400,
    "Koordinat laporan tidak valid.",
  );

  const referenceCode = await withTransaction(async (client) => {
    const categoryId = await getCategoryIdBySlug(client, input.categorySlug);
    assert(categoryId, 400, "Kategori laporan tidak dikenal.");

    let nextReferenceCode = generateReferenceCode();
    let attempts = 0;

    while (attempts < 5) {
      try {
        const reportResult = await client.query(
          `
            INSERT INTO reports (
              reference_code,
              reporter_id,
              category_id,
              title,
              description,
              latitude,
              longitude,
              address,
              district,
              status,
              is_verified,
              upvote_count,
              downvote_count,
              created_at,
              updated_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'new', FALSE, 0, 0, NOW(), NOW())
            RETURNING id
          `,
          [
            nextReferenceCode,
            reporterId,
            categoryId,
            input.title.trim(),
            input.description.trim(),
            Number(input.latitude),
            Number(input.longitude),
            input.address?.trim() || "",
            input.district?.trim() || deriveDistrict(input.address),
          ],
        );

        const reportId = reportResult.rows[0].id;
        await client.query(
          `
            INSERT INTO report_images (report_id, image_url, storage_key, kind, alt_text)
            VALUES ($1, $2, $3, 'report', $4)
          `,
          [
            reportId,
            input.imageUrl,
            input.storageKey || `reports/${nextReferenceCode}/cover`,
            input.imageAlt || input.title.trim(),
          ],
        );

        await client.query(
          `
            INSERT INTO report_status_logs (
              report_id,
              previous_status,
              next_status,
              note,
              updated_by
            )
            VALUES ($1, NULL, 'new', $2, NULL)
          `,
          [reportId, "Laporan diterima dari warga."],
        );

        return nextReferenceCode;
      } catch (error) {
        if (
          error.code === "23505" &&
          String(error.detail || error.constraint || "").includes("reference_code")
        ) {
          attempts += 1;
          nextReferenceCode = generateReferenceCode();
          continue;
        }

        throw error;
      }
    }

    throw new HttpError(500, "Gagal membuat ID laporan yang unik.");
  });

  return getReportByReferenceCode(referenceCode, reporterId);
}

async function addUpvote(referenceCode, userId) {
  await withTransaction(async (client) => {
    const target = await getInternalReport(client, referenceCode);
    assert(target, 404, "Laporan tidak ditemukan.");

    const removedDownvote = await client.query(
      `
        DELETE FROM report_downvotes
        WHERE user_id = $1 AND report_id = $2
        RETURNING report_id
      `,
      [userId, target.id],
    );

    const insertedUpvote = await client.query(
      `
        INSERT INTO report_upvotes (user_id, report_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
        RETURNING report_id
      `,
      [userId, target.id],
    );

    await client.query(
      `
        UPDATE reports
        SET
          upvote_count = upvote_count + $2,
          downvote_count = GREATEST(0, downvote_count - $3),
          updated_at = NOW()
        WHERE id = $1
      `,
      [target.id, insertedUpvote.rowCount, removedDownvote.rowCount],
    );
  });

  return getReportByReferenceCode(referenceCode, userId);
}

async function removeUpvote(referenceCode, userId) {
  await withTransaction(async (client) => {
    const target = await getInternalReport(client, referenceCode);
    assert(target, 404, "Laporan tidak ditemukan.");

    const result = await client.query(
      `
        DELETE FROM report_upvotes
        WHERE user_id = $1 AND report_id = $2
        RETURNING report_id
      `,
      [userId, target.id],
    );

    if (result.rowCount > 0) {
      await client.query(
        `
          UPDATE reports
          SET upvote_count = GREATEST(0, upvote_count - 1),
              updated_at = NOW()
          WHERE id = $1
        `,
        [target.id],
      );
    }
  });

  return getReportByReferenceCode(referenceCode, userId);
}

async function addDownvote(referenceCode, userId) {
  await withTransaction(async (client) => {
    const target = await getInternalReport(client, referenceCode);
    assert(target, 404, "Laporan tidak ditemukan.");

    const removedUpvote = await client.query(
      `
        DELETE FROM report_upvotes
        WHERE user_id = $1 AND report_id = $2
        RETURNING report_id
      `,
      [userId, target.id],
    );

    const insertedDownvote = await client.query(
      `
        INSERT INTO report_downvotes (user_id, report_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
        RETURNING report_id
      `,
      [userId, target.id],
    );

    await client.query(
      `
        UPDATE reports
        SET
          upvote_count = GREATEST(0, upvote_count - $2),
          downvote_count = downvote_count + $3,
          updated_at = NOW()
        WHERE id = $1
      `,
      [target.id, removedUpvote.rowCount, insertedDownvote.rowCount],
    );
  });

  return getReportByReferenceCode(referenceCode, userId);
}

async function removeDownvote(referenceCode, userId) {
  await withTransaction(async (client) => {
    const target = await getInternalReport(client, referenceCode);
    assert(target, 404, "Laporan tidak ditemukan.");

    const result = await client.query(
      `
        DELETE FROM report_downvotes
        WHERE user_id = $1 AND report_id = $2
        RETURNING report_id
      `,
      [userId, target.id],
    );

    if (result.rowCount > 0) {
      await client.query(
        `
          UPDATE reports
          SET downvote_count = GREATEST(0, downvote_count - 1),
              updated_at = NOW()
          WHERE id = $1
        `,
        [target.id],
      );
    }
  });

  return getReportByReferenceCode(referenceCode, userId);
}

async function addComment(referenceCode, user, body, parentId = null) {
  assert(body?.trim(), 400, "Komentar wajib diisi.");
  await assertReportVisible(referenceCode, user);

  const result = await withTransaction(async (client) => {
    const target = await getInternalReport(client, referenceCode);
    assert(target, 404, "Laporan tidak ditemukan.");

    if (parentId) {
      const parentComment = await client.query(
        "SELECT id FROM report_comments WHERE id = $1 AND report_id = $2",
        [parentId, target.id]
      );
      assert(parentComment.rowCount > 0, 404, "Komentar yang dibalas tidak ditemukan.");
    }

    const insertResult = await client.query(
      `
        INSERT INTO report_comments (report_id, user_id, parent_id, body, created_at, updated_at)
        VALUES ($1, $2, $3, $4, NOW(), NOW())
        RETURNING id::text AS id, report_id, user_id, parent_id, body, created_at, updated_at
      `,
      [target.id, user.id, parentId, body.trim()],
    );

    const inserted = insertResult.rows[0];
    const uResult = await client.query(
      "SELECT full_name, username, avatar_url FROM users WHERE id = $1",
      [user.id],
    );
    const u = uResult.rows[0] || {};
    inserted.user_name = u.full_name;
    inserted.user_username = u.username;
    inserted.user_avatar_url = u.avatar_url;

    return mapComment(inserted);
  });

  return result;
}

async function updateReportStatus(referenceCode, nextStatus, updatedBy, options = {}) {
  assert(
    allowedStatuses.includes(nextStatus),
    400,
    "Status laporan tidak valid.",
  );
  assert(nextStatus !== "rejected", 400, "Gunakan aksi tolak laporan untuk status ditolak.");

  await withTransaction(async (client) => {
    const current = await getInternalReport(client, referenceCode);
    assert(current, 404, "Laporan tidak ditemukan.");

    if (nextStatus === "resolved") {
      const existingProof = await client.query(
        `
          SELECT id
          FROM report_images
          WHERE report_id = $1 AND kind = 'resolution_proof'
          LIMIT 1
        `,
        [current.id],
      );
      const proofImages = Array.isArray(options.resolutionImages)
        ? options.resolutionImages
        : [];
      assert(
        proofImages.length > 0 || existingProof.rowCount > 0,
        400,
        "Foto bukti perbaikan wajib diunggah sebelum laporan diselesaikan.",
      );

      for (const image of proofImages) {
        await client.query(
          `
            INSERT INTO report_images (report_id, image_url, storage_key, kind, alt_text)
            VALUES ($1, $2, $3, 'resolution_proof', $4)
          `,
          [
            current.id,
            image.imageUrl,
            image.storageKey || `reports/${referenceCode}/resolution`,
            image.alt || "Foto bukti perbaikan",
          ],
        );
      }
    }

    await client.query(
      `
        UPDATE reports
        SET status = $2::varchar,
            is_verified = CASE WHEN $2::text = 'new' THEN FALSE ELSE TRUE END,
            rejection_reason = CASE WHEN $2::text = 'rejected' THEN rejection_reason ELSE NULL END,
            rejected_at = CASE WHEN $2::text = 'rejected' THEN rejected_at ELSE NULL END,
            updated_at = NOW()
        WHERE reference_code = $1
      `,
      [referenceCode, nextStatus],
    );

    await client.query(
      `
        INSERT INTO report_status_logs (
          report_id,
          previous_status,
          next_status,
          note,
          updated_by
        )
        VALUES ($1, $2, $3, $4, $5)
      `,
      [
        current.id,
        current.status,
        nextStatus,
        options.note || `Status laporan diperbarui menjadi ${nextStatus}.`,
        updatedBy,
      ],
    );
  });

  return getReportByReferenceCode(referenceCode, { id: updatedBy, role: "admin" });
}

async function rejectReport(referenceCode, reason, updatedBy) {
  assert(reason?.trim(), 400, "Alasan penolakan wajib diisi.");

  await withTransaction(async (client) => {
    const current = await getInternalReport(client, referenceCode);
    assert(current, 404, "Laporan tidak ditemukan.");

    await client.query(
      `
        UPDATE reports
        SET status = 'rejected',
            is_verified = FALSE,
            rejection_reason = $2,
            rejected_at = NOW(),
            updated_at = NOW()
        WHERE reference_code = $1
      `,
      [referenceCode, reason.trim()],
    );

    await client.query(
      `
        INSERT INTO report_status_logs (
          report_id,
          previous_status,
          next_status,
          note,
          updated_by
        )
        VALUES ($1, $2, 'rejected', $3, $4)
      `,
      [current.id, current.status, reason.trim(), updatedBy],
    );
  });

  return getReportByReferenceCode(referenceCode, { id: updatedBy, role: "admin" });
}

async function getAdminStats() {
  const result = await query(`
    SELECT
      COUNT(*)::int AS total_reports,
      COUNT(*) FILTER (WHERE status = 'new')::int AS new_reports,
      COUNT(*) FILTER (WHERE status = 'verified')::int AS verified_reports,
      COUNT(*) FILTER (WHERE status = 'in_progress')::int AS in_progress_reports,
      COUNT(*) FILTER (WHERE status = 'resolved')::int AS resolved_reports,
      COUNT(*) FILTER (WHERE status = 'rejected')::int AS rejected_reports,
      COALESCE(SUM(upvote_count), 0)::int AS upvotes,
      COALESCE(SUM(downvote_count), 0)::int AS downvotes
    FROM reports
  `);

  const row = result.rows[0];
  return {
    totalReports: row.total_reports,
    newReports: row.new_reports,
    verifiedReports: row.verified_reports,
    inProgressReports: row.in_progress_reports,
    resolvedReports: row.resolved_reports,
    rejectedReports: row.rejected_reports,
    upvotes: row.upvotes,
    downvotes: row.downvotes,
  };
}

function csvCell(value) {
  const text = value === null || value === undefined ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function reportsToCsv(reports) {
  const headers = [
    "ID",
    "Judul",
    "Pelapor",
    "Kategori",
    "Status",
    "Alamat",
    "Wilayah",
    "Upvote",
    "Downvote",
    "Komentar",
    "Dibuat",
    "Diperbarui",
    "Alasan Penolakan",
  ];
  const rows = reports.map((report) => [
    report.id,
    report.title,
    report.reporterName,
    report.categorySlug,
    report.status,
    report.address,
    report.district,
    report.upvoteCount,
    report.downvoteCount,
    report.commentCount,
    report.createdAt,
    report.updatedAt,
    report.rejectionReason || "",
  ]);

  return [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
}

module.exports = {
  allowedStatuses,
  listReports,
  getReportByReferenceCode,
  createReport,
  addUpvote,
  removeUpvote,
  addDownvote,
  removeDownvote,
  addComment,
  updateReportStatus,
  rejectReport,
  getAdminStats,
  reportsToCsv,
};
