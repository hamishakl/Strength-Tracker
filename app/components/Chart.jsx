import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'

const dateConvertor = (prDate, i) => {
  let date = new Date(prDate).toDateString()
  let dateArr = date.split(' ')
  dateArr.shift()
  dateArr.unshift(`#${i}`)

  return dateArr.join()
}

export const OneRmEstimate = (weight, reps) => {
  const unRounded1RM = weight * reps * 0.0333 + weight
  return reps === 1 ? weight : Math.round(unRounded1RM / 2.5, 1) * 2.5
}

export default function Chart(pr) {
  const container = {}
  let prArray = []
  const prLength = pr.pr.length
  const prObj = pr.pr
  for (let i = prLength - 1; i >= 0; i--) {
    container[i] = {}
    container[i].date = dateConvertor(prObj[i]['createdAt'], i)
    container[i]['1RM'] = OneRmEstimate(prObj[i]['weight'], prObj[i]['reps'])
    prArray.push(container[i])
  }
  return (
    <>
      <LineChart
        width={800}
        height={300}
        data={prArray}
        margin={{
          top: 5,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='date' />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type='monotone' dataKey='1RM' stroke='#82ca9d' />
      </LineChart>
    </>
  )
}
