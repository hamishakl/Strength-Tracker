import { Outlet, LiveReload, Link, Links, useLoaderData, Scripts } from 'remix'
import { getUser } from './utils/session.server'
import cssSheet from './styles/app.css'
// import UserCard from './components/UserCard'
// import WorkoutIcon from '../public/images/navbar/gym.svg'
// import PrIcon from '../public/images/navbar/medal.svg'
// import GoalIcon from '../public/images/navbar/tick.svg'
// import DashboardIcon from '../public/images/navbar/chart.svg'

export const links = () => {
  return [
    {
      rel: 'stylesheet',
      href: cssSheet,
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
        <link
          rel='stylesheet'
          href='https://use.typekit.net/jwz3lmi.css'
        ></link>
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
        <div class='app'>
          <div class='app-body'>
            <div class='app-body-navigation'>
              <div class='app-header-logo'>
                <div class='logo'>
                  <h1 class='logo-title'>
                    <span>Strength</span>
                    <span>Tracker</span>
                  </h1>
                </div>
              </div>
              <nav class='navigation'>
                <Link to='/dashboard'>
                  <i class='ph-browsers'></i>
                  <span>Dashboard</span>
                </Link>
                <Link to=''>
                  <i class='ph-check-square'></i>
                  <span>Personal Records</span>
                </Link>
                <Link to=''>
                  <i class='ph-swap'></i>
                  <span>Workouts</span>
                </Link>
                <Link to=''>
                  <i class='ph-file-text'></i>
                  <span>Exercises</span>
                </Link>
                <Link to=''>
                  <i class='ph-globe'></i>
                  <span>User</span>
                </Link>
                <Link to=''>
                  <i class='ph-clipboard-text'></i>
                  <span>Exchange</span>
                </Link>
              </nav>
              <footer class='footer'>
                <button class='user-profile'>
                  <span>{user.username}</span>
                  <span>
                    <img src='https://assets.codepen.io/285131/almeria-avatar.jpeg' />
                  </span>
                </button>
              </footer>
            </div>
            <div class='app-body-main-content'>{children}</div>
          </div>
        </div>
      ) : (
        <>
          <nav>
            <Link className='' to='/'>
              Strength Tracker
            </Link>
            <div className=''>
              <Link className='' to='/auth/register'>
                Register
              </Link>
            </div>
          </nav>
          <div className=''>{children}</div>
        </>
      )}
    </>
  )
}
