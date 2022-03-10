import { useActionData, json, redirect } from 'remix';
import { db } from '~/utils/db.server';
import { register, createUserSession } from '~/utils/session.server';

function badRequest(data) {
  return json(data, { status: 400 });
}

function validateUsername(username) {
  if (typeof username !== 'string' || username.length < 3) {
    return 'Username must be at least 3 characters';
  }
}

function validatePassword(password) {
  if (typeof password !== 'string' || password.length < 6) {
    return 'Password must be at least 6 characters';
  } else if (typeof password !== 'string' || password.search(/[0-9]/) == -1) {
    return 'Password must contain atleast 1 number';
  } else if (typeof password !== 'string' || password.search(/[A-Z]/) == -1) {
    return 'Password must contain atleast 1 upper case letter';
  }
}

export const action = async ({ request }) => {
  const form = await request.formData();
  const loginType = form.get('loginType');
  const username = form.get('username');
  const password = form.get('password');

  const fields = { loginType, username, password };

  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  const userExists = await db.user.findFirst({
    where: {
      username,
    },
  });
  if (userExists) {
    return badRequest({
      fields,
      fieldErrors: { userName: `User ${username} already exists` },
    });
  }

  const user = await register({ username, password });
  if (!user) {
    return badRequest({
      fields,
      formError: 'Something went wrong',
    });
  }

  return createUserSession(user.id, '/');
};

function Login() {
  const actionData = useActionData();

  return (
    <div className='w-screen h-screen flex justify-center items-center flex-col'>
      <div className='page-header'>
        <h1 className='text-xl font-semibold'>Register</h1>
      </div>
      <form method='POST' className='w-full max-w-lg flex flex-col'>
        <div className=''>
          <label
            htmlFor='username'
            className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
          >
            Username
          </label>
          <input
            type='text'
            name='username'
            className='appearance-none block w-full bg-gray-200 text-gray-700 border py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white'
            id='username'
            placeholder='Username'
            defaultValue={actionData?.fields.username}
          />
          <div className='error'>
            {actionData?.fieldErrors?.username &&
              actionData?.fieldErrors?.username}
          </div>
        </div>
        <div className='mb-3'>
          <label
            htmlFor='password'
            className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
          >
            Password
          </label>
          <input
            className='appearance-none block w-full bg-gray-200 text-gray-700 border py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white'
            id='password'
            type='password'
            name='password'
            placeholder='Password'
            defaultValue={actionData?.fields.password}
          />
        </div>
        <div className='error'>
          {actionData?.fieldErrors?.password &&
            actionData?.fieldErrors?.password}
        </div>
        <button type='submit' className='ease-linear duration-100 rounded-lg bg-cyan-500 hover:bg-blue-500 w-40 h-10 font-bold text-white '>
          Submit
        </button>
      </form>
    </div>
  );
}

export default Login;
