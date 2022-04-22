import { Form, useLoaderData, useActionData, redirect } from 'remix'
import { getUser } from '~/utils/session.server'
import { db } from '~/utils/db.server'

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
  const data = useLoaderData()
  const exercises = data.exercises
  let userDate = data.user.createdAt
  let split = userDate.split('')
  let arr = []
  for (let i = 0; i < 10; i++) {
    arr.push(split[i])
  }
  const userJoinDate = arr.join('')
  console.log(userJoinDate)
  const actionData = useActionData()
  const current = new Date()
  const date = `${current.getFullYear()}-0${
    current.getMonth() + 1
  }-${current.getDate()}`

  return (
    <div className='container'>
      <h1>New goal</h1>
      <Form method='POST'>
        <div className='mb-3'>
          <label htmlFor='exercise' className='form-label'>
            Exercise
          </label>
          <select
            className='form-select'
            aria-label='Default select example'
            required
            id='exercise'
            name='exercise'
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
        <div className='mb-3'>
          <label htmlFor='weight' className='form-label'>
            Weight
          </label>
          <input
            type='number'
            className='form-control'
            id='weight'
            name='weight'
            required
          />
          <div className='error'>
            <p>
              {actionData?.fieldErrors?.weight &&
                actionData?.fieldErrors?.weight}
            </p>
          </div>
        </div>
        <button type='submit' className='btn btn-primary'>
          Submit
        </button>
      </Form>
      <input
        type='date'
        id='start'
        name='trip-start'
        value={date}
        min={userJoinDate}
        max={date}
      ></input>
    </div>
  )
}
