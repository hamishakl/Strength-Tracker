import { Link } from "remix";
import Goals from './Goals'

export default function MyExercise({ exercises }) {
  return (
    <div className="container">
      <div className="row">
        {exercises.map((exercise) => (
          <div
            key={exercise.id}
            className="card"
            style={{ flex: "0 0 33.333333%" }}
          >
            <div className="card-body" key={exercise.id}>
              <Link to={exercise.id}>
                <h5 className="card-title">{exercise.title}</h5>
              </Link>
              <h6 className="card-subtitle mb-2 text-muted"></h6>
              <p className="card-text">{exercise.body}</p>
              <Link to={`./${exercise.id}/pr-new`} className="btn btn-primary">
                New PR
              </Link>
              <Goals exercise={exercise} />
              <Link to={`${exercise.id}/new-goal`} className="btn btn-primary">
                  New goal
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
