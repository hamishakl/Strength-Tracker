import { redirect } from '@remix-run/node'
import { Form, useActionData, useLoaderData } from '@remix-run/react'
import { getUser } from '~/utils/session.server'
import { db } from '~/utils/db.server'
import Navbar from '~/components/ui/PagesNavbar'

function validateweight(weight) {
  if (typeof weight !== 'number') {
    return 'weight should be a number'
  }
}

function validatereps(reps) {
  if (typeof reps !== 'number') {
    return 'reps should be a number'
  }
}

function badRequest(data) {
  return json(data, { status: 400 })
}

export const loader = async ({ request }) => {
  const user = await getUser(request)
  const exercises = await db.exercise.findMany({
    where: { userId: user.id },
  })

  return [exercises, user]
}

function oneRmCalc(weight, reps) {
  if (reps === 1) {
    return weight
  } else return Math.floor(weight * reps * 0.0333 + weight, 2.5)
}

export function goalCalc(weight, reps, goalweight, goalreps) {
  const preplinsTable = {
    100.0: 1,
    95.5: 2,
    92.2: 3,
    89.2: 4,
    86.3: 5,
    83.7: 6,
    81.1: 7,
    78.6: 8,
    76.2: 9,
    73.9: 10,
    70.7: 11,
    68.0: 12,
  }
  const onerm = oneRmCalc(weight, reps)
  const entries = Object.entries(preplinsTable)
  let percentageStr
  for (let i = 0; i < entries.length; i++) {
    if (goalreps < entries[i][1]) {
      percentageStr = entries[i][0]
    }
  }
  let percentage = parseInt(percentageStr) / 100
  let current = onerm * percentage
  let goal = oneRmCalc(goalweight, goalreps) * percentage
  let progress = (current / goal) * 100
  let remainingPercent = 100 - progress
  let remainingKg = goal - current
  if (current >= goal) {
    return [true, progress]
  } else {
    return [false, progress, remainingPercent, remainingKg]
  }
}

export const action = async ({ request, params }) => {
  const form = await request.formData()
  const user = await getUser(request)
  const id = form.get('exercise')
  const weightStr = form.get('weight')
  const repsStr = form.get('reps')
  const weight = parseInt(weightStr)
  const reps = parseInt(repsStr)
  const dateStr = form.get('date')
  const date = new Date(dateStr).toISOString()
  const goals = await db.goals.findMany({
    where: { userId: user.id, exerciseId: id },
  })
  const goalweight = goals[0].weight
  const goalreps = goals[0].reps
  const goalId = goals[0].id

  const fields = { weight, reps }

  const fieldErrors = {
    weight: validateweight(weight),
    reps: validatereps(reps),
  }

  if (Object.values(fieldErrors).some(Boolean)) {
    console.log(fieldErrors)
    return badRequest({ fieldErrors, fields })
  }

  const results = goalCalc(weight, reps, goalweight, goalreps)

  if (results[0] === true) {
    await db.goals.update({
      where: { id : goalId },
      data: {
       achieved: true,
       achievementDate: date
      }
    });
  }

  const pr = await db.pr.create({
    data: { ...fields, userId: user.id, exerciseId: id, date: date },
  })

  return redirect(`../dashboard/exercises/${id}`)
}


export const findDate = (user) => {

  let userDate = user.createdAt
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

      const data = [userJoinDate, date]
      return data
}

export default function newPr() {
  const data = useLoaderData()
  const exercises = data[0]
  const user = data[1]

  const actionData = useActionData()


const dateData = findDate(user)
const userJoinDate = dateData[0]
const date = dateData[1]

  return (
    <div className="">
      <Navbar data={['New PR', 'prs', 'Back']} />
      <div className="">
        <Form method="POST" className='mt-4'>
          <div className="relative z-0 w-full mb-6 group">
            <select
              id="exercise"
              name="exercise"
              // defaultValue={'Pick an exercise'}
              placeholder={'Pick an exercise'}
              className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            >
              <option disabled selected>
                Pick an exercise
              </option>
              {exercises.map((exercise) => (
              <option key={exercise.id} value={exercise.id}>
                {exercise.title}
              </option>
            ))}
            </select>
          </div>
          <div className="relative z-0 w-full mb-6 group">
            <input
              type="number"
              name="weight"
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
              name="reps"
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
          <div className="relative z-0 w-full mb-6 mt-2 group">
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
              className="peer-focus:font-medium absolute mb-2 text-gray-500 text-lg dark:text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 text-left"
            >
              Date
            </label>
          </div>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Submit
          </button>
        </Form>
      </div>
    </div>
  )
}
