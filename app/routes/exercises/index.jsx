import { Link, useLoaderData } from 'remix'
import { db } from '~/utils/db.server'

export const loader = async () => {
  const data = {
    exercises: await db.exercise.findMany({
      take: 20,
      select: { id: true, title: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    }),
  }

  return data
}

function ExerciseItems() {
  const { exercises } = useLoaderData()

  return (
    <>
      <div className='page-header'>
        <h1>exercises</h1>
        <Link to='/exercises/new' className='btn'>
          New exercise
        </Link>
      </div>
      <ul className='exercises-list'>
        {exercises.map((exercise) => (
          <li key={exercise.id}>
            <Link to={exercise.id}>
              <h3>{exercise.title}</h3>
              {new Date(exercise.createdAt).toLocaleString()}
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export default ExerciseItems
