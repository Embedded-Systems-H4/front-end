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
    const { name, color, context, device_id } = req.headers

    async function saveRole() {
        try {
            const db = database("MAIN");
            let result = { name: name }; // Default result object
            if (context !== "device") {

                const deviceCollection = db.collection('devices');
                const rolesCollection = db.collection('roles');
                const rolesQuery = await rolesCollection.updateOne(
                    {
                        "name": name
                    },
                    {
                        "$set": {
                            name: name,
                            color: color
                        }
                    },
                    {
                        upsert: true
                    }
                )

                await deviceCollection.updateMany(
                    {
                        "allowedRoles.name": name,
                    },
                    {
                        "$set": {
                            "allowedRoles.$.name": name,
                            "allowedRoles.$.color": color
                        }
                    }
                );

                if (rolesQuery?.acknowledged) {
                    return { name: name }
                }
            } else {
                const deviceCollection = db.collection('devices');
                const devicesQuery = await deviceCollection.updateOne(
                    { "id": device_id },
                    {
                        $push: {
                            "allowedRoles": {
                                $each: [
                                    {
                                        name: name,
                                        color: color
                                    }
                                ]
                            }
                        }
                    }
                )

                if (devicesQuery?.acknowledged) {
                    return { name: name }
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
                response
            })
        }
    } catch (error) {
        console.log(error);
        return new CustomError("Unable to save role", 500)
    }
}