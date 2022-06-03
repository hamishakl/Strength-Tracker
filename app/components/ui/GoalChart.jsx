import React from 'react'
import { PieChart, Pie, Sector, Cell, Tooltip } from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
        <div className="custom-tooltip">
        {payload[0].name === 'Remaining' ? (
            <p>{Math.round(payload[0].value)}kg to go</p>
        ) : (
            <p>{Math.round(payload[0].value)}kg so far</p>
        )}     
        </div>
    )
  }

  return null
}

export default function GoalChart(chartData) {
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }
  return (
    <div className={'goal-pie-chart__wrapper'}>
      {chartData.chartData.map((data) => {
        const progress = 100 - ((data.goal - data.current) / data.goal) * 100
        let remaining
        if (progress >= 100) {
          remaining = 0
        } else {
          remaining = 100 - progress
        }
        const dataArray = [
          {
            name: data.name,
            value: progress,
          },
          {
            name: 'Remaining',
            value: remaining,
          },
        ]
        return (
            <div className='goal-pie-chart__div'>
            <h3>{data.name}</h3>
          <PieChart width={400} height={400}>
            <Pie
              data={dataArray}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              >
              {dataArray.map((entry, index) => (
                  <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  />
                  ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
                  </div>
        )
      })}
    </div>
  )
}
