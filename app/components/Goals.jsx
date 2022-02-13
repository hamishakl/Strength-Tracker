import React from "react";
import { Link, useLoaderData } from "remix";

const findPr = (prs, exercise) => {
  for (let i = 0; i < prs.length; i++) {
    if (prs[i].exerciseId == exercise.id) {
      return prs[i];
    } else {
      return null;
    }
  }
};

const calcProgress = (exercise, latestPr) => {
  const goal = exercise.goal;
  const current = latestPr.weight;
  const percentage = (current / goal) * 100;
  if (exercise.goal == null) {
    return 0
  } else {
    console.log(percentage.toFixed(2))
    return percentage.toFixed(2)
  }
};

export default function Recommendation({ exercise, prs }) {
  const latestPr = findPr(prs, exercise);
  let percentage 
  latestPr === null ? percentage = 0 : percentage = calcProgress(exercise, latestPr)
  

  return (
    <div className="container">
      <div className="card" style={{ flex: "0 0 33.333333%" }}>
        <div className="card-body">
          <h6 className="card-subtitle mb-2 text-muted"></h6>
          {exercise.goal === null ? (
            <p>no goal</p>
          ) : (
            <p>Progress towards your goal of {exercise.goal}kg</p>
          )}
          <div class="progress">
            <div
              class="progress-bar"
              role="progressbar"
              style={{ width: `${percentage}%` }}
              aria-valuenow="25"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {percentage}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
