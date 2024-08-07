import { PrismaClient } from "@prisma/client";
import { users } from "./users";
import { encriptor } from "~/.server/adapter";

async function seed() {
    const prisma = new PrismaClient();
  
    try {
      for (const user of users) {
        const { password, ...userNew } = user
        const passwordHashed = await encriptor.hash(password, 10);
        await prisma.user.create({
          data: {...userNew, password: passwordHashed},
        });
      }
  
      console.log("Seed data has been inserted successfully.");
    } catch (error) {
      console.error("Error seeding data:", error);
    } finally {
      await prisma.$disconnect();
    }
}


seed();