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
    const { name } = JSON.parse(req.body)
    const deviceId = req.body?.["device-id"]
    console.log(deviceId, name)
    async function deleteAllowedRole() {
        try {
            const db = database("MAIN");
            // Delete from 'devices' collection
            const devicesCollection = db.collection('devices');
            const devicesQuery = await devicesCollection.updateOne(
                { "id": deviceId },
                { $pull: { "allowedRoles": { "name": name } } }
            );

            if (devicesQuery?.acknowledged) {
                return { name: name, id: deviceId };
            }
        } catch (error) {
            console.log(error);
            return new CustomError("Unable to delete role from device", 500)
        }
    }

    try {
        const response = await deleteAllowedRole()
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
        return new CustomError("Unable to delete role from device", 500)
    }
}