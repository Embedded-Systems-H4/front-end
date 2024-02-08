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
    const { name, color } = JSON.parse(req.body)
    const deviceId = req.body?.["device-id"]
    async function allowRole() {
        try {
            const db = database("MAIN");
            const collection = db.collection('devices');
            const query = await collection.updateOne(
                { "id": deviceId },
                {
                    "$push": {
                        "allowedRoles": {
                            "name": name,
                            "color": color
                        }
                    }
                }
            );
            if (query?.acknowledged) {
                return {
                    name: name,
                    color: color
                }
            }
        } catch (error) {
            console.log(error);
            return new CustomError("Unable to save role", 500)
        }
    }

    try {
        const response = await allowRole()
        if (response instanceof CustomError) {
            res.status(response.code).json({
                error: { message: response.message, code: response.code }
            })
        } else {
            res.status(200).json({
                role: response
            })
        }
    } catch (error) {
        console.log(error);
        return new CustomError("Unable to save role", 500)
    }
}