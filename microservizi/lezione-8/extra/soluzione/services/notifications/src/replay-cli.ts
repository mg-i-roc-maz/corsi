// Extra 2: da riga di comando.
//   nel container:  docker compose exec notifications node dist/replay-cli.js
//   dal computer:   RABBITMQ_URL=amqp://guest:guest@localhost:5672 npx tsx src/replay-cli.ts
import amqp from "amqplib";
import { DLQ, QUEUE } from "./broker.js";
import { replayDeadLetters } from "./replay-dlq.js";

const url = process.env.RABBITMQ_URL ?? "amqp://localhost:5672";
const connection = await amqp.connect(url);
const channel = await connection.createChannel();
const result = await replayDeadLetters(channel, { from: DLQ, to: QUEUE });
console.log(`rimessi in coda: ${result.replayed}, lasciati nella DLQ (illeggibili): ${result.skipped}`);
await channel.close();
await connection.close();
