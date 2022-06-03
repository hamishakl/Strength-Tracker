import React from "react";
import Navbar from "~/components/ui/PagesNavbar";

import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

import { getUser } from "~/utils/session.server";
import MyWorkouts from "../../../components/MyWorkouts";

import { getSunday, getEndOfWeek } from "../index";

export const loader = async ({ request }) => {
  const user = await getUser(request);

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
      orderBy: { date: "desc" },
    }),
  };

  return [workouts, user];
};

//test

export function weeksBetween(d1, d2) {
  let weeks = Math.round((d2 - d1) / (7 * 24 * 60 * 60 * 1000));
  return weeks;
}

export default function index() {
  const data = useLoaderData();
  const workouts = data[0].workouts;

  const userDate = data[1].createdAt;
  const today = new Date();
  let weeksArray = [];
  let weeks = weeksBetween(new Date(userDate), today);

  for (let i = 0; i < weeks + 2; i++) {
    let newWeek = getEndOfWeek(userDate, i * 7);
    weeksArray.push(newWeek);
  }

  weeksArray.reverse()

  return (
    <>
      <Navbar data={["My Workouts", "workouts/new", "New Workout"]} />
      {weeksArray.map((week) => {
        let startOfWeek = getEndOfWeek(week, 0).toISOString();
        let endOfWeek = getEndOfWeek(week, 6).toISOString();
        let workoutArray = [];
        for (let i = 0; i < workouts.length; i++) {
          if (workouts[i].date > startOfWeek && workouts[i].date < endOfWeek) {
            workoutArray.push(workouts[i]);
          }
        }
        return (
          <div>
            <h4>{new String(week)}</h4>
            <div>
              <MyWorkouts data={workoutArray} />
            </div>
          </div>
        );
      })}
    </>
  );
}
