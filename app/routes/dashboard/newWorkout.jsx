import { Form, useLoaderData, useActionData, redirect } from "remix";
import { getUser } from "~/utils/session.server";
import { db } from "~/utils/db.server";

export const loader = async ({ request }) => {
  const user = await getUser(request);
  const exercises = await db.exercise.findMany({
    where: { userId: user.id },
  });
  return exercises;
};

export const action = async ({ request }) => {
  const form = await request.formData();
  const weightStr = form.get("weight");
  const id = form.get("exercise");
  const weight = parseInt(weightStr);

  const fields = { weight };

  // const fieldErrors = {
  //   weight: validateWeight(weight),
  // };

  // if (Object.values(fieldErrors).some(Boolean)) {
  //   console.log(fieldErrors);
  //   return badRequest({ fieldErrors, fields });
  // }

  const goal = await db.exercise.update({
    where: {
      id: id,
    },
    data: {
      goal: weight,
    },
  });

  return redirect(`/dashboard`);
};

export default function newWorkout() {
  const exercises = useLoaderData();
  const actionData = useActionData();

  return (
    <div className="container">
      <h1>New goal</h1>
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
            name="exercise"
          >
            <option selected disabled>
              Pick an exercise
            </option>
            {exercises.map((exercise) => (
              <option key={exercise.id} value={exercise.id}>
                {exercise.title}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="weight" className="form-label">
            Weight
          </label>
          <input
            type="number"
            className="form-control"
            id="weight"
            name="weight"
            required
          />
          <div className="error">
            <p>
              {actionData?.fieldErrors?.weight &&
                actionData?.fieldErrors?.weight}
            </p>
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </Form>
    </div>
  );
}
