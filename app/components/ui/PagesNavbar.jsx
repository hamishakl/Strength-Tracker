import { Link } from "@remix-run/react";

export default function Navbar(data) {
  return (
      <div className={'dashboard-section-navbar flex justify-between items-center mb-4'}>
        <h2 className='text-2xl font-bold'>{data.data[0]}</h2>
          <Link to={`/dashboard/${data.data[1]}`} className='underline'>
            <span>{data.data[2]}</span>
          </Link>
      </div>
  )
}
