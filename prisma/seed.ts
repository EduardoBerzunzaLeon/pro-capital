import { PrismaClient } from "@prisma/client";
import { 
    users, 
    roles, 
    modules,
    permissions,
    routes,
    municipalities,
    towns
, folders, 
groups,
clients, avals, 
credits,
paymentDetail,
leaders,
agent_routes} from './users';
import { encriptor } from "~/.server/adapter";
// import { encriptor } from "~/.server/adapter";
const prisma = new PrismaClient();

export async function seed() {

    // await Promise.all([
    //  prisma.role.deleteMany(),
    //  prisma.module.deleteMany(),
    //  prisma.municipality.deleteMany(),
    //  prisma.route.deleteMany(),
    //  prisma.aval.deleteMany(),
    //  prisma.client.deleteMany(),
    //  prisma.permission.deleteMany(),
    //  prisma.town.deleteMany(),
    //  prisma.user.deleteMany(),
    //  prisma.folder.deleteMany(),
    //  prisma.folder.deleteMany(),
    //  prisma.group.deleteMany(),
    //  prisma.leader.deleteMany(),
    //  prisma.credit.deleteMany(),
    //  prisma.paymentDetail.deleteMany(),
    //  prisma.agentRoute.deleteMany()
    // ]);

    await insertRoles(prisma),
    await insertUsers(prisma),
    
    await Promise.all([
      insertModules(prisma),
      // insertMunicipalities(prisma),
      insertRoutes(prisma),
      // insertAvals(prisma),
      // insertStressClients(prisma, 20000)
      // insertClients(prisma)
    ]);

    await Promise.all([
      insertPermissions(prisma),
      // insertTowns(prisma),
    ]);


    // await insertFolders(prisma);
    // await insertGroups(prisma);

    // await insertLeaders(prisma);
    // await insertStressCredits(prisma, 20000);
    // await insertCredits(prisma);
    // await insertPaymentDetails(prisma);
    // await insertAgentRoutes(prisma);

    console.log(`Database has been seeded. 🌱`);
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

async function insertRoutes(prisma: PrismaClient) {
  for (const route of routes) {
    await prisma.route.createMany({
      data: {
        name: route.name,
        createdById: 1
      }
    });
    
  }
}


async function insertMunicipalities(prisma: PrismaClient) {
  
  for (const municipality of municipalities) {
    await prisma.municipality.create({
      data: {
        name: municipality.name,
        createdBy: {
          connect: { id: 1 }
        },
      }
    });
  }

  
}

async function insertAgentRoutes(prisma: PrismaClient) {
  for (const agent of agent_routes) {
    await prisma.agentRoute.create({
      data: {
        userId: agent.userId,
        routeId: agent.routeId,
        createdById: 1 
      }
    });
  }

}

async function insertPermissions(prisma: PrismaClient) {
  for (const permission of permissions) {
    const { name, description, module, roles, servername } = permission;
    const moduleDb  = await prisma.module.findFirst({ where: { name: module } });
    const rolesDB = await prisma.role.findMany({ where: {
       role: { in : roles }
    }})
    if(moduleDb) {
      const {id: moduleId} = moduleDb;
      await prisma.permission.create({ 
        data: {
          name, 
          description,
          servername,
          moduleId,
          roles: {
            connect: [...rolesDB]
          }
        }
      })
    }
  }
}

async function insertTowns(prisma: PrismaClient) {
  for (const town of towns) {
    const {name, municipality} = town;
    const municipalityDb = await prisma.municipality.findFirst({
      where: { 
       name: municipality 
      }
    });

    if(municipalityDb) {
      const { id } = municipalityDb;
      await prisma.town.create({ 
        data: {
          name, 
          municipality: {
            connect: { id }
          },
          createdBy: {
            connect: { id: 1 }
          }
        }
      })
    }
  }
}

async function insertFolders(prisma: PrismaClient) {

  for (const folder of folders) {
    const { name, town, route, consecutive } = folder;
    const [routeDb, townDb] = await Promise.all([
      prisma.route.findFirst({ where: { name: route }}),
      prisma.town.findFirst({ where: { name: town }})
    ]);
    
    if(routeDb && townDb) {
      await prisma.folder.create({
        data: {
          name,
          consecutive,
          createdBy: {
            connect: { id: 1}
          },
          town: {
            connect: { id: townDb.id }
          },
          route: {
            connect: { id: routeDb.id }
          }
        }
      })
    }
  }
}


async function insertGroups(prisma: PrismaClient) {
  for (const group of groups) {
    const { name, folder } = group;
    const folderDb = await prisma.folder.findUnique({ where: { name: folder } });
    if(folderDb) {
      await prisma.group.create({
        data: {
          name,
          folder: {
            connect: { id: folderDb.id }
          }
        }
      })
    }
  }
}

async function insertLeaders(prisma: PrismaClient) {
  for (const leader of leaders) {
    const { 
      folder, name, lastNameFirst, lastNameSecond,
      ...restLeader 
    } = leader;
    const folderDb = await prisma.folder.findUnique({ where: { name: folder } });

    const fullName = concatFullName({ name, lastNameFirst, lastNameSecond });

    if(folderDb) {
      await prisma.leader.create({
        data: {
          ...restLeader,
          name, 
          lastNameFirst,
          lastNameSecond,
          fullname: fullName,
          folder: {
            connect: { id: folderDb.id }
          },
          createdBy: {
            connect: { id: 1 }
          }
        }
      })

    }
  }
}


function concatFullName({ name, lastNameFirst, lastNameSecond }: { name: string, lastNameFirst: string, lastNameSecond?: string }) {

  const nameTrim = name.trim();
  const lastNameFirstTrim = lastNameFirst.trim();
  const fullName = `${nameTrim} ${lastNameFirstTrim}`.toLowerCase();
  
  if(!lastNameSecond) {
    return fullName;
  }

  const lastNameSecondTrim = lastNameSecond.trim();
  return `${fullName} ${lastNameSecondTrim}`.toLowerCase();
}

async function insertUsers(prisma: PrismaClient) {
  for (const user of users) {
    const { password, role, name, lastNameFirst, lastNameSecond, ...userNew } = user;
    const passwordHashed = await encriptor.hash(password, 10);
    const roleDb = await prisma.role.findUnique({ where: { role } });
    const fullName = concatFullName({ name, lastNameFirst, lastNameSecond });

    if(roleDb) {
      await prisma.user.create({
        data:  {
          name,
          lastNameFirst,
          lastNameSecond,
          fullName,
          ...userNew,
          password: passwordHashed,
          role: {
            connect: { id: roleDb.id }
          }
        }
      })
    }
  }
}

export async function insertStressClients(prisma: PrismaClient, interations: number) {

  for (let index = 0; index < interations; index++) {
      clients.push(clients[0]);
  }
  await insertClients(prisma);
}

export async function insertStressCredits(prisma: PrismaClient, interations: number) {

  for (let index = 0; index < interations; index++) {
    credits.push(credits[0]);
  }

  await insertCredits(prisma);
}

async function insertClients(prisma: PrismaClient) {
  return await prisma.client.createMany({
    data: [...clients]
  });
}

async function insertAvals(prisma: PrismaClient) {
  return await prisma.aval.createMany({
    data: [...avals]
  });
}

async function insertCredits(prisma: PrismaClient) {

  for (const credit of credits) {
    const { aval, client, folder, group, ...restCredit } = credit;
    const avalDb = await prisma.aval.findFirst({ where: { curp: aval }});
    const clientDb = await prisma.client.findFirst({ where: { curp: client }});
    const folderDb = await prisma.folder.findUnique({ where: { name: folder }});
    const groupDb = await prisma.group.findFirst({ where: { 
      name: group, 
      folderId: folderDb?.id 
    }});

    if(avalDb && clientDb && folderDb && groupDb ) {
      await prisma.credit.create({
        data: {
          ...restCredit,
          aval: {
            connect: { id: avalDb.id },
          },
          client: {
            connect: { id: clientDb.id },
          },
          folder: {
            connect: { id: folderDb.id },
          },
          group: {
            connect: { id: groupDb.id },
          },
          createdBy: {
            connect: { id: 1 }
          }
        }
      })
    }
  }
}

async function  insertPaymentDetails(prisma: PrismaClient) {

  for (const detail of paymentDetail) {
    
    const { client, folder, group, agendt, ...restDetail }  = detail;
    
    const creditDb = await prisma.credit.findFirst({
      where: {
        client: {
          curp: client
        },
        folder: {
          name: folder
        },
        group: {
            name:  group
        },
      }
    });

    // const creditDb = await prisma.credit.findFirst({ where: { id: 1 }});
    const agentDb = await prisma.user.findUnique({ where: { username: agendt }});
    
    if(creditDb && agentDb) {
      await prisma.paymentDetail.create({
        data: {
          ...restDetail,
          credit: {
            connect: { id: creditDb.id}
          },
          agent: {
            connect: { id: agentDb.id}
          },
          createdBy: {
            connect: { id: 1 }
          }
        }
      })
    }
  }
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });