import * as React from 'react'
import { OneRmEstimate } from '../routes/dashboard/exercises/$exerciseId'

export default function ({ prs }) {
  const dateConvertor = (prDate) => {
    let date = new Date(prDate).toDateString()
    let dateArr = date.split(' ')
    dateArr.shift()
    let yearArr = dateArr.pop()
    let yearSplit = yearArr.split('')
    let year = yearSplit.slice(2, 4).join('')
    dateArr.push(year)
    let month = dateArr[0]
    dateArr[0] = dateArr[1]
    dateArr[1] = month
    return dateArr.join(' ')
  }

  return (
    <div className="overflow-scroll h-auto max-h-1/2 pr-table__div my-10">
      <table className={'w-full flex flex-row flex-no-wrap rounded-lg sm:shadow-lg mb-5'}>
        <thead className="text-white">
          <tr className="bg-neutral-500	3 flex flex-row flex-no wrap sm:table-row sm:rounded-none mb-2 sm:mb-0 justify-between">
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Weight</th>
            <th className="p-3 text-left">Reps</th>
            <th className="p-3 text-left">Est 1RM</th>
          </tr>
        </thead>
        <tbody className="flex-1 sm:flex-none">
          {prs.map((pr, index) => {
            return (
              <tr key={pr.id} className="flex flex-row flex-no wrap sm:table-row sm:mb-0 hover:bg-neutral-500 sm:p-3 w-full px-2 justify-between hover:text-white">
                <td className="w-1/4 sm:w-auto md:p-3">{dateConvertor(pr.date)}</td>
                <td className="w-1/4 sm:w-auto md:p-3">{pr.weight}kg</td>
                <td className="w-1/4 sm:w-auto md:p-3">{pr.reps}</td>
                <td className="w-1/4 sm:w-auto md:p-3">{OneRmEstimate(pr.weight, pr.reps)}kg</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

