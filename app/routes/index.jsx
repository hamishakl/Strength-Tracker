import { redirect, useLoaderData } from 'remix'
import { getUser } from '../utils/session.server'
import WorkoutIcon from '../../public/images/hero-img.jpeg'


import cssSheet from '~/styles/app.css'
import homepageCssSheet from '~/styles/homepage.css'

export const links = () => {
  return [
    {
      rel: 'stylesheet',
      href: cssSheet,
    },
    {
      rel: 'stylesheet',
      href: homepageCssSheet,
    },
  ]
}
export const loader = async ({ request }) => {
  const user = await getUser(request)
  const data = {
    user,
  }

  if (user) {
    return redirect('/dashboard')
  }

  return data
}

function Home() {
  return (
    <div className='layout'>
      <container className='hero'>
        <div className='hero-contents__div'>
          <h1 className='hero__logo'>Measure progress</h1>
          <p className='hero__copy'>Stay on track with your fitness goals. Create a profile and track your strength progress to meet individual goals and challenges.</p>
          <div className='hero-buttons__wrapper'>
            <button className='hero__buttons register'>Register</button>
            <button className='hero__buttons login'>Login</button>
          </div>
        </div>
        <img src={WorkoutIcon} alt="" />
      </container>
      <container className='intro'>
          <p id='test'>
            Log your workouts and reach new PRs with Strength Tracker. With just a few clicks, track personal records from past workouts, set goals for future ones, monitor exercise progress, explore new exercises—all on one screen.
          </p>
            <img src="" alt="" />
      </container>
    </div>
  )
}

export default Home
