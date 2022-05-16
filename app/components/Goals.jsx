// import { Link } from "remix";
// import { OneRmEstimate } from "../routes/dashboard/$exerciseId";

// export const findPr = (prs, exercise) => {
//   let arr = [];
//   for (let i = 0; i < prs.length; i++) {
//     if (prs[i].exerciseId == exercise.id) {
//       arr.push(prs[i]);
//     }
//   }
//   return arr[0];
// };

// const calcProgress = (exercise, latestPr) => {
//   const goal = exercise.goal;
//   const current = OneRmEstimate(latestPr.weight, latestPr.reps);
//   const percentage = (current / goal) * 100;
//   if (exercise.goal == null) {
//     return 0;
//   } else {
//     return percentage.toFixed(2);
//   }
// };

// export default function Recommendation({ exercise, prs }) {
//   const latestPr = findPr(prs, exercise);
//   let percentage;
//   latestPr === null
//     ? (percentage = 0)
//     : (percentage = calcProgress(exercise, latestPr));
//   const currentPr = parseInt(OneRmEstimate(latestPr.weight, latestPr.reps).toFixed(2));
 
//   return (
//     <>
//       {exercise.goal === null ? (
//         <p>No goal set</p>
//       ) : (
//         <div className="">
//           <div className="" style={{ flex: "0 0 33.333333%" }}>
//             <div className="">
//               {currentPr > exercise.goal ? (
//                 <>
//                   <p>
//                     Current estimated PR: {currentPr}kg<br></br>You achieved
//                     your goal of {exercise.goal}kg!
//                   </p>
//                   <Link to={`/dashboard/${exercise.id}/new-goal`}>Set a new goal?</Link>
//                 </>
//               ) : (
//                 <p>
//                   Current estimated PR: {currentPr}kg<br></br>Your progress
//                   towards {exercise.goal}kg:
//                 </p>
//               )}
//               <div className="">
//                 <div
//                   className=""
//                   role="progressbar"
//                   style={{ width: `${percentage}%` }}
//                   aria-valuenow="25"
//                   aria-valuemin="0"
//                   aria-valuemax="100"
//                 >
//                   {percentage}%
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }
