import React from 'react'
import { PieChart, Pie, Sector, Cell, Tooltip,} from 'recharts'

// const data = [
//   { name: 'Group A', value: 400 },
//   { name: 'Group B', value: 300 },
//   { name: 'Group C', value: 300 },
//   { name: 'Group D', value: 200 },
// ]
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function GoalChart(chartData) {
  console.log(chartData)
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  return (
    <div>
      {chartData.chartData.map((data) => {
        const progress = 100 - ((data.goal - data.current) / data.goal) * 100
        console.log(data)
        let remaining 
        if (progress >=100) {
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
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        )
      })}
    </div>
  )
}
