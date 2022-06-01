import { Link } from "@remix-run/react";

export default function Navbar(data) {
  return (
      <div className={'dashboard-section-navbar'}>
        <h2 className=''>{data.data[0]}</h2>
        <div className='dashboard-section-navbar__links'>
          <Link to={`/dashboard/${data.data[1]}`} className=''>
            <span>New {data.data[2]}</span>
          </Link>
        </div>
      </div>
  )
}
