const sql = require('mssql'); 

const config = {
    user: 'User2',                 
    password: '1515', 
    server: 'localhost',         
    database: 'SDV',          
    options: {
        encrypt: false, 
        trustServerCertificate: true 
    }
};

let pool;

async function initPools() {
    try {
        pool = await sql.connect(config);
        console.log('Connected to MSSQL via Login/Password');
    } catch (err) {
        console.error('Connection failed:', err);
    }
}

function getPool() {
    return pool;
}

module.exports = {
    initPools,
    getPool,
    sql 
};