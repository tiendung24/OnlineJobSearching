const { sql } = require('../config/db');

// Get Profile
const getEmployeeProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const request = new sql.Request();
        request.input('userId', sql.Int, userId);

        const result = await request.query(`
            SELECT u.Email, j.FullName, j.Phone, j.Address, j.AvatarUrl
            FROM Users u
            INNER JOIN JobSeekers j ON u.UserID = j.JobSeekerID
            WHERE u.UserID = @userId
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy thông tin cá nhân.' });
        }

        res.status(200).json(result.recordset[0]);
    } catch (error) {
        console.error('Error fetching employee profile:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy thông tin.' });
    }
};

// Update Profile
const updateEmployeeProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { Phone, Address, AvatarUrl } = req.body;

        const request = new sql.Request();
        request.input('userId', sql.Int, userId);
        request.input('phone', sql.VarChar, Phone || null);
        request.input('address', sql.NVarChar, Address || null);
        request.input('avatar', sql.NVarChar, AvatarUrl || null);

        await request.query(`
            UPDATE JobSeekers
            SET Phone = @phone, Address = @address, AvatarUrl = @avatar
            WHERE JobSeekerID = @userId
        `);

        res.status(200).json({ message: 'Cập nhật thông tin thành công!' });
    } catch (error) {
        console.error('Error updating employee profile:', error);
        res.status(500).json({ message: 'Lỗi server khi cập nhật thông tin.' });
    }
};

// Get Employee Job
const getEmployeeJob = async (req, res) => {
    try {
        const userId = req.user.userId;
        const request = new sql.Request();
        request.input('userId', sql.Int, userId);

        const result = await request.query(`
            SELECT TOP 1
                e.Status as EmployeeStatus,
                e.CurrentJobTitle,
                e.Department,
                e.Team,
                e.CompanyEmail,
                e.CompanyPhone,
                e.HiredDate,
                j.Title as JobTitle,
                j.Location,
                j.JobType,
                c.CompanyName,
                c.LogoUrl
            FROM Employees e
            INNER JOIN Jobs j ON e.JobID = j.JobID
            INNER JOIN Companies c ON e.CompanyID = c.CompanyID
            WHERE e.JobSeekerID = @userId
            ORDER BY e.HiredDate DESC
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Bạn chưa thuộc công ty nào.' });
        }

        res.status(200).json(result.recordset[0]);
    } catch (error) {
        console.error('Error fetching employee job:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy thông tin công việc.' });
    }
};

module.exports = {
    getEmployeeProfile,
    updateEmployeeProfile,
    getEmployeeJob
};
