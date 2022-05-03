export default function NewWorkoutForm({ exercises, val  }) {
  val = val+2
  console.log(val)
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
          <label htmlFor="weight" required>Weight</label>
          <input type="number" name={`weight-${val}`}/>
          <label htmlFor="weight" required>Reps</label>
          <input type="number" name={`reps-${val}`}/>
          <label htmlFor="sets" required>Sets</label>
          <input type="number" name={`sets-${val}`}/>
         
    </div>
  )
}
