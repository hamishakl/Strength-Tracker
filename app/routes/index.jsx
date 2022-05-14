import styles from '~/styles/home.css'
import { redirect, useLoaderData } from 'remix'
import { getUser } from '../utils/session.server'

export function links() {
  return [{ rel: 'stylesheet', href: styles }]
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
    <div className=''>
      <h1>Strength Tracker</h1>
      <p>Track your personal records with ease</p>
    </div>
  )
}

export default Home
