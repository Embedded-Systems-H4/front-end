// useMQTTPublish.js
import { useCallback } from 'react';

export const useMQTTPublish = () => {
    const publish = useCallback(async ({
        topic, message
    }: {
        topic: string;
        message: string;
    }) => {
        await fetch("/api/socket", {
            method: "POST",
            body: JSON.stringify({
                action: "publish",
                topic,
                message,
            })
        });
    }, []);

    return { publish }
};
