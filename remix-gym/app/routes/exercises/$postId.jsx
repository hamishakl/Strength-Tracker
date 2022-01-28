import { useParams } from "remix";



function Exercise() {
const params = useParams()

return <div>
      <h1>Exercise {params.exerciseId}</h1>
  </div>;
}

export default Exercise;
