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

import { useState, useEffect } from 'react';

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

export function useWindowDimensions() {
  
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}


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
  let screenHeight 
  let screenWidth
  if (typeof window !== "undefined") {
    // Client-side-only code
   screenWidth = useWindowDimensions().width;
   screenHeight = useWindowDimensions().height;
   
   return (
    <ResponsiveContainer width={'100%' } height={'95%'} className="chart__container">
      <LineChart
        width={screenWidth}
        height={screenHeight}
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
        {/* <Legend /> */}
        <Line
          type="monotone"
          dataKey="Workouts Per Week"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
          />
      </LineChart>
    </ResponsiveContainer>
  )
} else {
  return (
    <>hello</>
  )
}
}
