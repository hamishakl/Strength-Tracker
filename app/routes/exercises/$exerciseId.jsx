import { Link, redirect, useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

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

  const dateConvertor = (prDate) => {
    return new Date(prDate).toLocaleString();
  };

  const data = pr.map((item) => {
    const container = {};

    container.name = dateConvertor(item.createdAt);
    container.uv = OneRmEstimate(item.weight, item.reps);

    return container;
  });

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
      <LineChart
        width={600}
        height={300}
        data={data}
        margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
      >
        <Line type="monotone" dataKey="uv" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
      </LineChart>
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
