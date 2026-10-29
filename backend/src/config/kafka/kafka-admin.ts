import kafka from "./kafka";

const admin = kafka.admin();

export const createKafkaTopics = async () => {
  await admin.connect();

  try {
    const topic = await admin.listTopics();

    if (!topic.includes("task-events")) {
      await admin.createTopics({
        topics: [
          {
            topic: "task-events",
            numPartitions: 1,
            replicationFactor: 1,
          },
        ],
      });

      console.log("===> Kafka topic created: task-events");
    } else {
      console.log("Kafka topic already exists: task-events");
    }
  } finally {
    await admin.disconnect();
  }
};

// 1. admin() gives us Kafka's administrative API.
// 2. listTopics() prevents us from trying to recreate an existing topic.
// 3. createTopics() creates the topic from application code.
// 4. finally ensures the admin connection is disconnected even if an error occurs.
