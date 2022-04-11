import * as React from "react";
import { OneRmEstimate } from "../routes/dashboard/$exerciseId";


export default function BasicTable({ prs }) {
  console.log(prs)
  return (
    <>
    <div>
    <p>{prs[1].weight}</p>
    {prs.map((pr ) => {
      <div key={pr.id}>

        <p>{pr.reps}</p>
      </div>
    })}
    </div>
    </>
  );
}
