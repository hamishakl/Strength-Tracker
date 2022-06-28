import { Link } from "@remix-run/react";

export const OneRmEstimate = (weight, reps) => {
  const unRounded1RM = weight * reps * 0.0333 + weight
  return reps === 1 ? weight : Math.round(unRounded1RM / 2.5, 1) * 2.5
}

export default function MyExercise({ exercises }) {
  return (
    <div className=' exercise-list__div w-full'>
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
          <div className={"transfer w-full flex justify-between border-t py-2"} key={exercise.id}>
            <dl className={"transfer-details w-full flex justify-between mx-5"}>
              <div className="text-left">
                <Link to={`/dashboard/exercises/${exercise.id}`}>
                  {exercise.title}
                </Link>
              </div>
              <div className="text-center">
                <dt>{oneRm === null ? "No PR" : oneRm + "kg"}</dt>
                <dd>Best 1RM Estimate</dd>
              </div>
              <div className="text-right">
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
