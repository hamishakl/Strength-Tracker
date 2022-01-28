const {
    PrismaClient
} = require('@prisma/client')
const db = new PrismaClient()

async function seed() {
    await Promise.all(
        getExercises().map(exercise => {
            return db.post.create({ data: exercise})
        })
    )
}

function getExercises() {
    return [
        { title: "Squat", body: "Barbell squat" },
      { title: "Bench", body: "Barbell flat bench press" },
      { title: "Deadlift", body: "Barbell conventional deadlift" },
    ]
}

seed()