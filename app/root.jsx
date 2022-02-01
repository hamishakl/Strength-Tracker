import { Outlet, LiveReload, Link, Links, useLoaderData } from "remix";
import globalStylesUrl from '~/styles/global.css'
import { getUser } from './utils/session.server'

export const links = () => [{ rel: 'stylesheet', href: globalStylesUrl}]

export const loader = async ({ request }) => {
  const user = await getUser(request)
  const data = {
    user
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
  );
}

function Document({ children, title }) {

  return (
    <html lang="en">
      <head>
        <Links />
        <title>Gym App</title>
      </head>
      <body>
      {children}
        {process.env.NODE_ENV === "development" ? <LiveReload /> : null}
      </body>
    </html>
  );
}

function Layout({ children }) {

  const {user} = useLoaderData()


  return (
    <>
      <nav className="navbar">
        <Link to="/" className="logo">
          Gym App
        </Link>
        <ul className="nav">
          <li>
            <Link to="/exercises">Exercises</Link>
          </li>
          {user ? (
            <li>
              <form action='/auth/logout' method='POST'>
                <button className="btn" type="submit">
                  Logout {user.username}
                </button>
              </form>
            </li>
          ) : (
          <li>
            <Link to="/auth/login">Login</Link>
          </li>
          )}
        </ul>
      </nav>
      <div className="container">{children}</div>
    </>
  );
}
