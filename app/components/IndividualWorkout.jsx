import { wordDate } from '../routes/dashboard/workouts'
import { Link } from '@remix-run/react'
import { getUser } from '~/utils/session.server'
import { db } from '~/utils/db.server'

const prArray = (dataBlock, exerciseList, user) => {
  let prArr = []
  for (let i = 0; i < exerciseList.length; i++) {
    prArr[i] = {
      exerciseId: dataBlock[i].exerciseId,
      weight: parseInt(dataBlock[i].weight),
      reps: parseInt(dataBlock[i].reps),
      userId: String(user.id),
    }
  }
  return prArr
}

//need the original pr id string 
//also need the volume string
//update both not create new one

export const action = async ({ request, params }) => {
  const user = await getUser(request)
  let volumeBlock = {}
  let exerciseList = []
  let volumeArray = []
  const form = await request.formData()
  console.log(form)

  let list = [...form]

  for (let i = 0; i < list.length; i++) {
    if (
      list[i][0].includes('exercise') &&
      !list[i][1].includes('Pick an exercise')
    ) {
      let obj = {
        exerciseId: list[i][1],
        weight: list[i + 1][1],
        reps: list[i + 2][1],
        sets: list[i + 3][1],
      }
      volumeArray.push(obj)
      exerciseList.push(list[i][1])
    }
  }

  let date = new Date(form.get('date'))

  let volume = {
    volume: {
      create: [],
    },
  }

  for (let i = 0; i < exerciseList.length; i++) {
    volume.volume.create.push({
      exerciseId: '',
      weight: '',
      reps: '',
      sets: '',
      userId: '',
    })
    volume.volume.create[i].exerciseId = String(volumeArray[i].exerciseId)
    volume.volume.create[i].weight = parseInt(volumeArray[i].weight)
    volume.volume.create[i].reps = parseInt(volumeArray[i].reps)
    volume.volume.create[i].sets = parseInt(volumeArray[i].sets)
    volume.volume.create[i].userId = String(user.id)
  }

  const prArr = prArray(volumeArray, exerciseList, user)

  for (let i = 0; i < exerciseList.length; i++) {
    let pr = await db.pr.create({
      data: prArr[i],
    })
  }

  const workout = await db.workout.update({
    where: { id: params.exerciseId },
    data: {
      userId: user.id,
      date: date,
      ...volume,
    },
    include: {
      volume: true,
    },
  })

  return redirect(`/dashboard`)
}

export default function IndividualWorkout({ data }) {
  const workoutData = [data[0]]
  const exercises = data[1]
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
        id: workoutArray[i].id,
      }
      arr.push(obj)
    }

    let exerciseTitleArray = []
    let workouts = []
    arr.map((workout) => {
      workout.volume.map((vol) => {
        if (!exerciseTitleArray.includes(vol.Exercise.title)) {
          exerciseTitleArray.push(vol.Exercise.title)
          delete vol.workoutId
          delete vol.date
          vol.exercise = vol.Exercise.title
          delete vol.Exercise
        } else {
          delete vol.Exercise
          delete vol.workoutId
          delete vol.date
        }
        workouts.push(vol)
      })
    })

    return (
      <>
        {arr.map((workout) => {
          return [
            <form className="workout-card" method='POST'>
              <Link to={`/dashboard/workouts/${workout.id}`}>
                <h4>{wordDate(workout.date)}</h4>
              </Link>
              {workout.volume.map((vol) => {
                // console.log(vol)
                // const volumeIdAndExercise = [vol.id, vol.exercise]
                return (
                  <div className="workout-card__wrapper" key={vol.id}>
                    {vol.exercise != undefined ? (
                      <div className="workout-card-heading__div">
                        <select
                          aria-label="Default select example"
                          required
                          id="exercise"
                          name="exercise-1"
                        >
                          <option defaultValue={vol.exercise}>
                            {vol.exercise}
                          </option>
                          {exercises.map((exercise) => (
                            <>
                              <option key={exercise.id} value={exercise.id}>
                                {exercise.title}
                              </option>
                            </>
                          ))}
                        </select>
                        <div className="workout-card-title__div">
                          <p>Weight</p>
                          <p>Reps</p>
                          <p>Sets</p>
                        </div>
                      </div>
                    ) : null}
                    <div className="workout-card-work__div">
                      <input type="text" defaultValue={vol.weight} />
                      <input type="text" defaultValue={vol.reps} />
                      <input type="text" defaultValue={vol.sets} />
                    </div>
                  </div>
                )
              })}
              <button type="submit">Save</button>
            </form>,
          ]
        })}
      </>
    )
  }
}
