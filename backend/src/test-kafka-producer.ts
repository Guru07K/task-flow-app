import { connectKafkaProducer, disconnectKafkaProducer, publishEvent } from "./config/kafka/kafka-producer";

const testKafkaProducer = async (): Promise<void> => {
  try {
    await connectKafkaProducer();

    await publishEvent(
      "task-events",
      "task.test",
      {
        message: "Hello from TaskFlow",
        source: "producer-test",
      },
      "taskflow-producer-test",
    );

    console.log("Kafka producer test passed");
  } catch (error) {
    console.error("Kafka producer test failed:", error);
    process.exitCode = 1;
  } finally {
    await disconnectKafkaProducer();
  }
};

void testKafkaProducer();
