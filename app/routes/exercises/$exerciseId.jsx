import { Link, redirect, useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";

export const loader = async ({ request, params }) => {
  const user = await getUser(request);
  const exercise = await db.exercise.findUnique({
    where: { id: params.exerciseId },
  });

  if (!exercise) throw new Error("exercise not found");

  const pr = await db.pr.findMany({
    where: {
      userId: {
        equals: `${user.id}`,
      },
      exerciseId: {
        equals: `${exercise.id}`,
      },
    },
  });

  const data = { exercise, user, pr };
  return data;
};

export const action = async ({ request, params }) => {
  const form = await request.formData();
  if (form.get("_method") === "delete") {
    const user = await getUser(request);

    const exercise = await db.exercise.findUnique({
      where: { id: params.exerciseId },
    });

    if (!exercise) throw new Error("exercise not found");

    if (user && exercise.userId === user.id) {
      await db.exercise.delete({ where: { id: params.exerciseId } });
    }

    return redirect("/exercises");
  }
};

function exercise() {
  const { exercise, user, pr } = useLoaderData();
  const OneRmEstimate = (weight, reps) => {
    const unRounded1RM = weight * reps * 0.0333 + weight;

    return reps === 1 ? weight : Math.round(unRounded1RM / 2.5, 1) * 2.5;
  };

  return (
    <div>
      <div className="page-header">
        <h1>{exercise.title}</h1>
        <div className="page-content">{exercise.body}</div>
        <Link to="/exercises" className="btn btn-reverse">
          Back
        </Link>
      </div>

      <ul className="pr-list">
        {pr.map((pr) => (
          <table key={pr.id}>
            <tbody>
              <tr>
                <td>Weight</td>
                <td>{pr.weight}</td>
              </tr>
              <tr>
                <td>Reps</td>
                <td>{pr.reps}</td>
              </tr>
              <tr>
                <td>Projected 1rm</td>
                <td>{OneRmEstimate(pr.weight, pr.reps)}</td>
              </tr>
              <tr>
                <td>Date</td>
                <td>{new Date(pr.createdAt).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        ))}
      </ul>

      <Link to="./pr">New PR</Link>

      <div className="page-footer">
        {user.id === exercise.userId && (
          <form method="POST">
            <input type="hidden" name="_method" value="delete" />
            <button className="btn btn-delete">Delete</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default exercise;
