import { useLoaderData, Link } from "remix";

export const loader = () => {
  const data = {
    exercises: [
      { id: 1, title: "Squat", body: "This is a text exercise" },
      { id: 2, title: "Bench", body: "This is a text exercise" },
      { id: 3, title: "Deadlift", body: "This is a text exercise" },
    ],
  };
  return data;
};

function ExerciseItems() {
  const { exercises } = useLoaderData();
  return (
    <div>
        <div className="page-header">

      <h1>Exercises</h1>
      <Link to='/exercises/new' className="btn">New exercise</Link>
        </div>
      <ul className="exercise-list">
        {exercises.map((exercise) => (
          <li key={exercise.id}>
            <Link to={exercise.id}>
              <h3>{exercise.title}</h3>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExerciseItems;
