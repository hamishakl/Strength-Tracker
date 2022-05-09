export default function MyWorkouts({ data }) {
  // console.log(data)
  return (
    <>
      <h2 className="subheading">Workouts</h2>
    <div className="workout-wrapper">
      {data.reduce((acc, current) => {
        // acc.push(current['Exercise'].title)
        console.log(current.volume)
      }, [])}
      {data.map((workouts) => {
        let dateStr = new Date(`${workouts.date}`);
        let dateArr = dateStr.toDateString().split(' ');
        let date = dateArr[2] + ' ' + dateArr[1] + ' ' + dateArr[3];
        

        return (
          <div className="workout-card">
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
          </div>
        )
      })}
    </div>
      </>
  )
}
