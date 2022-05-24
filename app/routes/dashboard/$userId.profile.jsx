import React from 'react'
import { useLoaderData, json, useActionData } from 'remix'
import { getUser } from '~/utils/session.server'
import { useState } from 'react'
import { db } from '~/utils/db.server'

function badRequest(data) {
  return json(data, { status: 400 })
}

export const loader = async ({ request }) => {
  const user = await getUser(request)
  return user
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
        fieldErrors: {email: `the email address: ${email} already exists.`},
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

  let data = form.get('_rename')
  if (data != undefined) {
    const exercise = await db.exercise.findUnique({
      where: { id: params.exerciseId },
    })

    await db.exercise.update({
      where: { id: params.exerciseId },
      data: {
        title: data,
      },
    })
  }

  return redirect(`/dashboard/${params.exerciseId}`)
}

export default function register() {
  const actionData = useActionData()

  let [count, setPage] = useState(0)

  const user = useLoaderData()
  console.log(user)
  return (
    <div>
      {count === 1 && (
        <>
        <div>
          <form method='POST' className=''>
            <input type='hidden' name='_method' value='name' />
            <input
              className=''
              name='name'
              type='text'
              placeholder={user.name}
              />
            <button type='submit' className=''>
              Save
            </button>
          </form>
        </div>
        <div>
          <h1 className='' onClick={() => setPage((count = 2))}>
            {user.email}
          </h1>
          <a className='menu-item' onClick={() => setPage((count = 2))}>
            Rename
          </a>
        </div>
              </>
      )}
      {count === 0 && (
        <div>
          <h1 className='' onClick={() => setPage((count = 1))}>
            {user.name}
          </h1>
          <a className='menu-item' onClick={() => setPage((count = 1))}>
            Rename
          </a>
        </div>
      )}
      {count === 2 && (
        <>
          <div>
            <h1 className='' onClick={() => setPage((count = 1))}>
              {user.name}
            </h1>
            <a className='menu-item' onClick={() => setPage((count = 1))}>
              Rename
            </a>
          </div>
          <div>
            <form method='POST' className=''>
              <input type='hidden' name='_method' value='email' />
              <input
                className=''
                name='email'
                type='text'
                placeholder={user.email}
              />
              <button type='submit' className=''>
                Save
              </button>
            </form>
          </div>
        </>
      )}
      <div className='error'>
          {actionData?.fieldErrors?.email &&
            actionData?.fieldErrors?.email}
        </div>
      {count === 0 && (
        <div>
          <h1 className='' onClick={() => setPage((count = 2))}>
            {user.email}
          </h1>
          <a className='menu-item' onClick={() => setPage((count = 2))}>
            Rename
          </a>
        </div>
      )}
      <form action="">
        <a>Change password</a>
        <label htmlFor="old-password">Old password</label>
        <input type="password" name='old-password' />
        <label htmlFor="new-password">New password</label>
        <input type="password" name='new-password' />
        <label htmlFor="confirm-new-password">Confirm new password</label>
        <input type="password" name='confirm-new-password' />
      </form>
    </div>
  )
}


