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
    const { profile } = JSON.parse(req.body)

    async function saveProfile() {
        try {
            const db = database("MAIN");
            const collection = db.collection('profiles');
            await collection.insertOne({
                ...profile,
                birthday: new Date(profile.birthday)
            })

        } catch (error) {
            console.log(error);
            return new CustomError("Unable to save profile", 500)
        }
    }

    try {
        const response = await saveProfile()
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
        return new CustomError("Unable to save profile", 500)
    }
}