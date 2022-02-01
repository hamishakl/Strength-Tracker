import { Link, redirect, useActionData, json } from "remix";
import { db } from "~/utils/db.server";

function validateTitle(title) {
  if (typeof title !== "string" || title.length < 2) {
    return "Title should be atleast 2 characters long";
  }
}

function validateTitle(body) {
  if (typeof title !== "string" || title.length < 10) {
    return "Body should be atleast 2 characters long";
  }
}

function badRequest(data) {
  return json(data, {status: 400})
}

export const action = async ({ request }) => {
  const form = await request.formData();
  const title = form.get("title");
  const body = form.get("body");

  const fields = { title, body };

  const fieldErrors = {
    title: validateTitle(title),
    body: validateTitle(title),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    console.log(fieldErrors);
    return badRequest({ fieldErrors, fields });
  }

  const exercise = await db.exercise.create({
    data: fields,
  });

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
                <input type="text" name="title" id="title" defaultValue={actionData?.fields?.title}/>
            <div className="error">
              <p>
                {actionData?.fieldErrors?.title &&
                  actionData?.fieldErrors?.title}
              </p>
            </div>
          </div>
          <div className="form-control">
            <label htmlFor="body">Exercise Body</label>
            <input type="text" name="body" id="body" defaultValue={actionData?.fields?.title} />
            <div className="error">
              <p>
                {actionData?.fieldErrors?.body &&
                  actionData?.fieldErrors?.body}
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

export function ErrorBoundary({ error }) {
  console.log(error);
  return (
    <Document>
      <Layout>
        <h1>Error</h1>
        <pre>{error.message}</pre>
      </Layout>
    </Document>
  );
}

export default NewExercise;
