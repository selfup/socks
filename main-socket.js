const http = require('http')
const WebSocketServer = require('websocket').server
const server = http.createServer((request, response) => {})

server.listen(8080, () => {})

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
    const msgString = message.utf8Data
    if (msgString.includes('17')) {
      const payload = JSON.parse(msgString.split('=')[0])
      for (const i in clients) {
        clients[i].sendUTF(JSON.stringify(msgString))
      }
    }
  })

  connection.on('close', (reason, description) => delete clients[id]);
});