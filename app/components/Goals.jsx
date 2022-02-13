import React from "react";
import { Link } from "remix";

export default function Recommendation({ exercises }) {
  console.log(exercises);
  return (
    <div className="container">
      <div
        key={exercises.id}
        className="card"
        style={{ flex: "0 0 33.333333%" }}
      >
        <div className="card-body" key={exercises.id}>
          <h6 className="card-subtitle mb-2 text-muted"></h6>
          <p className="card-text">{exercises.body}</p>
          <div class="progress">
            <div
              class="progress-bar"
              role="progressbar"
              style={{ width: "25%" }}
              aria-valuenow="25"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              25%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
