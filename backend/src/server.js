const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();



const app = express();
const port = process.env.PORT || 3000;
const hostname = process.env.HOSTNAME || 'localhost';

// ─── Middleware ───
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ───


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
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/onlinejobsearching';
        await mongoose.connect(mongoUri);
        console.log('✅ Database connected successfully');

        app.listen(port, () => {
            console.log(`🚀 Server running at http://${hostname}:${port}/`);
        });
    } catch (error) {
        console.error('❌ Unable to start server:', error.message);
        process.exit(1);
    }
};

startServer();
