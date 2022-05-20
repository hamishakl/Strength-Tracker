import { useActionData, json, redirect } from 'remix'
import { login, register, createUserSession } from '~/utils/session.server'

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
      rel: "stylesheet",
      href: 'https://fonts.googleapis.com/css?family=Noto Serif'
    }

  ]
}


function badRequest(data) {
  return json(data, { status: 400 })
}

function validateUsername(username) {
  if (typeof username !== 'string' || username.length < 3) {
    return 'Username must be at least 3 characters'
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
  const username = form.get('username')
  const password = form.get('password')

  const fields = { loginType, username, password }

  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password),
  }

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields })
  }

  const user = await login({ username, password })
  if (!user) {
    return badRequest({
      fields,
      fieldErrors: { username: 'Invalid Credentials' },
    })
  }
  return createUserSession(user.id, '/dashboard')
}

function Login() {
  const actionData = useActionData()

  return (
    <div className='auth-wrapper'>
        <h1 className=''>Login</h1>
        <form method='POST'>
          <div className=''>
            <label htmlFor='username' className=''>
              Username
            </label>
            <input
              type='text'
              name='username'
              id='username'
              className=''
              defaultValue={actionData?.fields.username}
              placeholder='username'
            />
            <div className=''>
              {actionData?.fieldErrors?.username &&
                actionData?.fieldErrors?.username}
            </div>
          </div>
          <div className=''>
            <label htmlFor='password' className=''>
              Password
            </label>
            <input
              type='password'
              name='password'
              className=''
              id='password'
              defaultValue={actionData?.fields.password}
              placeholder='Password'
            />
            <div className='error'>
              {actionData?.fieldErrors?.password &&
                actionData?.fieldErrors?.password}
            </div>
          </div>
          <button type='submit' className=''>
            Login
          </button>
        </form>
    </div>
  )
}

export default Login
