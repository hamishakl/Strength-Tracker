import { Link } from '@remix-run/react'

export default function PrNavbar(data) {
  const str = data.data[0]
  const strSplit = str.split(' ')
  const id = strSplit[strSplit.length - 1]
  let titleArr
  let title
  if (strSplit.length > 3) {
    titleArr = strSplit.slice(0, strSplit.length - 2)
   title = titleArr.join(" ")
  } else {
    title = strSplit[0]
  }

  return (
    <div className={'dashboard-section-navbar mt-5 sm:mt-10 pr-15'}>
      <Link to={`../dashboard/exercises/${id}`}>
        <h2 className="text-xl font-bold">{title}</h2>
      </Link>
      <Link to={`../dashboard/exercises/${id}/pr-new`}>
        <p className="" style={{'paddingRight': 68+'px'}}>New PR</p>
      </Link>
    </div>
  )
}
