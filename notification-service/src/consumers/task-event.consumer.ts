import kafka from "../config/kafka";
import { Notification } from "../schema/notication.schema";
import { validateTaskEvent } from "../validators/task-event.validator";

const consumer = kafka.consumer({
  groupId: "taskflow-notification-service",
});

export const startTaskEventConsumer = async () => {
  await consumer.connect();

  console.log("Notification Service Kafka consumer connected");

  await consumer.subscribe({
    topic: "task-events",
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (!message.value) {
        throw new Error("Received an empty Kafka message");
      }

      let parsedEvent: unknown;

      try {
        parsedEvent = JSON.parse(message.value.toString());
      } catch {
        throw new Error("Received invalid JSON from Kafka");
      }

      const event = validateTaskEvent(parsedEvent);

      const notification = await Notification.updateOne(
        { eventId: event.eventId },
        {
          $setOnInsert: {
            eventId: event.eventId,
            recipientId: event.data.assignedTo,
            eventType: event.eventType,
            taskId: event.data.taskId,
            projectId: event.data.projectId,
            assignedBy: event.data.assignedBy,
            isRead: false,
            readAt: null,
          },
        },
        { upsert: true },
      );

      console.log(notification.upsertedCount === 1 ? "Notification created" : "Notification already exists", {
        topic,
        partition,
        eventId: event.eventId,
        recipientId: event.data.assignedTo,
        taskId: event.data.taskId,
      });
    },
  });
};

export const stopTaskEventConsumer = async () => {
  await consumer.disconnect();
  console.log("Notification Service Kafka consumer disconnected");
};
