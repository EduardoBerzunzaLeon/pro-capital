import { PrismaClient } from "@prisma/client";
import { 
    users, 
    roles, 
    modules,
    permissions
} from './users';
import { encriptor } from "~/.server/adapter";

async function seed() {
    const prisma = new PrismaClient();

    await insertRoles(prisma);
    await insertModules(prisma);
    await insertPermissions(prisma);
  

}


async function insertRoles(prisma: PrismaClient) {
  return await prisma.role.createMany({
    data: [...roles]
  });
}

async function insertModules(prisma: PrismaClient) {
  return await prisma.module.createMany({
    data: [...modules]
  });
}

async function insertPermissions(prisma: PrismaClient) {
  for (const permission of permissions) {

    const { name, description, module, roles } = permission;

    const moduleDb  = await prisma.module.findFirst({ where: { name: module } });
    const rolesDB = await prisma.role.findMany({ where: {
       role: {in : roles }
    }})
  
    if(moduleDb) {
      const {id: moduleId} = moduleDb;

      await prisma.permission.create({ 
        data: {
          name, 
          description,
          moduleId,
          roles: {
            connect: [...rolesDB]
          }
        }
      }
    )

    }

  }
}



seed();

// try {
//   for (const user of users) {
//     const { password, ...userNew } = user
//     const passwordHashed = await encriptor.hash(password, 10);
//     await prisma.user.create({
//       data: {...userNew, password: passwordHashed},
//     });
//   }

//   console.log("Seed data has been inserted successfully.");
// } catch (error) {
//   console.error("Error seeding data:", error);
// } finally {
//   await prisma.$disconnect();
// }