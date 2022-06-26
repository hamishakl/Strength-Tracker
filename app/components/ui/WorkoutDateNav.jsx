export default function WorkoutNavbar(data) {
  return (
      <div className={'dashboard-section-navbar mb-4'}>
        <h2 className='text-xl font-bold'>{data.data[0]} - {data.data[1]}</h2>
      </div>
  )
}
