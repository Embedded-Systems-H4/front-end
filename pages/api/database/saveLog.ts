// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { database } from './database';

class CustomError extends Error {
    code: number;

    constructor(message: string, code: number) {
        super(message);
        this.name = 'CustomError';
        this.code = code;
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { log } = JSON.parse(req.body)

    async function saveLog() {
        try {
            const db = database("MAIN");
            const collection = db.collection('logs');

            await collection.insertOne({
                ...log,
                timestamp: new Date(log.timestamp)
            })

        } catch (error) {
            console.log(error);
            return new CustomError("Unable to save log", 500)
        }
    }

    try {
        const response = await saveLog()
        if (response instanceof CustomError) {
            res.status(response.code).json({
                error: { message: response.message, code: response.code }
            })
        } else {
            res.status(200).json({
                response
            })
        }
    } catch (error) {
        console.log(error);
        return new CustomError("Unable to save log", 500)
    }
}