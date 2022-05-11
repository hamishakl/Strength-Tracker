import { Form, useLoaderData, useActionData, redirect } from "remix";
import { getUser } from "~/utils/session.server";
import { db } from "~/utils/db.server";

export const loader = async ({ request }) => {
  const user = await getUser(request);
  const goals = await db.goals.findMany({
    where: { userId: user.id },
  });
  return goals;
};


export default function MyGoals() {
  return (
    <>
      <h2>MyGoals</h2>
    </>
  )
}
