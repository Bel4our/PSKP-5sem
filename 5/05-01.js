var http = require('http');
var url = require('url');
var fs = require('fs');
var data = require('./DB');

var db = new data.DB();

var statistics = {
    start: null,
    finish: null,
    request: 0,
    commit: 0
};
var isCollectingStats = false;

var shutdownTimer = null;
var commitInterval = null;
var statsTimer = null;

db.on('GET', (req, res)=>{console.log('DB.GET'); res.end(JSON.stringify(db.get()));});
db.on('POST', (req, res)=>{console.log('DB.POST');
                                req.on('data', data=>{
                                    let r = JSON.parse(data);
                                    db.post(r);
                                    res.end(JSON.stringify(r));
                                });
});
db.on('PUT', (req, res) => { 
    console.log('DB.PUT');
    
    req.on('data', data => {
        let r = JSON.parse(data);
        
        const parsedUrl = url.parse(req.url, true);
        const id = parseInt(parsedUrl.query.id);
        db.put(r, id);
        res.end(JSON.stringify(r));
    });
});

db.on('DELETE', (req, res) => { 
    console.log('DB.DELETE');
    
    const parsedUrl = url.parse(req.url, true);
    const id = parseInt(parsedUrl.query.id);
    
    const deletedUser = db.delete(id);

    res.end(JSON.stringify(deletedUser)); 
});

db.on('COMMIT', () => {
     if (isCollectingStats) {
        statistics.commit++;
    }
});


var server = http.createServer(function(request, response)
{
    if(url.parse(request.url).pathname==='/')
    {
        let html = fs.readFileSync('./05-01.html');
        response.writeHead(200,{'content-type':'text/html; charset=utf-8'});
        response.end(html);
    }else if (url.parse(request.url).pathname==='/api/db')
    {
        if (isCollectingStats) {
            statistics.request++;
        }
        db.emit(request.method, request, response);
    }
    else if (url.parse(request.url).pathname === '/api/ss') {
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(statistics));
    }
}).listen(5000);


process.stdin.setEncoding('utf-8');

process.stdin.on('readable', () => {
    let chunk;
    while ((chunk = process.stdin.read()) !== null) 
    {
        var [command, param] = chunk.trim().split(' ');
        var x = param ? parseInt(param) : null;

        switch (command) {
            case 'sd':
                clearTimeout(shutdownTimer);
                if (x && x > 0) {
                    console.log(`Server will shut down in ${x} seconds.`);
                    shutdownTimer = setTimeout(() => {
                        server.close(() => console.log('Server closed.'));
                        process.exit(0);
                    }, x * 1000);
                } else {
                    console.log('Server shutdown canceled.');
                }
                break;
            case 'sc':
                clearInterval(commitInterval);
                if (x && x > 0) {
                    console.log(`Periodic commit started with interval ${x} seconds.`);
                    commitInterval = setInterval(() => db.commit(), x * 1000);
                    commitInterval.unref();
                } else {
                    console.log('Periodic commit stopped.');
                }
                break;
            case 'ss':
                clearTimeout(statsTimer);
                if (x && x > 0) {
                     console.log(`Statistics collection will run for ${x} seconds.`);
                    isCollectingStats = true;
                    statistics = { start: new Date().toISOString().slice(0, 10), finish: null, request: 0, commit: 0 };
                    statsTimer = setTimeout(() => {
                        isCollectingStats = false;
                        statistics.finish = new Date().toISOString().slice(0, 10);
                        console.log('Statistics collection stopped.');
                    }, x * 1000);
                    statsTimer.unref();
                } else {
                    isCollectingStats = false;
                    if(statistics.start) statistics.finish = new Date().toISOString().slice(0, 10);
                    console.log('Statistics collection stopped.');
                }
                break;
            default:
                console.log('Unknown command');
                break;
        }
    }
});