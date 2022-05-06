import { Link, useLoaderData } from 'remix';
import { db } from '~/utils/db.server';
import MyExercise from '../../components/MyExercises';

import { getUser } from '~/utils/session.server';
import MyWorkouts from '~/components/MyWorkouts';

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
  const workouts = {
    workouts: await db.workout.findMany({
      where: {
        userId: {
          equals: `${user.id}`,
        },
      },
      include: {
        date: true,
      },
      include: {
            volume: {
              select: {
                exerciseId: true,
                weight: true,
                reps: true, 
                sets: true,
                workoutId: true,
                id: true,
              }
          },
        },
        orderBy: { createdAt: 'desc' },
      },
        ),
  };

  
  const data = { exercises, prs, workouts};

  return data;
};

function ExerciseItems() {
  const data = useLoaderData();
  const workoutData = data.workouts['workouts']
  return (
    <div className='h-screen w-screen max-w-none max-h-none bg-white p-0 m-0 text-black'>
      <div className='flex w-screen items-center justify-between'>
        <h1 className='text-3xl font-bold'>My Exercises</h1>
        <Link to='/dashboard/new' className='underline-offset-4'>
          <span className='underline-offset-4 underline opacity-80 hover:opacity-100 ease-linear duration-100 hover:underline-offset-2'>New Exercise</span>
        </Link>
      </div>
      <MyExercise exercises={data.exercises['exercises']} prs={data.prs['prs']} />
        <MyWorkouts data={workoutData}/>
      <div>
      </div>
    </div>
  );
}

export default ExerciseItems;
