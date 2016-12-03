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
    console.log(JSON.stringify(msgString));
    if (msgString.includes('17')) {
      for (const i in clients) {
        console.log("MSG STRING RAW", msgString);
        clients[i].sendUTF(msgString)
      }
    }
  })

  connection.on('close', (reason, description) => delete clients[id]);
});
