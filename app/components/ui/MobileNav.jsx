import { useState } from "react"
import { Link } from "@remix-run/react"

export default function MobileNav({ children, user, props }) {
  return (
    <div className='mobile-nav-menu__wrapper '>
      {children}
      <nav className={"navigation mobile-navigation"}>
        <Link to='/dashboard' className="" onClick={() => props.onClick()}>
          <i className={"ph-browsers"}></i>
          <span>Dashboard</span>
        </Link>
        <Link to='/dashboard/prs' onClick={() => props.onClick()}>
          <i className={"ph-check-square"}></i>
          <span>Personal Records</span>
        </Link>
        <Link to='dashboard/workouts' onClick={() => props.onClick()}>
          <i className={"ph-swap"}></i>
          <span>Workouts</span>
        </Link>
        <Link to='/dashboard/exercises' onClick={() => props.onClick()}>
          <i className={"ph-file-text"}></i>
          <span>Exercises</span>
        </Link>
        <Link to='/dashboard/goals' onClick={() => props.onClick()}>
          <i className={"ph-file-text"}></i>
          <span>Goals</span>
        </Link>
        <Link to={`/dashboard/${user.id}/profile`} onClick={() => props.onClick()}>
          <i className={"ph-globe"}></i>
          <span>Account Settings</span>
        </Link>
        <footer className={"footer"}>
            <form action='/auth/logout' method='POST'>
              <button className='btn' type='submit' onClick={() => props.onClick()}>
                Logout {user.name}
              </button>
            </form>
        </footer>
      </nav>
    </div>
  )
}
