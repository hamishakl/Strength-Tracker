import { redirect } from '@remix-run/node'
import { Form, useActionData, useLoaderData } from '@remix-run/react'
import { getUser } from '~/utils/session.server'
import { db } from '~/utils/db.server'
import Navbar from '../../../components/ui/PagesNavbar'

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
  const id = form.get('exercise')
  const weight = parseInt(weightStr)
  const user = await getUser(request)
  let reps = parseInt(repsStr)
  const achievementGoalDateStr = form.get('date')
  const achievementGoalDate = new Date(achievementGoalDateStr)

  if (repsStr === null) {
    reps = 1
  }

  const fields = { weight, reps, achievementGoalDate }

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
    <div className=''>
      <Navbar data={['New Goal', 'goals', 'Back']} />
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
              {data.exercises.map((exercise) => (
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
