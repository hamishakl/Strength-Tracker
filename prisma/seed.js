const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

async function seed() {
  await Promise.all(
    getExercises().map((exercise) => {
      return db.exercise.create({ data: exercise });
    }),
    getPrs().map((pr) => {
      return db.pr.create({ data: pr });
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
