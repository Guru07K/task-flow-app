import { randomUUID } from "node:crypto";
import kafka from "./kafka";

export interface DomainEvent<T> {
  version: number;
  eventId: string;
  eventType: string;
  occurredAt: string;
  data: T;
}

const producer = kafka.producer({
  allowAutoTopicCreation: false,
});

export const connectKafkaProducer = async () => {
  await producer.connect();
  console.log("Kafka producer connected successfully");
};

export const publishEvent = async <T>(topic: string, eventType: string, data: T, key?: string) => {
  const event: DomainEvent<T> = {
    version: 1,
    eventId: randomUUID(),
    eventType,
    occurredAt: new Date().toISOString(),
    data,
  };

  await producer.send({
    topic,
    acks: -1,
    messages: [
      {
        key,
        value: JSON.stringify(event),
      },
    ],
  });

  console.log(`Kafka event published: ${eventType}`);
};

export const disconnectKafkaProducer = async () => {
  await producer.disconnect();
  console.log("Kafka producer disconnected");
};
