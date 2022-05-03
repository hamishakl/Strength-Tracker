import { Form, useLoaderData, useActionData, redirect } from 'remix'
import { getUser } from '~/utils/session.server'
import { db } from '~/utils/db.server'
import React, { useState } from 'react'
import NewWorkoutForm from '~/components/NewWorkoutForm'
import exercise from './$exerciseId'

export const loader = async ({ request }) => {
  const user = await getUser(request)
  const exercises = await db.exercise.findMany({
    where: { userId: user.id },
  })
  const data = { user, exercises }
  return data
}

//create volume for each set 
//create workout 
//calculate any prs from volume and create that 

//create a neww exercise in the page 

const dataArray = (volumeBlock, exerciseList) => {
  let dataArr = []
  for (let i = 0; i < (exerciseList.length+1); i++) {
    volumeBlock[i] == [] ? (console.log('empty array')) : (
    dataArr.push(volumeBlock[i])
    )
  }
  return dataArr
}

export const action = async ({ request }) => {
  const user = await getUser(request);
  let volumeBlock = []
  let exerciseList = []
  const form = await request.formData()
  const list = form._fields
  const keys = Object.keys(list);
  keys.forEach((key, index) => {
    if (key.includes('exercise') === true) {
      exerciseList.push(`${key}: ${list[key]}`)
    }
  });

  for (let i = 0; i < (exerciseList.length+1); i++) {
    volumeBlock[i] = []
    keys.forEach((key, index)=> {
      if (key.includes(`exercise-${i}`)) {
        volumeBlock[i].exercise = list[key]
      } if (key.includes(`weight-${i}`)) {
        volumeBlock[i].weight = list[key]
      } if (key.includes(`reps-${i}`)) {
        volumeBlock[i].reps = list[key]
      } if (key.includes(`sets-${i}`)) {
        volumeBlock[i].sets = list[key]
      }
    });
    
  }
  
  //workout form 
  const date = form.get('date')
  
  //volume form 

  let dataBlock = dataArray(volumeBlock, exerciseList)
  let removeEmptyArray = dataBlock.shift()
  
  const workout = await db.workout.create({
    data: {
      date: date,
      userId: user.id,
      volume: {
        createMany: {
          data: dataBlock,
        },
      },
    },
    include: {
      volume: true,
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
          <h5>Exercise #1</h5>
          <select
            aria-label='Default select example'
            required
            id='exercise'
            name='exercise-1'
          >
            <option defaultValue={'none'}>Pick an exercise</option>
            {exercises.map((exercise) => (
              <>
                <option key={exercise.id} value={exercise.id}>
                  {exercise.title}
                </option>
              </>
            ))}
          </select>
          <label htmlFor="weight" >Weight</label>
          <input type="number" required name="weight-1" />
          <label htmlFor="weight" >Reps</label>
          <input type="number" required name="reps-1" />
          <label htmlFor="sets" >Sets</label>
          <input type="number" required name="sets-1" />

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
