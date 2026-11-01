import mongoose, { Document } from "mongoose";

export interface IModuleAccess {
  name: string;
  access: boolean;
  permissions: string[];
}

export interface IUserModuleAccess extends Document {
  userId: mongoose.Types.ObjectId;
  roleId: mongoose.Types.ObjectId;
  modules: IModuleAccess[];
}

export interface AssignModuleAccessDTO {
  userId: string;
  roleId: string;
  modules: IModuleAccess[];
}
