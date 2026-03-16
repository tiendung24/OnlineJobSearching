const sql = require('mssql');

const sqlConfig = {
    user: process.env.DB_USER || 'sa', // đổi tên tài khoản , mk của sql
    password: process.env.DB_PASSWORD || 'abcdef',
    database: process.env.DB_NAME || 'JobOnlineDB', 
    server: process.env.DB_SERVER || 'localhost',
    port: parseInt(process.env.DB_PORT) || 1433,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: false, 
        trustServerCertificate: true
    }
};

const connectDB = async () => {
    try {
        await sql.connect(sqlConfig);
        console.log('✅ Connected to SQL Server (JobOnlineDB) successfully!');
    } catch (err) {
        console.error('❌ Database Connection Failed:', err.message);
        process.exit(1);
    }
};

module.exports = {
    sql,
    connectDB,
    sqlConfig
};
