const express = require('express');
const router = express.Router();
const { sql } = require('../config/db');

// GET /api/companies - Public: list all companies with open job count
router.get('/', async (req, res) => {
    try {
        const { search, industry } = req.query;

        let query = `
            SELECT 
                c.CompanyID, c.CompanyName, c.Address, c.Description,
                c.LogoUrl, c.Size, c.Industry, c.Website,
                COUNT(j.JobID) AS OpenJobCount
            FROM Companies c
            LEFT JOIN Jobs j ON j.CompanyID = c.CompanyID AND j.Status = 'Published' AND j.ExpiredAt > GETDATE()
            WHERE c.IsProfileComplete = 1
        `;

        if (search) {
            query += ` AND (c.CompanyName LIKE N'%${search.replace(/'/g, "''")}%' OR c.Industry LIKE N'%${search.replace(/'/g, "''")}%')`;
        }
        if (industry && industry !== 'All') {
            query += ` AND c.Industry = N'${industry.replace(/'/g, "''")}'`;
        }

        query += ' GROUP BY c.CompanyID, c.CompanyName, c.Address, c.Description, c.LogoUrl, c.Size, c.Industry, c.Website ORDER BY OpenJobCount DESC';

        const result = await sql.query(query);
        res.json(result.recordset);
    } catch (err) {
        console.error('getCompanies Error:', err);
        res.status(500).json({ message: 'Server error.' });
    }
});

module.exports = router;
