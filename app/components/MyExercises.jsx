import { Link } from 'remix'
import Goals from './Goals'

export default function MyExercise({ exercises, prs }) {
  return (
    <div className='div4'>
      {exercises.map((exercise) => (
        <div key={exercise.id} className='exerciseList-card'>
          <div className='' key={exercise.id}>
            <Link to={exercise.id}>
              <h5 className=''>{exercise.title}</h5>
            </Link>
            <h6 className=''></h6>
            <ul className=''>
              <li className=''>
                <Link to={`./${exercise.id}/pr-new`}>New PR</Link>
              </li>
              <li className=''>
                <Link to={`${exercise.id}/new-goal`}>New goal</Link>
              </li>
              <li className=''>
                <Link to={`${exercise.id}/volume`}>New volume</Link>
              </li>
            </ul>
            {prs.length === 0 ? (
              <br></br>
            ) : (
              prs.map((pr) => {
                ;<div key={pr.id}>
                  <Goals exercise={exercise} prs={pr} />
                </div>
              })
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
