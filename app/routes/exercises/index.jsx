import { Link, useLoaderData } from "remix";
import { db } from "~/utils/db.server";

import { getUser } from "~/utils/session.server";

export const loader = async ({ request }) => {
  const user = await getUser(request);

  const data = {
    exercises: await db.exercise.findMany({
      where: {
        userId: {
          equals: `${user.id}`,
        },
      },
      take: 20,
      select: { id: true, title: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    }),
  };

  return data;
};

function ExerciseItems() {
  const { exercises } = useLoaderData();

  return (
    <>
      <div className="page-header">
        <h1>
          My exercises
            <Link to="/exercises/new" className="btn">
          <span class="badge bg-secondary">
              New
          </span>
            </Link>
        </h1>
      </div>
      <div class="container">
        <div class="row">
          {exercises.map((exercise) => (
            <div class="card" style={{ width: "18rem" }}>
              <div class="card-body" key={exercise.id}>
                <h5 class="card-title">{exercise.title}</h5>
                <h6 class="card-subtitle mb-2 text-muted">
                  {new Date(exercise.createdAt).toLocaleString()}
                </h6>
                <p class="card-text">{exercise.body}</p>
                <Link to={exercise.id} class="card-link">
                  View PR's
                </Link>
                <Link to={`./${exercise.id}/pr-new`} class="card-link">
                  New PR
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default ExerciseItems;
