"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Download,
  Eye,
  MessageCircle,
  Search,
  ShieldCheck,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { CategoryIcon } from "@/components/ui/category-icon";
import { InlineState } from "@/components/ui/error-state";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCategory, statusLabels } from "@/features/reports/catalog";
import { downloadAdminReportsCsv, verifyReport } from "@/lib/api/client";
import type { Report, ReportStatus } from "@/types/community-map";

const allStatuses: ReportStatus[] = [
  "new",
  "verified",
  "in_progress",
  "resolved",
  "rejected",
];

export function AdminReportsTable({
  initialReports,
  mode = "all",
}: {
  initialReports: Report[];
  mode?: "all" | "verification";
}) {
  const [reports, setReports] = useState(initialReports);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ReportStatus | "all">(
    mode === "verification" ? "new" : "all",
  );
  const [feedback, setFeedback] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [isPending, startTransition] = useTransition();

  const filteredReports = useMemo(
    () =>
      reports.filter((report) => {
        const matchesMode =
          mode === "all" ||
          ["new", "verified", "in_progress"].includes(report.status);
        const matchesStatus = status === "all" || report.status === status;
        const searchText = `${report.id} ${report.title} ${report.address} ${report.reporterName}`.toLowerCase();
        const matchesQuery =
          query.trim().length === 0 ||
          searchText.includes(query.trim().toLowerCase());

        return matchesMode && matchesStatus && matchesQuery;
      }),
    [mode, query, reports, status],
  );

  function quickVerify(id: string) {
    setFeedback(null);
    setPendingId(id);
    startTransition(async () => {
      try {
        const updated = await verifyReport(id);
        setReports((current) =>
          current.map((report) => (report.id === id ? updated : report)),
        );
        setFeedback(`Laporan ${id} berhasil diverifikasi.`);
      } catch (error) {
        setFeedback(
          error instanceof Error
            ? error.message
            : "Gagal memverifikasi laporan.",
        );
      } finally {
        setPendingId(null);
      }
    });
  }

  async function exportCsv() {
    setFeedback(null);
    setExporting(true);
    try {
      const blob = await downloadAdminReportsCsv();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `communitymap-reports-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.append(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setFeedback("Ekspor CSV berhasil dibuat.");
    } catch (error) {
      setFeedback(
        error instanceof Error ? error.message : "Gagal membuat ekspor CSV.",
      );
    } finally {
      setExporting(false);
    }
  }

  return (
    <section className="rounded-lg border border-[var(--border)] bg-white p-4 shadow-[var(--shadow)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-black">
            {mode === "verification" ? "Antrian Verifikasi" : "Laporan Masuk"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            {mode === "verification"
              ? "Fokus pada laporan baru dan laporan yang masih dalam penanganan."
              : "Kelola seluruh laporan warga, termasuk laporan yang ditolak dan selesai."}
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={exportCsv}
          disabled={exporting}
        >
          <Download className="size-4" />
          {exporting ? "Mengekspor..." : "Ekspor CSV"}
        </Button>
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <label className="flex min-h-10 flex-1 items-center gap-2 rounded-md border border-[var(--border)] px-3">
          <Search className="size-4 text-[var(--muted)]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full bg-transparent text-sm outline-none"
            placeholder="Cari ID, judul, lokasi, atau pelapor..."
          />
        </label>
        <select
          value={status}
          onChange={(event) =>
            setStatus(event.target.value as ReportStatus | "all")
          }
          className="h-10 rounded-md border border-[var(--border)] bg-white px-3 text-sm"
        >
          <option value="all">Status: Semua</option>
          {allStatuses.map((item) => (
            <option key={item} value={item}>
              {statusLabels[item]}
            </option>
          ))}
        </select>
      </div>

      {feedback && (
        <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm">
          {feedback}
        </div>
      )}

      {filteredReports.length === 0 ? (
        <div className="mt-5">
          <InlineState
            title="Tidak ada laporan sesuai filter"
            description="Ubah kata kunci atau status untuk melihat laporan lain."
          />
        </div>
      ) : (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[900px] border-separate border-spacing-y-2 text-left text-sm">
            <thead className="text-xs font-bold text-[var(--muted)]">
              <tr>
                <th className="px-3 py-2">ID Laporan</th>
                <th className="px-3 py-2">Foto</th>
                <th className="px-3 py-2">Lokasi</th>
                <th className="px-3 py-2">Kategori</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Interaksi</th>
                <th className="px-3 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id} className="bg-[var(--surface-strong)]">
                  <td className="rounded-l-lg px-3 py-3 font-semibold">
                    {report.id}
                    <p className="mt-1 text-xs font-normal text-[var(--muted)]">
                      {report.reporterName}
                    </p>
                  </td>
                  <td className="px-3 py-3">
                    <div className="relative size-12 overflow-hidden rounded-md bg-white">
                      <Image
                        src={report.images[0]?.imageUrl || "/images/report-road.svg"}
                        alt={report.images[0]?.alt || report.title}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="max-w-[260px] px-3 py-3">
                    <p className="truncate font-semibold">{report.address}</p>
                    <p className="text-xs text-[var(--muted)]">{report.district}</p>
                  </td>
                  <td className="px-3 py-3">
                    <span className="flex items-center gap-2">
                      <CategoryIcon slug={report.categorySlug} size="sm" />
                      {getCategory(report.categorySlug).name}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <StatusBadge status={report.status} />
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3 text-xs font-bold text-[var(--muted)]">
                      <span className="inline-flex items-center gap-1">
                        <ThumbsUp className="size-3.5" />
                        {report.upvoteCount}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <ThumbsDown className="size-3.5" />
                        {report.downvoteCount}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MessageCircle className="size-3.5" />
                        {report.commentCount}
                      </span>
                    </div>
                  </td>
                  <td className="rounded-r-lg px-3 py-3">
                    <div className="flex gap-2">
                      {report.status === "new" && (
                        <Button
                          type="button"
                          variant="secondary"
                          className="min-h-8 px-3 py-1 text-xs"
                          onClick={() => quickVerify(report.id)}
                          disabled={isPending && pendingId === report.id}
                        >
                          <ShieldCheck className="size-3.5" />
                          {isPending && pendingId === report.id
                            ? "Menyimpan..."
                            : "Verifikasi"}
                        </Button>
                      )}
                      <Link
                        href={`/admin/reports/${report.id}`}
                        className="inline-flex min-h-8 items-center justify-center gap-1 rounded-md border border-[var(--border)] bg-white px-3 text-xs font-bold transition hover:border-[var(--teal)]"
                      >
                        <Eye className="size-3.5" />
                        Detail
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
