import * as mqtt from 'mqtt';
import { Server } from 'socket.io';

const handleMQTTMessage = (io: Server) => (mqttTopic: any, mqttMessage: Buffer) => {
  const messageData = mqttMessage.toString();
  console.log(`Received MQTT message on topic ${mqttTopic}: ${messageData}`);
  io.emit('mqttMessage', { topic: mqttTopic, message: messageData });
};

// MQTT Connection
let mqttClient: mqtt.MqttClient;

const connectToMQTT = async (): Promise<boolean> => {
  const options: mqtt.IClientOptions = {
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    port: parseInt(process.env.MQTT_PORT as string),
    clientId: "front-end"
  };

  mqttClient = mqtt.connect(`mqtt://${process.env.MQTT_HOST}`, options);

  const connectPromise = new Promise<boolean>(resolve => {
    mqttClient.on('connect', () => {
      resolve(true);
    });

    mqttClient.on('error', () => {
      resolve(false);
    });
  });

  return await connectPromise;
};

const reconnect = async (): Promise<boolean> => {
  let isConnected = await connectToMQTT();

  while (!isConnected) {
    isConnected = await connectToMQTT();
  }

  return isConnected;
};

const SocketHandler = async (req: any, res: any) => {
  const { topics, topic, action, message } = JSON.parse(req.body);
  if (res.socket.server.io) {
    if (action === "publish") {
      if (topic && message) {
        if (await reconnect()) {
          mqttClient.publish(topic, message)
          console.log(`Published MQTT message on topic ${topic}: ${message}`);
          reconnect()
        }
      }
    }
  } else {
    console.log('Socket is initializing');
    const io = new Server(res.socket.server);
    res.socket.server.io = io;
    if (await reconnect()) {
      mqttClient.subscribe(topics);
      mqttClient.on('message', handleMQTTMessage(io));

    }
  }

  res.end();
};

export default SocketHandler;
