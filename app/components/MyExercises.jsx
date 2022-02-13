import { Link } from "remix";
import Goals from "./Goals";

export default function MyExercise({ data }) {
  const exercises = data.exercises["exercises"];
  const prs = data.prs["prs"];

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
              <ul className="nav">
                <li className="nav-item">
                  <Link to={`./${exercise.id}/pr-new`}>New PR</Link>
                </li>
                <li className="nav-item">
                  <Link to={`${exercise.id}/new-goal`}>New goal</Link>
                </li>
              </ul>
              <Goals exercise={exercise} prs={prs} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
