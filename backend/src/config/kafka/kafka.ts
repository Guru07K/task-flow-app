import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "taskflow-backend",
  brokers: ["localhost:9092"],
});

export default kafka;

// clientId: identifies this application in Kafka logs and metrics.
// brokers: points to the Docker-published listener accessible from Windows.
// kafka: reusable client used to create an admin client, producer, or consumer.
