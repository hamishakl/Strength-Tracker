import { Link } from 'remix'
// import Goals from './Goals'
// import { OneRmEstimate } from '../routes/dashboard/$exerciseId'

export const OneRmEstimate = (weight, reps) => {
  const unRounded1RM = weight * reps * 0.0333 + weight
  return reps === 1 ? weight : Math.round(unRounded1RM / 2.5, 1) * 2.5
}

export default function MyExercise({ exercises, prs }) {
  return (
    <>
      {exercises.map((exercise) => {
        let oneRm
        let weight
        let reps
        exercise['Pr'].length === 0 ? oneRm = 'no' : (
         weight = exercise['Pr'][0]['weight'],
         reps = exercise['Pr'][0]['reps'],
          oneRm = OneRmEstimate(weight, reps)
        )
        
        return (
          <>
            <div class="transfer" key={exercise.id}>
              <dl class="transfer-details">
                <div>
                  <dt>{exercise.title}</dt>
                </div>
                <div>
                  <dt>{oneRm}kg</dt>
                  <dd>Best 1RM Estimate</dd>
                </div>
                <div>
                  <dt>{exercise.updatedAt}</dt>
                  <dd>Last updated</dd>
                </div>
              </dl>
            </div>
          </>
        )

      })}
    </>
  )
}
