import { database } from "./database";

const db = database("MAIN")
const collection = db.collection('counters');

const globalCounters = async (name: any) => {
    const ret = await collection.findOneAndUpdate(
        { _id: name },
        { $inc: { seq: 1 } },
        { upsert: true },
    )

    return ret?.seq
}

export const getNextSequence = async (name: string) => await globalCounters(name)
