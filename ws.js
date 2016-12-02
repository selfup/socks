const WebSocketServer = require('websocket').server
const http = require('http')
const server = http.createServer(function(request, response) {})

server.listen(8080, () => {
  console.log(`${new Date()} Server is listening on localhost:8080`);
})

const wsServer = new WebSocketServer({
  httpServer: server
})

wsServer.on('request', (request) => {
  let count = 0
  let id = count++

  const connection = request.accept('rpi', request.origin)
  const clients = {}

  clients[id] = connection

  connection.on('message', (message) => {
    const msgString = message.utf8Data;
    console.log(msgString)
    for(const i in clients){
      clients[i].sendUTF(msgString)
    }
  })

  connection.on('close', (reason, description) => {
    delete clients[id]
    console.log(`${new Date()} Peer ${connection.remoteAddress} disconnected.`)
  });
});