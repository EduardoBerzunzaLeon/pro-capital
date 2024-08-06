import { PrismaClient } from "@prisma/client";
import { users } from "./users";

async function seed() {
    const prisma = new PrismaClient();
  
    try {
      for (const user of users) {
        await prisma.user.create({
          data: user,
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