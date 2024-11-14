const http = require('http');
const WebSocket = require('ws');
const url = require('url');
const fs = require('fs');


const server = http.createServer();
const wss1 = new WebSocket.Server({noServer: true});
const wss2 = new WebSocket.Server({noServer: true});
var outstream = fs.createWriteStream('out.raw');
var instream = fs.createWriteStream('in.raw');

wss1.on('connection', function connection(ws) {
    console.log("got out connection ");
    
    ws.on('message', function incoming(message){
        console.log('received out frame');
        outstream.write(message);
    });
});


wss2.on('connection', function connection(ws) {
    console.log("got in connection ");
    
    ws.on('message', function incoming(message){
        console.log('received in frame');
        instream.write(message);
    });
});

server.on('upgrade', function upgrade(request, socket, head){
    const pathname = url.parse(request.url).pathname;

    if(pathname = '/out'){
        wss1.handleUpgrade(request, socket, head, function done(ws){
            wss1.emit('connection', ws, request);
        });
    }else if (pathname === '/in'){
        wss2.handleUpgrade(request, socket, head, function done(ws){
            wss2.emit('connection', ws, request);
        });
    }else{
        socket.destroy();
    }
});


server.listen(8090);
