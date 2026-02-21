var http = require('http');
var fs = require('fs');
const route = 'png';

http.createServer(function(req, res)
{
    const fname = './pic.png';
    let png = null;
    if(req.url ==='/'+ route)
    {
    fs.stat(fname, (err, stat)=>{
        if(err){Console.log('error:',err);}
        else{
            png = fs.readFileSync(fname);
            res.writeHead(200,{'content-type': 'image/png','content-length':stat.size});
            res.end(png,'binary');
        }
    })
    }
    else{
        res.end('<h1>Error</h1>');
    }
}).listen(5000);


console.log('Server running at http://localhost:5000');