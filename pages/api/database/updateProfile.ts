// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Profile } from '@models/Profile';
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
    const { profile }: { profile: Profile } = JSON.parse(req.body)

    async function updateProfile() {
        try {
            const db = database("MAIN");
            const collection = db.collection('profiles');
            await collection.updateOne({
                "id": profile.id
            }, {
                $set: {
                    ...(typeof profile.name !== "undefined" && { name: profile.name }),
                    ...(typeof profile.birthday !== "undefined" && { birthday: profile.birthday }),
                    ...(typeof profile.gender !== "undefined" && { gender: profile.gender }),
                    ...(typeof profile.email !== "undefined" && { email: profile.email }),
                    ...(typeof profile.status !== "undefined" && { status: profile.status }),
                    ...(typeof profile.roles !== "undefined" ? { roles: profile.roles } : { roles: [] })
                }
            })
        } catch (error) {
            console.log(error);
            return new CustomError("Unable to update profile", 500)
        }
    }

    try {
        const response = await updateProfile()
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
        return new CustomError("Unable to update profile", 500)
    }
}