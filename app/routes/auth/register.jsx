import { useActionData, json, redirect, Link } from 'remix'
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
      rel: "stylesheet",
      href: 'https://fonts.googleapis.com/css?family=Noto Serif'
    }

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
      fieldErrors: { email: `User ${email} already exists, did you want to ${<Link to={'/auth/login'}>Login</Link>}?` },
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

  return (
    <div className='auth-wrapper'>
      <div className=''>
        <h1 className=''>Register</h1>
      </div>
      <form method='POST' className=''>
        <div>
          <label htmlFor="name">First name</label>
          <input type="text" name="name" id="" placeholder='What is your first name?' />
        </div>


        <div>
          <label htmlFor="email">Email address</label>
          <input type="email" name="email" placeholder='Please enter your email address' id="" />
        </div>

        <div className=''>
          <label htmlFor='password' className=''>
            Password
          </label>
          <input
            className=''
            id='password'
            type='password'
            name='password'
            placeholder='Please choose a password'
            defaultValue={actionData?.fields.password}
          />
        </div>
        <div className='error'>
          {actionData?.fieldErrors?.password &&
            actionData?.fieldErrors?.password}
        </div>
        <button type='submit' className=''>
          Submit
        </button>
      </form>
    </div>
  )
}

export default Login


