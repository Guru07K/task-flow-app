export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER ADMIN",
  MEMBER = "MEMBER",
  TL = "TL",
  MANGER = "MANAGER",
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserInput extends Partial<RegisterInput> {
  role?: UserRole;
}

export interface LoginInput {
  email: string;
  password: string;
}
