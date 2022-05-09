import { Form, useLoaderData, useActionData, redirect } from "remix";
import { getUser } from "~/utils/session.server";
import { db } from "~/utils/db.server";
import { OneRmEstimate } from "./$exerciseId";

function validateWeight(weight) {
  if (typeof weight !== "number") {
    return "weight should be a number";
  }
}

function validateReps(reps) {
  if (typeof reps !== "number") {
    return "reps should be a number";
  }
}

function badRequest(data) {
  return json(data, { status: 400 });
}

export const loader = async ({ request }) => {
  const user = await getUser(request);
  const exercises = await db.exercise.findMany({
    where: { userId: user.id },
  });
  return exercises;
};

export const action = async ({ request, params }) => {
  const form = await request.formData();
  const weightStr = form.get("weight");
  const repsStr = form.get("reps");
  const id = form.get("exercise");
  const weight = parseInt(weightStr);
  const reps = parseInt(repsStr);
  console.log(id)
  const user = await getUser(request);

  const fields = { weight, reps };

  const fieldErrors = {
    weight: validateWeight(weight),
    reps: validateReps(reps),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    console.log(fieldErrors);
    return badRequest({ fieldErrors, fields });
  }

  const pr = await db.pr.create({
    data: { ...fields, userId: user.id, exerciseId: id },
  });

  return redirect(`/dashboard`);
};

export default function newPr() {
  const exercises = useLoaderData();
  const actionData = useActionData();

  return (
    <div className="">
      <h1>New PR</h1>
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
        <div className="">
          <label htmlFor="reps" className="">
            Reps
          </label>
          <input
            type="number"
            className=""
            name="reps"
            id="reps"
            required
          />
          <div className="">
            <p>
              {actionData?.fieldErrors?.reps && actionData?.fieldErrors?.reps}
            </p>
          </div>
        </div>
        
        <div className="">
          <h5>Projected 1rm: </h5>
          <p></p>
        </div>
        <button type="submit" className="">
          Submit
        </button>
      </Form>
    </div>
  );
}
