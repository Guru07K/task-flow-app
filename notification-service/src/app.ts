import express from "express";
import cors from "cors";
import notificationRoutes from "./routes/notification.routes";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "notification-service",
  });
});

app.use("/api/notifications", notificationRoutes);

export default app;
