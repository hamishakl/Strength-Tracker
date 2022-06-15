import { Link, useLoaderData } from '@remix-run/react'
import { db } from '~/utils/db.server'
import { getUser } from '~/utils/session.server'
import Navbar from '~/components/ui/PagesNavbar'
import { dateStr } from '../../../components/MyGoals'
import PrNavbar from '../../../components/ui/PrNav'
import MyWorkouts from '../../../components/MyWorkouts'
import IndividualWorkout from '../../../components/IndividualWorkout'

export const loader = async ({ request, params }) => {
  const user = await getUser(request);
  const exercises = await db.exercise.findMany({
    where: { userId: user.id },
  })
  const workout = await db.workout.findUnique({
    where: { id: params.workoutId },
    include: {
      volume: {
        select: {
          date: true,
          exerciseId: true,
          weight: true,
          reps: true,
          sets: true,
          workoutId: true,
          id: true,
          Exercise: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
    },
  });

  return [workout, exercises]
};

export function weeksBetween(d1, d2) {
  let weeks = Math.round((d2 - d1) / (7 * 24 * 60 * 60 * 1000))
  return weeks
}

export const nth = (number) => {
  let selector

  if (number <= 0) {
    selector = 4
  } else if ((number > 3 && number < 21) || number % 10 > 3) {
    selector = 0
  } else {
    selector = number % 10
  }

  return number + ['th', 'st', 'nd', 'rd', ''][selector]
}

export function wordDate(isoDate) {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  const date = new Date(isoDate)
  const day = date.getDate()
  const month = date.getMonth()
  const dateStr = nth(day) + ' ' + months[month]
  return dateStr
}


export default function $workoutId() {
const data = useLoaderData()
const workouts = data[0]
const exercises = data[1]
  return (
    <>
      <IndividualWorkout data={[workouts, exercises]} />
    </>
  )
}
