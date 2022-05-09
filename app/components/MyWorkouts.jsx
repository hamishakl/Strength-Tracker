export default function MyWorkouts({ data }) {

  return (
    <>
      {data.map((workouts) => {
        let dateStr = new Date(`${workouts.date}`);
        let dateArr = dateStr.toDateString().split(' ');
        let date = dateArr[2] + ' ' + dateArr[1] + ' ' + dateArr[3];

        return (
          <>
            <h2>{date}</h2>
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
