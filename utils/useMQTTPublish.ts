// useMQTTPublish.js
import { useCallback } from 'react';

export const useMQTTPublish = () => {
    const publish = useCallback(async ({
        topics, message
    }: {
        topics: string[];
        message: string;
    }) => {
        await fetch("/api/socket", {
            method: "POST",
            body: JSON.stringify({
                topics,
                message,
                action: "publish"
            })
        });
    }, []);

    return { publish }
};
