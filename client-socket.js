const WebSocketClient = require('websocket').client;
const client = new WebSocketClient();
const net = require('net')

const sendPayload = (payload) => {
  const rpi = new net.Socket()
  rpi.connect(2000, '10.0.0.23', () => {
    rpi.write(payload)
    rpi.end()
    rpi.destroy()
  })
}

client.on('connectFailed', function(error) {
  console.log('Connect Error: ' + error.toString());
});

client.on('connect', function(connection) {
  connection.on('error', (error) => console.log(error.toString()));

  connection.on('close', () => console.log('echo-protocol Connection Closed'));

  connection.on('message', function(message) {
    if (message.type === 'utf8') {
      sendPayload(message.utf8Data)
    }
  });

  const sendMsg = () => {
    if (connection.connected) {
      const payload = { 17: false }
      const msg = JSON.stringify(payload)
      connection.sendUTF(msg);
      sendPayload(msg)
    }
  }

  sendMsg();
});

client.connect('ws://10.0.0.181:8080/', 'rpi');
