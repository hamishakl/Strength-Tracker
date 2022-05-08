export default function MyWorkouts({ data }) {
  return (
    <>
      {data.map((workouts) => {
        return (
          <>
            <h2>Workout date: {workouts.date}</h2>
            {workouts.volume.map((workout, index) => {
              return (
                <div>
                  <h4>{workout['Exercise'].title}</h4>
                  <p>
                    {workout.weight}kg for {workout.reps} reps for{' '}
                    {workout.sets} sets.
                  </p>
                </div>
              )
            })}
          </>
        )
      })}
    </>
  )
}
