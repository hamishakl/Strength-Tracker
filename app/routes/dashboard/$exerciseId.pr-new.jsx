import { Link, redirect, useActionData, json, Form, useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";

function validateWeight(weight) {
  if (typeof weight !== "number") {
    return "weight should be atleast 2 characters long";
  }
}

function validateReps(reps) {
  if (typeof reps !== "number") {
    return "reps should be atleast 2 characters long";
  }
}

function badRequest(data) {
  return json(data, { status: 400 });
}

export const loader = async ({params}) => {
  const exercise = await db.exercise.findUnique({
    where: {
      id: params.exerciseId
    }
  })
  return exercise
}

export const action = async ({ request, params }) => {
  const form = await request.formData();
  const weightStr = form.get("weight");
  const repsStr = form.get("reps");
  const weight = parseInt(weightStr);
  const reps = parseInt(repsStr);
  const exerciseId = params.exerciseId;

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
    data: { ...fields, userId: user.id, exerciseId: exerciseId },
  });

  return redirect(`/dashboard/${exerciseId}`);
};

function NewPr() {
  const actionData = useActionData();
  const exercise = useLoaderData()

  return (
    <>
      <div className="page-header">
        <h1>New PR for {exercise.title}</h1>
        <Link to="/dashboard" className="">
          Back
        </Link>
      </div>
      <div className="">
        <Form method="POST">
          <div className="">
            <label htmlFor="weight">weight</label>
            <input type="number" name="weight" id="weight" />
            <div className="">
              <p>
                {actionData?.fieldErrors?.weight &&
                  actionData?.fieldErrors?.weight}
              </p>
            </div>
          </div>
          <div className="">
            <label htmlFor="reps">Exercise reps</label>
            <input type="number" name="reps" id="reps" />
            <div className="">
              <p>
                {actionData?.fieldErrors?.reps && actionData?.fieldErrors?.reps}
              </p>
            </div>
          </div>
          <button type="submit" className="">
            Add PR
          </button>
        </Form>
      </div>
    </>
  );
}

export default NewPr;
