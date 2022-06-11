import Masonry from 'react-masonry-css'
import { wordDate } from '../routes/dashboard/workouts'
import { Link } from '@remix-run/react'

export default function MyWorkouts({ data }) {
  const workoutData = data
  if (data === undefined) {
    return null
  } else {
    let workoutArray = []
    let arr = []
    workoutData.map((workout) => {
      workoutArray.push(workout)
    })

    for (let i = 0; i < workoutArray.length; i++) {
      const workoutVolume = workoutArray[i].volume
      let obj = {
        date: workoutArray[i].date,
        volume: workoutVolume,
      }
      arr.push(obj)
    }

    let exerciseTitleArray = []
    let workouts = []
    arr.map((workout) => {
      workout.volume.map((vol) => {
        if (!exerciseTitleArray.includes(vol.Exercise.title)) {
          exerciseTitleArray.push(vol.Exercise.title)
          delete vol.id
          delete vol.workoutId
          delete vol.date
          vol.exercise = vol.Exercise.title
          delete vol.Exercise
        } else {
          delete vol.Exercise
          delete vol.id
          delete vol.workoutId
          delete vol.date
        }
        workouts.push(vol)
      })
    })

    return (
      <Masonry
        breakpointCols={3}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {arr.map((workout) => {
          console.log(workout)
          return [
            <div>
              <h4>{wordDate(workout.date)}</h4>
              {workout.volume.map((vol) => {
                console.log(vol.exercise)
                return (
                  <div>
                    {vol.exercise != undefined ? (
                      <div>
                        <p>
                          <Link to={`exercises/${vol.exerciseId}`}>
                            <h5>{vol.exercise}</h5>
                          </Link>
                        </p>
                        <p>Weight</p>
                        <p>Reps</p>
                        <p>Sets</p>
                      </div>
                    ) : null}
                    <div>
                      <p>{vol.weight}</p>
                      <p>{vol.reps}</p>
                      <p>{vol.sets}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          ]
        })}
      </Masonry>
    )
  }
}
