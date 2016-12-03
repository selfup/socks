const http = require('http')
const WebSocketServer = require('websocket').server
const server = http.createServer((request, response) => {})
const clients = {}
console.log("NEW");
let id = 0

server.listen(8080, () => {})

const wsServer = new WebSocketServer({
  httpServer: server
})

wsServer.on('request', (request) => {
  const connection = request.accept('rpi', request.origin)
  id += 1
  clients[id] = connection

  connection.on('message', (message) => {
    const msgString = message.utf8Data
    console.log(JSON.stringify(msgString));
    if (msgString.includes('17')) {
      for (const i in clients) {
        clients[i].sendUTF(msgString)
      }
    }
  })

  connection.on('close', (reason, description) => {
    delete clients[id];
  })
});
