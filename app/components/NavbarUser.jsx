import { Link } from "@remix-run/react";

import UserCard from './UserCard'

export default function NavbarUser(data) {
  const children = data.data[0].children
  const user = data.data[1]

  return (
    <container className=''>
      <nav className=''>
        <div className=''>
          <Link className='' to='/dashboard'>
            Strength Tracker
          </Link>
          <Link className='' to='/dashboard/newPr'>
            Set a new PR
          </Link>

          <Link className='' to='/dashboard/newGoal'>
            Set a new goal
          </Link>
          <Link className='' to='/dashboard/newWorkout'>
            record a new workout
          </Link>
        </div>
        <UserCard user={user} />
      </nav>
      {children}
    </container>
  )
}
