import { Outlet, LiveReload, Link, Links, useLoaderData, Scripts } from 'remix'
import { getUser } from './utils/session.server'
import tailwindUrl from './styles/app.css'
import UserCard from './components/UserCard'
import WorkoutIcon from '../public/images/navbar/gym.svg'
import PrIcon from '../public/images/navbar/medal.svg'
import GoalIcon from '../public/images/navbar/tick.svg'
import DashboardIcon from '../public/images/navbar/chart.svg'

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
        <container className='root__container'>
          <nav className='navbar'>
            <div className='navbar__div'>
              <Link className='navbar__logo' to='/dashboard'>
                <h3>
                  Strength Tracker
                </h3>
              </Link>
              <div className='navbar__links-wrapper'>
                <div className='navbar__links-card'>
                  <img src={DashboardIcon} />
                  <Link
                    className=''
                    to='/dashboard'
                  >
                    Dashboard
                  </Link>

                </div>
                <div className='navbar__links-card'>
                  <img src={PrIcon} />
                  <Link
                    className=''
                    to='/dashboard'
                  >
                    personal records
                  </Link>
                </div>
                <div className='navbar__links-card'>
                  <img src={GoalIcon} />
                  <Link
                    className=''
                    to='/dashboard'
                  >
                    goals
                  </Link>
                </div>
                <div className='navbar__links-card'>
                  <img src={WorkoutIcon} />
                  <Link
                    className=''
                    to='/dashboard'
                  >
                    workouts
                  </Link>
                </div>
              </div>
              <div className='navbar__whitespace'>
              </div>
              <UserCard user={user} />
            </div>
          </nav>
          <div className='root-children__container'>
            {children}
          </div>
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
