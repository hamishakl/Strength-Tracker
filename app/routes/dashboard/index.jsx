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
      include: {
        Pr: {
          select: {
            weight: true,
            reps: true,
          }, orderBy: { weight: 'desc'},
        }
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
      include: {
        Exercise: {
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
      <header class="app-header">
            <div class="app-header-navigation">
              <div class="tabs">
                <h1 className=''>Welcome, {data.user.username}!</h1>
                <p>Here's what's happening with your strength progress so far. Well done!</p>
              </div>
            </div>
            <div class="app-header-mobile">
              <button class="icon-button large">
                <i class="ph-list"></i>
              </button>
            </div>
          </header>
      <div className=''>
        <MyGoals goals={data.goals['goals']} />
      </div>
      <div className=''>
        <div className=''>
          <h2 className=''>My Exercises</h2>
          <Link to='/dashboard/new' className=''>
            <span>New</span>
          </Link>
        </div>
        <MyExercise
          exercises={data.exercises['exercises']}
          prs={data.prs['prs']}
        />
      </div>
      <div className=''>
        <MyWorkouts data={workoutData} />
      </div>
    </>
  )
}

export default ExerciseItems
