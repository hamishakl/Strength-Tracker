import { Form, useLoaderData } from "remix";
import { getUser } from "~/utils/session.server";
import { db } from "~/utils/db.server";
import exercise, { OneRmEstimate } from "./$exerciseId";
import { useEffect, useState } from "react";

export const loader = async ({ request }) => {
  const user = await getUser(request);
  const exercises = await db.exercise.findMany({
    where: { userId: user.id },
  });
  return exercises;
};
export const live1rmUpdate = () => {
    const oneRm = useState(0) 
    
}


export default function newPr() {
  const exercises = useLoaderData();

  const [title, setTitle] = useState('')


  return (
    <div className="container">
      <h1>New PR</h1>
      <Form method="POST">
        <div className="mb-3">
        <label htmlFor="exercise" className="form-label">
            Exercise
          </label>
          <select
            className="form-select"
            aria-label="Default select example"
            required
            id="exercise"
          >
            <option selected disabled>
              Pick an exercise
            </option>
            {exercises.map((exercise) => (
              <option key={exercise.id} value={exercise.title}>
                {exercise.title}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="weight" className="form-label">
            Weight
          </label>
          <input type="number" className="form-control" id="weight" />
        </div>
        <div className="mb-3">
          <label htmlFor="reps" className="form-label">
            Reps
          </label>
          <input type="number" className="form-control" id="reps" onKeyPress={event => setTitle(event.target.value)}/>
        </div>
        <div className="mb-3 form-check">
          <h5>Projected 1rm: </h5>
          <p>{title}</p>
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </Form>
      
    </div>
  );
}
