import { useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import {Link} from 'remix'

export const loader = async ({ params }) => {
  const exercise = await db.exercise.findUnique({
    where: { id: params.exerciseId },
  });

  const data = { exercise };
  return data;
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
    </div>
  );
}

export default Exercise;
