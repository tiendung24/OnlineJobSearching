const { sql } = require('../config/db');

const APPLICATION_STATUS_LABELS = {
    'Sent/Pending': 'New',
    Viewed: 'Reviewing',
    Interviewing: 'Interviewing',
    Rejected: 'Rejected',
    'Hired/Approved': 'Hired / Approved'
};

const normalizeApplicationStatusFilter = (status) => {
    if (!status || status === 'All' || status === 'All Statuses') {
        return null;
    }

    const aliases = {
        New: 'Sent/Pending',
        Reviewing: 'Viewed',
        Approved: 'Hired/Approved',
        Hired: 'Hired/Approved'
    };

    return aliases[status] || status;
};

const normalizeEmployeeStatusFilter = (status) => {
    if (!status || status === 'All' || status === 'All Statuses') {
        return null;
    }

    return status;
};

const getEmployerCompany = async (employerId) => {
    const request = new sql.Request();
    request.input('EmployerID', sql.Int, Number(employerId));

    const result = await request.query(`
        SELECT CompanyID, CompanyName, LogoUrl, IsProfileComplete
        FROM Companies
        WHERE EmployerID = @EmployerID
    `);

    return result.recordset[0] || null;
};

const getEmployerJobById = async (employerId, jobId) => {
    const request = new sql.Request();
    request.input('EmployerID', sql.Int, Number(employerId));
    request.input('JobID', sql.Int, Number(jobId));

    const result = await request.query(`
        SELECT
            j.JobID,
            j.CompanyID,
            j.Title,
            j.Description,
            j.SalaryRange,
            j.Location,
            j.Level,
            j.JobType,
            j.Industry,
            j.Status,
            j.CreatedAt,
            j.ExpiredAt,
            c.CompanyName,
            c.LogoUrl,
            (SELECT COUNT(*) FROM Applications a WHERE a.JobID = j.JobID) AS ApplicationCount,
            (SELECT COUNT(*) FROM Applications a WHERE a.JobID = j.JobID AND a.Status = 'Sent/Pending') AS NewApplicationCount,
            (SELECT COUNT(*) FROM Applications a WHERE a.JobID = j.JobID AND a.Status = 'Viewed') AS ViewedApplicationCount,
            (SELECT COUNT(*) FROM Applications a WHERE a.JobID = j.JobID AND a.Status = 'Interviewing') AS InterviewingApplicationCount,
            (SELECT COUNT(*) FROM Applications a WHERE a.JobID = j.JobID AND a.Status = 'Rejected') AS RejectedApplicationCount,
            (SELECT COUNT(*) FROM Applications a WHERE a.JobID = j.JobID AND a.Status = 'Hired/Approved') AS HiredApplicationCount
        FROM Jobs j
        JOIN Companies c ON c.CompanyID = j.CompanyID
        WHERE j.JobID = @JobID AND c.EmployerID = @EmployerID
    `);

    return result.recordset[0] || null;
};

const getEmployerApplicationSummary = async (employerId, applicationId, transaction = null) => {
    const request = transaction ? new sql.Request(transaction) : new sql.Request();
    request.input('EmployerID', sql.Int, Number(employerId));
    request.input('ApplicationID', sql.Int, Number(applicationId));

    const result = await request.query(`
        SELECT
            a.ApplicationID,
            a.JobID,
            a.JobSeekerID,
            a.CVID,
            a.Status,
            a.EmployerNote,
            j.CompanyID
        FROM Applications a
        JOIN Jobs j ON j.JobID = a.JobID
        JOIN Companies c ON c.CompanyID = j.CompanyID
        WHERE a.ApplicationID = @ApplicationID AND c.EmployerID = @EmployerID
    `);

    return result.recordset[0] || null;
};

const getEmployerApplicationDetail = async (employerId, applicationId, transaction = null) => {
    const request = transaction ? new sql.Request(transaction) : new sql.Request();
    request.input('EmployerID', sql.Int, Number(employerId));
    request.input('ApplicationID', sql.Int, Number(applicationId));

    const result = await request.query(`
        SELECT
            a.ApplicationID,
            a.JobID,
            a.JobSeekerID,
            a.CVID,
            a.CoverLetter,
            a.Status,
            a.AppliedAt,
            a.EmployerNote,
            js.FullName,
            js.Phone,
            js.Address,
            js.AvatarUrl,
            u.Email,
            cv.CVName,
            cv.FilePath,
            cv.IsDefault,
            cv.CreatedAt AS CVCreatedAt,
            j.Title AS JobTitle,
            j.Location AS JobLocation,
            j.Level AS JobLevel,
            j.JobType AS JobType,
            j.Status AS JobStatus,
            c.CompanyID,
            c.CompanyName,
            c.LogoUrl,
            emp.EmployeeID,
            emp.EmployeeStatus,
            emp.HiredDate,
            emp.EndDate
        FROM Applications a
        JOIN JobSeekers js ON js.JobSeekerID = a.JobSeekerID
        JOIN Users u ON u.UserID = js.JobSeekerID
        JOIN CVs cv ON cv.CVID = a.CVID
        JOIN Jobs j ON j.JobID = a.JobID
        JOIN Companies c ON c.CompanyID = j.CompanyID
        OUTER APPLY (
            SELECT TOP 1
                e.EmployeeID,
                e.Status AS EmployeeStatus,
                e.HiredDate,
                e.EndDate
            FROM Employees e
            WHERE e.CompanyID = j.CompanyID
              AND e.JobID = a.JobID
              AND e.JobSeekerID = a.JobSeekerID
            ORDER BY e.EmployeeID DESC
        ) emp
        WHERE a.ApplicationID = @ApplicationID AND c.EmployerID = @EmployerID
    `);

    return result.recordset[0] || null;
};

const getEmployerEmployeeById = async (employerId, employeeId) => {
    const request = new sql.Request();
    request.input('EmployerID', sql.Int, Number(employerId));
    request.input('EmployeeID', sql.Int, Number(employeeId));

    const result = await request.query(`
        SELECT
            e.EmployeeID,
            e.CompanyID,
            e.JobSeekerID,
            e.JobID,
            e.Status,
            e.HiredDate,
            e.EndDate,
            e.CurrentJobTitle,
            e.Department,
            e.Team,
            e.CompanyEmail,
            e.CompanyPhone,
            e.InternalNotes,
            js.FullName,
            js.Phone,
            js.Address,
            js.AvatarUrl,
            u.Email,
            COALESCE(e.CurrentJobTitle, j.Title) AS JobTitle,
            u.Email AS PersonalEmail,
            j.Location AS JobLocation,
            j.Level AS JobLevel,
            j.JobType,
            c.CompanyName
        FROM Employees e
        JOIN Companies c ON c.CompanyID = e.CompanyID
        JOIN JobSeekers js ON js.JobSeekerID = e.JobSeekerID
        JOIN Users u ON u.UserID = js.JobSeekerID
        JOIN Jobs j ON j.JobID = e.JobID
        WHERE e.EmployeeID = @EmployeeID AND c.EmployerID = @EmployerID
    `);

    return result.recordset[0] || null;
};

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

// POST /api/employer/company
// Create a new company profile (UC02)
const createCompanyProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { CompanyName, TaxCode, Address, Description, Size, Industry, Website, LogoUrl } = req.body;

        if (!CompanyName) {
            return res.status(400).json({ message: 'Company Name is required.' });
        }

        // Check if company already exists
        const checkResult = await sql.query`SELECT CompanyID FROM Companies WHERE EmployerID = ${userId}`;
        if (checkResult.recordset.length > 0) {
            return res.status(400).json({ message: 'Company profile already exists. Use PUT to update.' });
        }

        const result = await sql.query`
            INSERT INTO Companies (
                EmployerID, CompanyName, TaxCode, Address, Description, 
                Size, Industry, Website, LogoUrl, IsProfileComplete
            )
            OUTPUT INSERTED.*
            VALUES (
                ${userId}, ${CompanyName}, ${TaxCode || null}, ${Address || null}, 
                ${Description || null}, ${Size || null}, ${Industry || null}, 
                ${Website || null}, ${LogoUrl || null}, 1
            )
        `;

        res.status(201).json({ message: 'Company created successfully.', company: result.recordset[0] });
    } catch (err) {
        console.error('createCompanyProfile Error:', err);
        res.status(500).json({ message: 'Server error creating company profile.' });
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

        const company = await getEmployerCompany(userId);
        if (!company) {
            return res.status(400).json({ message: 'You must complete your company profile first.' });
        }

        const request = new sql.Request();
        request.input('CompanyID', sql.Int, company.CompanyID);

        const jobs = await request.query(`
            SELECT
                j.*,
                (SELECT COUNT(*) FROM Applications a WHERE a.JobID = j.JobID) AS ApplicationCount,
                (SELECT COUNT(*) FROM Applications a WHERE a.JobID = j.JobID AND a.Status = 'Sent/Pending') AS NewApplicationCount,
                (SELECT COUNT(*) FROM Applications a WHERE a.JobID = j.JobID AND a.Status = 'Viewed') AS ViewedApplicationCount,
                (SELECT COUNT(*) FROM Applications a WHERE a.JobID = j.JobID AND a.Status = 'Interviewing') AS InterviewingApplicationCount,
                (SELECT COUNT(*) FROM Applications a WHERE a.JobID = j.JobID AND a.Status = 'Rejected') AS RejectedApplicationCount,
                (SELECT COUNT(*) FROM Applications a WHERE a.JobID = j.JobID AND a.Status = 'Hired/Approved') AS HiredApplicationCount
            FROM Jobs j
            WHERE j.CompanyID = @CompanyID
            ORDER BY j.CreatedAt DESC
        `);

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

// --- APPLICANT REVIEW ---

// GET /api/employer/jobs/:jobId/applications
// Get applicant pipeline for a specific job
const getJobApplications = async (req, res) => {
    try {
        const userId = req.user.userId;
        const jobId = Number(req.params.jobId);
        const requestedStatus = req.query.status || 'All';
        const normalizedStatus = normalizeApplicationStatusFilter(requestedStatus);

        if (!Number.isInteger(jobId) || jobId <= 0) {
            return res.status(400).json({ message: 'A valid job ID is required.' });
        }

        const job = await getEmployerJobById(userId, jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found or access denied.' });
        }

        const applicantsRequest = new sql.Request();
        applicantsRequest.input('JobID', sql.Int, jobId);
        applicantsRequest.input('Status', sql.VarChar, normalizedStatus);

        const applicantsResult = await applicantsRequest.query(`
            SELECT
                a.ApplicationID,
                a.JobID,
                a.JobSeekerID,
                a.CVID,
                a.Status,
                a.AppliedAt,
                a.EmployerNote,
                a.CoverLetter,
                js.FullName,
                js.Phone,
                js.Address,
                js.AvatarUrl,
                u.Email,
                cv.CVName,
                cv.FilePath
            FROM Applications a
            JOIN JobSeekers js ON js.JobSeekerID = a.JobSeekerID
            JOIN Users u ON u.UserID = js.JobSeekerID
            JOIN CVs cv ON cv.CVID = a.CVID
            WHERE a.JobID = @JobID
              AND (@Status IS NULL OR a.Status = @Status)
            ORDER BY
                CASE a.Status
                    WHEN 'Sent/Pending' THEN 1
                    WHEN 'Viewed' THEN 2
                    WHEN 'Interviewing' THEN 3
                    WHEN 'Hired/Approved' THEN 4
                    WHEN 'Rejected' THEN 5
                    ELSE 6
                END,
                a.AppliedAt DESC
        `);

        res.json({
            job,
            selectedStatus: normalizedStatus || 'All',
            availableStatuses: [
                { value: 'All', label: 'All Statuses', count: job.ApplicationCount || 0 },
                { value: 'Sent/Pending', label: APPLICATION_STATUS_LABELS['Sent/Pending'], count: job.NewApplicationCount || 0 },
                { value: 'Viewed', label: APPLICATION_STATUS_LABELS.Viewed, count: job.ViewedApplicationCount || 0 },
                { value: 'Interviewing', label: APPLICATION_STATUS_LABELS.Interviewing, count: job.InterviewingApplicationCount || 0 },
                { value: 'Rejected', label: APPLICATION_STATUS_LABELS.Rejected, count: job.RejectedApplicationCount || 0 },
                { value: 'Hired/Approved', label: APPLICATION_STATUS_LABELS['Hired/Approved'], count: job.HiredApplicationCount || 0 }
            ],
            applicants: applicantsResult.recordset.map((applicant) => ({
                ...applicant,
                HasCoverLetter: Boolean(applicant.CoverLetter && applicant.CoverLetter.trim()),
                StatusLabel: APPLICATION_STATUS_LABELS[applicant.Status] || applicant.Status
            }))
        });
    } catch (err) {
        console.error('getJobApplications Error:', err);
        res.status(500).json({ message: 'Server error retrieving applicants.' });
    }
};

// GET /api/employer/applications/:applicationId
// Get full details for an application. First read marks Sent/Pending as Viewed.
const getApplicationDetail = async (req, res) => {
    try {
        const userId = req.user.userId;
        const applicationId = Number(req.params.applicationId);

        if (!Number.isInteger(applicationId) || applicationId <= 0) {
            return res.status(400).json({ message: 'A valid application ID is required.' });
        }

        let application = await getEmployerApplicationDetail(userId, applicationId);
        if (!application) {
            return res.status(404).json({ message: 'Application not found or access denied.' });
        }

        if (application.Status === 'Sent/Pending') {
            const updateRequest = new sql.Request();
            updateRequest.input('ApplicationID', sql.Int, applicationId);
            await updateRequest.query(`
                UPDATE Applications
                SET Status = 'Viewed'
                WHERE ApplicationID = @ApplicationID AND Status = 'Sent/Pending'
            `);

            application = await getEmployerApplicationDetail(userId, applicationId);
        }

        res.json({
            application: {
                ...application,
                StatusLabel: APPLICATION_STATUS_LABELS[application.Status] || application.Status
            }
        });
    } catch (err) {
        console.error('getApplicationDetail Error:', err);
        res.status(500).json({ message: 'Server error retrieving application details.' });
    }
};

// PATCH /api/employer/applications/:applicationId/status
// Update an application and keep Employees in sync when hiring or rejecting
const updateApplicationStatus = async (req, res) => {
    const allowedStatuses = ['Viewed', 'Interviewing', 'Rejected', 'Hired/Approved'];
    const transaction = new sql.Transaction();
    let transactionStarted = false;

    try {
        const userId = req.user.userId;
        const applicationId = Number(req.params.applicationId);
        const { status, employerNote } = req.body;

        if (!Number.isInteger(applicationId) || applicationId <= 0) {
            return res.status(400).json({ message: 'A valid application ID is required.' });
        }

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: `Status must be one of: ${allowedStatuses.join(', ')}.`
            });
        }

        const application = await getEmployerApplicationSummary(userId, applicationId);
        if (!application) {
            return res.status(404).json({ message: 'Application not found or access denied.' });
        }

        await transaction.begin();
        transactionStarted = true;

        const request = new sql.Request(transaction);
        request.input('ApplicationID', sql.Int, applicationId);
        request.input('Status', sql.VarChar, status);
        request.input(
            'EmployerNote',
            sql.NVarChar,
            employerNote === undefined ? application.EmployerNote : (employerNote || null)
        );

        await request.query(`
            UPDATE Applications
            SET Status = @Status,
                EmployerNote = @EmployerNote
            WHERE ApplicationID = @ApplicationID
        `);

        const employeeCheckRequest = new sql.Request(transaction);
        employeeCheckRequest.input('CompanyID', sql.Int, application.CompanyID);
        employeeCheckRequest.input('JobSeekerID', sql.Int, application.JobSeekerID);
        employeeCheckRequest.input('JobID', sql.Int, application.JobID);

        const employeeResult = await employeeCheckRequest.query(`
            SELECT TOP 1 EmployeeID, Status
            FROM Employees
            WHERE CompanyID = @CompanyID
              AND JobSeekerID = @JobSeekerID
              AND JobID = @JobID
            ORDER BY EmployeeID DESC
        `);

        const existingEmployee = employeeResult.recordset[0];

        if (status === 'Hired/Approved') {
            if (existingEmployee) {
                const reactivateRequest = new sql.Request(transaction);
                reactivateRequest.input('EmployeeID', sql.Int, existingEmployee.EmployeeID);
                await reactivateRequest.query(`
                    UPDATE Employees
                    SET Status = 'Active',
                        EndDate = NULL
                    WHERE EmployeeID = @EmployeeID
                `);
            } else {
                const insertEmployeeRequest = new sql.Request(transaction);
                insertEmployeeRequest.input('CompanyID', sql.Int, application.CompanyID);
                insertEmployeeRequest.input('JobSeekerID', sql.Int, application.JobSeekerID);
                insertEmployeeRequest.input('JobID', sql.Int, application.JobID);
                await insertEmployeeRequest.query(`
                    INSERT INTO Employees (CompanyID, JobSeekerID, JobID, Status)
                    VALUES (@CompanyID, @JobSeekerID, @JobID, 'Active')
                `);
            }
        } else if (existingEmployee && existingEmployee.Status === 'Active') {
            const closeEmployeeRequest = new sql.Request(transaction);
            closeEmployeeRequest.input('EmployeeID', sql.Int, existingEmployee.EmployeeID);
            await closeEmployeeRequest.query(`
                UPDATE Employees
                SET Status = 'Terminated',
                    EndDate = GETDATE()
                WHERE EmployeeID = @EmployeeID
            `);
        }

        await transaction.commit();
        transactionStarted = false;

        const updatedApplication = await getEmployerApplicationDetail(userId, applicationId);
        res.json({
            message: 'Application status updated successfully.',
            application: {
                ...updatedApplication,
                StatusLabel: APPLICATION_STATUS_LABELS[updatedApplication.Status] || updatedApplication.Status
            }
        });
    } catch (err) {
        if (transactionStarted) {
            await transaction.rollback();
        }
        console.error('updateApplicationStatus Error:', err);
        res.status(500).json({ message: 'Server error updating application status.' });
    }
};

// --- EMPLOYEE MANAGEMENT ---

// GET /api/employer/employees
// Get employees hired by the logged-in employer
const getEmployees = async (req, res) => {
    try {
        const userId = req.user.userId;
        const company = await getEmployerCompany(userId);
        const requestedStatus = req.query.status || 'All';
        const normalizedStatus = normalizeEmployeeStatusFilter(requestedStatus);
        const search = (req.query.search || '').trim();

        if (!company) {
            return res.status(400).json({ message: 'You must complete your company profile first.' });
        }

        const request = new sql.Request();
        request.input('CompanyID', sql.Int, company.CompanyID);
        request.input('Status', sql.VarChar, normalizedStatus);
        request.input('Search', sql.NVarChar, search ? `%${search}%` : null);

        const result = await request.query(`
            SELECT
                e.EmployeeID,
                e.CompanyID,
                e.JobSeekerID,
                e.JobID,
                e.Status,
                e.HiredDate,
                e.EndDate,
                e.CurrentJobTitle,
                e.Department,
                e.Team,
                e.CompanyEmail,
                e.CompanyPhone,
                e.InternalNotes,
                js.FullName,
                js.Phone,
                js.Address,
                js.AvatarUrl,
                u.Email,
                COALESCE(e.CurrentJobTitle, j.Title) AS JobTitle,
                u.Email AS PersonalEmail,
                j.Location AS JobLocation,
                j.Level AS JobLevel,
                j.JobType,
                c.CompanyName
            FROM Employees e
            JOIN Companies c ON c.CompanyID = e.CompanyID
            JOIN JobSeekers js ON js.JobSeekerID = e.JobSeekerID
            JOIN Users u ON u.UserID = js.JobSeekerID
            JOIN Jobs j ON j.JobID = e.JobID
            WHERE e.CompanyID = @CompanyID
              AND (@Status IS NULL OR e.Status = @Status)
              AND (
                    @Search IS NULL
                    OR js.FullName LIKE @Search
                    OR u.Email LIKE @Search
                    OR j.Title LIKE @Search
                  )
            ORDER BY
                CASE e.Status
                    WHEN 'Active' THEN 1
                    WHEN 'On Leave' THEN 2
                    WHEN 'Resigned' THEN 3
                    WHEN 'Terminated' THEN 4
                    ELSE 5
                END,
                e.HiredDate DESC
        `);

        const summaryRequest = new sql.Request();
        summaryRequest.input('CompanyID', sql.Int, company.CompanyID);

        const summaryResult = await summaryRequest.query(`
            SELECT
                COUNT(*) AS TotalEmployees,
                SUM(CASE WHEN Status = 'Active' THEN 1 ELSE 0 END) AS ActiveEmployees,
                SUM(CASE WHEN Status = 'On Leave' THEN 1 ELSE 0 END) AS OnLeaveEmployees,
                SUM(CASE WHEN Status = 'Resigned' THEN 1 ELSE 0 END) AS ResignedEmployees,
                SUM(CASE WHEN Status = 'Terminated' THEN 1 ELSE 0 END) AS TerminatedEmployees
            FROM Employees
            WHERE CompanyID = @CompanyID
        `);

        res.json({
            company,
            selectedStatus: normalizedStatus || 'All',
            search,
            summary: summaryResult.recordset[0],
            employees: result.recordset
        });
    } catch (err) {
        console.error('getEmployees Error:', err);
        res.status(500).json({ message: 'Server error retrieving employees.' });
    }
};

// PATCH /api/employer/employees/:employeeId/status
// Update an employee status for the logged-in employer
const updateEmployeeStatus = async (req, res) => {
    try {
        const userId = req.user.userId;
        const employeeId = Number(req.params.employeeId);
        const allowedStatuses = ['Active', 'On Leave', 'Resigned', 'Terminated'];
        const { status } = req.body;

        if (!Number.isInteger(employeeId) || employeeId <= 0) {
            return res.status(400).json({ message: 'A valid employee ID is required.' });
        }

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: `Status must be one of: ${allowedStatuses.join(', ')}.`
            });
        }

        const employee = await getEmployerEmployeeById(userId, employeeId);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found or access denied.' });
        }

        const request = new sql.Request();
        request.input('EmployeeID', sql.Int, employeeId);
        request.input('Status', sql.VarChar, status);
        await request.query(`
            UPDATE Employees
            SET Status = @Status,
                EndDate = CASE
                    WHEN @Status = 'Active' THEN NULL
                    WHEN EndDate IS NULL THEN GETDATE()
                    ELSE EndDate
                END
            WHERE EmployeeID = @EmployeeID
        `);

        const updatedEmployee = await getEmployerEmployeeById(userId, employeeId);
        res.json({
            message: 'Employee status updated successfully.',
            employee: updatedEmployee
        });
    } catch (err) {
        console.error('updateEmployeeStatus Error:', err);
        res.status(500).json({ message: 'Server error updating employee status.' });
    }
};

// PATCH /api/employer/employees/:employeeId/profile
// Update editable internal employee profile fields
const updateEmployeeProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const employeeId = Number(req.params.employeeId);
        const allowedStatuses = ['Active', 'On Leave', 'Resigned', 'Terminated'];
        const {
            CurrentJobTitle,
            Department,
            Team,
            Status,
            HiredDate,
            EndDate,
            InternalNotes,
            CompanyEmail,
            CompanyPhone
        } = req.body;

        if (!Number.isInteger(employeeId) || employeeId <= 0) {
            return res.status(400).json({ message: 'A valid employee ID is required.' });
        }

        if (Status && !allowedStatuses.includes(Status)) {
            return res.status(400).json({
                message: `Status must be one of: ${allowedStatuses.join(', ')}.`
            });
        }

        const employee = await getEmployerEmployeeById(userId, employeeId);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found or access denied.' });
        }

        const nextHiredDate = HiredDate ? new Date(HiredDate) : employee.HiredDate;
        const nextEndDate = EndDate ? new Date(EndDate) : null;

        if (HiredDate && Number.isNaN(nextHiredDate.getTime())) {
            return res.status(400).json({ message: 'Start date is invalid.' });
        }

        if (EndDate && Number.isNaN(nextEndDate.getTime())) {
            return res.status(400).json({ message: 'End date is invalid.' });
        }

        const request = new sql.Request();
        request.input('EmployeeID', sql.Int, employeeId);
        request.input('CurrentJobTitle', sql.NVarChar, CurrentJobTitle || null);
        request.input('Department', sql.NVarChar, Department || null);
        request.input('Team', sql.NVarChar, Team || null);
        request.input('Status', sql.VarChar, Status || employee.Status);
        request.input('HiredDate', sql.DateTime, nextHiredDate);
        request.input('EndDate', sql.DateTime, EndDate ? nextEndDate : null);
        request.input('InternalNotes', sql.NVarChar(sql.MAX), InternalNotes || null);
        request.input('CompanyEmail', sql.VarChar, CompanyEmail || null);
        request.input('CompanyPhone', sql.VarChar, CompanyPhone || null);

        await request.query(`
            UPDATE Employees
            SET CurrentJobTitle = @CurrentJobTitle,
                Department = @Department,
                Team = @Team,
                Status = @Status,
                HiredDate = @HiredDate,
                EndDate = @EndDate,
                InternalNotes = @InternalNotes,
                CompanyEmail = @CompanyEmail,
                CompanyPhone = @CompanyPhone
            WHERE EmployeeID = @EmployeeID
        `);

        const updatedEmployee = await getEmployerEmployeeById(userId, employeeId);
        res.json({
            message: 'Employee profile updated successfully.',
            employee: updatedEmployee
        });
    } catch (err) {
        console.error('updateEmployeeProfile Error:', err);
        res.status(500).json({ message: 'Server error updating employee profile.' });
    }
};

// GET /api/employer/employees/:employeeId
// Get a single employee detail for the logged-in employer
const getEmployeeDetail = async (req, res) => {
    try {
        const userId = req.user.userId;
        const employeeId = Number(req.params.employeeId);

        if (!Number.isInteger(employeeId) || employeeId <= 0) {
            return res.status(400).json({ message: 'A valid employee ID is required.' });
        }

        const employee = await getEmployerEmployeeById(userId, employeeId);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found or access denied.' });
        }

        res.json({ employee });
    } catch (err) {
        console.error('getEmployeeDetail Error:', err);
        res.status(500).json({ message: 'Server error retrieving employee detail.' });
    }
};

module.exports = {
    getCompanyProfile,
    createCompanyProfile,
    updateCompanyProfile,
    getMyJobs,
    createJob,
    getJobApplications,
    getApplicationDetail,
    updateApplicationStatus,
    getEmployees,
    updateEmployeeStatus,
    getEmployeeDetail,
    updateEmployeeProfile
};
