import { Form, useLoaderData, useActionData, redirect } from 'remix'
import { getUser } from '~/utils/session.server'
import { db } from '~/utils/db.server'

export const loader = async ({ request }) => {
  const user = await getUser(request)
  const exercises = await db.exercise.findMany({
    where: { userId: user.id },
  })
  return { exercises, user }
}

export const action = async ({ request }) => {
  const form = await request.formData()
  const weightStr = form.get('weight')
  const repsStr = form.get('reps')
  const setsStr = form.get('sets')
  const id = form.get('exercise')
  const weight = parseInt(weightStr)
  const user = await getUser(request)
  let reps = parseInt(repsStr)
  let sets = parseInt(setsStr)
  const achievementGoalDateStr = form.get('date')
  const achievementGoalDate = new Date(achievementGoalDateStr)

  if (repsStr === null) {
    reps = 1
  }
  if (setsStr === null) {
    sets = 1
  }

  const fields = { weight, reps, sets, achievementGoalDate }

  const goal = await db.goals.create({
    data: { ...fields, userId: user.id, exerciseId: id },
  })

  return redirect(`/dashboard`)
}

export default function newPr() {
  const data = useLoaderData()
  const actionData = useActionData()

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
    <>
      <div className=''>
        <h1>New goal</h1>
      </div>
      <div className=''>
        <Form method='POST'>
          <div className=''>
            <label htmlFor='exercise' className=''>
              Exercise
            </label>
            <select
              className=''
              aria-label='Default select example'
              required
              id='exercise'
              name='exercise'
            >
              <option selected disabled>
                Pick an exercise
              </option>
              {data.exercises.map((exercise) => (
                <option key={exercise.id} value={exercise.id}>
                  {exercise.title}
                </option>
              ))}
            </select>
          </div>
          <div className=''>
            <label htmlFor='weight' className=''>
              Weight
            </label>
            <input
              type='number'
              className=''
              id='weight'
              name='weight'
              required
            />
            <div className=''>
              <p>
                {actionData?.fieldErrors?.weight &&
                  actionData?.fieldErrors?.weight}
              </p>
            </div>
          </div>
          <div className=''>
            <label htmlFor='weight' className=''>
              Reps
            </label>
            <input type='number' className='' id='reps' name='reps' />
          </div>
          <div className=''>
            <label htmlFor='weight' className=''>
              Sets
            </label>
            <input type='number' className='' id='sets' name='sets' />
          </div>
          <div>
            <h5>Date to accomplish your new goal:</h5>
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
          <button type='submit' className=''>
            Submit
          </button>
        </Form>
      </div>
    </>
  )
}
