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
    createJob
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

module.exports = router;
