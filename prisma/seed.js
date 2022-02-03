const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function seed() {
  const adminz = await prisma.user.create({
    data: {
      username: 'adminz',
      passwordHash:
        '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u',
    },
  })


  await Promise.all(
    getExercises().map((exercise) => {
      const data = { userId: adminz.id, ...exercise }
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