const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seed() {
  const john = await prisma.user.create({
    data: {
      username: 'john',
      passwordHash: '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u'
    }
  })

  await Promise.all(
    getExercises().map((exercise) => {
      const data = {userId: john.id, ...exercise}
      return prisma.exercise.create({ data });
    }),
    getPrs().map((pr) => {
      return prisma.pr.create({ data: pr });
    })
  );
}

function getExercises() {
  return [
    { title: "Squat", body: "Barbell squat" },
    { title: "Bench", body: "Barbell flat bench press" },
    { title: "Deadlift", body: "Barbell conventional deadlift" },
  ];
}

function getPrs() {
  return [
    { exercise: "Squat", weight: 50, reps: 5, sets: 3  }
  ];
}

seed();
