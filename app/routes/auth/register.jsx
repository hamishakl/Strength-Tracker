import { json, redirect } from '@remix-run/node'
import { Link, useActionData, useTransition, Form} from '@remix-run/react'
import { db } from '~/utils/db.server'
import { register, createUserSession } from '~/utils/session.server'

import cssSheet from '~/styles/app.css'
import homepageCssSheet from '~/styles/homepage.css'

export const links = () => {
  return [
    {
      rel: 'stylesheet',
      href: cssSheet,
    },
    {
      rel: 'stylesheet',
      href: homepageCssSheet,
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css?family=Noto Serif',
    },
  ]
}

function badRequest(data) {
  return json(data, { status: 400 })
}

function validateEmail(email) {
  if (typeof email !== 'string' || email.length < 6) {
    return 'Email must be at least 7 characters'
  } else if (typeof email !== 'string' || email.search(/[@]/) == -1) {
    return 'Password must contain atleast 1 @ character'
  } else if (typeof email !== 'string' || email.search(/[.]/) == -1) {
    return 'Password must contain atleast 1 .'
  }
}
function validatePassword(password) {
  if (typeof password !== 'string' || password.length < 6) {
    return 'Password must be at least 6 characters'
  } else if (typeof password !== 'string' || password.search(/[0-9]/) == -1) {
    return 'Password must contain atleast 1 number'
  } else if (typeof password !== 'string' || password.search(/[A-Z]/) == -1) {
    return 'Password must contain atleast 1 upper case letter'
  }
}

export const action = async ({ request }) => {
  const form = await request.formData()
  const loginType = form.get('loginType')
  const email = form.get('email')
  const password = form.get('password')
  const name = form.get('name')

  const fields = { loginType, email, name, password }

  const fieldErrors = {
    email: validateEmail(email),
    password: validatePassword(password),
  }

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields })
  }

  const emailExists = await db.user.findFirst({
    where: {
      email,
    },
  })
  if (emailExists) {
    return badRequest({
      fields,
      fieldErrors: { email: `the email address: ${email} already exists.` },
    })
  }

  const user = await register({ email, password, name })
  if (!user) {
    return badRequest({
      fields,
      formError: 'Something went wrong',
    })
  }

  return createUserSession(user.id, '/')
}

function Login() {
  const actionData = useActionData()
  const transition = useTransition()

  return (
    <div className="auth-wrapper">
      <div class="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
        <div class="flex-1">
          <div class="text-center">
            <p class="mt-3 text-gray-500 dark:text-black">
              Sign up to start tracking your strength today
            </p>
          </div>
          <div class="mt-8">
            <Form method="POST">
              <div>
                <label
                  for="name"
                  class="block mb-2 text-sm text-black dark:text-black"
                >
                  First Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  htmlFor="name"
                  defaultValue={actionData?.fields.name}
                  placeholder="Aphrodite"
                  class="block w-full px-4 py-2 mt-2 text-black placeholder-black bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-white dark:text-black dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                />
                {/* <div className="">
                  {actionData?.fieldErrors?.email &&
                    actionData?.fieldErrors?.email}
                </div> */}
              </div>
              <div className="mt-6">
                <label
                  for="email"
                  class="block mb-2 text-sm text-black dark:text-black"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  htmlFor="email"
                  defaultValue={actionData?.fields.email}
                  placeholder="example@example.com"
                  class="block w-full px-4 py-2 mt-2 text-black placeholder-black bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-white dark:text-black dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                />
                <div className="">
                  {actionData?.fieldErrors?.email &&
                    actionData?.fieldErrors?.email}
                </div>
              </div>

              <div class="mt-6">
                <div class="flex justify-between mb-2">
                  <label
                    for="password"
                    class="text-sm text-black dark:text-black"
                  >
                    Password
                  </label>
                </div>

                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Your Password"
                  class="block w-full px-4 py-2 mt-2 text-black placeholder-black bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-white dark:text-black dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                />
                <div className="error">
                  {actionData?.fieldErrors?.password &&
                    actionData?.fieldErrors?.password}
                </div>
              </div>

              <div class="mt-6">
                <button
                  disabled={transition.submission}
                  class="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                >
                   {transition.submission
                      ? 'Signing up...'
                      : 'Sign up'}
                </button>
              </div>
            </Form>

            <p class="mt-6 text-sm text-center text-gray-400">
              Already have an account?{' '}
              <Link
                to={'../auth/login'}
                class="text-blue-500 focus:outline-none focus:underline hover:underline"
              >
                Login
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
