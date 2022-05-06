import { Link } from 'remix';
import Goals from './Goals';

export default function MyExercise({ data }) {
  const exercises = data.exercises['exercises'];
  const prs = data.prs['prs'];
  return (
    <>
        {exercises.map((exercise) => (
          <div
          key={exercise.id}
          className=''
          style={{ flex: '0 0 33.333333%' }}
          >
            <div className='flex flex-col' key={exercise.id}>
              <Link to={exercise.id}>
                <h5 className='font-bold'>{exercise.title}</h5>
              </Link>
              <h6 className='card-subtitle mb-2 text-muted'></h6>
              <ul className='nav'>
                <li className='nav-item'>
                  <Link to={`./${exercise.id}/pr-new`}>New PR</Link>
                </li>
                <li className='nav-item'>
                  <Link to={`${exercise.id}/new-goal`}>New goal</Link>
                </li>
                <li className='nav-item'>
                  <Link to={`${exercise.id}/volume`}>New volume</Link>
                </li>
              </ul>
              {prs.length === 0 ? (
                <br></br>
                ) : (
                  prs.map((pr) => {
                    <div key={pr.id}>
                    <Goals exercise={exercise} prs={pr} />
                  </div>;
                })
                )}
            </div>
          </div>
        ))}
        </>
  );
}
