import { useLoaderData } from "@remix-run/react";
import MyGoals from "~/components/MyGoals";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";
import NewGoal from "./new";
import Navbar from "../../../components/ui/PagesNavbar";

export const loader = async ({ request }) => {
  const user = await getUser(request);
  const goals = await db.goals.findMany({
    where: { userId: user.id },
    include: {
      Exercise: {
        select: {
          title: true,
        },
      },
    },
  });
  const exercises = await db.exercise.findMany({
    where: { userId: user.id },
  })
  const data = {user, goals, exercises}

  return data;
};

export default function index() {
  const data = useLoaderData();
  const user = data.user
  const goals = data.goals
  const exercises = data.exercises
    // console.log(data.user)
  const newGoalData = [user,exercises]

  let achievedArr = [];
  for (let i = 0; i < goals.length; i++) {
    if (goals[i].achieved === true) {
      achievedArr.push(i);
    }
  }
  const notAchieved = [goals, false];
  const achieved = [goals, true];
  return (
    <>
      <div>
        <Navbar data={['My Goals', 'goals/new', 'New Goal']} />
        <MyGoals data={notAchieved} />
        {achievedArr.length != 0 ? (
          <>
            <h2>Goals I've accomplished so far:</h2>
            <MyGoals data={achieved} />
          </>
        ) : null}
      </div>
      <div>
          {/* <NewGoal data={newGoalData}/> */}
      </div>
    </>
  );
}
