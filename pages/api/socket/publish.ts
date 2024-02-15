// publishSocket.ts
import * as mqtt from 'mqtt';

let mqttClient: mqtt.MqttClient | null = null; // Initialize as null
let isMqttConnected = false;

const connectToMQTT = async (): Promise<boolean> => {
    if (mqttClient && isMqttConnected) {
        // Already connected, return true
        return true;
    }

    const options: mqtt.IClientOptions = {
        username: process.env.MQTT_USERNAME,
        password: process.env.MQTT_PASSWORD,
        port: parseInt(process.env.MQTT_PORT as string),
        keepalive: 30
    };

    mqttClient = mqtt.connect(`mqtt://${process.env.MQTT_HOST}`, options);

    const connectPromise = new Promise<boolean>(resolve => {
        mqttClient?.on('connect', () => {
            isMqttConnected = true;
            resolve(true);
        });

        mqttClient?.on('close', () => {
            isMqttConnected = false;
            console.log('MQTT client closed');
        });

        mqttClient?.on('reconnect', () => {
            console.log('MQTT client attempting to reconnect');
        });

        mqttClient?.on('error', (error) => {
            console.error(`MQTT connection error: ${error}`);
            isMqttConnected = false;
            resolve(false);
        });
    });

    return await connectPromise;
};

export default async function handler(
    req: any,
    res: any
) {
    const { topics, topic, message } = JSON.parse(req.body);
    const publishHandler = () => {
        if (isMqttConnected) {
            mqttClient?.publish(topic, message);
            console.log(`Published MQTT message on topic ${topic}: ${message}`);
        } else {
            console.log('MQTT client is not connected. Message not published.');
        }
    }

    if (res.socket.server.io) {
        if (await connectToMQTT()) {
            publishHandler()
        }
    }

    res.end();
}
