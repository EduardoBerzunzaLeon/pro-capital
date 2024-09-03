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

async function seed() {
    const prisma = new PrismaClient();

    try {
    await Promise.all([
     prisma.role.deleteMany(),
     prisma.module.deleteMany(),
     prisma.municipality.deleteMany(),
     prisma.route.deleteMany(),
     prisma.aval.deleteMany(),
     prisma.client.deleteMany(),
     prisma.permission.deleteMany(),
     prisma.town.deleteMany(),
     prisma.user.deleteMany(),
     prisma.folder.deleteMany(),
     prisma.folder.deleteMany(),
     prisma.group.deleteMany(),
     prisma.leader.deleteMany(),
     prisma.credit.deleteMany(),
     prisma.paymentDetail.deleteMany(),
     prisma.agentRoute.deleteMany()
    ]);

    await Promise.all([
      insertRoles(prisma),
      insertModules(prisma),
      insertMunicipalities(prisma),
      insertRoutes(prisma),
      insertAvals(prisma),
      insertClients(prisma)
    ]);

    await Promise.all([
      insertPermissions(prisma),
      insertTowns(prisma),
      insertUsers(prisma),
    ]);


    await insertFolders(prisma);
    await insertGroups(prisma);

    await insertLeaders(prisma);
    await insertCredits(prisma);
    await insertPaymentDetails(prisma);
    await insertAgentRoutes(prisma);

  } catch (error) {
    console.log({error});   
  }
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
  return await prisma.route.createMany({
    data: [...routes]
  });
}


async function insertMunicipalities(prisma: PrismaClient) {
  return await prisma.municipality.createMany({
    data: [...municipalities]
  });
}

async function insertAgentRoutes(prisma: PrismaClient) {
  return await prisma.agentRoute.createMany({
    data: [...agent_routes]
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
    const { folder, ...restLeader } = leader;
    const folderDb = await prisma.folder.findUnique({ where: { name: folder } });

    if(folderDb) {
      await prisma.leader.create({
        data: {
          ...restLeader,
          folder: {
            connect: { id: folderDb.id }
          }
        }
      })

    }
  }
}


function concatFullName({ name, lastNameFirst, lastNameSecond }: { name: string, lastNameFirst: string, lastNameSecond?: string }) {

  const nameTrim = name.trim();
  const lastNameFirstTrim = lastNameFirst.trim();
  const fullName = `${nameTrim} ${lastNameFirstTrim}`;
  
  if(!lastNameSecond) {
    return fullName;
  }

  const lastNameSecondTrim = lastNameSecond.trim();
  return `${fullName} ${lastNameSecondTrim}`;
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
    const avalDb = await prisma.aval.findUnique({ where: { curp: aval }});
    const clientDb = await prisma.client.findUnique({ where: { curp: client }});
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
          }
        }
      })
    }
  }
}

seed();