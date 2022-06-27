import { redirect } from '@remix-run/node'
import { Form, useActionData, useLoaderData } from '@remix-run/react'
import { getUser } from '~/utils/session.server'
import { db } from '~/utils/db.server'
import React, { useState } from 'react'
import NewWorkoutForm from '~/components/NewWorkoutForm'
import Navbar from '../../../components/ui/PagesNavbar'
import NewExerciseForm from '../../../components/NewExerciseForm'
import { goalCalc } from '../prs/new'
import { OneRmEstimate } from '../prs'

export const loader = async ({ request }) => {
  const user = await getUser(request)
  const exercises = await db.exercise.findMany({
    where: { userId: user.id },
  })
  const data = { user, exercises }
  return data
}

function validateTitle(title) {
  if (typeof title !== 'string' || title.length < 2) {
    return 'Title should be atleast 2 characters long'
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

  let goals = await db.goals.findMany({
    where: { userId: user.id, achieved: false },
  })

  let list = [...form]
  console.log(list)

  if (form.get('_method') === 'workout') {
    for (let i = 0; i < list.length; i++) {
      if (
        list[i][0].includes('exercise') &&
        !list[i][1].includes('Pick an exercise')
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

    let date = new Date(form.get('date'))

    let volume = {
      volume: {
        create: [],
      },
    }

    for (let i = 0; i < exerciseList.length; i++) {
      volume.volume.create.push({
        exerciseId: '',
        weight: '',
        reps: '',
        sets: '',
        userId: '',
      })
      volume.volume.create[i].exerciseId = String(volumeArray[i].exerciseId)
      volume.volume.create[i].weight = parseInt(volumeArray[i].weight)
      volume.volume.create[i].reps = parseInt(volumeArray[i].reps)
      volume.volume.create[i].sets = parseInt(volumeArray[i].sets)
      volume.volume.create[i].userId = String(user.id)
    }

    const prArr = prArray(volumeArray, exerciseList, user)

    for (let i = 0; i < exerciseList.length; i++) {
      console.log('below')
      console.log(prArr[i].exerciseId)
      let goalWeight
      let currentWeight
      let goalId
      goals.forEach(({ exerciseId, weight, reps }, x) => {
        if (exerciseId === prArr[i].exerciseId) {
          console.log(goals[x])
          goalWeight = OneRmEstimate(goals[x].weight, goals[x].reps)
          currentWeight = OneRmEstimate(prArr[i].weight, prArr[i].reps)
          console.log([goalWeight, currentWeight])
          goalId = goals[x].id
        }
      })
      if (goalWeight < currentWeight) {
        let goal = await db.goals.update({
          where: {
            id: goalId,
          },
          data: {
            achieved: true,
            achievementDate: date.toISOString(),
          },
        })
      }
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
  } else if (form.get('_method') === 'exercise') {
    const title = form.get('title')

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
  return redirect(`/dashboard`)
}

export default function newWorkout() {
  const actionData = useActionData()

  const [volumeArray, setCount] = useState([])
  let [count, setPage] = useState(0)

  const updatePageState = (state) => {
    setPage(state)
  }

  const data = useLoaderData()
  const exercises = data.exercises
  let userDate = data.user.createdAt
  let split = userDate.split('')
  let arr = []
  for (let i = 0; i < 10; i++) {
    arr.push(split[i])
  }
  const userJoinDate = arr.join('')
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
    <div className="">
      <Navbar data={['New Workout', 'workouts', 'Back']} />
      <Form method="post">
        <input type="hidden" name="_method" value="workout" />
        <div className="relative z-0 w-full mb-6 mt-5 group">
          <input
            type="date"
            name="date"
            id="date"
            className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            defaultValue={date}
            min={userJoinDate}
            max={date}
          />
          <label
            for="date"
            className="peer-focus:font-medium absolute mb-2 font-bold text-gray-500 text-lg dark:text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 text-left"
          >
            Date of workout
          </label>
        </div>
        <div>
          <h4>Working sets</h4>
        </div>
        <div className="relative z-0 w-full mb-6 group">
          <select
            id="exercise"
            name="exercise-1"
            // defaultValue={'Pick an exercise'}
            placeholder={'Pick an exercise'}
            className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          >
            <option disabled selected>
              Exercise #1
            </option>
            {exercises.map((exercise) => (
              <option key={exercise.id} value={exercise.id}>
                {exercise.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <div className="relative z-0 w-full mb-6 group">
            <input
              type="number"
              name="weight-1"
              id="weight"
              className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              for="weight"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Weight
            </label>
          </div>
          <div className="relative z-0 w-full mb-10 group">
            <input
              type="number"
              name="reps-1"
              id="reps"
              className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              for="reps"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Reps
            </label>
          </div>
          <div className="relative z-0 w-full mb-10 group">
            <input
              type="number"
              name="sets-1"
              id="sets"
              className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              for="sets"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Sets
            </label>
          </div>
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
        <div className="fixed bottom-0 flex justify-center flex-col items-center w-full left-0 bg-dark min-h-auto">
          <div className="flex w-full justify-center items-center rounded-md shadow-sm">
            <a
              onClick={() =>
                setCount((volumeArray) => [...volumeArray, volumeArray.length])
              }
              aria-current="page"
              class="py-2 px-4 text-sm font-medium text-blue-700 bg-white rounded-l-lg border border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
            >
              New block
            </a>
            <button
              type="submit"
              class="py-2 px-4 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-blue-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-blue-700 dark:focus:ring-blue-500 dark:focus:text-white"
            >
              Save
            </button>
            <a
              onClick={() => setPage((count = 1))}
              href="#"
              class="py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-r-md border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
            >
              New exercise
            </a>
          </div>
          {count === 1 ? (
            <div className="page-content mt-3 pb-4">
              <form method="POST">
                <input type="hidden" name="_method" value="exercise" />
                <div className="relative z-0 w-full mb-10 group">
                  <input
                    type="text"
                    name={`title`}
                    id="title"
                    className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                  />
                  <label
                    for="title"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Exercise name
                  </label>
                </div>
                <div className="">
                  <p>
                    {actionData?.fieldErrors?.title &&
                      actionData?.fieldErrors?.title}
                  </p>
                </div>
                <div className="flex w-full justify-center items-center rounded-md shadow-sm">
                  <button
                    type="submit"
                    // onClick={() => props.onClick()}
                    aria-current="page"
                    class="py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-l-lg border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-blue-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-blue-700 dark:focus:ring-blue-500 dark:focus:text-white"
                    >
                    Save
                  </button>
                  <a
                    onClick={() => setPage((count = 0))}
                    href="#"
                    class="py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-r-md border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
                  >
                    Cancel
                  </a>
                </div>
              </form>
            </div>
          ) : null}
        </div>
      </Form>
    </div>
  )
}
