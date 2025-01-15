import prisma from "./client";

const dummyData = [
  {
    name: "0",
    password: "hGjOYp43",
    permission: "admin",
  },
  {
    name: "team1",
    password: "team1",
    permission: "contestant",
  },
  {
    name: "team2",
    password: "team2",
    permission: "contestant",
  },
];

const addUser = async () => {
  dummyData.forEach(async (data) => {
    const account = await prisma.account.findFirst({
      where: {
        name: data.name,
      },
    });

    if (account === null) {
      await prisma.account.create({
        data: {
          name: data.name,
          password: data.password,
          permission: data.permission,
        },
      });
    }
  });
};

addUser()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
