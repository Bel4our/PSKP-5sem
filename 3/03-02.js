var http = require('http');
var url = require('url');
var fs = require('fs');

let factorial = (n) => {
    return n <=1?n: n * factorial(n-1);
};

http.createServer(function(request, response){
    let rc = JSON.stringify({k:0});
    if(url.parse(request.url).pathname === '/fact')
    {
        console.log(request.url);
        if (typeof url.parse(request.url, true).query.k != 'undefined')
        {
            let k = parseInt(url.parse(request.url, true).query.k);
            if(Number.isInteger(k))
            {
                response.writeHead(200, {'Content-Type':'application/json; charset=utf-8'});
                response.end(JSON.stringify({k:k, fact: factorial(k)}))
            }
        }
    }
    else if( url.parse(request.url).pathname==='/')
    {
        let html = fs.readFileSync('./03-03.html');
        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        response.end(html);
    }
    else{
        response.end(rc);
    }
}).listen(5000);

console.log('Server running at http://localhost:5000/');