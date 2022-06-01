import { json, redirect } from "@remix-run/node"
import { Link, useActionData, useLoaderData } from "@remix-run/react"
import { db } from "~/utils/db.server"
import { getUser } from "~/utils/session.server"
import Navbar from "../../../components/ui/PagesNavbar"

function validateTitle(title) {
  if (typeof title !== "string" || title.length < 2) {
    return "Title should be atleast 2 characters long"
  }
}

function badRequest(data) {
  return json(data, { status: 400 })
}

export const action = async ({ request }) => {
  const form = await request.formData()
  const title = form.get("title")

  const user = await getUser(request)

  const fields = { title }

  const fieldErrors = {
    title: validateTitle(title),
  }

  if (Object.values(fieldErrors).some(Boolean)) {
    console.log(fieldErrors)
    return badRequest({ fieldErrors, fields })
  }

  const exercise = await db.exercise.create({
    data: { ...fields, userId: user.id },
  })

  return redirect(`/dashboard/exercises/${exercise.id}`)
}

function NewExercise() {
  const actionData = useActionData()

  return (
    <>
      <div className='page-header'>
        <Navbar data={["New Exercise", "exercises", "Back"]} />
        <Link to='/dashboard' className=''>
          Back
        </Link>
      </div>
      <div className='page-content'>
        <form method='POST'>
          <div className=''>
            <label htmlFor='title'>Title</label>
            <input
              type='text'
              name='title'
              id='title'
              defaultValue={actionData?.fields?.title}
            />
            <div className=''>
              <p>
                {actionData?.fieldErrors?.title &&
                  actionData?.fieldErrors?.title}
              </p>
            </div>
          </div>
          <button type='submit' className=''>
            Add exercise
          </button>
        </form>
      </div>
    </>
  )
}

export default NewExercise
