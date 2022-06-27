import { Link, useLoaderData } from '@remix-run/react'
import { db } from '~/utils/db.server'
import { getUser } from '~/utils/session.server'
import Navbar from '~/components/ui/PagesNavbar'
import { dateStr } from '../../../components/MyGoals'
import PrNavbar from '../../../components/ui/PrNav'
import { NestedError } from '../../../components/error handling/NestedError'

export const loader = async ({ request }) => {
  const user = await getUser(request)
  const prs = await db.pr.findMany({
    where: { userId: user.id },
    include: {
      Exercise: {
        select: {
          title: true,
          id: true,
        },
      },
    },
    orderBy: {
      exerciseId: 'asc',
    },
  })
  const exercises = await db.exercise.findMany({
    where: { userId: user.id },
  })
  const data = { user, prs, exercises }

  return data
}

export function ErrorBoundary(error) {
  console.error(error)
  return <NestedError />
}
export const OneRmEstimate = (weight, reps) => {
  const unRounded1RM = weight * reps * 0.0333 + weight
  return reps === 1 ? weight : Math.round(unRounded1RM / 2.5, 1) * 2.5
}

export default function index() {
  const data = useLoaderData()
  const prData = data.prs
  let prTempArray = []

  let prs = prData.filter((pr) => pr['Exercise'] != null)
  prs.map((pr, i) => {
    prTempArray.push(pr['Exercise'].title + ' ID: ' + pr['Exercise'].id)
  })

  let prArray = [...new Set(prTempArray)]

  for (let i = 0; i < prArray.length; i++) {
    let name = prArray[i]
    prArray[i] = [name]
  }

  prs.map((pr) => {
    for (let i = 0; i < prArray.length; i++) {
      let strSplit = prArray[i][0].split(' ')
      let titleArr
      let title
      if (strSplit.length > 3) {
        titleArr = strSplit.slice(0, strSplit.length - 2)
        title = titleArr.join(' ')
      } else {
        title = strSplit[0]
      }

      if (pr['Exercise'].title === title) {
        let obj = {
          date: pr.createdAt,
          weight: pr.weight,
          reps: pr.reps,
          oneRm: OneRmEstimate(pr.weight, pr.reps),
        }
        prArray[i].push(obj)
      }
    }
  })
  //

  return (
    <div>
      <div className="mt-2">
      <Navbar data={['My Personal Records', 'prs/new', 'New PR']} />
      </div>

      {prArray.map((pr) => {
        return (
          <>
            <PrNavbar data={[pr[0]]} />
            <div className="overflow-scroll h-auto max-h-1/2 pr-table__div">
              <table className="w-full flex flex-row flex-no-wrap rounded-lg sm:shadow-lg my-5">
                <thead className="text-white">
                  <tr className="bg-neutral-500	3 flex flex-row flex-no wrap sm:table-row sm:rounded-none mb-2 sm:mb-0 justify-between">
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Weight</th>
                    <th className="p-3 text-left">Reps</th>
                    <th className="p-3 text-left">Estimated 1rm</th>
                  </tr>
                </thead>
                <tbody className="flex-1 sm:flex-none">
                  {pr.map((individualPrs) => {
                    return individualPrs.weight === undefined ? null : (
                      <tr className="flex flex-row flex-no wrap sm:table-row sm:mb-0 hover:bg-neutral-500 sm:p-3 w-full px-2 justify-between hover:text-white">
                        <td className="w-1/4 sm:w-auto md:p-3">
                          {individualPrs.date === undefined
                            ? null
                            : dateStr(new String(individualPrs.date))}
                        </td>
                        <td className="w-1/4 sm:w-auto   md:p-3">{individualPrs.weight}kg</td>
                        <td className="w-1/4 sm:w-auto  md:p-3">{individualPrs.reps}</td>
                        <td className="w-1/4 sm:w-auto md:p-3">{individualPrs.oneRm}kg</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </>
        )
      })}
    </div>
  )
}
