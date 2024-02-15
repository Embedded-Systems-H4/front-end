// subscribeSocket.ts
import * as mqtt from 'mqtt';
import { Server } from 'socket.io';

let mqttClient: mqtt.MqttClient;

const handleMQTTMessage = (io: Server) => (topic: any, subscription: Buffer) => {
    const messageData = subscription.toString();
    console.log(`Received MQTT message on topic ${topic}: ${messageData}`);
    io.emit('subscription', { topic: topic, message: messageData });
};

const connectToMQTT = async (): Promise<boolean> => {
    const options: mqtt.IClientOptions = {
        username: process.env.MQTT_USERNAME,
        password: process.env.MQTT_PASSWORD,
        port: parseInt(process.env.MQTT_PORT as string),
        clientId: "subscribe",
        keepalive: 30
    };

    mqttClient = mqtt.connect(`mqtt://${process.env.MQTT_HOST}`, options);

    const connectPromise = new Promise<boolean>(resolve => {
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

export default async function handler(
    req: any,
    res: any
) {
    const { topics, topic, action, message } = JSON.parse(req.body);
    if (!res.socket.server.io) {
        const io = new Server(res.socket.server);
        res.socket.server.io = io;
        console.log('Socket is initializing');
        if (await connectToMQTT()) {
            mqttClient.subscribe(topics);
            mqttClient.on('message', handleMQTTMessage(io));
        }
    }

    res.end();
}