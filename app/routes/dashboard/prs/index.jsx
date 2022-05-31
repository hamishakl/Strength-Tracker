import { Link, useLoaderData } from "remix"
import { db } from "~/utils/db.server"
import { getUser } from "~/utils/session.server"

export const loader = async ({ request }) => {
  const user = await getUser(request)
  const prs = await db.pr.findMany({
    where: { userId: user.id },
    include: {
      Exercise: {
        select: {
          title: true,
        },
      },
    },
    orderBy: {
      exerciseId: "desc",
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

export function createGroups(arr, numGroups) {
  const perGroup = Math.ceil(arr.length / numGroups);
  return new Array(numGroups)
    .fill('')
    .map((_, i) => arr.slice(i * perGroup, (i + 1) * perGroup));
}

export default function index() {
  const data = useLoaderData()
  const user = data.user
  const prData = data.prs
  const exercises = data.exercises
  let prTempArray = []

  var prs = prData.filter(pr => pr['Exercise'] != null)

  prs.map((pr, i) => {
    prTempArray.push(pr["Exercise"].title)
  })
  
  let prArray = [...new Set(prTempArray)]
  
  for (let i = 0; i < prArray.length; i++) {
    let name = prArray[i]
    prArray[i] = [name]
  }
  
  prs.map((pr) => {
    for (let i = 0; i < prArray.length; i++) {
      if (pr['Exercise'].title === prArray[i][0]) {
        let obj = {
          date: pr.createdAt,
          weight: pr.weight,
          reps: pr.reps,
          oneRm: OneRmEstimate(pr.weight, pr.reps)
        }
        prArray[i].push(obj)
      }
      
    }
  })

  return (
    <>
      <div>
        <h1>My Personal Records</h1>
        <Link to={'/dashboard/prs/new'}>New PR</Link>
        {prArray.map((pr)=> {
          // console.log(pr)
          return(
            <>
              <h5>{pr[0]}</h5>
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
                  console.log(individualPrs)
                  return(

                    <tr>
                    <td>{individualPrs.date}</td>
                    <td>{individualPrs.weight}</td>
                    <td>{individualPrs.reps}</td>
                    <td>{individualPrs.oneRm}</td>
                  </tr>
                    )
                })}
              </table>
            </>
          )
        })}
      </div>
    </>
  )
}

//got the data.. sort by exercise.. chuck into individual array.. map over that array and output the weight into a table
