import { Server } from 'socket.io';
import * as mqtt from 'mqtt';

const SocketHandler = (req: any, res: any) => {
  const topic = req.headers.topic
  if (res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    // MQTT Connection
    const mqttClient = mqtt.connect('mqtt://10.71.202.219');

    mqttClient.on('connect', () => {
      console.log('MQTT connected');
      mqttClient.subscribe(topic);
    });

    mqttClient.on('message', (topic: any, message: Buffer) => {
      const messageData = message.toString();
      console.log(`Received MQTT message on topic ${topic}: ${messageData}`);

      // Broadcast the MQTT message to all connected Socket.io clients
      io.emit('mqttMessage', { topic, message: messageData });
    });

    // Handling Socket.io connections
    io.on('connection', (socket) => {
      console.log('Socket.io client connected');

      // Example: Send a Socket.io message when a new MQTT message is received
      mqttClient.on('message', (topic, message) => {
        socket.emit('mqttMessage', { topic, message: message.toString() });
      });

      // Handle Socket.io disconnections
      socket.on('disconnect', () => {
        console.log('Socket.io client disconnected');
      });
    });
  }

  res.end();
};

export default SocketHandler;
