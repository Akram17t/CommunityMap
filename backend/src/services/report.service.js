const db = require('../config/database');

class ReportService {
  /**
   * Create a new report
   */
  async create(reporterId, data) {
    const { category_id, title, description, latitude, longitude, address } = data;
    
    const result = await db.query(
      `INSERT INTO reports (reporter_id, category_id, title, description, latitude, longitude, address)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [reporterId, category_id, title, description, latitude, longitude, address || null]
    );
    
    return result.rows[0];
  }

  /**
   * Get all reports with filters
   */
  async findAll(filters = {}, userId = null) {
    const { category, status, date_from, date_to, sort_by = 'newest', page = 1, limit = 20 } = filters;
    
    let query = `
      SELECT r.*,
             json_build_object(
               'id', u.id,
               'full_name', u.full_name
             ) as reporter,
             json_build_object(
               'id', c.id,
               'name', c.name
             ) as category,
             COALESCE(
               (SELECT json_agg(json_build_object(
                 'id', ri.id,
                 'image_url', ri.image_url
               ))
               FROM report_images ri
               WHERE ri.report_id = r.id),
               '[]'::json
             ) as images,
             ${userId ? `
             EXISTS(
               SELECT 1 FROM report_upvotes ru
               WHERE ru.report_id = r.id AND ru.user_id = $${userId ? 6 : 5}
             ) as has_upvoted` : 'false as has_upvoted'}
      FROM reports r
      JOIN users u ON r.reporter_id = u.id
      JOIN report_categories c ON r.category_id = c.id
      WHERE 1=1
    `;
    
    const params = [];
    let paramIndex = 0;
    
    if (category) {
      paramIndex++;
      query += ` AND r.category_id = $${paramIndex}`;
      params.push(category);
    }
    
    if (status) {
      paramIndex++;
      query += ` AND r.status = $${paramIndex}`;
      params.push(status);
    }
    
    if (date_from) {
      paramIndex++;
      query += ` AND r.created_at >= $${paramIndex}`;
      params.push(date_from);
    }
    
    if (date_to) {
      paramIndex++;
      query += ` AND r.created_at <= $${paramIndex}`;
      params.push(date_to);
    }
    
    // Sorting
    const sortOptions = {
      newest: 'r.created_at DESC',
      oldest: 'r.created_at ASC',
      upvotes: 'r.upvote_count DESC',
    };
    query += ` ORDER BY ${sortOptions[sort_by] || sortOptions.newest}`;
    
    // Pagination
    paramIndex++;
    query += ` LIMIT $${paramIndex}`;
    params.push(limit);
    
    paramIndex++;
    query += ` OFFSET $${paramIndex}`;
    params.push((page - 1) * limit);
    
    const result = await db.query(query, params);
    
    return result.rows;
  }

  /**
   * Get report by ID
   */
  async findById(id, userId = null) {
    const query = `
      SELECT r.*,
             json_build_object(
               'id', u.id,
               'full_name', u.full_name
             ) as reporter,
             json_build_object(
               'id', c.id,
               'name', c.name
             ) as category,
             COALESCE(
               (SELECT json_agg(json_build_object(
                 'id', ri.id,
                 'image_url', ri.image_url
               ))
               FROM report_images ri
               WHERE ri.report_id = r.id),
               '[]'::json
             ) as images,
             ${userId ? `
             EXISTS(
               SELECT 1 FROM report_upvotes ru
               WHERE ru.report_id = r.id AND ru.user_id = $2
             ) as has_upvoted` : 'false as has_upvoted'}
      FROM reports r
      JOIN users u ON r.reporter_id = u.id
      JOIN report_categories c ON r.category_id = c.id
      WHERE r.id = $1
    `;
    
    const result = await db.query(query, userId ? [id, userId] : [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  }

  /**
   * Get reports by user ID
   */
  async findByUserId(userId) {
    const result = await db.query(
      `SELECT r.*,
              json_build_object(
                'id', c.id,
                'name', c.name
              ) as category,
              COALESCE(
                (SELECT json_agg(json_build_object(
                  'id', ri.id,
                  'image_url', ri.image_url
                ))
                FROM report_images ri
                WHERE ri.report_id = r.id),
                '[]'::json
              ) as images,
              false as has_upvoted
       FROM reports r
       JOIN report_categories c ON r.category_id = c.id
       WHERE r.reporter_id = $1
       ORDER BY r.created_at DESC`,
      [userId]
    );
    
    return result.rows;
  }

  /**
   * Verify a report
   */
  async verify(reportId, isVerified, adminId) {
    const result = await db.query(
      `UPDATE reports 
       SET is_verified = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [isVerified, reportId]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    // Log status change
    await db.query(
      `INSERT INTO report_status_logs (report_id, changed_by, old_status, new_status, notes)
       VALUES ($1, $2, (SELECT status FROM reports WHERE id = $1), (SELECT status FROM reports WHERE id = $1), $3)`,
      [reportId, adminId, isVerified ? 'Report verified' : 'Report unverified']
    );
    
    return result.rows[0];
  }

  /**
   * Update report status
   */
  async updateStatus(reportId, newStatus, adminId, notes = null) {
    // Get current status
    const currentResult = await db.query(
      'SELECT status FROM reports WHERE id = $1',
      [reportId]
    );
    
    if (currentResult.rows.length === 0) {
      return null;
    }
    
    const oldStatus = currentResult.rows[0].status;
    
    // Update status
    const result = await db.query(
      `UPDATE reports 
       SET status = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [newStatus, reportId]
    );
    
    // Log status change
    await db.query(
      `INSERT INTO report_status_logs (report_id, changed_by, old_status, new_status, notes)
       VALUES ($1, $2, $3, $4, $5)`,
      [reportId, adminId, oldStatus, newStatus, notes]
    );
    
    return result.rows[0];
  }

  /**
   * Upvote a report
   */
  async upvote(reportId, userId) {
    try {
      await db.query(
        `INSERT INTO report_upvotes (report_id, user_id)
         VALUES ($1, $2)`,
        [reportId, userId]
      );
      
      // Update upvote count
      await db.query(
        `UPDATE reports 
         SET upvote_count = upvote_count + 1
         WHERE id = $1`,
        [reportId]
      );
      
      return true;
    } catch (error) {
      if (error.code === '23505') {
        throw new Error('You have already upvoted this report');
      }
      throw error;
    }
  }

  /**
   * Remove upvote from a report
   */
  async removeUpvote(reportId, userId) {
    const result = await db.query(
      `DELETE FROM report_upvotes 
       WHERE report_id = $1 AND user_id = $2
       RETURNING *`,
      [reportId, userId]
    );
    
    if (result.rows.length === 0) {
      throw new Error('You have not upvoted this report');
    }
    
    // Update upvote count
    await db.query(
      `UPDATE reports 
       SET upvote_count = GREATEST(upvote_count - 1, 0)
       WHERE id = $1`,
      [reportId]
    );
    
    return true;
  }

  /**
   * Add image to report
   */
  async addImage(reportId, imageUrl, storageKey) {
    const result = await db.query(
      `INSERT INTO report_images (report_id, image_url, storage_key)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [reportId, imageUrl, storageKey]
    );
    
    return result.rows[0];
  }

  /**
   * Get admin statistics
   */
  async getAdminStats() {
    const statsQuery = `
      SELECT 
        (SELECT COUNT(*) FROM reports) as total_reports,
        (SELECT COUNT(*) FROM reports WHERE status = 'new' AND is_verified = false) as pending_verification,
        (SELECT COUNT(*) FROM reports WHERE status = 'in_progress') as in_progress,
        (SELECT COUNT(*) FROM reports WHERE status = 'resolved' AND updated_at >= date_trunc('month', NOW())) as resolved_this_month
    `;
    
    const topCategoriesQuery = `
      SELECT c.name as category, COUNT(r.id) as count
      FROM report_categories c
      LEFT JOIN reports r ON c.id = r.category_id
      GROUP BY c.id, c.name
      ORDER BY count DESC
      LIMIT 5
    `;
    
    const [statsResult, categoriesResult] = await Promise.all([
      db.query(statsQuery),
      db.query(topCategoriesQuery),
    ]);
    
    return {
      ...statsResult.rows[0],
      top_categories: categoriesResult.rows,
    };
  }
}

module.exports = new ReportService();
