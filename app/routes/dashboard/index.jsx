import { Link, useLoaderData } from 'remix'
import { db } from '~/utils/db.server'
import MyExercise from '../../components/MyExercises'

import { getUser } from '~/utils/session.server'
import MyWorkouts from '~/components/MyWorkouts'

export const loader = async ({ request }) => {
  const user = await getUser(request)

  const exercises = {
    exercises: await db.exercise.findMany({
      where: {
        userId: {
          equals: `${user.id}`,
        },
      },
      take: 20,
      orderBy: { createdAt: 'desc' },
    }),
  }
  const prs = {
    prs: await db.pr.findMany({
      where: {
        userId: {
          equals: `${user.id}`,
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
  }
  const workouts = {
    workouts: await db.workout.findMany({
      where: {
        userId: {
          equals: `${user.id}`,
        },
      },
      select: {
        date: true,
        volume: {
          include: {
            exerciseId: true,
            weight: true,
            reps: true,
            sets: true,
            workoutId: true,
            id: true,
          },
          include: {
            Exercise: {
              select: {
                id: true,
                title: true,
              }
            }
          }
        },
      },
      orderBy: { date: 'desc' },
    }),
  }

  const data = { exercises, prs, workouts, user }

  return data
}

function ExerciseItems() {
  const data = useLoaderData()
  const workoutData = data.workouts['workouts']
  return (
    <>
      <div className='div2'>
        <h1 className='heading'>Hi {data.user.username}!</h1>
      </div>
        <div className='div3 exercises-heading--wrapper'>
          <h2 className='subheading'>My Exercises</h2>
          <Link to='/dashboard/new' className='new-exercise--link'>
            <span>
              New
            </span>
          </Link>
        </div>
        <MyExercise
          exercises={data.exercises['exercises']}
          prs={data.prs['prs']}
        />
      <div className='div5'>
        <MyWorkouts data={workoutData} />

      </div>
    </>
  )
}

export default ExerciseItems
