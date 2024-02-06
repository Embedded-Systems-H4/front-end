import { MongoClient } from 'mongodb'

export const database = (name: string) => {
    const client = new MongoClient(process.env.MONGO_URL as string)
    return client.db(name)
}