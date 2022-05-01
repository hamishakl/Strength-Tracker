export default function NewWorkoutForm({ exercises, val  }) {
  val = val+1
  console.log(val)
  return (
    <div>
      <h5>Exercise #{val}</h5>
      <select
            aria-label='Default select example'
            required
            id='exercise'
            name='exercise'
          >
            <option defaultValue={'none'}>
              Pick an exercise
            </option>
            {exercises.map((exercise) => (
              <>
              <option key={exercise.id} defaultValue={exercise.id}>
                {exercise.title}
              </option>
              </>
            ))}
          </select>
          <label htmlFor="weight">Weight</label>
          <input type="number" name="weight"/>
          <label htmlFor="weight">Reps</label>
          <input type="number" name="reps"/>
          <label htmlFor="sets">Sets</label>
          <input type="number" name="sets"/>
         
    </div>
  )
}
