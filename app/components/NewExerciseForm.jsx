import { Form } from '@remix-run/react'

export default function NewExerciseForm(data, children) {
  const actionData = data[0]
  return (
    <div className="page-content mt-3 pb-4">
      <Form method="POST">
        <input type="hidden" name="_method" value="exercise" />
        <div className="relative z-0 w-full mb-10 group">
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
        <div className="flex w-full justify-center items-center rounded-md shadow-sm">
          <button
            type="submit"
            // onClick={() => props.onClick()}
            aria-current="page"
            class="py-2 px-4 text-sm font-medium text-blue-700 bg-white rounded-l-lg border border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
          >
            New block
          </button>
          <a
            onClick={() => stateChanger((count = 0))}
            href="#"
            class="py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-r-md border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
          >
            Cancel
          </a>
        </div>
      </Form>
    </div>
  )
}
