const { sql } = require('../config/db');
const bcrypt = require('bcrypt');

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

// GET /api/admin/users — list users with pagination/filter/search
const getUsers = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
        const search = (req.query.search || '').trim();
        const roleId = parseInt(req.query.roleId, 10);
        const status = req.query.status; // active | inactive
        const offset = (page - 1) * limit;

        const request = new sql.Request();
        request
            .input('search', sql.NVarChar, search || null)
            .input('roleId', sql.Int, Number.isNaN(roleId) ? null : roleId)
            .input('isActive', sql.Bit, status === 'active' ? 1 : status === 'inactive' ? 0 : null)
            .input('offset', sql.Int, offset)
            .input('limit', sql.Int, limit);

        const countResult = await request.query(`
            SELECT COUNT(*) AS Total
            FROM Users u
            LEFT JOIN JobSeekers js ON js.JobSeekerID = u.UserID
            LEFT JOIN Companies c ON c.EmployerID = u.UserID
            WHERE
                (@search IS NULL OR u.Email LIKE '%' + @search + '%' OR js.FullName LIKE '%' + @search + '%' OR c.CompanyName LIKE '%' + @search + '%')
                AND (@roleId IS NULL OR u.RoleID = @roleId)
                AND (@isActive IS NULL OR u.IsActive = @isActive)
        `);

        const dataRequest = new sql.Request();
        dataRequest
            .input('search', sql.NVarChar, search || null)
            .input('roleId', sql.Int, Number.isNaN(roleId) ? null : roleId)
            .input('isActive', sql.Bit, status === 'active' ? 1 : status === 'inactive' ? 0 : null)
            .input('offset', sql.Int, offset)
            .input('limit', sql.Int, limit);

        const result = await dataRequest.query(`
            SELECT
                u.UserID, u.Email, u.IsActive, u.CreatedAt, u.RoleID,
                r.RoleName,
                js.FullName,
                c.CompanyName,
                COALESCE(js.FullName, c.CompanyName, u.Email) AS DisplayName
            FROM Users u
            JOIN Roles r ON u.RoleID = r.RoleID
            LEFT JOIN JobSeekers js ON js.JobSeekerID = u.UserID
            LEFT JOIN Companies c ON c.EmployerID = u.UserID
            WHERE
                (@search IS NULL OR u.Email LIKE '%' + @search + '%' OR js.FullName LIKE '%' + @search + '%' OR c.CompanyName LIKE '%' + @search + '%')
                AND (@roleId IS NULL OR u.RoleID = @roleId)
                AND (@isActive IS NULL OR u.IsActive = @isActive)
            ORDER BY u.CreatedAt DESC
            OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
        `);

        const total = countResult.recordset[0]?.Total || 0;
        res.json({
            data: result.recordset,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.max(Math.ceil(total / limit), 1)
            }
        });
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

// POST /api/admin/users — create new user
const createUser = async (req, res) => {
    const { email, password, roleId, fullName, companyName, isActive } = req.body;
    if (!email || !password || !roleId) {
        return res.status(400).json({ message: 'Email, password and roleId are required.' });
    }

    const parsedRoleId = parseInt(roleId, 10);
    if (![1, 2, 3].includes(parsedRoleId)) {
        return res.status(400).json({ message: 'Invalid roleId.' });
    }

    const transaction = new sql.Transaction();
    try {
        await transaction.begin();
        const request = new sql.Request(transaction);

        const existingUser = await request
            .input('Email', sql.VarChar, email.trim())
            .query(`SELECT TOP 1 UserID FROM Users WHERE Email = @Email`);
        if (existingUser.recordset.length > 0) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userResult = await request
            .input('RoleID', sql.Int, parsedRoleId)
            .input('PasswordHash', sql.VarChar, hashedPassword)
            .input('IsActive', sql.Bit, isActive === false ? 0 : 1)
            .query(`
                INSERT INTO Users (RoleID, Email, PasswordHash, IsActive)
                OUTPUT INSERTED.UserID
                VALUES (@RoleID, @Email, @PasswordHash, @IsActive)
            `);

        const userId = userResult.recordset[0].UserID;

        if (parsedRoleId === 2) {
            await request
                .input('JobSeekerID', sql.Int, userId)
                .input('FullName', sql.NVarChar, (fullName || '').trim() || email.trim())
                .query(`INSERT INTO JobSeekers (JobSeekerID, FullName) VALUES (@JobSeekerID, @FullName)`);
        }

        if (parsedRoleId === 3 && companyName && companyName.trim()) {
            await request
                .input('EmployerID', sql.Int, userId)
                .input('CompanyName', sql.NVarChar, companyName.trim())
                .query(`INSERT INTO Companies (EmployerID, CompanyName) VALUES (@EmployerID, @CompanyName)`);
        }

        await transaction.commit();
        res.status(201).json({ message: 'User created successfully.' });
    } catch (err) {
        if (transaction._aborted !== true) {
            await transaction.rollback();
        }
        console.error('createUser Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// PUT /api/admin/users/:id — update user details
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { email, password, roleId, isActive, fullName, companyName } = req.body;
    const userId = parseInt(id, 10);
    const parsedRoleId = roleId !== undefined ? parseInt(roleId, 10) : null;

    if (Number.isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user id.' });
    }
    if (parsedRoleId !== null && ![1, 2, 3].includes(parsedRoleId)) {
        return res.status(400).json({ message: 'Invalid roleId.' });
    }

    const transaction = new sql.Transaction();
    try {
        await transaction.begin();
        const request = new sql.Request(transaction);
        const existing = await request.input('UserID', sql.Int, userId).query(`SELECT TOP 1 * FROM Users WHERE UserID = @UserID`);
        if (existing.recordset.length === 0) {
            await transaction.rollback();
            return res.status(404).json({ message: 'User not found.' });
        }

        const currentUser = existing.recordset[0];
        const finalRoleId = parsedRoleId ?? currentUser.RoleID;
        const finalEmail = (email || currentUser.Email || '').trim();
        const finalIsActive = isActive === undefined ? currentUser.IsActive : (isActive ? 1 : 0);

        if (email && email.trim() !== currentUser.Email) {
            const duplicate = await request
                .input('NewEmail', sql.VarChar, email.trim())
                .query(`SELECT TOP 1 UserID FROM Users WHERE Email = @NewEmail AND UserID <> @UserID`);
            if (duplicate.recordset.length > 0) {
                await transaction.rollback();
                return res.status(400).json({ message: 'Email already exists.' });
            }
        }

        const updateRequest = new sql.Request(transaction);
        updateRequest
            .input('UserID', sql.Int, userId)
            .input('RoleID', sql.Int, finalRoleId)
            .input('Email', sql.VarChar, finalEmail)
            .input('IsActive', sql.Bit, finalIsActive);

        let passwordClause = '';
        if (password && password.trim()) {
            const hashedPassword = await bcrypt.hash(password.trim(), 10);
            updateRequest.input('PasswordHash', sql.VarChar, hashedPassword);
            passwordClause = ', PasswordHash = @PasswordHash';
        }

        await updateRequest.query(`
            UPDATE Users
            SET RoleID = @RoleID, Email = @Email, IsActive = @IsActive ${passwordClause}
            WHERE UserID = @UserID
        `);

        // Keep profile table consistent with role
        if (finalRoleId === 2) {
            await new sql.Request(transaction)
                .input('UserID', sql.Int, userId)
                .input('FullName', sql.NVarChar, (fullName || '').trim() || finalEmail)
                .query(`
                    IF EXISTS (SELECT 1 FROM JobSeekers WHERE JobSeekerID = @UserID)
                        UPDATE JobSeekers SET FullName = @FullName WHERE JobSeekerID = @UserID
                    ELSE
                        INSERT INTO JobSeekers (JobSeekerID, FullName) VALUES (@UserID, @FullName)
                `);
            await new sql.Request(transaction).input('UserID', sql.Int, userId).query(`DELETE FROM Companies WHERE EmployerID = @UserID`);
        } else if (finalRoleId === 3) {
            await new sql.Request(transaction)
                .input('UserID', sql.Int, userId)
                .input('CompanyName', sql.NVarChar, (companyName || '').trim() || finalEmail)
                .query(`
                    IF EXISTS (SELECT 1 FROM Companies WHERE EmployerID = @UserID)
                        UPDATE Companies SET CompanyName = @CompanyName WHERE EmployerID = @UserID
                    ELSE
                        INSERT INTO Companies (EmployerID, CompanyName) VALUES (@UserID, @CompanyName)
                `);
            await new sql.Request(transaction).input('UserID', sql.Int, userId).query(`DELETE FROM JobSeekers WHERE JobSeekerID = @UserID`);
        } else {
            await new sql.Request(transaction).input('UserID', sql.Int, userId).query(`DELETE FROM JobSeekers WHERE JobSeekerID = @UserID`);
            await new sql.Request(transaction).input('UserID', sql.Int, userId).query(`DELETE FROM Companies WHERE EmployerID = @UserID`);
        }

        await transaction.commit();
        res.json({ message: 'User updated successfully.' });
    } catch (err) {
        if (transaction._aborted !== true) {
            await transaction.rollback();
        }
        console.error('updateUser Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// DELETE /api/admin/users/:id — delete user
const deleteUser = async (req, res) => {
    const { id } = req.params;
    const userId = parseInt(id, 10);
    if (Number.isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user id.' });
    }
    if (req.user?.userId === userId) {
        return res.status(400).json({ message: 'Admin cannot delete own account.' });
    }

    const transaction = new sql.Transaction();
    try {
        await transaction.begin();
        const request = new sql.Request(transaction);
        const existing = await request.input('UserID', sql.Int, userId).query(`SELECT TOP 1 UserID FROM Users WHERE UserID = @UserID`);
        if (existing.recordset.length === 0) {
            await transaction.rollback();
            return res.status(404).json({ message: 'User not found.' });
        }

        await new sql.Request(transaction).input('UserID', sql.Int, userId).query(`DELETE FROM JobSeekers WHERE JobSeekerID = @UserID`);
        await new sql.Request(transaction).input('UserID', sql.Int, userId).query(`DELETE FROM Companies WHERE EmployerID = @UserID`);
        await new sql.Request(transaction).input('UserID', sql.Int, userId).query(`DELETE FROM Users WHERE UserID = @UserID`);

        await transaction.commit();
        res.json({ message: 'User deleted successfully.' });
    } catch (err) {
        if (transaction._aborted !== true) {
            await transaction.rollback();
        }
        console.error('deleteUser Error:', err);
        res.status(500).json({ message: 'Server error. User may have related records.' });
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

module.exports = {
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
};
