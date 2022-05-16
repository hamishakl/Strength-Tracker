import { Link, useLoaderData } from 'remix'
import { db } from '~/utils/db.server'
import MyExercise from '../../components/MyExercises'

import { getUser } from '~/utils/session.server'
import MyWorkouts from '~/components/MyWorkouts'
import MyGoals from '~/components/MyGoals'

export const loader = async ({ request }) => {
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
  const goals = {
    goals: await db.goals.findMany({
      where: {
        userId: {
          equals: `${user.id}`,
        }, 
      },
      include:{
        Exercise:{
          select: {

            title: true,
          },
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
              },
            },
          },
        },
      },
      orderBy: { date: 'desc' },
    }),
  }

  const data = { exercises, prs, workouts, goals, user }

  return data
}

function ExerciseItems() {
  const data = useLoaderData()
  const workoutData = data.workouts['workouts']
  return (
    <>
      <div className='header'>
        <h1 className='heading'>Hi {data.user.username}!</h1>
      </div>
      <div className='exercises'>
        <MyExercise
          exercises={data.exercises['exercises']}
          prs={data.prs['prs']}
        />
      </div>
      <div className='workouts'>
        <MyWorkouts data={workoutData} />
      </div>
      <div className='goals'>
        <MyGoals goals={data.goals['goals']}/>
      </div>
    </>
  )
}

export default ExerciseItems
