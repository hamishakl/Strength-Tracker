import { Link, useLoaderData } from '@remix-run/react'
import { db } from '~/utils/db.server'
import { getUser } from '~/utils/session.server'
import Navbar from '~/components/ui/PagesNavbar'
import { dateStr } from '../../../components/MyGoals'
import PrNavbar from '../../../components/ui/PrNav'

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

  return (
    <div>
      <Navbar data={['My Personal Records', 'prs/new', 'New PR']} />

      {prArray.map((pr) => {
        return (
          <>
            <PrNavbar data={[pr[0]]} />
            <div className="pr-table">
              <table>
                <tr>
                  <td>
                    <th>Date</th>
                  </td>
                  <td>
                    <th>Weight</th>
                  </td>
                  <td>
                    <th>Reps</th>
                  </td>
                  <td>
                    <th>Estimated 1rm</th>
                  </td>
                </tr>
                {pr.map((individualPrs) => {
                  return (
                    <tr>
                      <td>
                        {individualPrs.date === undefined
                          ? null
                          : dateStr(new String(individualPrs.date))}
                      </td>
                      <td>{individualPrs.weight}</td>
                      <td>{individualPrs.reps}</td>
                      <td>{individualPrs.oneRm}</td>
                    </tr>
                  )
                })}
              </table>
            </div>
          </>
        )
      })}
    </div>
  )
}
