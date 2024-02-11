import * as mqtt from 'mqtt';
import { Server } from 'socket.io';

const handleMQTTMessage = (io: Server) => (mqttTopic: any, mqttMessage: Buffer) => {
  const messageData = mqttMessage.toString();
  console.log(`Received MQTT message on topic ${mqttTopic}: ${messageData}`);
  io.emit('mqttMessage', { topic: mqttTopic, message: messageData });
};

const SocketHandler = (req: any, res: any) => {
  const { topics, topic, action, message } = JSON.parse(req.body);

  if (res.socket.server.io) {
    if (action === 'publish' && topic && message) {
      // Handle client's publish request
      const mqttClient = mqtt.connect(`mqtt://${process.env.MQTT_HOST}`, {
        username: process.env.MQTT_USERNAME,
        password: process.env.MQTT_PASSWORD,
        port: parseInt(process.env.MQTT_PORT as string),
        clientId: "front-end"
      });

      mqttClient.on('connect', () => {
        mqttClient.publish(topic, message);
        console.log(`Published MQTT message on topic ${topic}: ${message}`);
        mqttClient.end();
      });
    } else {
      // Handle other actions if needed
    }
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
      mqttClient.subscribe(topics);
    });

    mqttClient.on('message', handleMQTTMessage(io));
  }

  res.end();
};

export default SocketHandler;
