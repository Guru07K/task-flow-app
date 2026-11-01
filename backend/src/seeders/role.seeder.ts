import { Role } from "../schema/role.schema";

const roles = [
  {
    name: "SUPER_ADMIN",
    description: "Has complete access to the application",
  },
  {
    name: "ADMIN",
    description: "Manages users and application operations",
  },
  {
    name: "MANAGER",
    description: "Manages projects and teams",
  },
  {
    name: "TL",
    description: "Manages tasks and team activities",
  },
  {
    name: "MEMBER",
    description: "Works on assigned tasks",
  },
];

export const seedRoles = async (): Promise<void> => {
  for (const role of roles) {
    await Role.updateOne({ name: role.name }, { $setOnInsert: role }, { upsert: true });
  }

  console.log("Roles seeded successfully");
};
