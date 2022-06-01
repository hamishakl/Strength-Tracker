import React from "react"
import Navbar from "~/components/ui/PagesNavbar"
import Masonry from "react-masonry-css"

import { Link, useLoaderData } from "@remix-run/react"
import { db } from "~/utils/db.server"

import { getUser } from "~/utils/session.server"

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
  const workoutData = data.workouts

  let workoutArray = []

  workoutData.map((workout, i) => {
    var obj = {
      date: workout.date,
      volume: [],
    }
    workoutArray.push(obj)
    workout.volume.map((vol) => {
      //  console.log(obj.volume)
      if (obj.volume[0] != vol.Exercise.title) {
        let arr = { weight: vol.weight, reps: vol.reps, sets: vol.sets }
        obj.volume.push(vol.Exercise.title)
        obj.volume.push(arr)
      } else {
        let arr = { weight: vol.weight, reps: vol.reps, sets: vol.sets }
        obj.volume.push(arr)
      }
    })
  })

  let workoutMasonryArray = []

  let arr = []

  workoutArray.map((workout) => {
    arr = [
      <div>
        <h2>{workout.date}</h2>
        <table>
          {workout.volume.map((vol, i) => {
            if (typeof vol != "object") {
              return (
                <tr>
                  {vol}
                  <td>
                    <th>
                      <h3>weight</h3>
                    </th>
                  </td>
                  <td>
                    <th>
                      <h3>reps</h3>
                    </th>
                  </td>
                  <td>
                    <th>
                      <h3>sets</h3>
                    </th>
                  </td>
                </tr>
              )
            } else {
              return (
                <tr>
                  <td>
                    <p></p>
                  </td>
                  <td>
                    <p>{vol.weight}</p>
                  </td>
                  <td>
                    <p>{vol.reps}</p>
                  </td>
                  <td>
                    <p>{vol.sets}</p>
                  </td>
                </tr>
              )
            }
          })}
        </table>
      </div>,
    ]
    workoutMasonryArray.push(arr)
  })
  return (
    <>
      <Navbar data={["My Workouts", "workouts/new", "Workout"]} />
      <Masonry
        breakpointCols={3}
        className='my-masonry-grid'
        columnClassName='my-masonry-grid_column'
      >
        {workoutMasonryArray}
      </Masonry>
    </>
  )
}
