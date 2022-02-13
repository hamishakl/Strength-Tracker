import { Link, useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import MyExercise from "../../components/MyExercises";
import Goals from "../../components/Goals";

import { getUser } from "~/utils/session.server";

export const loader = async ({ request }) => {
  const user = await getUser(request);

  const exercises = {
    exercises: await db.exercise.findMany({
      where: {
        userId: {
          equals: `${user.id}`,
        },
      },
      take: 20,
      orderBy: { createdAt: "desc" },
    }),
  };
  const prs = {
    prs: await db.pr.findMany({
      where: {
        userId: {
          equals: `${user.id}`,
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  };

  const data = { exercises, prs };

  return data;
};

function ExerciseItems() {
  const data = useLoaderData();

  return (
    <>
      <div className="page-header">
        <h1>
          My exercises
          <Link to="/dashboard/new" className="btn">
            <span className="badge bg-secondary">New</span>
          </Link>
        </h1>
      </div>
      <MyExercise data={data} />
    </>
  );
}

export default ExerciseItems;
