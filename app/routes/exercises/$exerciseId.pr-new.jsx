import { Link, redirect, useActionData, json } from "remix";
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

  return redirect(`/exercises/${exerciseId}`);
};

function NewPr() {
  const actionData = useActionData();

  return (
    <>
      <div className="page-header">
        <h1>New exercise</h1>
        <Link to="/exercises" className="btn btn-reverse">
          Back
        </Link>
      </div>
      <div className="page-content">
        <form method="POST">
          <div className="form-control">
            <label htmlFor="weight">weight</label>
            <input type="text" name="weight" id="weight" />
            <div className="error">
              <p>
                {actionData?.fieldErrors?.weight &&
                  actionData?.fieldErrors?.weight}
              </p>
            </div>
          </div>
          <div className="form-control">
            <label htmlFor="reps">Exercise reps</label>
            <input type="text" name="reps" id="reps" />
            <div className="error">
              <p>
                {actionData?.fieldErrors?.reps && actionData?.fieldErrors?.reps}
              </p>
            </div>
          </div>
          <button type="submit" className="btn btn-block">
            Add exercise
          </button>
        </form>
      </div>
    </>
  );
}

export default NewPr;
