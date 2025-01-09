const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const superADMIN = {
  name: "0",
  password: "hGjOYp43",
  permission: "admin",
};

const contestant = {
  name: "team1",
  password: "team1",
  permission: "contestant",
};

const addSuperADMIN = async () => {
  const findADMIN = await prisma.account.findFirst({
    where: {
      name: superADMIN.name,
    },
  });

  if (findADMIN === null) {
    await prisma.account.create({
      data: {
        name: superADMIN.name,
        password: superADMIN.password,
        permission: superADMIN.permission,
      },
    });
  }
};

const addContestant = async () => {
  const findContestant = await prisma.account.findFirst({
    where: {
      name: contestant.name,
    },
  });

  if (findContestant === null) {
    await prisma.account.create({
      data: {
        name: contestant.name,
        password: contestant.password,
        permission: contestant.permission,
      },
    });
  }
};

addSuperADMIN();
addContestant();
