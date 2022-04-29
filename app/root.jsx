import { Outlet, LiveReload, Link, Links, useLoaderData, Scripts } from 'remix'
import globalStylesUrl from '~/styles/global.css'
import { getUser } from './utils/session.server'
import tailwindUrl from './styles/app.css'

export const links = () => {
  return [
    //  {
    //    href: "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css",
    //    rel: "stylesheet",
    //    integrity:
    //    "sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3",
    //    crossOrigin: "anonymous",
    //   },
    {
      rel: 'stylesheet',
      href: tailwindUrl,
    },
  ]
}

export const loader = async ({ request }) => {
  const user = await getUser(request)
  const data = {
    user,
  }
  return data
}

export default function App(params) {
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  )
}

function Document({ children, title }) {
  return (
    <html lang='en'>
      <head>
        <Links />
        <title>Strength Tracker</title>
      </head>
      <body>
        {children}
        {process.env.NODE_ENV === 'development' ? <LiveReload /> : null}
        <Scripts />
      </body>
    </html>
  )
}

function Layout({ children }) {
  const { user } = useLoaderData()

  return (
    <>
      <nav className='container flex h-20 w-screen max-w-none flex-row items-center justify-between border-b-2 bg-space-cadet pl-8 pr-8 text-white duration-100 ease-linear'>
        {user ? (
          <>
            <Link className='font-bold' to='/dashboard'>
              Strength Tracker
            </Link>
            <Link
              className='font-medium opacity-80 duration-100 ease-linear hover:opacity-100 '
              to='/dashboard/newPr'
            >
              New PR
            </Link>
            <Link
              className='font-medium opacity-80 duration-100 ease-linear hover:opacity-100'
              to='/dashboard/newGoal'
            >
              New Goal
            </Link>
            <Link
              className='font-medium opacity-80 duration-100 ease-linear hover:opacity-100'
              to='/dashboard/newWorkout'
            >
              New Workout
            </Link>
            <form action='/auth/logout' method='POST'>
              <button
                className='font-medium opacity-80 duration-100 ease-linear hover:opacity-100'
                type='submit'
              >
                Logout {user.username}
              </button>
            </form>
          </>
        ) : (
          <>
            <Link className='font-bold' to='/'>
              Strength Tracker
            </Link>
            <div className='flex w-1/5 items-center justify-between'>
              <Link
                className='font-medium opacity-80 duration-100 ease-linear hover:opacity-100'
                to='/auth/register'
              >
                Register
              </Link>

              <Link to='/auth/login'>Login</Link>
            </div>
          </>
        )}
      </nav>
      <div className='``'>{children}</div>
    </>
  )
}
