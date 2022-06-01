import { Link } from "@remix-run/react";

export default function MyGoals(data) {
  const goals = data.data[0]
  const achieved = data.data[1]
  return (
    <>
      <ul>
        {goals.map((goal) => {
          let dateSplit = goal.achievementGoalDate.split("")
          let dateStr = dateSplit.slice(0, 10)
          let newDate = new Date(`${dateStr.join("")}`)
          let dateArr = newDate.toDateString().split(" ")
          let date = dateArr[2] + " " + dateArr[1] + " " + dateArr[3]
          const weight = goal.weight
          const reps = goal.reps
          const sets = goal.sets
          if (achieved === false && goal.achieved === false) {
            return (
              <>
                <li key={goal.exerciseId}>
                  <p>
                    <Link to={`exercises/${goal.exerciseId}`}>
                      {goal.Exercise.title}
                    </Link>{" "}
                    <b>{goal.weight}kg</b> for{" "}
                    <b>
                      {reps < 2 ? ` 1 rep` : ` ${reps} reps`}
                      {sets < 2 ? `` : ` x ${sets} sets`}
                    </b>{" "}
                    by {date}
                  </p>
                </li>
              </>
            )
          } else if (goal.achieved === true && achieved === true) {
            return (
              <>
                <li key={goal.exerciseId}>
                  <p>
                    <Link to={`exercises/${goal.exerciseId}`}>
                      {goal.Exercise.title}
                    </Link>{" "}
                    <b>{goal.weight}kg</b> for{" "}
                    <b>
                      {reps < 2 ? ` 1 rep` : ` ${reps} reps`}
                      {sets < 2 ? `` : ` x ${sets} sets`}
                    </b>{" "}
                    by {date}
                  </p>
                </li>
              </>
            )
          }
        })}
      </ul>
    </>
  )
}
