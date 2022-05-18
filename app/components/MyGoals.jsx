import { Link } from 'remix'

export default function MyGoals(goals) {
  const data = goals.goals
  return (
    <>
      <h2>My Goals</h2>
      <ul>
        {data.map((goal) => {
          let dateSplit = goal.achievementGoalDate.split('')
          let dateStr = dateSplit.slice(0, 10)
          let newDate = new Date(`${dateStr.join('')}`)
          let dateArr = newDate.toDateString().split(' ')
          let date = dateArr[2] + ' ' + dateArr[1] + ' ' + dateArr[3]
          const weight = goal.weight
          const reps = goal.reps
          const sets = goal.sets
          return (
            <li key={goal.exerciseId}>
              {/* <h3>{goal.Exercise.title}</h3> */}
              <p>
                <Link to={`${goal.exerciseId}`}>{goal.Exercise.title}</Link>{' '}
                <b>{goal.weight}kg</b> for{' '}
                <b>
                  {reps < 2 ? ` 1 rep` : ` ${reps} reps`}
                  {sets < 2 ? `` : ` x ${sets} sets`}
                </b>{' '}
                by {date}
              </p>
            </li>
          )
        })}
      </ul>
    </>
  )
}
