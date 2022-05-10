import { Link, redirect, useLoaderData } from 'remix'
import { db } from '~/utils/db.server'
import { getUser } from '~/utils/session.server'
import PrTable from '../../components/PrTable'
import Chart from '../../components/Chart'
import Goals from '../../components/Goals'
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
      createdAt: 'desc',
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
    if (data != undefined) {
      
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
    
    return redirect(`/dashboard/${params.exerciseId}`)
  
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
    <>
      <div className='heading-wrapper'>
        {count === 1 && (<div>
          <form method='POST' className='rename-form'>
            <input className='input' name='_rename' type="text" placeholder={exercise.title}/>
            <button type='submit' className="menu-item" >Save</button>
          </form>
        </div>)}
        {count === 0 && (<div>
          <h1 className='exercise-heading' onClick={() => setPage(count = 1)}>{exercise.title}</h1>
          <a className="menu-item" onClick={() => setPage(count = 1)}>Rename</a>
        </div>)}

        {pr.length > 0 ? (
          <>
            <h4>Current estimated PR: {currentEstimatedPr}kg</h4>
            <h4>Best estimated PR recorded: {oneRepMax}kg</h4>
          </>
        ) : null}
        <Link to='/dashboard' className=''>
          Back
        </Link>
      </div>
      {pr.length > 0 ? (
        <div>
          <Goals exercise={exercise} prs={pr} />
          <PrTable prs={pr} />
          <Link to='./pr-new'>New PR</Link>
          <Chart pr={pr} />
        </div>
      ) : (
        <h1>no prs yet :(</h1>
      )}
      <div className='page-footer'>
        {user.id === exercise.userId && (
          <form method='POST'>
            <input type='hidden' name='_method' value='delete' />
            <button className=''>Delete exercise</button>
          </form>
        )}
      </div>
    </>
  )
}

export default exercise
