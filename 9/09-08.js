const http = require('http');
const fs = require('fs');

const file = fs.createWriteStream("downloadedFile.txt");

let options = {
    hostname: 'localhost',
    port: 3000,
    path: '/MyFile.txt',
    method: 'GET'
};

const req = http.request(options, (res) => {
    res.pipe(file);
});

req.on('error', (e) => {
  console.log(`http.request: error: ${e.message}`);
});

req.end();

