import { Outlet, LiveReload } from "remix";

export default function App(params) {
  return (
    <html>
      <head>
        <title>Gym App</title>
      </head>
      <body>
        <h1>hello world </h1>
        <Outlet />
        {process.env.NODE_ENV === 'development' ? 
        <LiveReload /> : null}
      </body>
    </html>
  )
}

