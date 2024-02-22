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
    const { aggregated } = JSON.parse(req.body)
    const { limit } = req.query;
    async function getLogs() {
        try {
            const db = database("MAIN");
            const collection = db.collection('logs');
            const documentsCursor = aggregated ? collection.aggregate([
                {
                    $sort: {
                        timestamp: -1
                    },
                },
                {
                    $limit: parseInt(limit as string) || 20
                },
                {
                    $lookup: {
                        from: "profiles",
                        localField: "profileId",
                        foreignField: "id",
                        as: "profile",
                    },
                },
                {
                    $unwind: {
                        path: "$profile",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "cards",
                        localField: "cardId",
                        foreignField: "id",
                        as: "card",
                    },
                },
                {
                    $unwind: {
                        path: "$card",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "profiles",
                        localField: "card.profileId",
                        foreignField: "id",
                        as: "cardProfile",
                    },
                },
                {
                    $unwind: {
                        path: "$cardProfile",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "devices",
                        localField: "deviceId",
                        foreignField: "id",
                        as: "device",
                    },
                },
                {
                    $unwind: {
                        path: "$device",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        profile: {
                            $ifNull: ["$profile", "$cardProfile"]
                        },

                        cardId: 1,
                        card: 1,
                        deviceId: 1,
                        device: 1,
                        access: 1,
                        type: 1,
                        timestamp: 1
                    },
                },
            ]) : collection.find({})
            const logList = await documentsCursor.toArray()
            if (logList.length > 0) {
                return logList;
            } else {
                return []
            }
        } catch (error) {
            console.log(error);
            return new CustomError("Unable to fetch logs", 500)
        }
    }

    try {
        const response = await getLogs()
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
        return new CustomError("Unable to fetch logs", 500)
    }
}