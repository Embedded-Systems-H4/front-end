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
    const { id, name } = req.body
    async function saveRole() {
        try {
            const db = database("MAIN");
            const collection = db.collection('roles');
            const query = await collection.insertOne({
                id: id,
                name: name
            })
            if (query?.acknowledged && query?.insertedId) {
                return {
                    id: id,
                    name: name
                }
            }
        } catch (error) {
            console.log(error);
            return new CustomError("Unable to save role", 500)
        }
    }

    try {
        const response = await saveRole()
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