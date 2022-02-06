import { Link, redirect, useActionData, json } from "remix";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";

function validateTitle(title) {
  if (typeof title !== "string" || title.length < 2) {
    return "Title should be atleast 2 characters long";
  }
}

function validateBody(body) {
  if (typeof body !== "string") {
    return "Body should be atleast 2 characters long";
  }
}

function badRequest(data) {
  return json(data, { status: 400 });
}

export const action = async ({ request }) => {
  const form = await request.formData();
  const title = form.get("title");
  const body = form.get("body");

  const user = await getUser(request);

  const fields = { title, body };

  const fieldErrors = {
    title: validateTitle(title),
    body: validateBody(body),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    console.log(fieldErrors);
    return badRequest({ fieldErrors, fields });
  }

  const exercise = await db.exercise.create({
    data: { ...fields, userId: user.id },
  });

  // const exercise = await db.exercise.create({ data: data })


  return redirect(`/exercises/${exercise.id}`);
};

function NewExercise() {
  const actionData = useActionData();

  return (
    <>
      <div className="page-header">
        <h1>New exercise</h1>
        <Link to="/exercises" className="btn btn-reverse">
          Back
        </Link>
      </div>
      <div className="page-content">
        <form method="POST">
          <div className="form-control">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              defaultValue={actionData?.fields?.title}
            />
            <div className="error">
              <p>
                {actionData?.fieldErrors?.title &&
                  actionData?.fieldErrors?.title}
              </p>
            </div>
          </div>
          <div className="form-control">
            <label htmlFor="body">Exercise Body</label>
            <input
              type="text"
              name="body"
              id="body"
              defaultValue={actionData?.fields?.title}
            />
            <div className="error">
              <p>
                {actionData?.fieldErrors?.body && actionData?.fieldErrors?.body}
              </p>
            </div>
          </div>
          <button type="submit" className="btn btn-block">
            Add exercise
          </button>
        </form>
      </div>
    </>
  );
}

// export function ErrorBoundary({ error }) {
//   console.log(error);
//   return (
//     <Document>
//       <Layout>
//         <h1>Error</h1>
//         <pre>{error.message}</pre>
//       </Layout>
//     </Document>
//   );
// }

export default NewExercise;

// import { Link, redirect, useActionData, json } from 'remix'
// import { db } from '~/utils/db.server'
// import { getUser } from '~/utils/session.server'

// function validateTitle(title) {
//   if (typeof title !== 'string' || title.length < 3) {
//     return 'Title must be at least 3 characters'
//   }
// }

// function validateBody(body) {
//   if (typeof body !== 'string' || body.length < 10) {
//     return 'Body must be at least 10 characters'
//   }
// }

// function badRequest(data) {
//   return json(data, { status: 400 })
// }

// export const action = async ({ request }) => {
//   const form = await request.formData()
//   const title = form.get('title')
//   const body = form.get('body')
//   const user = await getUser(request)

//   const fields = { title, body }

//   const fieldErrors = {
//     title: validateTitle(title),
//     body: validateBody(body),
//   }

//   if (Object.values(fieldErrors).some(Boolean)) {
//     console.log(fieldErrors)
//     return badRequest({ fieldErrors, fields })
//   }

//   const exercise = await db.exercise.create({ data: { ...fields, userId: user.id } })

//   return redirect(`/exercises/${exercise.id}`)
// }

// function NewExericse() {
//   const actionData = useActionData()
//   return (
//     <>
//       <div className='page-header'>
//         <h1>New exercise</h1>
//         <Link to='/exercises' className='btn btn-reverse'>
//           Back
//         </Link>
//       </div>

//       <div className='page-content'>
//         <form method='exercise'>
//           <div className='form-control'>
//             <label htmlFor='title'>Title</label>
//             <input
//               type='text'
//               name='title'
//               id='title'
//               defaultValue={actionData?.fields?.title}
//             />
//             <div className='error'>
//               {actionData?.fieldErrors?.title ? (
//                 <p
//                   className='form-validation-error'
//                   role='alert'
//                   id='title-error'
//                 >
//                   {actionData.fieldErrors.title}
//                 </p>
//               ) : null}
//             </div>
//           </div>
//           <div className='form-control'>
//             <label htmlFor='body'>exercise Body</label>
//             <textarea
//               name='body'
//               id='body'
//               defaultValue={actionData?.fields?.body}
//             />
//             <div className='error'>
//               {actionData?.fieldErrors?.body ? (
//                 <p
//                   className='form-validation-error'
//                   role='alert'
//                   id='body-error'
//                 >
//                   {actionData.fieldErrors.body}
//                 </p>
//               ) : null}
//             </div>
//           </div>
//           <button type='submit' className='btn btn-block'>
//             Add exercise
//           </button>
//         </form>
//       </div>
//     </>
//   )
// }

// export default NewExericseddd