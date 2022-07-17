import { redirect } from '@remix-run/node'
import { Link, useLoaderData, Form } from '@remix-run/react'
import { db } from '~/utils/db.server'
import { getUser } from '~/utils/session.server'
import PrTable from '../../../components/PrTable'
import Chart from '../../../components/Chart'
import { useState } from 'react'

export const loader = async ({ request, params }) => {
  const user = await getUser(request)
  const exercise = await db.exercise.findUnique({
    where: { id: params.exerciseId },
  })

  if (!exercise) throw new Error('exercise not found')
  const pr = await db.pr.findMany({
    where: {
      userId: {
        equals: `${user.id}`,
      },
      exerciseId: {
        equals: `${exercise.id}`,
      },
    },
    orderBy: {
      date: 'asc',
    },
  })
  const oneRepMax = weightLoop(pr)
  const data = { exercise, user, pr, oneRepMax }
  return data
}

const weightLoop = (pr) => {
  let arr = []
  for (let i = 0; i < pr.length; i++) {
    arr.push(OneRmEstimate(pr[i].weight, pr[i].reps))
  }
  return Math.max(...arr)
}

export const action = async ({ request, params }) => {
  const form = await request.formData()
  if (form.get('_method') === 'delete') {
    const user = await getUser(request)

    const exercise = await db.exercise.findUnique({
      where: { id: params.exerciseId },
    })

    if (!exercise) throw new Error('exercise not found')

    if (user && exercise.userId === user.id) {
      await db.exercise.delete({ where: { id: params.exerciseId } })
    }

    return redirect('/dashboard')
  }
  let data = form.get('_rename')
  if (data != undefined || data != '' || data.length != 1) {
    const exercise = await db.exercise.findUnique({
      where: { id: params.exerciseId },
    })

    await db.exercise.update({
      where: { id: params.exerciseId },
      data: {
        title: data,
      },
    })
  }

  return redirect(`/dashboard/exercises/${params.exerciseId}`)
}

export const OneRmEstimate = (weight, reps) => {
  const unRounded1RM = weight * reps * 0.0333 + weight
  return reps === 1 ? weight : Math.round(unRounded1RM / 2.5, 1) * 2.5
}

function exercise() {
  const { exercise, user, pr, oneRepMax } = useLoaderData()

  const latestPr = pr[0]
  let currentEstimatedPr = null

  if (latestPr === undefined || pr.length === 0) {
    console.log('no pr')
  } else {
    currentEstimatedPr = OneRmEstimate(latestPr.weight, latestPr.reps)
  }

  let [count, setPage] = useState(0)

  return (
    <div className="">
      <div className="">
        {count === 1 && (
          <div>
            <Form method="POST" className="">
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                name="_rename"
                type="text"
                placeholder={exercise.title}
              />
              <button type="submit" className="ml-3 mr-3">
                Save
              </button>
              <a className="" onClick={() => setPage((count = 0))}>
                Cancel
              </a>
            </Form>
          </div>
        )}
        {count === 0 && (
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center">
              <h1
                className="text-xl font-bold underline underline-offset-1 mr-3"
                onClick={() => setPage((count = 1))}
              >
                {exercise.title}
              </h1>
              <a
                className="menu-item underline underline-offset-2"
                onClick={() => setPage((count = 1))}
              >
                Rename
              </a>
            </div>
            <Link to="/dashboard" className="font-bold">
              <p className='underline underline-offset-2 '>Back</p>
            </Link>
          </div>
        )}

        {pr.length > 0 ? (
          <div className="mt-3 mb-3">
            <h4>Current estimated PR: {currentEstimatedPr}kg</h4>
            <h4>Best estimated PR recorded: {oneRepMax}kg</h4>
          </div>
        ) : null}
      </div>
      {pr.length > 0 ? (
        <div className="w-full h-5/6">
          <PrTable prs={pr} />
          <Link to="./pr-new">New PR</Link>
          <Chart pr={pr} />
        </div>
      ) : (
        <h1>{'no prs yet :('}</h1>
      )}
      <div className="">
        {user.id === exercise.userId && (
          <Form method="POST">
            <input type="hidden" name="_method" value="delete" />
            <button className="underline underline-offset-2">Delete exercise</button>
          </Form>
        )}
      </div>
    </div>
  )
}

export default exercise
