var http = require('http');
var url = require('url');
var fs = require('fs');
var data = require('./DB');

var db = new data.DB();

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


http.createServer(function(request, response)
{
    if(url.parse(request.url).pathname==='/')
    {
        response.writeHead(200,{'content-type':'text/html; charset=utf-8'});
        response.end('Hello');
    }else if (url.parse(request.url).pathname==='/api/db')
    {
        db.emit(request.method, request, response);
    }
}).listen(5000);