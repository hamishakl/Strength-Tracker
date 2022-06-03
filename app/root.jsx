import { Link, Links, LiveReload, Outlet, Scripts, useLoaderData } from "@remix-run/react";
import { getUser } from './utils/session.server'
import cssSheet from './styles/app.css'
import HomepageFooter from './components/ui/HomepageFooter'

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
        <script src="https://widget.cloudinary.com/v2.0/global/all.js" type="text/javascript">
        </script>
      </body>
    </html>
  )
}

function Layout({ children }) {
  const { user } = useLoaderData()
  return (
    <>
      {user ? (
        <div className={'app'}>
          <div className={'app-body'}>
            <div className={'app-body-navigation'}>
              <div className={'app-header-logo'}>
                <div className={'logo'}>
                  <h1 className={'logo-title'}>
                    <span>Strength</span>
                    <span>Tracker</span>
                  </h1>
                </div>
              </div>
              <nav className={'navigation'}>
                <Link to='/dashboard'>
                  <i className={'ph-browsers'}></i>
                  <span>Dashboard</span>
                </Link>
                <Link to='/dashboard/prs'>
                  <i className={'ph-check-square'}></i>
                  <span>Personal Records</span>
                </Link>
                <Link to='dashboard/workouts'>
                  <i className={'ph-swap'}></i>
                  <span>Workouts</span>
                </Link>
                <Link to='/dashboard/exercises'>
                  <i className={'ph-file-text'}></i>
                  <span>Exercises</span>
                </Link>
                <Link to='/dashboard/goals'>
                  <i className={'ph-file-text'}></i>
                  <span>Goals</span>
                </Link>
                <Link to={`/dashboard/${user.id}/profile`}>
                  <i className={'ph-globe'}></i>
                  <span>Account Settings</span>
                </Link>
              </nav>
              <footer className={'footer'}>
                <button>
                  <form action='/auth/logout' method='POST'>
                    <button className="btn" type="submit">
                      Logout {user.name}
                    </button>
                  </form>
                </button>
              </footer>
            </div>
            <div className={'app-body-main-content'}>{children}</div>
          </div>
        </div>
      ) : (
        <container className='homepage-container'>
          <nav className='homepage__navbar'>
            <Link className='home-logo logo--animation' to='/'>
              Strength Tracker
            </Link>
            <div className='navbar-buttons__div'>
              <Link className='' to='/auth/register'>
                Register
              </Link>
              <Link className='' to='/auth/login'>
                Login
              </Link>
            </div>
          </nav>
          <div className=''>{children}</div>
          <HomepageFooter />
        </container>
      )}
    </>
  )
}
