export interface AccessTokenPayload extends IUserAuthorization {
  userId: string;
}

export interface RefreshTokenPayload {
  userId: string;
}

export interface IModuleAccess {
  name: string;
  access: boolean;
  permissions: string[];
}

export interface IUserAuthorization {
  role: string;
  modules: IModuleAccess[];
}
