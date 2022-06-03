import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  // getDate(label)
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        {payload[0].value === 0 ? (
          <p className="label">{`${label}: No workouts this week`}</p>
        ) : payload[0].value === 1 ? (
          <p className="label">{`${label}: ${payload[0].value} workout`}</p>
        ) : (
          <p className="label">{`${label}: ${payload[0].value} workouts`}</p>
        )}
      </div>
    )
  }

  return null
}

export default function WorkoutChart(data) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={300}
        data={data.data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line
          type="monotone"
          dataKey="Workouts Per Week"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
