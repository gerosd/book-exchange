import {MongoClient, Db} from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB || 'book_exchange';

let client: MongoClient;
let db: Db;

export async function connectToDatabase() {
    if (db) {
        return {client, db};
    }

    try {
        client = new MongoClient(uri);
        await client.connect();
        db = client.db(dbName);

        return {client, db};
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw error;
    }
}

export {db};
