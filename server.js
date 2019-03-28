const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');
const bodyParser = require('body-parser')

const PORT = process.env.PORT || 3002;
const WSPORT = process.env.PORT || 3001;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(express.static('public'))
  
server.post('/updateLiveMatch',function(req,res){
  console.log(req.body)
  wss.clients.forEach((client) => {
    client.send(
      JSON.stringify({
        type: 'liveMatch',
        data: req.body
      })
    );
  });
  res.end("yes");
});

server.post('/updateBrackets',function(req,res){
  console.log(req.body)
  wss.clients.forEach((client) => {
    client.send(
      JSON.stringify({
        type: 'brackets',
        data: req.body
      })
    );
  });
  res.end("yes");
});

server.listen(PORT, () => console.log(`Listening on ${ PORT }`));
const wsserver = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(WSPORT, () => console.log(`WS Listening on ${ WSPORT }`));

const wss = new SocketServer({ server: wsserver });

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('close', () => console.log('Client disconnected'));
});

const players = [
  'Reid Duke',
  'Martin Juza',
  'John Rolf',
  'Luis Scott-Vargas'
]

const sample = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)]
}

let liveMatch = {
  playerA: sample(players),
  playerB: sample(players),
}

wss.clients.forEach((client) => {
  client.send(
    JSON.stringify(liveMatch)
  );
});
