import { redirect } from "@remix-run/node"
import { Form, useActionData, useLoaderData } from "@remix-run/react"
import { getUser } from "~/utils/session.server"
import { db } from "~/utils/db.server"
import React, { useState } from "react"
import NewWorkoutForm from "~/components/NewWorkoutForm"
import Navbar from "../../../components/ui/PagesNavbar"
import NewExerciseForm from "../../../components/NewExerciseForm"

export const loader = async ({ request }) => {
  const user = await getUser(request)
  const exercises = await db.exercise.findMany({
    where: { userId: user.id },
  })
  const data = { user, exercises }
  return data
}

function validateTitle(title) {
  if (typeof title !== "string" || title.length < 2) {
    return "Title should be atleast 2 characters long"
  }
}

const prArray = (dataBlock, exerciseList, user) => {
  let prArr = []
  for (let i = 0; i < exerciseList.length; i++) {
    prArr[i] = {
      exerciseId: dataBlock[i].exerciseId,
      weight: parseInt(dataBlock[i].weight),
      reps: parseInt(dataBlock[i].reps),
      userId: String(user.id),
    }
  }
  return prArr
}

export const action = async ({ request }) => {
  const user = await getUser(request)
  let volumeBlock = {}
  let exerciseList = []
  let volumeArray = []
  const form = await request.formData()

  let list = [...form]

  if (form.get('_method' === 'workout')) {
    
    
    for (let i = 0; i < list.length; i++) {
      if (
        list[i][0].includes("exercise") &&
        !list[i][1].includes("Pick an exercise")
        ) {
          let obj = {
            exerciseId: list[i][1],
            weight: list[i + 1][1],
            reps: list[i + 2][1],
            sets: list[i + 3][1],
          }
          volumeArray.push(obj)
          exerciseList.push(list[i][1])
        }
      }
      
  let date = new Date(form.get("date"))
  
  let volume = {
    volume: {
      create: [],
    },
  }
  
  for (let i = 0; i < exerciseList.length; i++) {
    volume.volume.create.push({
      exerciseId: "",
      weight: "",
      reps: "",
      sets: "",
      userId: "",
    })
    volume.volume.create[i].exerciseId = String(volumeArray[i].exerciseId)
    volume.volume.create[i].weight = parseInt(volumeArray[i].weight)
    volume.volume.create[i].reps = parseInt(volumeArray[i].reps)
    volume.volume.create[i].sets = parseInt(volumeArray[i].sets)
    volume.volume.create[i].userId = String(user.id)
  }
  
  const prArr = prArray(volumeArray, exerciseList, user)
  
  for (let i = 0; i < exerciseList.length; i++) {
    let pr = await db.pr.create({
      data: prArr[i],
    })
  }
  
  const workout = await db.workout.create({
    data: {
      userId: user.id,
      date: date,
      ...volume,
    },
    include: {
      volume: true,
    },
  })
  
  return redirect(`/dashboard`)
} else if(form.get('_method') === 'exercise') {
  const title = form.get("title")

  const fields = { title }

  const fieldErrors = {
    title: validateTitle(title),
  }

  if (Object.values(fieldErrors).some(Boolean)) {
    console.log(fieldErrors)
    return badRequest({ fieldErrors, fields })
  }

  const exercise = await db.exercise.create({
    data: { ...fields, userId: user.id },
  })

  return null
}
}

export default function newWorkout() {
  const actionData = useActionData()

  const [volumeArray, setCount] = useState([])
  const data = useLoaderData()
  const exercises = data.exercises
  let userDate = data.user.createdAt
  let split = userDate.split("")
  let arr = []
  for (let i = 0; i < 10; i++) {
    arr.push(split[i])
  }
  const userJoinDate = arr.join("")
  const current = new Date()
  const day = current.getDate()
  let date
  day < 10
    ? (date = `${current.getFullYear()}-0${
        current.getMonth() + 1
      }-0${current.getDate()}`)
    : (date = `${current.getFullYear()}-0${
        current.getMonth() + 1
      }-0${current.getDate()}`)

  return (
    <div className=''>
      <Navbar data={["New Workout", "workouts", "Back"]} />
      <Form method='post'>
      <input type="hidden" name="_method" value="workout" />
        <div>
          <h5>Date of workout:</h5>
          <input
            type='date'
            id='start'
            name='date'
            defaultValue={date}
            min={userJoinDate}
            max={date}
            required
          ></input>
        </div>
        <div>
          <h4>Only enter your working sets</h4>
        </div>
        <div>
          <h5>Block #1</h5>
          <select
            aria-label='Default select example'
            required
            id='exercise'
            name='exercise-1'
          >
            <option defaultValue={"none"}>Pick an exercise</option>
            {exercises.map((exercise) => (
              <>
                <option key={exercise.id} value={exercise.id}>
                  {exercise.title}
                </option>
              </>
            ))}
          </select>
          <label htmlFor='weight'>Weight</label>
          <input type='number' required name='weight-1' />
          <label htmlFor='weight'>Reps</label>
          <input type='number' required name='reps-1' />
          <label htmlFor='sets'>Sets</label>
          <input type='number' required name='sets-1' />
        </div>
        {volumeArray.map((i) => {
          return (
            <NewWorkoutForm
              key={i}
              exercises={exercises}
              val={volumeArray[i]}
            />
          )
        })}
        <div>
          <a
            onClick={() =>
              setCount((volumeArray) => [...volumeArray, volumeArray.length])
            }
          >
            New block
          </a>
        </div>
        <button type='submit' className=''>
          Submit
        </button>
      </Form>
      <NewExerciseForm data={[actionData, ]}/>
    </div>
  )
}
