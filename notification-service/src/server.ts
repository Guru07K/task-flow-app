import "dotenv/config";
import app from "./app.js";
import { connectDatabase } from "./config/database.js";
import { startTaskEventConsumer } from "./consumers/task-event.consumer.js";

const PORT = Number(process.env.PORT) || 5001;

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();
    await startTaskEventConsumer();

    app.listen(PORT, () => {
      console.log(`Notification Service running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start Notification Service:", error);
    process.exitCode = 1;
  }
};

void startServer();
