import React from "react";
import { Link, useLoaderData } from "remix";

export const loader = async ({ request, params, exercise }) => {
  const user = await getUser(request);

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
  
  return pr
};

export default function Recommendation({ exercise }) {

  const pr = useLoaderData()

  console.log(pr);

  return (
    <div className="container">
      <div
        className="card"
        style={{ flex: "0 0 33.333333%" }}
      >
        <div className="card-body">
          <h6 className="card-subtitle mb-2 text-muted"></h6>
          {exercise.goal === null ? (<p>no goal</p>) : (<p>Progress towards your goal of {exercise.goal}kg</p>)}
          <div class="progress">
            <div
              class="progress-bar"
              role="progressbar"
              style={{ width: "25%" }}
              aria-valuenow="25"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              25%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
