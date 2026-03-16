const { sql } = require('../config/db');

// GET /api/admin/stats — overview numbers
const getStats = async (req, res) => {
    try {
        const result = await sql.query(`
            SELECT
                (SELECT COUNT(*) FROM Users WHERE RoleID = 2) AS totalJobSeekers,
                (SELECT COUNT(*) FROM Users WHERE RoleID = 3) AS totalEmployers,
                (SELECT COUNT(*) FROM Users WHERE IsActive = 1) AS activeUsers,
                (SELECT COUNT(*) FROM Jobs) AS totalJobs,
                (SELECT COUNT(*) FROM Jobs WHERE Status = 'Published') AS publishedJobs,
                (SELECT COUNT(*) FROM Jobs WHERE Status = 'Pending Approval') AS pendingJobs,
                (SELECT COUNT(*) FROM Applications) AS totalApplications,
                (SELECT COUNT(*) FROM Applications WHERE Status = 'Hired/Approved') AS totalHired,
                (SELECT COUNT(*) FROM Employees WHERE Status = 'Active') AS activeEmployees
        `);
        res.json(result.recordset[0]);
    } catch (err) {
        console.error('getStats Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// GET /api/admin/pending-jobs — jobs waiting for approval
const getPendingJobs = async (req, res) => {
    try {
        const result = await sql.query(`
            SELECT TOP 10
                j.JobID, j.Title, j.CreatedAt, j.Status,
                j.SalaryRange, j.Location, j.Level, j.JobType,
                c.CompanyName, c.LogoUrl
            FROM Jobs j
            JOIN Companies c ON j.CompanyID = c.CompanyID
            WHERE j.Status = 'Pending Approval'
            ORDER BY j.CreatedAt ASC
        `);
        res.json(result.recordset);
    } catch (err) {
        console.error('getPendingJobs Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// PATCH /api/admin/jobs/:id/approve
const approveJob = async (req, res) => {
    try {
        const { id } = req.params;
        await sql.query`UPDATE Jobs SET Status = 'Published' WHERE JobID = ${id}`;
        res.json({ message: 'Job approved and published.' });
    } catch (err) {
        console.error('approveJob Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// PATCH /api/admin/jobs/:id/reject
const rejectJob = async (req, res) => {
    try {
        const { id } = req.params;
        await sql.query`UPDATE Jobs SET Status = 'Closed/Expired' WHERE JobID = ${id}`;
        res.json({ message: 'Job rejected.' });
    } catch (err) {
        console.error('rejectJob Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// GET /api/admin/users — list all users
const getUsers = async (req, res) => {
    try {
        const result = await sql.query(`
            SELECT
                u.UserID, u.Email, u.IsActive, u.CreatedAt, u.RoleID,
                r.RoleName,
                COALESCE(js.FullName, c.CompanyName) AS DisplayName
            FROM Users u
            JOIN Roles r ON u.RoleID = r.RoleID
            LEFT JOIN JobSeekers js ON js.JobSeekerID = u.UserID
            LEFT JOIN Companies c ON c.EmployerID = u.UserID
            ORDER BY u.CreatedAt DESC
        `);
        res.json(result.recordset);
    } catch (err) {
        console.error('getUsers Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// PATCH /api/admin/users/:id/toggle-active — lock/unlock
const toggleUserActive = async (req, res) => {
    try {
        const { id } = req.params;
        await sql.query`UPDATE Users SET IsActive = 1 - IsActive WHERE UserID = ${id}`;
        res.json({ message: 'User status updated.' });
    } catch (err) {
        console.error('toggleUserActive Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// GET /api/admin/monthly-stats — for charts (last 6 months)
const getMonthlyStats = async (req, res) => {
    try {
        const result = await sql.query(`
            SELECT
                FORMAT(CreatedAt, 'yyyy-MM') AS [Month],
                COUNT(*) AS NewUsers
            FROM Users
            WHERE CreatedAt >= DATEADD(MONTH, -6, GETDATE())
            GROUP BY FORMAT(CreatedAt, 'yyyy-MM')
            ORDER BY [Month]
        `);

        const jobResult = await sql.query(`
            SELECT
                FORMAT(CreatedAt, 'yyyy-MM') AS [Month],
                COUNT(*) AS NewJobs
            FROM Jobs
            WHERE CreatedAt >= DATEADD(MONTH, -6, GETDATE())
            GROUP BY FORMAT(CreatedAt, 'yyyy-MM')
            ORDER BY [Month]
        `);

        const appResult = await sql.query(`
            SELECT
                FORMAT(AppliedAt, 'yyyy-MM') AS [Month],
                COUNT(*) AS NewApplications
            FROM Applications
            WHERE AppliedAt >= DATEADD(MONTH, -6, GETDATE())
            GROUP BY FORMAT(AppliedAt, 'yyyy-MM')
            ORDER BY [Month]
        `);

        res.json({
            users: result.recordset,
            jobs: jobResult.recordset,
            applications: appResult.recordset
        });
    } catch (err) {
        console.error('getMonthlyStats Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getStats, getPendingJobs, approveJob, rejectJob, getUsers, toggleUserActive, getMonthlyStats };
