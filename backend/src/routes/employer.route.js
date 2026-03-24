const express = require('express');
const router = express.Router();
const { verifyToken, isEmployer } = require('../middleware/auth.middleware');
const { uploadLogo: uploadLogoMiddleware } = require('../middleware/upload.middleware');
const {
    getCompanyProfile,
    createCompanyProfile,
    updateCompanyProfile,
    uploadLogo,
    getMyJobs,
    createJob,
    getJobApplications,
    getApplicationDetail,
    updateApplicationStatus,
    getEmployees,
    updateEmployeeStatus,
    getEmployeeDetail,
    updateEmployeeProfile
} = require('../controllers/employer.controller');

// All routes require user to be logged in and have Employer role
router.use(verifyToken, isEmployer);

// Company Profile endpoints
router.get('/company', getCompanyProfile);
router.post('/company', createCompanyProfile);
router.put('/company', updateCompanyProfile);
router.post('/company/upload-logo', uploadLogoMiddleware, uploadLogo);

// Job Management endpoints
router.get('/jobs', getMyJobs);
router.post('/jobs', createJob);
router.get('/jobs/:jobId/applications', getJobApplications);
router.get('/applications/:applicationId', getApplicationDetail);
router.patch('/applications/:applicationId/status', updateApplicationStatus);
router.get('/employees', getEmployees);
router.get('/employees/:employeeId', getEmployeeDetail);
router.patch('/employees/:employeeId/profile', updateEmployeeProfile);
router.patch('/employees/:employeeId/status', updateEmployeeStatus);

module.exports = router;
