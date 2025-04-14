const prisma = require("./index");

const seed = async () => {
    
    const createMovie = async () => {
        const movies = [
            {
                title: "",
                description: "",
                image: "",
                year: 1975,
                genre:
            }
        ]
    }

    const createUser = async () => {
        const users = [
            {
                firstName: "Emma",
                lastName: "Stone",
                email: "estone@mail.com",
                password: "password",
                isAdmin: true
            },
            {
                firstName: "Timothee",
                lastName: "Chalamet",
                email: "timtim@gmail.com",
                password: "password",
                isAdmin: false
            },
            {
                firstName: "Nicholas",
                lastName: "Cage",
                email: "ncage@yahoo.com",
                password: "password",
                isAdmin: true
            }
        ];
        await prisma.user.createMany({ data: users});
    }
    await createUser();
}

seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });