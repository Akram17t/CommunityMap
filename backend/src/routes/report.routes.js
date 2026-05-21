const express = require('express');
const reportController = require('../controllers/report.controller');
const { validateRequest, authenticate, requireAdmin } = require('../middleware');
const { reportValidators } = require('../validators');

const router = express.Router();

// Public routes
router.get('/', reportValidators.list, validateRequest, reportController.findAll);
router.get('/:id', reportController.findById);

// Protected routes (require authentication)
router.post('/', authenticate, reportValidators.create, validateRequest, reportController.create);
router.get('/user/me', authenticate, reportController.findMyReports);
router.post('/:id/upvote', authenticate, reportController.upvote);
router.delete('/:id/upvote', authenticate, reportController.removeUpvote);

// Admin routes
router.get('/admin/all', authenticate, requireAdmin, reportController.findAllAdmin);
router.patch('/:id/verify', authenticate, requireAdmin, reportValidators.verify, validateRequest, reportController.verify);
router.patch('/:id/status', authenticate, requireAdmin, reportValidators.updateStatus, validateRequest, reportController.updateStatus);
router.get('/admin/stats', authenticate, requireAdmin, reportController.getStats);

module.exports = router;
