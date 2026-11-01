export interface IModuleAccess {
  name: string;
  access: boolean;
  permissions: string[];
}

export interface IUserAuthorization {
  role: string;
  modules: IModuleAccess[];
}

export interface IAccessTokenPayload extends IUserAuthorization {
  userId: string;
  exp?: number;
  iat?: number;
  iss?: string;
  aud?: string;
}
