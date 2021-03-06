((app) => {
  app.socket = new WebSocket('ws://localhost:8080', 'rpi')

  app.makePinsIntoArray = (data) => {
    const keys = Object.keys(data)
    const values = keys.map(e => data[e])
    const newPins = keys.map((e, i) => ({num: e, gpio: values[i]}))
    Vue.set(app.vm.$data, 'pins', newPins)
  }

  app.sendMessage = (message) => {
    app.socket.send(JSON.stringify(message))
  }

  app.socket.onclose = message => console.log(message)
  app.socket.onmessage = message => app.makePinsIntoArray(JSON.parse(message.data))

  app.entry = document.querySelector('#app')

  app.vm = new Vue({
    el: app.entry,
    data() {
      return {
        pins: [],
      }
    },
    methods: {
      on() {
        app.sendMessage({17: true})
      },
      off() {
        app.sendMessage({17: false})
      },
    },
    template: `
      <div>
        <h1>GPIO Statuses</h1>
        <button @click='on'>ON</button>
        <button @click='off'>OFF</button>
        <ul>
          <li v-for='pin in pins'>
            <p>
              Pin: <strong>{{pin.num}}</strong>
              <span
                v-if='pin.gpio'
                class="pin-on"
              >
                {{pin.gpio}}
              </span>
              <span
                v-if='!pin.gpio'
                class="pin-off"
              >
                {{pin.gpio}}
              </span>
            </p>
          </li>
        </ul>
      </div>
    `
  })
})(window.app = {})
