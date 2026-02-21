var http = require('http');
var fs = require('fs');
var url = require('url');
const { parse } = require('querystring');
const nodemailer = require('nodemailer');


let http_handler = (req,res)=>{
    res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
    if(url.parse(req.url).pathname=='/' && req.method == 'GET')
    {
        res.end(fs.readFileSync('./06-02.html'));
    }
    else if(url.parse(req.url).pathname=='/' && req.method == 'POST')
    {
        let body = '';
        req.on('data',chunk => {body += chunk.toString();});
        req.on('end',()=>{
            let parm = parse(body);
            
            const transporter = nodemailer.createTransport({
                host: 'smtp.mail.ru',
                port: 465,
                secure: true,
                auth: {
                    user: 'тут почта отправителя',
                    pass: 'ут ключ от почты для возможности отправки',
                },});

            const options = {
                from: parm.sender,
                to: parm.receiver,
                subject: "Lab06",
                text: parm.message,
            };

            transporter.sendMail(options, (err, info) => {
                if (err) {
                    console.log(err);
                    res.end(`<h1>Error: ${err.message}</h1>`)
                } else {
                    console.log(info);
                    res.end(`<h1>OK: ${parm.receiver}, ${parm.sender}, ${parm.message}</h1>`);
                }
            });

        })
    }
    else 
        res.end('<h1>Not supported</h1>');
}

let server = http.createServer(http_handler);
server.listen(3000);

console.log('Server running at http://localhost:3000/')