import { OutboxStatus } from "../models/outbox.model";
import { Outbox } from "../schema/outbox.schema";
import kafka from "../config/kafka/kafka";

const TOPIC = "task-events";
const CLAIM_TIMEOUT_MS = 60_000;
const POLL_INTERVAL_MS = 1_000;
const MAX_ATTEMPTS = 10;

const producer = kafka.producer({
  allowAutoTopicCreation: false,
});

let isRunning = false;
let isConnected = false;

const connectProducer = async (): Promise<void> => {
  if (isConnected) return;

  await producer.connect();
  isConnected = true;
  console.log("Outbox publisher connected to Kafka");
};

const claimNextEvent = async () => {
  const now = new Date();
  const expiredClaim = new Date(now.getTime() - CLAIM_TIMEOUT_MS);

  return Outbox.findOneAndUpdate(
    {
      attempts: { $lt: MAX_ATTEMPTS },
      nextAttemptAt: { $lte: now },
      $or: [
        { status: OutboxStatus.PENDING },
        {
          status: OutboxStatus.PROCESSING,
          processingStartedAt: { $lte: expiredClaim },
        },
      ],
    },
    {
      $set: {
        status: OutboxStatus.PROCESSING,
        processingStartedAt: now,
      },
      $inc: { attempts: 1 },
    },
    {
      returnDocument: "after",
      sort: { createdAt: 1 },
    },
  );
};

const publishClaimedEvent = async (event: NonNullable<Awaited<ReturnType<typeof claimNextEvent>>>) => {
  try {
    await producer.send({
      topic: TOPIC,
      acks: -1,
      messages: [
        {
          key: event.data.taskId,
          value: JSON.stringify({
            version: event.version,
            eventId: event.eventId,
            eventType: event.eventType,
            occurredAt: event.occurredAt.toISOString(),
            data: event.data,
          }),
        },
      ],
    });

    await Outbox.updateOne(
      {
        _id: event._id,
        status: OutboxStatus.PROCESSING,
        processingStartedAt: event.processingStartedAt,
      },
      {
        $set: {
          status: OutboxStatus.PUBLISHED,
          publishedAt: new Date(),
        },
        $unset: {
          processingStartedAt: 1,
          lastError: 1,
        },
      },
    );

    console.log(`Outbox event published: ${event.eventType} (${event.eventId})`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Kafka error";
    const permanentlyFailed = event.attempts >= MAX_ATTEMPTS;
    const retryDelayMs = Math.min(1_000 * 2 ** (event.attempts - 1), 60_000);

    await Outbox.updateOne(
      {
        _id: event._id,
        status: OutboxStatus.PROCESSING,
        processingStartedAt: event.processingStartedAt,
      },
      {
        $set: {
          status: permanentlyFailed ? OutboxStatus.FAILED : OutboxStatus.PENDING,
          nextAttemptAt: permanentlyFailed ? new Date() : new Date(Date.now() + retryDelayMs),
          lastError: message,
        },
        $unset: { processingStartedAt: 1 },
      },
    );

    console.error(`Outbox event publication failed: ${event.eventId}`, message);
  }
};

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const startOutboxPublisher = async (): Promise<void> => {
  if (isRunning) return;

  await connectProducer();
  isRunning = true;

  void (async () => {
    while (isRunning) {
      try {
        const event = await claimNextEvent();

        if (event) {
          await publishClaimedEvent(event);
        } else {
          await sleep(POLL_INTERVAL_MS);
        }
      } catch (error) {
        console.error("Outbox publisher loop error:", error);
        await sleep(POLL_INTERVAL_MS);
      }
    }
  })();
};

export const stopOutboxPublisher = async (): Promise<void> => {
  isRunning = false;

  if (isConnected) {
    await producer.disconnect();
    isConnected = false;
  }

  console.log("Outbox publisher stopped");
};
