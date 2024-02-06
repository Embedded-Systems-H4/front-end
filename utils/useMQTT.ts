import { useCallback, useEffect, useRef } from "react";
import { Socket, io } from "socket.io-client";
export const useMQTT = (
    topic: string
) => {
    const socketRef = useRef<Socket>();
    const subscribe = useCallback(async () => {
        await fetch("/api/socket", {
            headers: {
                topic,
            },
        });
    }, [topic])
    useEffect(() => {
        subscribe()
        const socket = io();
        socketRef.current = socket;
        return () => {
            socket.disconnect();
        };
    }, [subscribe, topic]);

    return socketRef.current;
};