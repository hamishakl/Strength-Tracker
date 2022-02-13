import { Link, redirect, useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";
import { OneRmEstimate } from "./$exerciseId";

export const loader = async ({ params }) => {
  const exercise = params.exerciseId;

  if (!exercise) throw new Error("exercise not found");

  const pr = await db.pr.findUnique({
    where: {
      id: params.pr,
    },
  });

  const data = { exercise, pr };
  return data;
};

function prPage() {
  const { exercise, pr } = useLoaderData();
  // console.log(pr);
  return (
    <>
      <table>
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
      <Link to={`../${exercise}`}>Back</Link>
    </>
  );
}

export default prPage;
