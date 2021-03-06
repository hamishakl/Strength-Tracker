import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server"
import { getUser } from "~/utils/session.server"
import MyExercise from '../../../components/MyExercises'
import Navbar from '~/components/ui/PagesNavbar'
import { NestedError } from "../../../components/error handling/NestedError";

export const loader = async ({ request }) => {
  const user = await getUser(request)
  const exercises = {
    exercises: await db.exercise.findMany({
      where: {
        userId: {
          equals: `${user.id}`,
        },
      },
      // orderBy: { createdAt: 'desc' },
      include: {
        Pr: {
          select: {
            weight: true,
            reps: true,
          },
          orderBy: { weight: 'desc' },
        },
      },
      orderBy: { updatedAt: 'desc' },
    }),
  }

  return exercises
}

export function ErrorBoundary(error) {
  console.error(error);
  return (
    <NestedError/>
  )
}

export default function index() {
  const data = useLoaderData()
  return (
    <>
      <Navbar data={['My Exercises', 'exercises/new', 'New Exercise']} />
      <MyExercise exercises={data['exercises']} />
    </>
  )
}