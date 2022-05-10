import * as React from 'react'
import { OneRmEstimate } from '../routes/dashboard/$exerciseId'

export default function ({ prs }) {

  const dateConvertor = (prDate) => {
    let date = new Date(prDate).toDateString()
    let dateArr = date.split(' ')
    dateArr.shift()
    let yearArr = dateArr.pop()
    let yearSplit = yearArr.split('')
    let year = yearSplit.slice(2, 4).join("")
    dateArr.push(year)
    let month = dateArr[0]
    dateArr[0] = dateArr[1]
    dateArr[1] = month
    return dateArr.join(" ")
  }

  return (
    <>
      <table class="pr-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Weight</th>
            <th>Reps</th>
            <th>Est 1RM</th>
          </tr>
        </thead>
        <tbody>
          {prs.map((pr, index) => {
            return (
              <tr key={pr.id}>
                <td>
                  {dateConvertor(pr.createdAt)}
                </td>
                <td>
                  {pr.weight}kg
                </td>
                <td>
                  {pr.reps}
                </td>
                <td>
                  {OneRmEstimate(pr.weight, pr.reps)}kg
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}
