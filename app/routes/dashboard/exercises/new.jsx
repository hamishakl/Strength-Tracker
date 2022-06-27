import { json, redirect } from '@remix-run/node'
import { Link, useActionData, useLoaderData } from '@remix-run/react'
import { db } from '~/utils/db.server'
import { getUser } from '~/utils/session.server'
import Navbar from '../../../components/ui/PagesNavbar'

function validateTitle(title) {
  if (typeof title !== 'string' || title.length < 2) {
    return 'Title should be atleast 2 characters long'
  }
}

function badRequest(data) {
  return json(data, { status: 400 })
}

export const action = async ({ request }) => {
  const form = await request.formData()
  const title = form.get('title')

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
      <div className="page-header">
        <Navbar data={['New Exercise', 'exercises', 'Back']} />
      </div>
      <div className="page-content">
        <form method="POST">
          <div className="relative z-0 w-full mt-5 mb-10 group">
            <input
              type="text"
              name={`title`}
              id="title"
              className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              for="title"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Exercise name
            </label>
          </div>
          <div className="">
            <p>
              {actionData?.fieldErrors?.title && actionData?.fieldErrors?.title}
            </p>
          </div>
          <button
            type="submit"
            aria-current="page"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Save
          </button>
        </form>
      </div>
    </>
  )
}

export default NewExercise
