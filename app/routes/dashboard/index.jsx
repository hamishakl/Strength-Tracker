import { Link, useLoaderData } from 'remix'
import { db } from '~/utils/db.server'
import MyExercise from '../../components/MyExercises'

import { getUser } from '~/utils/session.server'
import MyWorkouts from '~/components/MyWorkouts'
import MyGoals from '~/components/MyGoals'

import Navbar from '~/components/ui/DashboardContentNavbar'

export const loader = async ({ request }) => {
  const user = await getUser(request)

  const exercises = {
    exercises: await db.exercise.findMany({
      where: {
        userId: {
          equals: `${user.id}`,
        },
      },
      // orderBy: { createdAt: 'desc' },
      include: {
        Pr: {
          select: {
            weight: true,
            reps: true,
          },
          orderBy: { weight: 'desc' },
        },
      },
      orderBy: { updatedAt: 'desc' },
      take: 6,
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
    
            Exercise: {
              select: {
                id: true,
                title: true,
              },
            },

        },
      },
      orderBy: { date: 'desc' },
      take: 6,
   } }),
  }

  const data = { exercises, prs, workouts, goals, user }

  return data
}

function ExerciseItems() {
  const data = useLoaderData()
  const workoutData = data.workouts['workouts']
  return (
    <>
      <header className={'app-header'}>
        <div className={'app-header-navigation'}>
          <div className={'tabs'}>
            <h1 className={''}>Welcome, {data.user.name}!</h1>
            <p>
              Here's what's happening with your strength progress so far. Well
              done!
            </p>
          </div>
        </div>
        <div className={'app-header-mobile'}>
          <button className={'icon-button large'}>
            <i className={'ph-list'}></i>
          </button>
        </div>
      </header>
      <div className=''>
        <Navbar data={['My Goals', 'new-goal', 'all-goals']} />
        <MyGoals goals={data.goals['goals']} />
      </div>
      <div className={''}>
        <Navbar data={['My Exercises', 'new-exercise', 'all-exercises']} />
        <MyExercise exercises={data.exercises['exercises']} />
      </div>
      <div className=''>
        <Navbar data={['My Workouts', 'new-workout', 'all-workouts']} />
        <MyWorkouts data={workoutData} />
      </div>
    </>
  )
}

export default ExerciseItems
