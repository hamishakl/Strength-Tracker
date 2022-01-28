import { useLoaderData } from "remix";
import {db} from '~/utils/db.server'

export const loader = async ({params}) =>{
  const exercise = await db.exercise.findUnique({
    where: { id: params.exerciseId},
  })


  const data = {exercise}
  return data
}

function Exercise() {
  const {exercise} = useLoaderData()
  return (
    <div>
      <h1>{exercise.title}</h1>
    </div>
  );
}

export default Exercise;
