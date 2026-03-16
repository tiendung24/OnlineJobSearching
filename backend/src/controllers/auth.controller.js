const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sql, connectDB } = require('../config/db');

// Ensure DB is connected
connectDB();

const register = async (req, res) => {
    try {
        const { role, fullName, email, password } = req.body;
        
        // Basic validation
        if (!email || !password || !fullName || !role) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const roleId = role === 'employer' ? 3 : 2; // Assuming 2: JobSeeker, 3: Employer

        // Check if user exists
        const checkUser = await sql.query`SELECT * FROM Users WHERE Email = ${email}`;
        if (checkUser.recordset.length > 0) {
            return res.status(400).json({ message: 'Email already exists.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Transaction for inserting User and related profile
        const transaction = new sql.Transaction();
        await transaction.begin();

        try {
            const request = new sql.Request(transaction);

            // Insert into Users and get UserID
            const userResult = await request
                .input('RoleID', sql.Int, roleId)
                .input('Email', sql.VarChar, email)
                .input('PasswordHash', sql.VarChar, hashedPassword)
                .query(`
                    INSERT INTO Users (RoleID, Email, PasswordHash) 
                    OUTPUT INSERTED.UserID 
                    VALUES (@RoleID, @Email, @PasswordHash)
                `);
            
            const userId = userResult.recordset[0].UserID;

            // Insert into specific role table
            if (roleId === 2) {
                await request
                    .input('JobSeekerID', sql.Int, userId)
                    .input('FullName', sql.NVarChar, fullName)
                    .query(`
                        INSERT INTO JobSeekers (JobSeekerID, FullName) 
                        VALUES (@JobSeekerID, @FullName)
                    `);
            }
            // For roleId === 3 (Employer), they will create their Company profile later (UC02)

            await transaction.commit();

            const token = jwt.sign(
                { userId, role: roleId },
                process.env.JWT_SECRET || 'rjkghfjkguh',
                { expiresIn: '1d' }
            );

            res.status(201).json({ message: 'Registration successful', token, user: { id: userId, email, role, fullName } });
        } catch (err) {
            await transaction.rollback();
            throw err;
        }

    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const result = await sql.query`SELECT * FROM Users WHERE Email = ${email}`;
        
        if (result.recordset.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const user = result.recordset[0];
        const isMatch = await bcrypt.compare(password, user.PasswordHash);

        if (!isMatch) {
            // Also check for plain text passwords seeded from the SQL script
            if (password === user.PasswordHash) {
                // For simplicity, if it matches plain text password, we log them in (used for sample data)
            } else {
                return res.status(401).json({ message: 'Invalid credentials.' });
            }
        }

        if (!user.IsActive) {
            return res.status(403).json({ message: 'Account is locked.' });
        }

        const token = jwt.sign(
            { userId: user.UserID, role: user.RoleID },
            process.env.JWT_SECRET || 'rjkghfjkguh',
            { expiresIn: '1d' }
        );

        res.status(200).json({ 
            message: 'Login successful', 
            token, 
            user: { id: user.UserID, email: user.Email, roleId: user.RoleID } 
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};

module.exports = {
    register,
    login
};
