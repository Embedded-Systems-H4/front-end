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
    async function deleteRole() {
        try {
            const db = database("MAIN");

            // Delete from 'roles' collection
            const rolesCollection = db.collection('roles');
            const rolesQuery = await rolesCollection.deleteOne({ "name": name });

            // Delete from 'devices' collection
            const devicesCollection = db.collection('devices');
            const devicesQuery = await devicesCollection.updateMany(
                { "allowedRoles": name },
                { $pull: { "allowedRoles": name } }
            );

            if (rolesQuery?.acknowledged && devicesQuery?.acknowledged) {
                return { name: name };
            }
        } catch (error) {
            console.log(error);
            return new CustomError("Unable to delete role", 500)
        }
    }

    try {
        const response = await deleteRole()
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
        return new CustomError("Unable to delete role", 500)
    }
}