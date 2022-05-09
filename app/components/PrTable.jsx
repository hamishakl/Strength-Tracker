import * as React from 'react'
import { OneRmEstimate } from '../routes/dashboard/$exerciseId'

export default function ({ prs }) {
  return (
    <>
      {prs.map((pr) => {
        console.log(pr)
        return (
          <div>
          <div key={pr.id}>
            <p>{pr.weight}</p>
            <p>{pr.reps}</p>
          </div>
        </div>
          )
      })}
    </>
  )
}
