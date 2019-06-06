import { Db, Collection } from "mongodb";

export class EventSaver {
    private readonly COLLECTION_NAME = "events";
    private readonly collection: Collection;
    public static DB_NAME = "groupget-events";

    constructor(private db: Db) {
        this.collection = this.db.collection(this.COLLECTION_NAME);
    }

    public async saveEvent(event: any) {
        await this.collection.insertOne(event);
        console.log(`Event saved:`);
        console.log(event);
    }
}
