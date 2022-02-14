import { Outlet, LiveReload, Link, Links, useLoaderData } from "remix";
import globalStylesUrl from "~/styles/global.css";
import { getUser } from "./utils/session.server";

export const links = () => [
  {
    href: "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css",
    rel: "stylesheet",
    integrity:
      "sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3",
    crossOrigin: "anonymous",
  },
];

export const loader = async ({ request }) => {
  const user = await getUser(request);
  const data = {
    user,
  };
  return data;
};

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
        <title>Strength Tracker</title>
      </head>
      <body>
        {children}
        {process.env.NODE_ENV === "development" ? <LiveReload /> : null}
      </body>
    </html>
  );
}

function Layout({ children }) {
  const { user } = useLoaderData();

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            Strength Tracker
          </Link>
          {user ? (
            <div className="collapse navbar-collapse" id="navbarText">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <Link className="nav-item nav-link" to="/dashboard">
                  Dashboard
                </Link>
                <Link className="nav-item nav-link" to="/dashboard/newPr">
                  New PR
                </Link>
                <Link className="nav-item nav-link" to="/dashboard/newGoal">
                  New Goal
                </Link>
              </ul>
            </div>
          ) : (
            <div className="collapse navbar-collapse" id="navbarText">
              <Link className="nav-item nav-link" to="/auth/register">
                Register
              </Link>
            </div>
          )}
        </div>
        {user ? (
          <form action="/auth/logout" method="POST">
            <button className="btn btn-primary" type="submit">
              Logout {user.username}
            </button>
          </form>
        ) : (
          <Link to="/auth/login">Login</Link>
        )}
      </nav>
      <div className="container">{children}</div>
    </>
  );
}
