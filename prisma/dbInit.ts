const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const superADMIN = {
    "name": "0",
    "password": "hGjOYp43",
    "permission": "admin"
}

const addSuperADMIN = async() => {
    const findADMIN = await prisma.account.findFirst({
        where: {
            name: superADMIN.name
        }
    })

    if (findADMIN === null) {
        await prisma.account.create({
            data: {
                name: superADMIN.name,
                password: superADMIN.password,
                permission: superADMIN.permission
            }
        })
    }
}

addSuperADMIN();