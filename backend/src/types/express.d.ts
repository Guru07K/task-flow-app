import { User } from "../schema/user.schema";
import { IUserAuthorization } from "./auth.types";

declare global {
  namespace Express {
    interface Request {
      user?: User;
      authorization: IUserAuthorization;
    }
  }
}

export {};
