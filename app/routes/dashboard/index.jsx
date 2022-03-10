import { Link, useLoaderData } from 'remix';
import { db } from '~/utils/db.server';
import MyExercise from '../../components/MyExercises';
import Goals from '../../components/Goals';

import { getUser } from '~/utils/session.server';

export const loader = async ({ request }) => {
  const user = await getUser(request);

  const exercises = {
    exercises: await db.exercise.findMany({
      where: {
        userId: {
          equals: `${user.id}`,
        },
      },
      take: 20,
      orderBy: { createdAt: 'desc' },
    }),
  };
  const prs = {
    prs: await db.pr.findMany({
      where: {
        userId: {
          equals: `${user.id}`,
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
  };

  const data = { exercises, prs };

  return data;
};

function ExerciseItems() {
  const data = useLoaderData();
  return (
    <div className='h-screen w-screen max-w-none max-h-none bg-space-cadet p-0 m-0 text-white'>
      <div className='flex w-screen items-center justify-between'>
        <h1 className='text-3xl font-bold'>My Exercises</h1>
        <Link to='/dashboard/new' className='underline-offset-4'>
          <span className='underline-offset-4 underline opacity-80 hover:opacity-100 ease-linear duration-100 hover:underline-offset-2'>New Exercise</span>
        </Link>
      </div>
      <MyExercise data={data} />
    </div>
  );
}

export default ExerciseItems;
