const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
const {
    getStats,
    getPendingJobs,
    approveJob,
    rejectJob,
    getUsers,
    toggleUserActive,
    getMonthlyStats,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/admin.controller');

router.use(verifyToken, isAdmin);

router.get('/stats', getStats);
router.get('/monthly-stats', getMonthlyStats);
router.get('/pending-jobs', getPendingJobs);
router.patch('/jobs/:id/approve', approveJob);
router.patch('/jobs/:id/reject', rejectJob);
router.get('/users', getUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/toggle-active', toggleUserActive);

module.exports = router;
