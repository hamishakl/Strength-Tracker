import {
  Link,
  Links,
  LiveReload,
  Outlet,
  Scripts,
  useLoaderData,
} from '@remix-run/react'
import { getUser } from './utils/session.server'
import cssSheet from './styles/app.css'
import HomepageFooter from './components/ui/HomepageFooter'
import mobileCssSheet from '~/styles/mobile.css'
import MobileNav from './components/ui/MobileNav'
import { useState } from 'react'

import styles from './tailwind.css'
import DashboardNavbar from './components/ui/DashboardNavbar'
import { Footer } from './components/homepage/Footer'

export const links = () => {
  return [
    { rel: 'stylesheet', href: styles },
    {
      rel: 'stylesheet',
      href: cssSheet,
    },
    {
      rel: 'stylesheet',
      href: mobileCssSheet,
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

export function ErrorBoundary(error) {
  console.error(error)
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Links />
      </head>
      <body>
        <Scripts />
      </body>
    </html>
  )
}

function Document({ children, title }) {
  return (
    <html lang="en">
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <head>
        <Links />
        <title>Strength Tracker</title>
        <link
          rel="stylesheet"
          href="https://use.typekit.net/jwz3lmi.css"
        ></link>
      </head>
      <body>
        {children}
        {process.env.NODE_ENV === 'development' ? <LiveReload /> : null}
        <Scripts />
        <script
          src="https://widget.cloudinary.com/v2.0/global/all.js"
          type="text/javascript"
        ></script>
      </body>
    </html>
  )
}

function Layout({ children }) {
  let [count, setPage] = useState(0)

  const { user } = useLoaderData()
  return (
    <>
      {user ? (
        <div className={'app flex justifiy-between'}>
          <div className={'app-body'}>
            <DashboardNavbar user={user} />
            <div
              className={
                'app-body-main-content flex justifiy-between flex-col h-full'
              }
            >
              {count === 1 ? (
                <MobileNav user={user}>
                  <div
                    className="mobile-nav__button--close"
                    onClick={() => setPage((count = 0))}
                  ></div>
                </MobileNav>
              ) : null}
              <nav className="mobile-nav mb-3">
                <Link to={'/dashboard'}>
                  <h1 className={'logo-title mobile-title mb-1'}>
                    <span className="text-xl font-bold">Strength</span>
                    <span className="text-xl font-bold">Tracker</span>
                  </h1>
                </Link>
                <div
                  className="mobile-nav__button"
                  onClick={() => setPage((count = 1))}
                ></div>
              </nav>
              {children}
            </div>
          </div>
        </div>
      ) : (
        <container className="homepage-container w-5/6">
          <nav className="homepage__navbar w-full">
            <Link className="home-logo logo--animation" to="/">
              Strength Tracker
            </Link>
            <div className="navbar-buttons__div">
              <Link className="mr-1" to="/auth/register">
                Register
              </Link>
              <Link className="" to="/auth/login">
                Login
              </Link>
            </div>
          </nav>
          <div className="w-full">{children}</div>
          {/* <HomepageFooter /> */}
          <Footer />
        </container>
      )}
    </>
  )
}
