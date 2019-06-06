import { MongoClient } from 'mongodb';

export class DbProvider {
    private static client: MongoClient;
    private static readonly URI = process.env.DB_ATLAS || 'mongodb://localhost:27017/testdb';

    private static async connect(uri?: string) {
        this.client = await new Promise<MongoClient>(async (resolve, reject) => {
            const client = new MongoClient(uri || this.URI, { useNewUrlParser: true });
            await client.connect();

            console.log("Connected successfully to server");

            resolve(client);
        });
    }

    public static async getClient(uri?: string) {
        if (!this.client) {
            await this.connect(uri);
        }

        return this.client;
    }

    public static async getDb(dbName: string) {
        if (!this.client) {
            await this.connect();
        }

        return this.client.db(dbName);
    }

    public static closeConnection() {
        if (this.client) {
            return this.client.close();
        }
    }
}
