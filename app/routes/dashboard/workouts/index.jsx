import React from 'react'
import Navbar from '~/components/ui/PagesNavbar'

import { Link, useLoaderData } from '@remix-run/react'
import { db } from '~/utils/db.server'

import { getUser } from '~/utils/session.server'
import MyWorkouts from '../../../components/MyWorkouts'

import { getSunday, getEndOfWeek } from '../index'
import WorkoutNavbar from '../../../components/ui/WorkoutDateNav'

export const loader = async ({ request }) => {
  const user = await getUser(request)

  const workouts = {
    workouts: await db.workout.findMany({
      where: {
        userId: {
          equals: `${user.id}`,
        },
      },
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
      orderBy: { date: 'desc' },
    }),
  }

  return [workouts, user]
}

export function weeksBetween(d1, d2) {
  let weeks = Math.round((d2 - d1) / (7 * 24 * 60 * 60 * 1000))
  return weeks
}

export const nth = (number) => {
  let selector;

  if (number <= 0) {
    selector = 4;
  } else if ((number > 3 && number < 21) || number % 10 > 3) {
    selector = 0;
  } else {
    selector = number % 10;
  }

  return number + ['th', 'st', 'nd', 'rd', ''][selector];
};

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
  const year = date.getFullYear()
  const month = date.getMonth()
  console.log(month)
  const dateStr = nth(day) + ' ' + months[month]
  return dateStr
}

export default function index() {
  const data = useLoaderData()
  const workouts = data[0].workouts

  const userDate = data[1].createdAt
  const today = new Date()
  let weeksArray = []
  let weeks = weeksBetween(new Date(userDate), today)

  for (let i = 0; i < weeks + 2; i++) {
    let newWeek = getEndOfWeek(userDate, i * 7)
    weeksArray.push(newWeek)
  }

  weeksArray.reverse()

  return (
    <>
      <Navbar data={['My Workouts', 'workouts/new', 'New Workout']} />
      {weeksArray.map((week) => {
        let startOfWeek = getEndOfWeek(week, 0).toISOString()
        let endOfWeek = getEndOfWeek(week, 6).toISOString()
        let workoutArray = []
        for (let i = 0; i < workouts.length; i++) {
          if (workouts[i].date > startOfWeek && workouts[i].date < endOfWeek) {
            workoutArray.push(workouts[i])
          }
        }
        return (
          <div>
            {workoutArray.length === 0 ? null : (
              <>
                <WorkoutNavbar
                  data={[wordDate(startOfWeek), wordDate(endOfWeek)]}
                />
                <MyWorkouts data={workoutArray} />
              </>
            )}
          </div>
        )
      })}
    </>
  )
}
