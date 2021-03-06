import { Link, useLoaderData } from '@remix-run/react'
import { db } from '~/utils/db.server'
import MyExercise from '../../components/MyExercises'

import { getUser } from '~/utils/session.server'
import MyWorkouts from '~/components/MyWorkouts'
import MyGoals from '~/components/MyGoals'

import Navbar from '~/components/ui/DashboardContentNavbar'
import { NestedError } from '../../components/error handling/NestedError'

export function getSunday() {
  let sunday = new Date(today.setDate(today.getDate() - today.getDay() + 1))
  return sunday
}

export function getEndOfWeek(d, week) {
  d = new Date(d)
  let day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6 : 1) + week
  return new Date(d.setDate(diff))
}

export const loader = async ({ request }) => {
  let now = new Date()
  let today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  let lastSunday = new Date(today.setDate(today.getDate() - today.getDay() + 1))
  let thisSunday = new Date(today.setDate(today.getDate() - today.getDay() + 8))

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
      take: 4,
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
  const goals = await db.goals.findMany({
    where: { userId: user.id },
    include: {
      Exercise: {
        select: {
          title: true,
        },
      },
    },
  })

  const workouts = {
    workouts: await db.workout.findMany({
      where: {
        userId: {
          equals: `${user.id}`,
        },
        date: {
          gt: lastSunday,
          lte: thisSunday,
        },
      },
      include: {
        volume: {
          select: {
            date: true,
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
      },
      orderBy: { date: 'desc' },
    }),
  }
  const data = { exercises, prs, workouts, goals, user }

  return data
}

export function ErrorBoundary(error) {
  console.error(error)
  return <NestedError />
}

function ExerciseItems() {
  const data = useLoaderData()
  const workoutData = data.workouts['workouts']
  const notAchieved = [data.goals, false]
  return (
    <>
      <header className={'app-header mb-5'}>
        <div className={'app-header-navigation'}>
          <div className={'tabs'}>
            <h1 className={'h-auto mb-5 font-bold text-2xl'}>
              Welcome, {data.user.name}!
            </h1>
            <p className="">
              Here's what's happening with your strength progress so far. Well
              done!
            </p>
          </div>
        </div>
        <div className={'app-header-mobile mb-3'}>
          <h1 className={'mb-2 font-bold text-3xl'}>Welcome, {data.user.name}!</h1>
          <p>
            Here's what's happening with your strength progress so far. Well
            done!
          </p>
        </div>
      </header>
      <div className="h-auto mb-10">
        <Navbar data={['My Goals', 'goals/new', 'goals']} />
        <MyGoals data={notAchieved} />
      </div>
      <div className={'h-auto mb-10 w-full'}>
        <Navbar data={['My Exercises', 'exercises/new', 'exercises']} />
        <MyExercise exercises={data.exercises['exercises']} />
      </div>
      <div className="h-auto mb-10 flex justify-center flex-col">
        <div className='mb-5'>
        <Navbar data={['My Workouts This Week', 'workouts/new', 'workouts']} />
        </div>
        <MyWorkouts data={workoutData} />
      </div>
    </>
  )
}

export default ExerciseItems
