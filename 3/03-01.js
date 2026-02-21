var http = require('http');

let currentState = 'norm';

http.createServer(function(request,response){
    response.writeHead(200,{'content-type':'text/html'});
    response.end(`<h1>${currentState}</h1>`);
}).listen(5000);

console.log('Server is running at http://localhost:5000');

process.stdin.setEncoding('utf-8');
process.stdout.write(currentState + "->");
process.stdin.on('readable', ()=>{
    let chunk = null;
    while((chunk = process.stdin.read())!==null)
    {
        if(chunk.trim()=='exit') process.exit(0);
        else if (chunk.trim()=='norm'||chunk.trim()=='idle' || chunk.trim()=='stop'|| chunk.trim()=='test')
        {
            process.stdout.write('reg = ' + currentState + ' --> ' + chunk);
            currentState = chunk.trim();
            process.stdout.write(currentState + "->");
        } 
        else
        { process.stdout.write(chunk);
          process.stdout.write(currentState + "->");
        }
    }
});