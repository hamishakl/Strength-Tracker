import { Form, useLoaderData, useActionData, redirect } from "remix";
import { getUser } from "~/utils/session.server";
import { db } from "~/utils/db.server";
import { OneRmEstimate } from "./$exerciseId";

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

export default function newPr() {
  const exercises = useLoaderData();
  const actionData = useActionData();

  return (
    <div className="">
      <h1>New goal</h1>
      <Form method="POST">
        <div className="">
          <label htmlFor="exercise" className="">
            Exercise
          </label>
          <select
            className=""
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
        <div className="">
          <label htmlFor="weight" className="">
            Weight
          </label>
          <input
            type="number"
            className=""
            id="weight"
            name="weight"
            required
          />
          <div className="">
            <p>
              {actionData?.fieldErrors?.weight &&
                actionData?.fieldErrors?.weight}
            </p>
          </div>
        </div>
        <button type="submit" className="">
          Submit
        </button>
      </Form>
    </div>
  );
}
