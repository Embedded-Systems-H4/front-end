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
    async function getRoles() {
        try {
            const db = database("MAIN");
            const collection = db.collection('roles');
            const documentsCursor = collection.aggregate([
                {
                    $sort: {
                        lastUpdatedAt: -1,
                    },
                }
            ]);
            const roleList = await documentsCursor.toArray()

            if (roleList.length > 0) {
                return roleList;
            } else {
                return new CustomError("No devices found", 404)
            }
        } catch (error) {
            console.log(error);
            return new CustomError("Unable to fetch devices", 500)
        }
    }

    try {
        const response = await getRoles()
        if (response instanceof CustomError) {
            res.status(response.code).json({
                error: { message: response.message, code: response.code }
            })
        } else {
            res.status(200).json({
                roles: response
            })
        }
    } catch (error) {
        console.log(error);
        return new CustomError("Unable to fetch devices", 500)
    }
}