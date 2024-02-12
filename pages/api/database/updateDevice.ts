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
    const { device_id, locked } = req.headers

    async function updateDevice() {
        try {
            const db = database("MAIN");
            const collection = db.collection('devices');
            await collection.updateOne(
                {
                    "id": device_id
                },
                {
                    "$set": {
                        ...(typeof locked !== "undefined" && { "locked": locked === "true" ? true : false })
                    }
                }
            )
        } catch (error) {
            console.log(error);
            return new CustomError("Unable to set lock status", 500)
        }
    }

    try {
        const response = await updateDevice()
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
        return new CustomError("Unable to set lock status", 500)
    }
}