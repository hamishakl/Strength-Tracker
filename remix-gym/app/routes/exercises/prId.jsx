import { useLoaderData } from "remix";
import { db } from "~/utils/db.server";

// export const action = async ({ request, params }) => {
//   const form = await request.formData();
//   if (form.get("_method") === "delete") {
//     const exercise = await db.exercise.findUnique({
//       where: { id: params.exerciseId },
//     });

//     if (!exercise) {
//       throw new Error("Exercise not found");
//     }
//     await db.exercise.delete({ where: { id: params.exerciseId } });
//     return redirect("/exercises");
//   }
// };

export const loader = async ( params ) => {
  const pr = await db.pr.findUnique({ 
    where: { id: params.exerciseId },
  });
  const data = { pr };
  return data;
};

export default function Pr({id}) {
  console.log('pr id here:' + id )
  const { pr } = useLoaderData(id);
  return (
   <>
   <h1>hello</h1>
   <h1>{pr}</h1>
   </>
  );
}
