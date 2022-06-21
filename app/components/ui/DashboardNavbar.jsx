import { Link } from '@remix-run/react'

export default function DashboardNavbar(user) {
    console.log(user.user.name)
  return (
    <div className={'app-body-navigation flex justifiy-between'}>
      <div className={'app-header-logo mb-4'}>
        <div className={'logo'}>
          <h1 className={'logo-title'}>
            <span className='font-extrabold text-2xl'>Strength</span>
            <span className='font-extrabold text-2xl'>Tracker</span>
          </h1>
        </div>
      </div>
      <nav className={'navigation'}>
        <Link to="/dashboard">
          <i className={'ph-browsers'}></i>
          <span>Dashboard</span>
        </Link>
        <Link to="/dashboard/prs">
          <i className={'ph-check-square'}></i>
          <span>Personal Records</span>
        </Link>
        <Link to="dashboard/workouts">
          <i className={'ph-swap'}></i>
          <span>Workouts</span>
        </Link>
        <Link to="/dashboard/exercises">
          <i className={'ph-file-text'}></i>
          <span>Exercises</span>
        </Link>
        <Link to="/dashboard/goals">
          <i className={'ph-file-text'}></i>
          <span>Goals</span>
        </Link>
        <Link to={`/dashboard/${user.user.id}/profile`}>
          <i className={'ph-globe'}></i>
          <span>Account Settings</span>
        </Link>
      </nav>
      <div className={'footer'}>
        <button>
          <form action="/auth/logout" method="POST">
            <button className="btn underline" type="submit">
              Logout {user.user.name}
            </button>
          </form>
        </button>
      </div>
    </div>
  )
}
