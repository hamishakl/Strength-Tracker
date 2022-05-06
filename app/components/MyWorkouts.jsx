export default function MyWorkouts({ data }) {
  const forLoop = (workout) => {
    for (let i = 0; i < workout.length; i++) {
      return i
    }
  }
  console.log(data);
  return (
    <>
      {data.map((workout) => {
       <h1>
         {forLoop(workout)}
       </h1>
      })}
    </>
  )
}
