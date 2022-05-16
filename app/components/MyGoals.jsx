import { Form, useLoaderData, useActionData, redirect } from "remix";
import { getUser } from "~/utils/session.server";
import { db } from "~/utils/db.server";

export default function MyGoals(goals) {
  const data = goals.goals
  // console.log(data)
  return (
    <>
      <h3>My Goals</h3>
      {data.map((goal) => {
        let dateSplit = goal.achievementGoalDate.split("")
        let dateStr = dateSplit.slice(0, 10)
        let newDate = new Date(`${dateStr.join('')}`);
        let dateArr = newDate.toDateString().split(' ');
        let date = dateArr[2] + ' ' + dateArr[1] + ' ' + dateArr[3];
        const weight = goal.weight
        const reps = goal.reps
        const sets = goal.sets
        console.log({weight, reps, sets})
        return (
          <div>
            <h4>{goal.Exercise.title}</h4>
            <p>I will {goal.Exercise.title} {goal.weight}kg for 
            {reps < 2 ? (` 1 rep`) : (` ${reps} reps`)} 
            {sets < 2 ? (``): (` and ${sets} sets`)} by {date}</p>
          </div>

        )
      })}
    </>
  )
}
