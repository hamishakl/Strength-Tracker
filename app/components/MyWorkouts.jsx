import Masonry from "react-masonry-css"

export default function MyWorkouts({ data }) {
  const workoutData = data

  let workoutArray = []
  let workoutMasonryArray = []
  let arr = []

  workoutData.map((workout, i) => {
    var obj = {
      date: workout.date,
      volume: [],
    }
    workoutArray.push(obj)
    workout.volume.map((vol) => {
      //  console.log(obj.volume)
      if (obj.volume[0] != vol.Exercise.title) {
        let arr = { weight: vol.weight, reps: vol.reps, sets: vol.sets }
        obj.volume.push(vol.Exercise.title)
        obj.volume.push(arr)
      } else {
        let arr = { weight: vol.weight, reps: vol.reps, sets: vol.sets }
        obj.volume.push(arr)
      }
    })
  })

  workoutArray.map((workout) => {
    arr = [
      <div>
        <h2>{workout.date}</h2>
        <table>
          {workout.volume.map((vol, i) => {
            if (typeof vol != "object") {
              return (
                <tr>
                  {vol}
                  <td>
                    <th>
                      <h3>weight</h3>
                    </th>
                  </td>
                  <td>
                    <th>
                      <h3>reps</h3>
                    </th>
                  </td>
                  <td>
                    <th>
                      <h3>sets</h3>
                    </th>
                  </td>
                </tr>
              )
            } else {
              return (
                <tr>
                  <td>
                    <p></p>
                  </td>
                  <td>
                    <p>{vol.weight}</p>
                  </td>
                  <td>
                    <p>{vol.reps}</p>
                  </td>
                  <td>
                    <p>{vol.sets}</p>
                  </td>
                </tr>
              )
            }
          })}
        </table>
      </div>,
    ]
    workoutMasonryArray.push(arr)
  })
  return (
    <Masonry
      breakpointCols={3}
      className='my-masonry-grid'
      columnClassName='my-masonry-grid_column'
    >
      {workoutMasonryArray}
    </Masonry>
  )
}
