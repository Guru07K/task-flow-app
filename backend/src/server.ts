import "dotenv/config";
import app from "./app";
import { connectDatabase } from "./config/database";
import { createKafkaTopics } from "./config/kafka/kafka-admin";
import { connectKafkaProducer } from "./config/kafka/kafka-producer";
import { startOutboxPublisher } from "./services/outbox-publisher.service";
import { seedRoles } from "./seeders/role.seeder";
import redisClient from "./config/redis/redis";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDatabase();

  // await createKafkaTopics();
  // await connectKafkaProducer();
  // await startOutboxPublisher();

  await redisClient.connect();

  await seedRoles();

  app.listen(PORT, () => {
    console.log(`TaskFlow API running on http://localhost:${PORT}`);
  });
};

startServer();
