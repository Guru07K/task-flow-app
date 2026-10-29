import kafka from "./config/kafka/kafka";

const consumer = kafka.consumer({
  groupId: "taskflow-consumer-test",
});

const testKafkaConsumer = async (): Promise<void> => {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  try {
    await consumer.connect();
    console.log("Kafka consumer connected successfully");

    await consumer.subscribe({
      topic: "task-events",
      fromBeginning: true,
    });

    let resolveReceived!: () => void;
    let rejectReceived!: (error: Error) => void;

    const receivedTestEvent = new Promise<void>((resolve, reject) => {
      resolveReceived = resolve;
      rejectReceived = reject;
    });

    timeout = setTimeout(() => {
      rejectReceived(new Error("Timed out waiting for the task.test event"));
    }, 15000);

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if (!message.value) {
          return;
        }

        const event = JSON.parse(message.value.toString());

        console.log("Event received successfully");
        console.log("Topic:", topic);
        console.log("Partition:", partition);
        console.log("Event:", event);

        if (event.eventType === "task.test") {
          resolveReceived();
        }
      },
    });

    await receivedTestEvent;

    console.log("Kafka consumer test passed");
  } catch (error) {
    console.error("Kafka consumer test failed:", error);
    process.exitCode = 1;
  } finally {
    if (timeout) {
      clearTimeout(timeout);
    }

    try {
      await consumer.stop();
      await consumer.disconnect();
      console.log("Kafka consumer disconnected");
    } catch (error) {
      console.error("Kafka consumer cleanup failed:", error);
      process.exitCode = 1;
    }
  }
};

void testKafkaConsumer();
