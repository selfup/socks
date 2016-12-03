require 'json'
require 'socket'
require 'pi_piper'

@gpio_pins = {}

@app_pins = {17 => false}

@app_pins.each do |pin, v|
  @gpio_pins[pin] = PiPiper::Pin.new(pin: pin, direction: :out)
end

@print_or_close = -> msg, client do
  if msg == ""
    stream.close
  else
    @update_pins.(JSON.parse(msg), client)
  end
end

@update_pins = -> payload, client do
  if payload.keys.include?("17")
    keys = payload.keys.map { |e| e.to_i }
    translated_payload = Hash[keys.zip(payload.values)]
    @app_pins = @app_pins.merge(translated_payload)
    @pin_logic_gate.(@app_pins)
  end
end

@pin_logic_gate = -> pins do
  pins.each do |k, v|
    @gpio_pins[k].on if v
    @gpio_pins[k].off if !v
  end
end

@pin_logic_gate.(@app_pins)

if __FILE__ == $0
  socket_server = TCPServer.open(2000)
  while true
    Thread.new(socket_server.accept) do |client|
      loop do
        msg = client.recvmsg[0]
        puts msg
        @print_or_close.(msg, client)
        p Time.now.utc
        p @app_pins
        GC.start
      end
    end
  end
end