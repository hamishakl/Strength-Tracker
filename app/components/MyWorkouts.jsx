import Masonry from "react-masonry-css"
import { wordDate } from "../routes/dashboard/workouts"
import { Link } from "@remix-run/react"

export default function MyWorkouts({ data }) {
  const workoutData = data
  if (data === undefined) {
    return null
  } else {
    let workoutArray = []
    let workoutMasonryArray = []
    let arr = []

    workoutData.map((workout) => {
      var obj = {
        date: workout.date,
        volume: {},
      }
      let exerciseArr = []
      for (let i = 0; i < workout.volume.length; i++) {
        let exercise = workout.volume[i].Exercise.title
        if (!exerciseArr.includes(workout.volume[i].Exercise.title)) {
          exerciseArr.push(workout.volume[i].Exercise.title)
          obj.volume[`${exercise}`] = {
            [`block${i}`]: {
              weight: workout.volume[i].weight,
              sets: workout.volume[i].sets,
              reps: workout.volume[i].reps,
            },
          }
        } else {
          obj.volume[`${exercise}`][`block${i}`] = {
            weight: workout.volume[i].weight,
            sets: workout.volume[i].sets,
            reps: workout.volume[i].reps,
          }
        }
      }
      workoutArray.push(obj)
    })

    

    workoutArray.map((workout, count) => {
      // console.log(workout.volume)
      arr = [
        <>
          <h2>{wordDate(workout.date)}</h2>
          <table>
            {
              Object.keys(workout.volume).map((vol, i) => {
                console.log(workout.volume[vol])
                console.log(i)
              })
            }
          </table>
        </>,
      ]
    })
    // workoutArray.map((workout) => {
    //   arr = [
    //     <div>
    //       <h2>{wordDate(workout.date)}</h2>
    //       <table>
    //         {workout.volume.map((vol, i) => {
    //           let id = vol.id
    //           // console.log(vol)
    //           if (typeof vol != "object") {
    //             return (
    //               <tr>
    //                 <td>
    //                   <th>{vol}</th>
    //                 </td>
    //                 <td>
    //                   <th>
    //                     <h3>weight</h3>
    //                   </th>
    //                 </td>
    //                 <td>
    //                   <th>
    //                     <h3>reps</h3>
    //                   </th>
    //                 </td>
    //                 <td>
    //                   <th>
    //                     <h3>sets</h3>
    //                   </th>
    //                 </td>
    //               </tr>
    //             )
    //           } else {
    //             return (
    //               <tr>
    //                 <td>
    //                   <p></p>
    //                 </td>
    //                 <td>
    //                   <p>{vol.weight}</p>
    //                 </td>
    //                 <td>
    //                   <p>{vol.reps}</p>
    //                 </td>
    //                 <td>
    //                   <p>{vol.sets}</p>
    //                 </td>
    //               </tr>
    //             )
    //           }
    //         })}
    //       </table>
    //     </div>,
    //   ]
    //   workoutMasonryArray.push(arr)
    // })

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
}
