import { useCallback, useEffect } from 'react';
import io from 'socket.io-client';

export const useMQTTSubscription = ({
    callback,
    topics
}: {
    callback: (e: any) => void;
    topics: string[];
}) => {
    const subscribe = useCallback(async () => {
        await fetch("/api/socket", {
            method: "POST",
            body: JSON.stringify({
                topics: topics as string[],
            })
        });
    }, [topics]);

    useEffect(() => {
        subscribe();
    }, [topics, subscribe]);

    useEffect(() => {
        const socket = io();

        if (socket) {
            socket.on("mqttMessage", callback);
        }

        return () => {
            if (socket) {
                socket.off("mqttMessage");
                socket.disconnect();
            }
        };
    }, [callback]);
};
