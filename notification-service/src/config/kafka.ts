import { Kafka } from "kafkajs";

const brokers = process.env.KAFKA_BROKERS?.split(",")
  .map((broker) => broker.trim())
  .filter(Boolean);

if (!brokers?.length) {
  throw new Error("KAFKA_BROKERS is not configured");
}

const kafka = new Kafka({
  clientId: "taskflow-notification-service",
  brokers,
});

export default kafka;
