import { db } from "~/utils/db.server";
import { Link, redirect, useLoaderData, Form } from "remix";

export const loader = async ({ params }) => {
  console.log(params);

  const exercise = await db.exercise.findUnique({
    where: {
      id: params.exerciseId,
    },
  });

  //   console.log(exercise);
  return exercise;
};

export const action = async ({ request, params }) => {
  const form = await request.formData();
  const weightStr = form.get("weight");
  const goal = parseInt(weightStr);

  const updateUser = await db.exercise.update({
    where: {
      id: params.exerciseId,
    },
    data: {
      goal: goal,
    },
  });

  return redirect(`/dashboard/${params.exerciseId}`);
};

export default function NewGoal() {
  const exercise = useLoaderData();
  return (
    <div className="container">
      <h1>New goal for {exercise.title}</h1>
      <Form method="POST">
        <div className="">
          <label htmlFor="weight">weight</label>
          <input type="number" name="weight" id="weight" />
        </div>
        {/* <div className="error">
              <p>
                {actionData?.fieldErrors?.reps && actionData?.fieldErrors?.reps}
              </p>
            </div> */}
        <button type="submit" className="">
          Add goal
        </button>
      </Form>
    </div>
  );
}
