import { Link, useLoaderData } from 'remix'
import { db } from '~/utils/db.server'
import { getUser } from '~/utils/session.server'

export const loader = async (request) => {
  const user = await getUser(request)

  const exercises = {
    exercises: await db.exercise.findMany({
      where: {
        userId: {
          equals: `${user.id}`,
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
  }
  return { exercises }
}

export default function MyWorkouts({ data }) {
  const exercises = useLoaderData()
  const exerciseData = exercises.exercises.exercises
  const exerciseIds = []
  let exerciseNames = []

  for (let a = 0; a < exerciseData.length; a++) {
    for (let b = 0; b < data.length; b++) {
      for (let c = 0; c < data[b].volume.length; c++) {
        if (data[b].volume[c].exerciseId === exerciseData[a].id) {
          exerciseNames.unshift({
            [exerciseData[a].id]: exerciseData[a].title,
          })
        }
      }
    }
  }

  return (
    <>
      {data.map((workouts) => {
        return (
          <>
            <h2>Workout date: {workouts.date}</h2>
            {workouts.volume.map((workout, index) => {
              console.log(index)
              return (
                <div>
                  <h1>{exerciseNames[index][workout.exerciseId]}</h1>
                  <p>
                    {workout.weight}kg for {workout.reps} reps for{' '}
                    {workout.sets} sets.
                  </p>
                </div>
              )
            })}
          </>
        )
      })}
    </>
  )
}
