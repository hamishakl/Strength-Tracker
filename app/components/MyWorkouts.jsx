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
                  <h1>{workout['Exercise'].title}</h1>
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
