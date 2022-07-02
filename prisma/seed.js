const { PrismaClient } = require('@prisma/client')
// const { categories, products } = require('./data.js');
const prisma = new PrismaClient()

async function seed() {
  const admin = await prisma.user.create({
    data: {
      email: 'admin@strengthtracker.com',
      name: 'admin',
      passwordHash:
        '$2b$10$MweAMpPVK5yHf0grZfIhtObZn8SDOQrCP4TqjtlpWadd.9ZfR/as.',
    },
  })

  await Promise.all(
    getExercises().map((exercise) => {
      const data = { userId: admin.id, ...exercise }
      return prisma.exercise.create({ data })
    })
  )
}

seed()

function getExercises() {
  return [
    { title: 'Hack Squat' },
    { title: 'High Bar Squat' },
    { title: 'Seated Leg Curl' },
    { title: 'Stair Calves' },
    { title: 'Machine Crunch' },
    { title: 'Low Incline Dumbbell Press' },
    { title: 'Assisted Parallel Pullup' },
    { title: 'Wide Grip Bench Press' },
    { title: 'Row Machine' },
    { title: 'Deadlift' },
    { title: 'Dumbbell Walking Lunge' },
    { title: '45 Degree Back Raise' },
    { title: 'Lying Leg Curl' },
    { title: 'Calves on Calf Machine' },
    { title: 'Hanging Knee Raise' },
    { title: 'Barbell Upright Row' },
    { title: 'Dips' },
    { title: 'EZ Curl' },
    { title: '1-Arm Dumbbell Row' },
    { title: 'Flat Dumbbell Bench Press' },
    { title: 'High Bar Good Morning' },
    { title: 'Reaching Sit-Up' },
  ]
}
