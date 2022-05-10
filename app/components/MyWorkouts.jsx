export default function MyWorkouts({ data }) {
  return (
    <>
      <h2 className="subheading">Workouts</h2>
      <div className="workout-wrapper">
        {data.map((workouts, index) => {
          let dateStr = new Date(`${workouts.date}`);
          let dateArr = dateStr.toDateString().split(' ');
          let date = dateArr[2] + ' ' + dateArr[1] + ' ' + dateArr[3];

          console.log('look here')

          return (
            <div className="workout-card" key={index}>
              <h2>{date}</h2>
              {workouts.volume.map((workout, index, arr) => {
                console.log(workout)
                index++
                let previousArrTitle = arr[index - 1]
                let arrTitle = arr[index]
                return (
                  <div key={index}>
                    {
                      arrTitle != undefined && previousArrTitle != undefined ?

                        (
                          arrTitle['Exercise'].title === previousArrTitle['Exercise'].title ?
                            (
                              <>
                                <h4>{previousArrTitle['Exercise'].title}</h4>
                                <p>
                                  {previousArrTitle.weight}kg for {previousArrTitle.reps} reps for{' '}
                                  {previousArrTitle.sets} sets.
                                </p>
                                <p>
                                  {arrTitle.weight}kg for {arrTitle.reps} reps for{' '}
                                  {arrTitle.sets} sets.
                                </p>
                              </>
                            )
                            :
                            (
                              <>
                                <h4>{arrTitle['Exercise'].title}</h4>
                                <p>
                                  {arrTitle.weight}kg for {arrTitle.reps} reps for{' '}
                                  {arrTitle.sets} sets.
                                </p>
                              </>
                            )
                        )
                        :
                        (
                          console.log()
                        )
                    }
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
