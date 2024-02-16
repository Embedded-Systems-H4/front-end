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
    const { cardId, profileId } = JSON.parse(req.body)

    async function updateCard() {
        try {
            const db = database("MAIN");
            const collection = db.collection('cards');
            await collection.updateOne(
                {
                    "id": cardId
                },
                {
                    "$set": {
                        ...(typeof profileId !== "undefined" && { "profileId": parseInt(profileId) }),
                        "updatedAt": new Date()
                    }
                },
                { upsert: true }
            )
        } catch (error) {
            console.log(error);
            return new CustomError("Unable to update card", 500)
        }
    }

    try {
        const response = await updateCard()
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
        return new CustomError("Unable to set update card", 500)
    }
}