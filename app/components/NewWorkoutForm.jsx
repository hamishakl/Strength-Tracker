export default function NewWorkoutForm({ exercises, val  }) {
  val = val+2
  return (
    <div>
      <h5>Exercise #{val}</h5>
      <select
            aria-label='Default select example'
            required
            id='exercise'
            name={`exercise-${val}`}
          >
            <option defaultValue={'none'}>
              Pick an exercise
            </option>
            {exercises.map((exercise) => (
              <>
              <option key={exercise.id} value={exercise.id}>
                {exercise.title}
              </option>
              </>
            ))}
          </select>
          <label htmlFor="weight" >Weight</label>
          <input type="number" required name={`weight-${val}`}/>
          <label htmlFor="weight" >Reps</label>
          <input type="number" required name={`reps-${val}`}/>
          <label htmlFor="sets" >Sets</label>
          <input type="number" required name={`sets-${val}`}/>
         
    </div>
  )
}
