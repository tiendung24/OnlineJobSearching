const express = require('express');
const router = express.Router();
const {
    getStats,
    getPendingJobs,
    approveJob,
    rejectJob,
    getUsers,
    toggleUserActive,
    getMonthlyStats
} = require('../controllers/admin.controller');

router.get('/stats', getStats);
router.get('/monthly-stats', getMonthlyStats);
router.get('/pending-jobs', getPendingJobs);
router.patch('/jobs/:id/approve', approveJob);
router.patch('/jobs/:id/reject', rejectJob);
router.get('/users', getUsers);
router.patch('/users/:id/toggle-active', toggleUserActive);

module.exports = router;
