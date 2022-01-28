import { redirect, useLoaderData, Link } from "remix";
import { db } from "~/utils/db.server";

export const loader = async ({ params }) => {
  const exercise = await db.exercise.findUnique({
    where: { id: params.exerciseId },
  });

  if (!exercise) {
    throw new Error("Exercise not found");
  }

  const data = { exercise };
  return data;
};

export const action = async ({ request, params }) => {
  const form = await request.formData();
  if (form.get("_method") === "delete") {
    const exercise = await db.exercise.findUnique({
      where: { id: params.exerciseId },
    });

    if (!exercise) {
      throw new Error("Exercise not found");
    }
    await db.exercise.delete({ where: { id: params.exerciseId } });
    return redirect("/exercises");
  }
};

function Exercise() {
  const { exercise } = useLoaderData();
  return (
    <div>
      <div className="page-header">
        <h1>{exercise.title}</h1>
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
}

export default Exercise;
