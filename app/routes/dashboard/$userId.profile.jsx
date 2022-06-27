import React from 'react'
import { json } from '@remix-run/node'
import { useActionData, useLoaderData } from '@remix-run/react'
import { getUser } from '~/utils/session.server'
import { useState } from 'react'
import { db } from '~/utils/db.server'

import { changePassword } from '~/utils/session.server'

function badRequest(data) {
  return json(data, { status: 400 })
}
function goodRequest(data) {
  return json(data, { status: 200 })
}

export const loader = async ({ request }) => {
  const user = await getUser(request)
  return user
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

export const action = async ({ request, params }) => {
  const form = await request.formData()
  const name = form.get('name')

  if (form.get('_method') === 'name') {
    const user = await getUser(request)

    await db.user.update({
      where: { id: user.id },
      data: {
        name: name,
      },
    })

    return null
  }
  if (form.get('_method') === 'email') {
    const user = await getUser(request)
    const email = form.get('email')
    const fields = { email }
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

    await db.user.update({
      where: { id: user.id },
      data: {
        email: email,
      },
    })

    return null
  }

  if (form.get('_method') === 'password') {
    const user = await getUser(request)
    const email = user.email
    const oldPassword = form.get('old-password')
    const newPassword = form.get('new-password')
    const confirmNewPassword = form.get('confirm-new-password')

    const fields = { oldPassword }

    if (confirmNewPassword != newPassword) {
      return badRequest({
        fields,
        fieldErrors: { password: "Passwords don't match" },
      })
    }

    const fieldErrors = {
      password: validatePassword(newPassword),
    }

    if (Object.values(fieldErrors).some(Boolean)) {
      return badRequest({ fieldErrors, fields })
    }

    const passwordTrue = await changePassword({
      email,
      oldPassword,
      newPassword,
    })
    if (!passwordTrue) {
      return badRequest({
        fields,
        fieldErrors: { password: 'Invalid Credentials' },
      })
    }

    return goodRequest({
      fields,
      fieldErrors: { password: 'Password changed successfully' },
    })
  }

  return null
}

export default function register() {
  const actionData = useActionData()

  let [count, setPage] = useState(0)

  const user = useLoaderData()
  return (
    <div className="w-full h-full">
      {count === 1 && (
        <div className="w-full lg:w-1/2 h-1/2 flex flex-col justify-between">
          <div className="mb-20 flex flex-row justify-between items-center">
            <form method="POST" className="w-full">
              <input type="hidden" name="_method" value="name" />
              <div class="mb-6">
                <label
                  for="name"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Edit name
                </label>
                <input
                  type="name"
                  id="name"
                  name="name"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder={user.name}
                  required
                />
              </div>
              <button
                type="submit"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full lg:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Submit
              </button>
            </form>
          </div>
          <div className="mb-20 flex flex-row justify-between items-center">
            <h1
              className="font-bold text-2xl "
              onClick={() => setPage((count = 2))}
            >
              {user.email}
            </h1>
            <a
              className="menu-item underline"
              onClick={() => setPage((count = 2))}
            >
              Edit email
            </a>
          </div>
          <a className="underline" onClick={() => setPage((count = 3))}>
            Change password
          </a>
        </div>
      )}

      {count === 0 && (
        <div className="w-full lg:w-1/2 h-1/2 flex flex-col justify-between">
          <div className="mb-20 flex flex-row justify-between items-center">
            <p
              className="font-bold text-2xl "
              onClick={() => setPage((count = 1))}
            >
              {user.name}
            </p>
            <a
              className="menu-item underline"
              onClick={() => setPage((count = 1))}
            >
              Edit name
            </a>
          </div>
          <div className="mb-20 flex flex-row justify-between items-center">
            <p
              className="font-bold text-2xl "
              onClick={() => setPage((count = 2))}
            >
              {user.email}
            </p>
            <a
              className="menu-item underline"
              onClick={() => setPage((count = 2))}
            >
              Edit email
            </a>
          </div>
          <div className="error">
            {actionData?.fieldErrors?.email && actionData?.fieldErrors?.email}
          </div>
          <a className="underline" onClick={() => setPage((count = 3))}>
            Change password
          </a>
          <div className="error">
            {actionData?.fieldErrors?.password &&
              actionData?.fieldErrors?.password}
          </div>
        </div>
      )}

      {count === 2 && (
        <div className="w-full lg:w-1/2 h-1/2 flex flex-col justify-between">
          <div className="mb-20 flex flex-row justify-between items-center">
            <h1
              className="font-bold text-2xl "
              onClick={() => setPage((count = 1))}
            >
              {user.name}
            </h1>
            <a
              className="menu-item underline"
              onClick={() => setPage((count = 1))}
            >
              Edit name
            </a>
          </div>
          <div className="mb-20 flex flex-row justify-between items-center">
            <form method="POST" className="w-full">
              <input type="hidden" name="_method" value="email" />
              <div class="mb-6">
                <label
                  for="email"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder={user.email}
                  required
                />
              </div>
              <div className="error">
                {actionData?.fieldErrors?.email &&
                  actionData?.fieldErrors?.email}
              </div>
              <button
                type="submit"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full lg:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Submit
              </button>
            </form>
          </div>
          <a className="underline" onClick={() => setPage((count = 3))}>
            Change password
          </a>
          <div className="error">
            {actionData?.fieldErrors?.password &&
              actionData?.fieldErrors?.password}
          </div>
        </div>
      )}

      {count === 3 && (
        <div className="w-full lg:w-1/2 h-1/2 flex flex-col justify-between">
          <div className="mb-20 flex flex-row justify-between items-center">
            <h1
              className="font-bold text-2xl "
              onClick={() => setPage((count = 1))}
            >
              {user.name}
            </h1>
            <a className="menu-item" onClick={() => setPage((count = 1))}>
              Edit name
            </a>
          </div>
          <div className="mb-20 flex flex-row justify-between items-center">
            <h1
              className="font-bold text-2xl "
              onClick={() => setPage((count = 2))}
            >
              {user.email}
            </h1>
            <a className="menu-item" onClick={() => setPage((count = 2))}>
              Edit email
            </a>
          </div>
          <form method="POST">
            <input type="hidden" name="_method" value="password" />
            <div class="mb-6">
              <label
                for="old-password'"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Current password
              </label>
              <input
                name="old-password"
                type="password"
                id="old-password'"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="•••••••••"
                required
              />
            </div>
            <div class="mb-6">
              <label
                for="new-password"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                New password
              </label>
              <input
                type="password"
                name="new-password"
                id="new-password"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="•••••••••"
                required
              />
            </div>
            <div class="mb-6">
              <label
                for="confirm-new-password"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Confirm password
              </label>
              <input
                type="password"
                name="confirm-new-password"
                id="confirm-new-password"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="•••••••••"
                required
              />
            </div>
            <div className="error">
              {actionData?.fieldErrors?.password &&
                actionData?.fieldErrors?.password}
            </div>
            <button
              type="submit"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full lg:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
