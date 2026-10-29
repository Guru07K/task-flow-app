import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  getNotificationsController,
  getUnreadCountControler,
  markNotrificationAsReadController,
} from "../controllers/notification.controller";

const router = Router();
//

router.use(authenticate);

router.get("/", getNotificationsController);
router.get("/unread-count", getUnreadCountControler);
router.patch("/:id/read", markNotrificationAsReadController);

export default router;
