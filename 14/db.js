const sql = require('mssql'); 

const config = {
    user: 'user2',                 
    password: '1515', 
    server: 'DESKTOP-P1GMMIV',         
    database: 'SDV2',          
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
