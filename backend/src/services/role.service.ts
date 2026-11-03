import { Role } from "../schema/role.schema";

class RoleService {
  async getRoles() {
    return Role.find().select("name description").sort({ name: 1 }).lean();
  }
}

export default new RoleService();
