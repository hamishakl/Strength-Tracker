export default function WorkoutNavbar(data) {
  return (
      <div className={'dashboard-section-navbar'}>
        <h2 className=''>{data.data[0]} - {data.data[1]}</h2>
      </div>
  )
}
