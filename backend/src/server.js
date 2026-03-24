const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/auth.route');
const adminRoutes = require('./routes/admin.route');
const employerRoutes = require('./routes/employer.route');
const companiesRoutes = require('./routes/companies.route');
const employeeRoutes = require('./routes/employee.route');
const { connectDB } = require('./config/db');

const app = express();
const port = process.env.PORT || 3000;
const hostname = process.env.HOSTNAME || 'localhost';

// ─── Middleware ───
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Static Files (uploaded images) ───
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ─── Routes ───
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/employer', employerRoutes);
app.use('/api/companies', companiesRoutes);
app.use('/api/employee', employeeRoutes);


app.get('/', async (req, res) => {
    res.status(200).json({ message: 'Workly API is running 🚀' });
});


app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint not found' });
});


app.use((err, req, res, next) => {
    console.error('❌ Error:', err.message);
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Lỗi server nội bộ',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
});


const startServer = async () => {
    try {
        await connectDB();

        app.listen(port, () => {
            console.log(`🚀 Server running at http://${hostname}:${port}/`);
        });
    } catch (error) {
        console.error('❌ Unable to start server:', error.message);
        process.exit(1);
    }
};

startServer();
