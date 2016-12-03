socket = new WebSocket('ws://localhost:8080', 'rpi')
socket.onclose = message => console.log(message)
socket.onmessage = message => console.log(message, "THAT'S WHAT I SENT!")
socket.send('wowow')
