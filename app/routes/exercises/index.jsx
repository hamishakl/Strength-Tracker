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
            <span className="badge bg-secondary">New</span>
          </Link>
        </h1>
      </div>
      <div className="container">
        <div className="row">
          {exercises.map((exercise) => (
            <div key={exercise.id} className="card" style={{ flex: "0 0 33.333333%" }}>
              <div className="card-body" key={exercise.id}>
                <Link to={exercise.id}>
                  <h5 className="card-title">{exercise.title}</h5>
                </Link>
                <h6 className="card-subtitle mb-2 text-muted">
                  {/* {new Date(exercise.createdAt).toLocaleString()} */}
                </h6>
                <p className="card-text">{exercise.body}</p>
                <Link to={`./${exercise.id}/pr-new`} className="btn btn-primary">
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
