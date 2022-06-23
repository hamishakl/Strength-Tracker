import { Link } from '@remix-run/react'

export const dateStr = (a) => {
  let dateSplit = a.split('')
  let dateStr = dateSplit.slice(0, 10)
  let newDate = new Date(`${dateStr.join('')}`)
  let dateArr = newDate.toDateString().split(' ')
  let date = dateArr[2] + ' ' + dateArr[1] + ' ' + (dateArr[3] - 2000)
  return date
}

export default function MyGoals(data) {
  // console.log(data.data)
  let goals
  data.data.length === 1 ? (goals = data.data) : (goals = data.data[0])
  const achieved = data.data[1]
  console.log(data.data[1])
  return (
    <>
      <ul className="mt-2">
        {goals.map((goal) => {
          // console.log(goal)
          const date = dateStr(goal.achievementGoalDate)
          const reps = goal.reps
          if (achieved === false && goal.achieved === false) {
            return (
              <>
                <li key={goal.exerciseId}>
                  <p className="">
                    <Link
                      to={`exercises/${goal.exerciseId}`}
                      className="underline font-bold"
                    >
                      {goal.Exercise.title}
                    </Link>{' '}
                    <b>{goal.weight}kg</b> for{' '}
                    <b>{reps < 2 ? ` 1 rep` : ` ${reps} reps`}</b> by {date}
                  </p>
                </li>
              </>
            )
          } else if (goal.achieved === true && achieved === true) {
            return (
              <>
                <li key={goal.exerciseId} className="mb-2">
                  <p>
                    <Link to={`../dashboard/exercises/${goal.exerciseId}`}>
                      {goal.Exercise.title}
                    </Link>{' '}
                    <b>{goal.weight}kg</b> for{' '}
                    <b>{reps < 2 ? ` 1 rep` : ` ${reps} reps`}</b> by {date}
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
