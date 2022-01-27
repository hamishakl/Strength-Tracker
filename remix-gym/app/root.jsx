import { Outlet, LiveReload, Link, Links } from "remix";
import globalStylesUrl from '~/styles/global.css'

export const links = () => [{ rel: 'stylesheet', href: globalStylesUrl}]

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
        </ul>
      </nav>
      <div className="container">{children}</div>
    </>
  );
}
