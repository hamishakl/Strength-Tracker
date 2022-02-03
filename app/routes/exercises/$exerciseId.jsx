import { redirect, useLoaderData, Link } from "remix";
import { db } from "~/utils/db.server";
// import Pr from "./prId";
// import { useState } from 'react';
import { getUser } from '~/utils/session.server'



export const loader = async ({ request, params }) => {
  const user = await getUser(request)
  const exercise = await db.exercise.findUnique({
    where: { id: params.exerciseId },
  });

  if (!exercise) {
    throw new Error("Exercise not found");
  }

  const data = { exercise, user };
  return data;
};

export const action = async ({ request, params }) => {
  const form = await request.formData();
  if (form.get("_method") === "delete") {
    const user = await getUser(request)

    const exercise = await db.exercise.findUnique({
      where: { id: params.exerciseId },
    });

    if (!exercise) {
      throw new Error("Exercise not found");
    }

    if (user && exercise.userId === user.id) {
      await db.exercise.delete({ where: { id: params.exerciseId } })
    }

    return redirect("/exercises");
  }
};

function Exercise() {
  const { exercise } = useLoaderData();
  // const [data, setData] = useState("");
  // const exerciseId = exercise.id
  return (
    <div>
      <div className="page-header">
        <h1>{exercise.title}</h1>
        {/* <Pr id={exerciseId} /> */}
        <Link to="/exercises" className="btn btn-reverse">
          Back
        </Link>
      </div>
      <div className="page-footer">
        <form method="POST">
          <input type="hidden" name="_method" value="delete" />
          <button className="btn btn-delete">Delete</button>
        </form>
      </div>
    </div>
  );
  
};

export default Exercise
