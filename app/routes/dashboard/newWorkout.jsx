import { Form, useLoaderData, useActionData, redirect } from 'remix'
import { getUser } from '~/utils/session.server'
import { db } from '~/utils/db.server'
import React, { useState } from 'react'
import NewWorkoutForm from '~/components/NewWorkoutForm'

export const loader = async ({ request }) => {
  const user = await getUser(request)
  const exercises = await db.exercise.findMany({
    where: { userId: user.id },
  })
  const data = { user, exercises }
  return data
}

export const action = async ({ request }) => {
  const form = await request.formData()
  const weightStr = form.get('weight')
  const id = form.get('exercise')
  const weight = parseInt(weightStr)

  const fields = { weight }

  const goal = await db.exercise.update({
    where: {
      id: id,
    },
    data: {
      goal: weight,
    },
  })

  return redirect(`/dashboard`)
}

export default function newWorkout() {
  const [volumeArray, setCount] = useState([])
  const data = useLoaderData()
  const exercises = data.exercises
  let userDate = data.user.createdAt
  let split = userDate.split('')
  let arr = []
  for (let i = 0; i < 10; i++) {
    arr.push(split[i])
  }
  const userJoinDate = arr.join('')
  const actionData = useActionData()
  const current = new Date()
  const day = current.getDate()
  let date
  day < 10
    ? (date = `${current.getFullYear()}-0${
        current.getMonth() + 1
      }-0${current.getDate()}`)
    : `${current.getFullYear()}-0${
        current.getMonth() + 1
      }-0${current.getDate()}`

  return (
    <div className='container'>
      <h1>New workout</h1>
      <Form method='POST'>
        <div>
          <h5>Date of workout:</h5>
          <input
            type='date'
            id='start'
            name='trip-start'
            defaultValue={date}
            min={userJoinDate}
            max={date}
          ></input>
        </div>
        <div>
          <h4>Only enter your working sets</h4>
        </div>
        <div>
          <h5>Exercise #1</h5>
          <select
            aria-label='Default select example'
            required
            id='exercise'
            name='exercise'
          >
            <option defaultValue={'none'}>Pick an exercise</option>
            {exercises.map((exercise) => (
              <>
                <option key={exercise.id} defaultValue={exercise.id}>
                  {exercise.title}
                </option>
              </>
            ))}
          </select>
          <label htmlFor='weight' required>
            Weight
          </label>
          <input type='number' name='weight' />
          <label htmlFor='weight' required>
            Reps
          </label>
          <input type='number' name='reps' />
          <label htmlFor='sets' required>
            Sets
          </label>
          <input type='number' name='sets' />
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
            Click me
          </a>
        </div>
        <button type='submit' className='btn btn-primary'>
          Submit
        </button>
      </Form>
    </div>
  )
}
