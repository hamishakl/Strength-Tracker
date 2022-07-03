import { useLoaderData } from '@remix-run/react'
import MyGoals from '~/components/MyGoals'
import { db } from '~/utils/db.server'
import { getUser } from '~/utils/session.server'
import NewGoal from './new'
import Navbar from '../../../components/ui/PagesNavbar'
import GoalChart from '../../../components/ui/GoalChart'
import { OneRmEstimate } from '../prs'
import ProgressBar from '../../../components/ui/ProgressBar'
import { NestedError } from '../../../components/error handling/NestedError'

export const loader = async ({ request }) => {
  const user = await getUser(request)
  const goals = await db.goals.findMany({
    where: { userId: user.id },
    include: {
      Exercise: {
        include: {
          Pr: {
            select: {
              weight: true,
              reps: true,
            },
            orderBy: {
              createdAt: 'asc',
            },
            take: 1,
          },
        },
      },
    },
  })

  const exercises = await db.exercise.findMany({
    where: { userId: user.id },
  })

  const data = { user, goals, exercises }

  return data
}

export function ErrorBoundary(error) {
  console.error(error)
  return <NestedError />
}

export default function index() {
  const data = useLoaderData()
  const user = data.user
  const goals = data.goals
  const exercises = data.exercises
  const newGoalData = [user, exercises]
  let achievedArr = []
  for (let i = 0; i < goals.length; i++) {
    if (goals[i].achieved === true) {
      achievedArr.push(i)
    }
  }
  const notAchieved = [goals, false]
  const achieved = [goals, true]
  let goalData = []
  let noPrGoal = []
  goals.map((goal) => {
    if (goal.achieved === false && goal.Exercise.Pr.length !== 0) {
      let weight = goal.Exercise.Pr[0].weight
      let reps = goal.Exercise.Pr[0].reps
      let obj = {
        name: goal.Exercise.title,
        goal: goal.weight,
        current: OneRmEstimate(weight, reps),
        goalData: [goal],
      }
      goalData.push(obj)
    } else if (goal.achieved === false && goal.Exercise.Pr.length === 0) {
      let obj = {
        name: goal.Exercise.title,
        goal: goal.weight,
        current: 0,
        goalData: [goal],
      }
      noPrGoal.push(obj)
    }
  })

  return (
    <div className="">
      <div className="">
        <Navbar data={['My Goals', 'goals/new', 'New Goal']} />
        {goalData.length === 0
          ? noPrGoal.map((data) => {
            let goal = data.goal
            let current = data.current
            let name = data.name
              return (
                <>
                  <MyGoals data={[data.goalData, false]} />
                  <ProgressBar data={[goal, current]} />
                </>
              )
            })
          : goalData.map((data) => {
              let goal = data.goal
              let current = data.current
              let name = data.name
              return (
                <>
                  <MyGoals data={[data.goalData, false]} />
                  <ProgressBar data={[goal, current, name]} />
                </>
              )
            })}
        {achievedArr.length != 0 ? (
          <div className="mt-4">
            <h2 className="mb-2 font-bold underline-offset-1 underline">
              Goals I've accomplished so far:
            </h2>
            <MyGoals data={achieved} />
          </div>
        ) : null}
      </div>
      {/* <div className="goal-pie-chart__wrapper"></div> */}
    </div>
  )
}
