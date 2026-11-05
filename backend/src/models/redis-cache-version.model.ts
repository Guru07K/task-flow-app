import { Document } from "mongoose";

export interface IRedisCacheVersion extends Document {
  resource: string;
  version: number;
}
