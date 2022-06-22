import { redirect } from '@remix-run/node'
import { Form, useActionData, useLoaderData } from '@remix-run/react'
import { getUser } from '~/utils/session.server'
import { db } from '~/utils/db.server'
import Navbar from '~/components/ui/PagesNavbar'

function validateWeight(weight) {
  if (typeof weight !== 'number') {
    return 'weight should be a number'
  }
}

function validateReps(reps) {
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

export function goalCalc(weight, reps, goalWeight, goalReps) {
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
    if (goalReps < entries[i][1]) {
      percentageStr = entries[i][0]
    }
  }
  let percentage = parseInt(percentageStr) / 100
  let current = onerm * percentage
  let goal = oneRmCalc(goalWeight, goalReps) * percentage
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
  const goalWeight = goals[0].weight
  const goalReps = goals[0].reps
  const goalId = goals[0].id

  const fields = { weight, reps }

  const fieldErrors = {
    weight: validateWeight(weight),
    reps: validateReps(reps),
  }

  if (Object.values(fieldErrors).some(Boolean)) {
    console.log(fieldErrors)
    return badRequest({ fieldErrors, fields })
  }

  const results = goalCalc(weight, reps, goalWeight, goalReps)

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
      <Form method="POST">
        <div className="">
          <label htmlFor="exercise" className="">
            Exercise
          </label>
          <select
            className=""
            aria-label="Default select example"
            required
            id="exercise"
            name="exercise"
          >
            <option selected disabled>
              Pick an exercise
            </option>
            {exercises.map((exercise) => (
              <option key={exercise.id} value={exercise.id}>
                {exercise.title}
              </option>
            ))}
          </select>
        </div>
        <div className="">
          <label htmlFor="weight" className="">
            Weight
          </label>
          <input
            type="number"
            className=""
            id="weight"
            name="weight"
            required
          />
          <div className="">
            <p>
              {actionData?.fieldErrors?.weight &&
                actionData?.fieldErrors?.weight}
            </p>
          </div>
        </div>
        <div className="">
          <label htmlFor="reps" className="">
            Reps
          </label>
          <input type="number" className="" name="reps" id="reps" required />
          <div className="">
            <p>
              {actionData?.fieldErrors?.reps && actionData?.fieldErrors?.reps}
            </p>
          </div>
        </div>
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

        <div className="">
          <h5>Projected 1rm: </h5>
          <p></p>
        </div>
        <button type="submit" className="">
          Submit
        </button>
      </Form>
    </div>
  )
}
