import { AssignModuleAccessDTO, IUserModuleAccess } from "../models/user-module-access.model";
import { Role } from "../schema/role.schema";
import { UserModuleAccess } from "../schema/user-module-access.schema";
import { User } from "../schema/user.schema";
import { IUserAuthorization } from "../types/auth.types";
import { ErrorHandler } from "../utils/error-handler";

class UserModuleAccessService {
  async assignAccess(data: AssignModuleAccessDTO): Promise<IUserModuleAccess> {
    const { userId, roleId, modules } = data;

    const userExists = await User.exists({ _id: userId });
    if (!userExists) {
      throw new ErrorHandler(404, "User not found");
    }

    const roleExists = await Role.exists({ _id: roleId });
    if (!roleExists) {
      throw new ErrorHandler(404, "Role not found");
    }

    for (const module of modules) {
      if (!module.access && module.permissions.length > 0) {
        throw new ErrorHandler(400, `Permissions cannot be assigned when module access is disabled: ${module.name}`);
      }
    }

    const userModuleAccess = await UserModuleAccess.findOneAndUpdate(
      { userId },
      {
        $set: { roleId, modules },
      },
      {
        upsert: true,
        returnDocument: "after",
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );
    return userModuleAccess;
  }

  async getUserAuthorization(userId: string) {
    const userAccess = await UserModuleAccess.findOne({ userId }).lean();
    if (!userAccess) {
      throw new ErrorHandler(403, "User access configuration not found");
    }

    const role = await Role.findById(userAccess.roleId).lean();
    if (!role) {
      throw new ErrorHandler(403, "User role not found");
    }

    return {
      roleId: userAccess.roleId.toString(),
      role: role.name,
      modules: userAccess.modules,
    };
  }
}

export default new UserModuleAccessService();
