// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { UpdateFilter } from 'mongodb';
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
    const { name, color, context, device_id } = JSON.parse(req.body)
    async function deleteRole() {
        try {
            const db = database("MAIN");
            let result = { name: name }; // Default result object

            // Check context before updating 'devices' collection
            if (context !== "device") {
                // Delete from 'roles' collection
                const rolesCollection = db.collection('roles');
                const rolesQuery = await rolesCollection.deleteOne({ "name": name });
                if (rolesQuery?.acknowledged) {
                    result = { name: name };
                }

            }

            const devicesCollection = db.collection('devices');
            const devicesQuery = await devicesCollection.updateMany(
                context === "device" ? { "id": device_id, "allowedRoles": { name: name, color: color } } : { "allowedRoles": { name: name, color: color } },
                { $pull: { "allowedRoles": { name: name, color: color } } as UpdateFilter<Document> }
            );

            if (devicesQuery?.acknowledged) {
                return result;
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
                response
            })
        }
    } catch (error) {
        console.log(error);
        return new CustomError("Unable to delete role", 500)
    }
}