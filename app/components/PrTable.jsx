import * as React from 'react'
import { OneRmEstimate } from '../routes/dashboard/$exerciseId'

export default function ({ prs }) {
  return (
    <>
      <h5>PR Table</h5>
      <table class="">
        <thead>
          <tr>
            <th>Date</th>
            <th>Weight</th>
            <th>Reps</th>
            <th>Est 1RM</th>
          </tr>
        </thead>
        <tbody>
          {prs.map((pr) => {
            console.log(pr)
            return (
              <tr key={pr.id}>
                <td>
                  {pr.weight}
                </td>
                <td>
                  {pr.reps}
                </td>
                <td>
                  {OneRmEstimate(pr.weight, pr.reps)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>


    </>
  )
}
