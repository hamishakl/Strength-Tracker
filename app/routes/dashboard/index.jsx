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
      include: {
        Pr: {
          select: {
            weight: true,
            reps: true,
          }, orderBy: { weight: 'desc' },
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: 6
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
      take: 6,
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
      <header className={'app-header'}>
        <div className={'app-header-navigation'}>
          <div className={'tabs'}>
            <h1 className={''}>Welcome, {data.user.username}!</h1>
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
        <MyGoals goals={data.goals['goals']} />
      </div>
      <div className={''}>
        <div className={'my-exercises__navigation'}>
          <h2 className=''>My Exercises</h2>
          <div className='my-exercises__links'>
            <Link to='/dashboard/new' className=''>
              <span>New</span>
            </Link>
            <Link to={'/exercises'}>View all</Link>
          </div>
        </div>
        <MyExercise
          exercises={data.exercises['exercises']}
        />
      </div>
      <div className=''>
        <MyWorkouts data={workoutData} />
      </div>
    </>
  )
}

export default ExerciseItems
