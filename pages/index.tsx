import { HStack, VStack, Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import io, { Socket } from 'socket.io-client';

const Home: NextPage = () => {
  const [messages, setMessages] = useState<string[]>([]);
  let socket: Socket;

  const socketInitializer = async () => {
    await fetch('/api/socket', {
      headers: {
        topic: "sensor_data_topic"
      }
    });
    socket = io();

    socket.on('connect', () => {
      console.log('connected');
    });

    // Listen for 'mqttMessage' events from the server
    socket.on('mqttMessage', (data: { topic: string, message: string }) => {
      // Update messages state with the new message
      setMessages([data.message]);
    });
  };

  useEffect(() => {
    // Ensure the socketInitializer is async, and handle Promise<void> properly
    const initializeSocket = async () => {
      await socketInitializer();
    };

    initializeSocket();

    // Cleanup function (optional)
    return () => {
      // Disconnect or perform any cleanup if needed
      if (socket) {
        socket.disconnect();
      }
    };
  }, []); // Empty dependency array means this effect runs once after initial render

  return (
    <VStack ml={{ base: 0, md: 60 }} p="4">
      <HStack w={'100%'} h={'100%'}>
        <VStack>
          {messages.map((message, index) => (
            <Text key={index}>{message}</Text>
          ))}
        </VStack>
      </HStack>
    </VStack>
  );
};

export default Home;
