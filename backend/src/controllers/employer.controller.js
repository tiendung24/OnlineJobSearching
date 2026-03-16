const { sql } = require('../config/db');

// --- COMPANY PROFILE (UC02) ---

// GET /api/employer/company
// Get company profile for the logged-in employer
const getCompanyProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const result = await sql.query`
            SELECT * FROM Companies WHERE EmployerID = ${userId}
        `;

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Company profile not found.' });
        }

        res.json(result.recordset[0]);
    } catch (err) {
        console.error('getCompanyProfile Error:', err);
        res.status(500).json({ message: 'Server error retrieving company profile.' });
    }
};

// PUT /api/employer/company
// Update company profile
const updateCompanyProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { CompanyName, TaxCode, Address, Description, Size, Industry, Website, LogoUrl } = req.body;

        if (!CompanyName) {
            return res.status(400).json({ message: 'Company Name is required.' });
        }

        const result = await sql.query`
            UPDATE Companies 
            SET 
                CompanyName = ${CompanyName},
                TaxCode = ${TaxCode || null},
                Address = ${Address || null},
                Description = ${Description || null},
                Size = ${Size || null},
                Industry = ${Industry || null},
                Website = ${Website || null},
                LogoUrl = ${LogoUrl || null},
                IsProfileComplete = 1
            OUTPUT INSERTED.*
            WHERE EmployerID = ${userId}
        `;

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Company profile not found.' });
        }

        res.json({ message: 'Company profile updated successfully.', company: result.recordset[0] });
    } catch (err) {
        console.error('updateCompanyProfile Error:', err);
        res.status(500).json({ message: 'Server error updating company profile.' });
    }
};


// --- JOB POSTING (UC01) ---

// GET /api/employer/jobs
// Get all jobs posted by this employer
const getMyJobs = async (req, res) => {
    try {
        const userId = req.user.userId;
        
        // Find company ID first
        const compResult = await sql.query`SELECT CompanyID FROM Companies WHERE EmployerID = ${userId}`;
        if (compResult.recordset.length === 0) {
            return res.status(400).json({ message: 'You must complete your company profile first.' });
        }
        const companyId = compResult.recordset[0].CompanyID;

        const jobs = await sql.query`
            SELECT * FROM Jobs 
            WHERE CompanyID = ${companyId}
            ORDER BY CreatedAt DESC
        `;

        res.json(jobs.recordset);
    } catch (err) {
        console.error('getMyJobs Error:', err);
        res.status(500).json({ message: 'Server error retrieving jobs.' });
    }
};

// POST /api/employer/jobs
// Create a new job posting
const createJob = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { Title, Description, SalaryRange, Location, Level, JobType, Industry, ExpiredAt } = req.body;

        // Basic Validation (UC01 BR3: required fields)
        if (!Title || !Description || !ExpiredAt) {
            return res.status(400).json({ message: 'Title, Description, and Expiration Date are required.' });
        }

        // Validate expiration date (UC01 BR4)
        const expiredDate = new Date(ExpiredAt);
        if (expiredDate < new Date()) {
            return res.status(400).json({ message: 'Application deadline must be a future date.' });
        }

        // 1. Get CompanyID (UC01 BR2: must complete profile)
        const compResult = await sql.query`
            SELECT CompanyID, IsProfileComplete 
            FROM Companies 
            WHERE EmployerID = ${userId}
        `;

        if (compResult.recordset.length === 0) {
            return res.status(404).json({ message: 'Company profile not found.' });
        }

        const company = compResult.recordset[0];
        if (!company.IsProfileComplete) {
            return res.status(403).json({ message: 'Please complete your company profile before posting a job.' });
        }

        // 2. Insert Job
        const request = new sql.Request();
        request.input('CompanyID', sql.Int, company.CompanyID);
        request.input('Title', sql.NVarChar, Title);
        request.input('Description', sql.NVarChar, Description);
        request.input('SalaryRange', sql.NVarChar, SalaryRange || null);
        request.input('Location', sql.NVarChar, Location || null);
        request.input('Level', sql.NVarChar, Level || null);
        request.input('JobType', sql.NVarChar, JobType || null);
        request.input('Industry', sql.NVarChar, Industry || null);
        request.input('Status', sql.VarChar, 'Pending Approval'); // Default status
        request.input('ExpiredAt', sql.DateTime, expiredDate);

        const result = await request.query(`
            INSERT INTO Jobs (CompanyID, Title, Description, SalaryRange, Location, Level, JobType, Industry, Status, ExpiredAt)
            OUTPUT INSERTED.*
            VALUES (@CompanyID, @Title, @Description, @SalaryRange, @Location, @Level, @JobType, @Industry, @Status, @ExpiredAt)
        `);

        res.status(201).json({ 
            message: 'Job posted successfully. Waiting for admin approval.',
            job: result.recordset[0]
        });

    } catch (err) {
        console.error('createJob Error:', err);
        res.status(500).json({ message: 'Server error posting job.' });
    }
};

module.exports = {
    getCompanyProfile,
    updateCompanyProfile,
    getMyJobs,
    createJob
};
