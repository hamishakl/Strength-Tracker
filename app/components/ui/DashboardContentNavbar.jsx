import { Link } from "@remix-run/react";

export default function Navbar(data) {
  return (
      <div className={'dashboard-section-navbar'}>
        <h2 className='text-xl font-bold'>{data.data[0]}</h2>
        <div className='dashboard-section-navbar__links'>
          <Link to={`/dashboard/${data.data[1]}`} className='underline'>
            <span>New</span>
          </Link>
          <Link to={`/dashboard/${data.data[2]}`} className='underline'>View all</Link>
        </div>
      </div>
  )
}
