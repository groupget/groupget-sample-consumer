import * as amqp from "amqplib";
import { DbProvider } from "./db";
import { EventSaver } from "./event-saver";

const connectionString = process.env.RABBIT_CLOUD || "amqp://localhost";

const EXCHANGE_NAMES = [
    // "planning_dev",
    // "budget_dev",
    "groupget_events" // aggregates two above
];

const EXCHANGE_TYPE = "topic";
const QUEUE_NAME = "groupget-consumer";


async function start() {
    let connection = await amqp.connect(connectionString);
    let channel = await connection.createChannel();

    let q = await channel.assertQueue(QUEUE_NAME);
    let topic = process.argv[2] || "#";

    for (const exchange of EXCHANGE_NAMES) {
        await channel.assertExchange(exchange, EXCHANGE_TYPE, { durable: false });

        console.log(`binding queue ${q.queue} to exchange ${exchange}`);
        console.log(`Listening on topic: ${topic}`)

        await channel.bindQueue(q.queue, exchange, topic);
    }

    // const db = await DbProvider.getDb(EventSaver.DB_NAME);
    // const eventSaver = new EventSaver(db);

    console.log(' [*] Waiting for notifications. To exit press CTRL+C');

    channel.consume(q.queue, async msg => {
        if (msg === null) {
            console.log("null message :o");
            return;
        }

        const event = JSON.parse(msg.content.toString());
        event["_id"] = null;
        console.log(event);
        // await eventSaver.saveEvent(event);

        channel.ack(msg);
    }, { noAck: false })
}

start();
