import { Link, redirect, useLoaderData } from 'remix'
import { db } from '~/utils/db.server'
import { getUser } from '~/utils/session.server'

export const loader = async ({ request, params }) => {
  const user = await getUser(request)
  console.log(params.exerciseId)
  const exercise = await db.exercise.findUnique({
    where: { id: params.exerciseId },
  })

  const pr = await db.pr.findMany({
    where: { exerciseId:{
      equals: params.exerciseId
    }}
  })

  if (!exercise) throw new Error('exercise not found')

  const data = { exercise, user, pr }
  return data
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

    return redirect('/exercises')
  }
}

function exercise() {
  const { exercise, user, pr } = useLoaderData()
  console.log(pr)
  return (

    <div>
      <div className='page-header'>
        <h1>{exercise.title}</h1>
        <Link to='/exercises' className='btn btn-reverse'>
          Back
        </Link>
      </div> 

      <div className='page-content'>
      <h1>{pr[0].weight}</h1>
        {exercise.body}
      </div>
      <div className='page-footer'>
        {user.id === exercise.userId && (
          <form method='POST'>
            <input type='hidden' name='_method' value='delete' />
            <button className='btn btn-delete'>Delete</button>
          </form>
        )}
      </div>
    </div>
  )
}

export default exercise