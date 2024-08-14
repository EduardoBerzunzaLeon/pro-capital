import { PrismaClient } from "@prisma/client";

let db: PrismaClient;

declare global {
    // eslint-disable-next-line no-var
    var __db: PrismaClient | undefined;
}

if (process.env.NODE_ENV === "production") {
    db = new PrismaClient();
    db.$connect()
} else {
    if (!global.__db) {
        global.__db = new PrismaClient();
        global.__db.$connect();
    }
    db = global.__db;
}

export { db };

// TODO: Implement this for pagination
// const db = new PrismaClient().$extends({
//     name: "findManyAndCount",
//     model: {
//       $allModels: {
//         /**
//          * Find and return items and total available count
//          */
//         async findManyAndCount<Model, Args>(
//           this: Model,
//           args: Prisma.Args<Model, "findMany">,
//         ): Promise<[Prisma.Result<Model, Args, "findMany">, number]> {
//           const context = Prisma.getExtensionContext(this)
  
//           return db.$transaction([
//             (context as any).findMany(args),
//             (context as any).count({ where: args.where }),
//           ]) as Promise<[Prisma.Result<Model, Args, "findMany">, number]>
//         },
//       },
//     },
//   })