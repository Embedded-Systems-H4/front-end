import * as mqtt from 'mqtt';
import { Server } from 'socket.io';

let mqttPublishClient: mqtt.MqttClient;
let mqttSubscribeClient: mqtt.MqttClient;

const handleMQTTMessage = (io: Server) => (topic: any, subscription: Buffer) => {
  const messageData = subscription.toString();
  console.log(`Received MQTT message on topic ${topic}: ${messageData}`);
  io.emit('subscription', { topic: topic, message: messageData });
};

const connectToMQTT = async (clientId: string): Promise<boolean> => {
  const options: mqtt.IClientOptions = {
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    port: parseInt(process.env.MQTT_PORT as string),
    clientId,
    keepalive: 30
  };

  // Assign the mqttClient instance to the appropriate global variable
  if (clientId === "publish") {
    mqttPublishClient = mqtt.connect(`mqtt://${process.env.MQTT_HOST}`, options);
  } else if (clientId === "subscribe") {
    mqttSubscribeClient = mqtt.connect(`mqtt://${process.env.MQTT_HOST}`, options);
  }

  const connectPromise = new Promise<boolean>(resolve => {
    // Use the correct mqttClient instance in the event handlers
    const mqttClient = clientId === "publish" ? mqttPublishClient : mqttSubscribeClient;

    mqttClient.on('connect', () => {
      resolve(true);
    });

    mqttClient.on('close', () => {
      console.log('MQTT client closed');
    });

    mqttClient.on('reconnect', () => {
      console.log('MQTT client attempting to reconnect');
    });

    mqttClient.on('error', (error) => {
      console.error(`MQTT connection error: ${error}`);
      resolve(false);
    });
  });

  return await connectPromise;
};

const reconnect = async (clientId: string): Promise<boolean> => {
  let isConnected = await connectToMQTT(clientId);

  return isConnected;
};

export default async function handler(
  req: any,
  res: any
) {
  const { topics, topic, action, message } = JSON.parse(req.body);
  if (res.socket.server.io) {
    if (action === "publish") {
      if (topic && message) {
        if (await reconnect("publish")) {
          res.socket.server.io.on('publish', async () => {
            mqttPublishClient.publish(topic, message);
            mqttPublishClient.end()
            console.log(`Published MQTT message on topic ${topic}: ${message}`);
          });
        }
      }
    }
  }

  if (!res.socket.server.io) {
    const io = new Server(res.socket.server);
    res.socket.server.io = io;
    console.log('Socket is initializing');
    if (await reconnect("subscribe")) {
      mqttSubscribeClient.subscribe(topics);
      mqttSubscribeClient.on('message', handleMQTTMessage(io));
    }
  }

  res.end();
};