import { useCallback, useEffect } from 'react';
import io from 'socket.io-client';

export const useMQTT = ({
    topics, callback
}: {
    topics?: string[],
    callback: (e: any) => void
}) => {
    const subscribe = useCallback(async () => {
        await fetch("/api/socket", {
            method: "POST",
            body: JSON.stringify({
                topics: topics as string[],
            })
        });
    }, [topics]);

    const publish = useCallback(async (topic: string, message: string) => {
        await fetch("/api/socket", {
            method: "POST",
            body: JSON.stringify({
                topic,
                message,
                action: "publish"
            })
        });
    }, []);

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
    }, [callback]); // Removed subscribe from the dependency array

    useEffect(() => {
        subscribe();
    }, [subscribe]);

    return { publish }
};
