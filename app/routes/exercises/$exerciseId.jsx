import { Link, redirect, useLoaderData } from "remix";
import { Container } from "@mui/material";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";
import PrTable from "../../components/PrTable";

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

export const OneRmEstimate = (weight, reps) => {
  const unRounded1RM = weight * reps * 0.0333 + weight;
  return reps === 1 ? weight : Math.round(unRounded1RM / 2.5, 1) * 2.5;
};

function exercise() {
  const { exercise, user, pr } = useLoaderData();

  const dateConvertor = (prDate) => {
    return new Date(prDate).toDateString();
  };

  const data = pr.map((item) => {
    const container = {};

    container.name = dateConvertor(item.createdAt);
    container.uv = OneRmEstimate(item.weight, item.reps);

    return container;
  });

  return (
    <Container maxWidth="md">
      <div className="page-header">
        <h1>{exercise.title}</h1>
        <div className="page-content">{exercise.body}</div>
        <Link to="/exercises" className="btn btn-reverse">
          Back
        </Link>
      </div>

      <PrTable prs={pr} />

      <Link to="./pr-new">New PR</Link>
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="pv"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
      </LineChart>
      <div className="page-footer">
        {user.id === exercise.userId && (
          <form method="POST">
            <input type="hidden" name="_method" value="delete" />
            <button className="btn btn-delete">Delete</button>
          </form>
        )}
      </div>
    </Container>
  );
}

export default exercise;
