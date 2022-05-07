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
      orderBy: { createdAt: 'desc' },
    }),
  }

  const data = { exercises, prs, workouts }

  return data
}

function ExerciseItems() {
  const data = useLoaderData()
  const workoutData = data.workouts['workouts']
  return (
    <div className='max-h-none m-0 h-screen w-screen max-w-none bg-white p-0 text-black'>
      <div className='flex w-screen items-center justify-between'>
        <h1 className='text-3xl font-bold'>My Exercises</h1>
        <Link to='/dashboard/new' className='underline-offset-4'>
          <span className='underline underline-offset-4 opacity-80 duration-100 ease-linear hover:underline-offset-2 hover:opacity-100'>
            New Exercise
          </span>
        </Link>
      </div>
      <MyExercise
        exercises={data.exercises['exercises']}
        prs={data.prs['prs']}
      />
      <MyWorkouts data={workoutData} />
      <div></div>
    </div>
  )
}

export default ExerciseItems
