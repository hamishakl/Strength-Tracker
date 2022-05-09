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
        <link rel="stylesheet" href="https://use.typekit.net/jwz3lmi.css"></link>
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
      {user ? (
        <container className='body-wrapper'>
          <nav className='navbar'>
            <Link className='' to='/dashboard'>
              Strength Tracker
            </Link>
            <Link
              className=''
              to='/dashboard/newPr'
            >
              New PR
            </Link>
            <Link
              className=''
              to='/dashboard/newGoal'
            >
              New Goal
            </Link>
            <Link
              className=''
              to='/dashboard/newWorkout'
            >
              New Workout
            </Link>
            <form action='/auth/logout' method='POST'>
              <button
                className=''
                type='submit'
              >
                Logout {user.username}
              </button>
            </form>
          </nav>
          <div className='body'>{children}</div>
        </container>
      ) : (
        <>
          <nav>

            <Link className='' to='/'>
              Strength Tracker
            </Link>
            <div className=''>
              <Link
                className=''
                to='/auth/register'
              >
                Register
              </Link>

              <Link to='/auth/login'>Login</Link>
            </div>
          </nav>
          <div className=''>{children}</div>

        </>
      )}
    </>
  )
}
