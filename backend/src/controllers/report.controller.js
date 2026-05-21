const reportService = require('../services/report.service');
const ApiResponse = require('../utils/response');

class ReportController {
  /**
   * Create a new report
   */
  async create(req, res) {
    try {
      const report = await reportService.create(req.user.id, req.body);
      
      return ApiResponse.success(res, { report }, 'Report created successfully', 201);
    } catch (error) {
      console.error('Create report error:', error);
      return ApiResponse.error(res, 'Failed to create report');
    }
  }

  /**
   * Get all reports (public)
   */
  async findAll(req, res) {
    try {
      const reports = await reportService.findAll(req.query);
      
      return ApiResponse.success(res, { reports });
    } catch (error) {
      console.error('Get reports error:', error);
      return ApiResponse.error(res, 'Failed to get reports');
    }
  }

  /**
   * Get report by ID
   */
  async findById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user ? req.user.id : null;
      
      const report = await reportService.findById(id, userId);
      
      if (!report) {
        return ApiResponse.notFound(res, 'Report not found');
      }
      
      return ApiResponse.success(res, { report });
    } catch (error) {
      console.error('Get report error:', error);
      return ApiResponse.error(res, 'Failed to get report');
    }
  }

  /**
   * Get current user's reports
   */
  async findMyReports(req, res) {
    try {
      const reports = await reportService.findByUserId(req.user.id);
      
      return ApiResponse.success(res, { reports });
    } catch (error) {
      console.error('Get my reports error:', error);
      return ApiResponse.error(res, 'Failed to get your reports');
    }
  }

  /**
   * Upvote a report
   */
  async upvote(req, res) {
    try {
      const { id } = req.params;
      
      await reportService.upvote(id, req.user.id);
      
      return ApiResponse.success(res, null, 'Report upvoted successfully');
    } catch (error) {
      console.error('Upvote error:', error);
      
      if (error.message === 'You have already upvoted this report') {
        return ApiResponse.error(res, error.message, 409);
      }
      
      return ApiResponse.error(res, 'Failed to upvote report');
    }
  }

  /**
   * Remove upvote from a report
   */
  async removeUpvote(req, res) {
    try {
      const { id } = req.params;
      
      await reportService.removeUpvote(id, req.user.id);
      
      return ApiResponse.success(res, null, 'Upvote removed successfully');
    } catch (error) {
      console.error('Remove upvote error:', error);
      
      if (error.message === 'You have not upvoted this report') {
        return ApiResponse.error(res, error.message, 400);
      }
      
      return ApiResponse.error(res, 'Failed to remove upvote');
    }
  }

  /**
   * Get all reports (admin)
   */
  async findAllAdmin(req, res) {
    try {
      const reports = await reportService.findAll(req.query);
      
      return ApiResponse.success(res, { reports });
    } catch (error) {
      console.error('Get admin reports error:', error);
      return ApiResponse.error(res, 'Failed to get reports');
    }
  }

  /**
   * Verify a report (admin)
   */
  async verify(req, res) {
    try {
      const { id } = req.params;
      const { is_verified } = req.body;
      
      const report = await reportService.verify(id, is_verified, req.user.id);
      
      if (!report) {
        return ApiResponse.notFound(res, 'Report not found');
      }
      
      return ApiResponse.success(res, { report }, `Report ${is_verified ? 'verified' : 'unverified'} successfully`);
    } catch (error) {
      console.error('Verify report error:', error);
      return ApiResponse.error(res, 'Failed to verify report');
    }
  }

  /**
   * Update report status (admin)
   */
  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;
      
      const report = await reportService.updateStatus(id, status, req.user.id, notes);
      
      if (!report) {
        return ApiResponse.notFound(res, 'Report not found');
      }
      
      return ApiResponse.success(res, { report }, 'Report status updated successfully');
    } catch (error) {
      console.error('Update status error:', error);
      return ApiResponse.error(res, 'Failed to update report status');
    }
  }

  /**
   * Get admin statistics
   */
  async getStats(req, res) {
    try {
      const stats = await reportService.getAdminStats();
      
      return ApiResponse.success(res, { stats });
    } catch (error) {
      console.error('Get stats error:', error);
      return ApiResponse.error(res, 'Failed to get statistics');
    }
  }
}

module.exports = new ReportController();
