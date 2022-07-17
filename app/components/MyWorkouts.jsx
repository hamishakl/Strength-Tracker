import Masonry from 'react-masonry-css'
import { wordDate } from '../routes/dashboard/workouts'
import { Link } from '@remix-run/react'

export default function MyWorkouts({ data }) {
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };
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
        id: workoutArray[i].id
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
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {arr.map((workout) => {
          return [
            <div className='workout-card'>
              <Link to={`/dashboard/workouts/${workout.id}`}>
              <h4 className='font-bold text-2xl underline underline-offset-1 mb-3'>{wordDate(workout.date)}</h4>
              </Link>
              {workout.volume.map((vol) => {
                return (
                  <div className='workout-card__wrapper'>
                    {vol.exercise != undefined ? (
                      <div className='workout-card-heading__div'>
                        <div>
                            <Link to={`../dashboard/exercises/${vol.exerciseId}`}>
                              <h3 className='font-bold underline text-xl'>{vol.exercise}</h3>
                            </Link>
                        </div>
                        <div className='workout-card-title__div border-b border-t mt-2'>
                          <p className=''>Weight</p>
                          <p className=''>Reps</p>
                          <p className=''>Sets</p>
                        </div>
                      </div>
                    ) : null}
                    <div className='workout-card-work__div mb-5'>
                      <p>{vol.weight}kg</p>
                      <p>{vol.reps}</p>
                      <p>{vol.sets}</p>
                    </div>
                  </div>
                )
              })}
            </div>,
          ]
        })}
      </Masonry>
    )
  }
}
