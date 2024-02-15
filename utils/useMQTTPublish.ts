import { useCallback } from 'react';

export const useMQTTPublish = () => {
    const publish = useCallback(async ({ topic, message }: { topic: string; message: string }) => {
        await fetch("/api/socket/publish", {
            method: "POST",
            body: JSON.stringify({
                topic,
                message
            })
        });
    }, []);

    return { publish };
};
