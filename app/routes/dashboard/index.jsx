import { Link, useLoaderData } from "@remix-run/react"
import { db } from "~/utils/db.server"
import MyExercise from "../../components/MyExercises"

import { getUser } from "~/utils/session.server"
import MyWorkouts from "~/components/MyWorkouts"
import MyGoals from "~/components/MyGoals"

import Navbar from "~/components/ui/DashboardContentNavbar"

function getSunday(d) {
  d = new Date(d);
  var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6:1)
  return new Date(d.setDate(diff));
}

function getEndOfWeek(d) {
  d = new Date(d);
  var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6:1) + 7
  return new Date(d.setDate(diff));
}


export const loader = async ({ request }) => {
  let today = new Date()
  

  console.log(getSunday(today))
  console.log(getEndOfWeek(today))
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
          orderBy: { weight: "desc" },
        },
      },
      orderBy: { updatedAt: "desc" },
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
      orderBy: { createdAt: "desc" },
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
        createdAt: {
          gt: getSunday(today),
          lte: getEndOfWeek(today),
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
      orderBy: { date: "desc" },
      take: 6,
    }),
  }
  const data = { exercises, prs, workouts, goals, user }

  return data
}



function ExerciseItems() {
  const data = useLoaderData()
  const workoutData = data.workouts["workouts"]
  const notAchieved = [data.goals, false]
  

  return (
    <>
      <header className={"app-header"}>
        <div className={"app-header-navigation"}>
          <div className={"tabs"}>
            <h1 className={""}>Welcome, {data.user.name}!</h1>
            <p>
              Here's what's happening with your strength progress so far. Well
              done!
            </p>
          </div>
        </div>
        <div className={"app-header-mobile"}>
          <button className={"icon-button large"}>
            <i className={"ph-list"}></i>
          </button>
        </div>
      </header>
      <div className=''>
        <Navbar data={["My Goals", "goals/new", "goals"]} />
        <MyGoals data={notAchieved} />
      </div>
      <div className={""}>
        <Navbar data={["My Exercises", "exercises/new", "exercises"]} />
        <MyExercise exercises={data.exercises["exercises"]} />
      </div>
      <div className=''>
        <Navbar data={["My Workouts This Week So Far..", "workouts/new", "workouts"]} />
        <MyWorkouts data={workoutData} />
      </div>
    </>
  )
}

export default ExerciseItems
