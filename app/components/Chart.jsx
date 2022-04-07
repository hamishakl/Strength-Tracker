import { useEffect } from 'react';
import React from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const dateConvertor = (prDate) => {
  return new Date(prDate).toDateString();
};

export const OneRmEstimate = (weight, reps) => {
  const unRounded1RM = weight * reps * 0.0333 + weight;
  return reps === 1 ? weight : Math.round(unRounded1RM / 2.5, 1) * 2.5;
};

export default function Chart(pr) {
  const data = pr.pr.map((item) => {
    const container = {};
    container.name = dateConvertor(item.createdAt);
    container.uv = OneRmEstimate(item.weight, item.reps);
    return container;
  });

  return (
    <>
       {/* <ResponsiveContainer width="100%" height="100%"> */}
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
        </LineChart>
      {/* </ResponsiveContainer> */}
    </>
  );
}
