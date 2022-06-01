import React from "react"
import Navbar from "~/components/ui/PagesNavbar"
import Masonry from "react-masonry-css"

import { Link, useLoaderData } from "@remix-run/react"
import { db } from "~/utils/db.server"

import { getUser } from "~/utils/session.server"
import MyWorkouts from "../../../components/MyWorkouts"

export const loader = async ({ request }) => {
  const user = await getUser(request)

  const workouts = {
    workouts: await db.workout.findMany({
      where: {
        userId: {
          equals: `${user.id}`,
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
    }),
  }

  return workouts
}

export default function index() {
  const data = useLoaderData()
  return (
    <>
      <Navbar data={["My Workouts", "workouts/new", "New Workout"]} />
      <MyWorkouts data={data.workouts} />
    </>
  )
}
