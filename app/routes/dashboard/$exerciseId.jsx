import { Link, redirect, useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";
import PrTable from "../../components/PrTable";
import Chart from "../../components/Chart";
import Goals from "../../components/Goals";
import { useEffect, useRef } from "react";

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
    orderBy: {
      createdAt: "desc",
    },
  });
  const oneRepMax = weightLoop(pr);
  const data = { exercise, user, pr, oneRepMax };
  return data;
};

const weightLoop = (pr) => {
  let arr = [];
  for (let i = 0; i < pr.length; i++) {
    arr.push(OneRmEstimate(pr[i].weight, pr[i].reps));
  }
  return Math.max(...arr);
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

    return redirect("/dashboard");
  }
};

export const OneRmEstimate = (weight, reps) => {
  const unRounded1RM = weight * reps * 0.0333 + weight;
  return reps === 1 ? weight : Math.round(unRounded1RM / 2.5, 1) * 2.5;
};


function exercise() {
  const { exercise, user, pr, oneRepMax } = useLoaderData();

  const latestPr = pr[0];
  let currentEstimatedPr = null

  if (latestPr === undefined || pr.length === 0){
    console.log('no pr')
  } else {
    currentEstimatedPr = OneRmEstimate(latestPr.weight, latestPr.reps);
  }

  return (
    <>
      <div className="page-header">
        <h1>{exercise.title}</h1>
        {pr.length > 0 ? (
          <>
            <h5>Current estimated PR: {currentEstimatedPr}kg</h5>
            <h5>Best estimated PR recorded: {oneRepMax}kg</h5>
          </>
        ) : null}
        <Link to="/dashboard" className="btn btn-reverse">
          Back
        </Link>
      </div>
      {pr.length > 0 ? (
        <div >
          <Goals exercise={exercise} prs={pr}/>
          <PrTable prs={pr} />
          <Link to="./pr-new">New PR</Link>
          <Chart pr={pr} />
        </div>
      ) : (
        <h1>no prs yet :(</h1>
          )}
      <div className="page-footer">
        {user.id === exercise.userId && (
          <form method="POST">
            <input type="hidden" name="_method" value="delete" />
            <button className="btn btn-delete">Delete</button>
          </form>
        )}
      </div>
        </>
  );
}

export default exercise;
