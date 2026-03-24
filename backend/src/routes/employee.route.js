const express = require('express');
const router = express.Router();
const {
    getEmployeeProfile,
    updateEmployeeProfile,
    getEmployeeJob
} = require('../controllers/employee.controller');
const { verifyToken, isJobSeeker } = require('../middleware/auth.middleware');

router.get('/profile', verifyToken, isJobSeeker, getEmployeeProfile);
router.put('/profile', verifyToken, isJobSeeker, updateEmployeeProfile);
router.get('/job', verifyToken, isJobSeeker, getEmployeeJob);

module.exports = router;
