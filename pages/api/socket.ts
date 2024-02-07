import * as mqtt from 'mqtt';
import { Server } from 'socket.io';

const SocketHandler = (req: any, res: any) => {
  const topic = req.headers.topic
  if (res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    // MQTT Connection
    const mqttClient = mqtt.connect(`mqtt://${process.env.MQTT_HOST}`, {
      username: process.env.MQTT_USERNAME,
      password: process.env.MQTT_PASSWORD,
      port: parseInt(process.env.MQTT_PORT as string),
      clientId: "front-end"
    });

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
  }

  res.end();
};

export default SocketHandler;
