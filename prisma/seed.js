import pkg from "@prisma/client";
const prisma = new pkg.PrismaClient();

async function seed() {
  const bruno = await prisma.user.create({
    data: {
      username: 'bruno',
      passwordHash:
        '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u',
    },
  })


  await Promise.all(
    getExercises().map((exercise) => {
      const data = { userId: bruno.id, ...exercise }
      return prisma.exercise.create({ data })
    })
  )
}

seed();

function getExercises() {
  return [
    { title: "Squat", body: "Barbell squat" },
    { title: "Bench", body: "Barbell flat bench press" },
    { title: "Deadlift", body: "Barbell conventional deadlift" },
  ];
}

