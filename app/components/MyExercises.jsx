import { Link } from "@remix-run/react";

export const OneRmEstimate = (weight, reps) => {
  const unRounded1RM = weight * reps * 0.0333 + weight
  return reps === 1 ? weight : Math.round(unRounded1RM / 2.5, 1) * 2.5
}

export default function MyExercise({ exercises }) {
  return (
    <div className='exercise-list__div w-full'>
      {exercises.map((exercise, index) => {
        let dateSplit = exercise.updatedAt.split("")
        let dateStr = dateSplit.slice(0, 10)
        let newDate = new Date(`${dateStr.join("")}`)
        let dateArr = newDate.toDateString().split(" ")
        let date = dateArr[2] + " " + dateArr[1] + " " + dateArr[3]

        let oneRm
        let weight
        let reps
        exercise["Pr"].length === 0
          ? (oneRm = null)
          : ((weight = exercise["Pr"][0]["weight"]),
            (reps = exercise["Pr"][0]["reps"]),
            (oneRm = OneRmEstimate(weight, reps)))

        return (
          <div className={"transfer w-full flex justify-between"} key={exercise.id}>
            <dl className={"transfer-details w-full"}>
              <div>
                <Link to={`/dashboard/exercises/${exercise.id}`}>
                  {exercise.title}
                </Link>
              </div>
              <div>
                <dt>{oneRm === null ? "No PR" : oneRm + "kg"}</dt>
                <dd>Best 1RM Estimate</dd>
              </div>
              <div>
                <dt>{date}</dt>
                <dd>Last updated</dd>
              </div>
            </dl>
          </div>
        )
      })}
    </div>
  )
}
