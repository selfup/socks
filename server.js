const net = require('net')

const sendPayload = (payload) => {
  const rpi = new net.Socket()
  rpi.connect(2000, '10.0.0.230', () => {
    rpi.write(JSON.stringify(payload))
    rpi.end()
    rpi.destroy()
  })
}

mockLoad = {17: true}

sendPayload(JSON.parse(mockLoad))
