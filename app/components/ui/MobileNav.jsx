import { useState } from "react"
import { Link } from "@remix-run/react"

export default function MobileNav({ children, user }) {
  // const count = data[0]
  // let [count, setPage] = useState(0);
  return (
    <div className='mobile-nav-menu__wrapper'>
      {children}
      <nav className={"navigation mobile-navigation"}>
        <Link to='/dashboard'>
          <i className={"ph-browsers"}></i>
          <span>Dashboard</span>
        </Link>
        <Link to='/dashboard/prs'>
          <i className={"ph-check-square"}></i>
          <span>Personal Records</span>
        </Link>
        <Link to='dashboard/workouts'>
          <i className={"ph-swap"}></i>
          <span>Workouts</span>
        </Link>
        <Link to='/dashboard/exercises'>
          <i className={"ph-file-text"}></i>
          <span>Exercises</span>
        </Link>
        <Link to='/dashboard/goals'>
          <i className={"ph-file-text"}></i>
          <span>Goals</span>
        </Link>
        <Link to={`/dashboard/${user.id}/profile`}>
          <i className={"ph-globe"}></i>
          <span>Account Settings</span>
        </Link>
        <footer className={"footer"}>
          <button>
            <form action='/auth/logout' method='POST'>
              <button className='btn' type='submit'>
                Logout {user.name}
              </button>
            </form>
          </button>
        </footer>
      </nav>
    </div>
  )
}
