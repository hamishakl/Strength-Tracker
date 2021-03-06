export default function ProgressBar(data) {
  const name = data.data[2]
  const goal = data.data[0]
  const current = data.data[1]
  const percentage = current / goal
  const currentWidth = 350 * percentage
  return (
    <div className="progress-bar__div mt-2">
      <div className='progress-bar__goal'>
        <p>{goal}kg</p>
        <div
          className='progress-bar__current'
          style={{ width: currentWidth + "px" }}
        >
          <p>{current}kg</p>
        </div>
      </div>
    </div>
  )
}
