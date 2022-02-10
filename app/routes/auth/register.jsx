import { useActionData, json, redirect } from "remix";
import { db } from "~/utils/db.server";
import { register, createUserSession } from "~/utils/session.server";

function badRequest(data) {
  return json(data, { status: 400 });
}

function validateUsername(username) {
  if (typeof username !== "string" || username.length < 3) {
    return "Username must be at least 3 characters";
  }
}

function validatePassword(password) {
  if (typeof password !== "string" || password.length < 6) {
    return "Password must be at least 6 characters";
  } else if (typeof password !== "string" || password.search(/[0-9]/) == -1) {
    return "Password must contain atleast 1 number";
  } else if (typeof password !== "string" || password.search(/[A-Z]/) == -1) {
    return "Password must contain atleast 1 upper case letter";
  }
}

export const action = async ({ request }) => {
  const form = await request.formData();
  const loginType = form.get("loginType");
  const username = form.get("username");
  const password = form.get("password");

  const fields = { loginType, username, password };

  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  const userExists = await db.user.findFirst({
    where: {
      username,
    },
  });
  if (userExists) {
    return badRequest({
      fields,
      fieldErrors: { userName: `User ${username} already exists` },
    });
  }

  const user = await register({ username, password });
  if (!user) {
    return badRequest({
      fields,
      formError: "Something went wrong",
    });
  }

  return createUserSession(user.id, "/");
};

function Login() {
  const actionData = useActionData();

  return (
    <div className="auth-container">
      <div className="page-header">
        <h1>Register</h1>
      </div>

      {/* <div className="page-content">
        <form method="POST">
          <div className="form-control">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              defaultValue={actionData?.fields.username}
            />
            <div className="error">
              {actionData?.fieldErrors?.username &&
                actionData?.fieldErrors?.username}
            </div>
          </div>
          <div className="form-control">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              defaultValue={actionData?.fields.password}
            />
            <div className="error">
              {actionData?.fieldErrors?.password &&
                actionData?.fieldErrors?.password}
            </div>
          </div>
          <button className="btn btn-block" type="submit">
            Login
          </button>
        </form>
      </div> */}
      <form method="POST">
        <div class="mb-3">
          <label htmlFor="username" class="form-label">
            Username
          </label>
          <input
            type="text"
            name="username"
            class="form-control"
            id="username"
            defaultValue={actionData?.fields.username}
          />
          <div className="error">
            {actionData?.fieldErrors?.username &&
              actionData?.fieldErrors?.username}
          </div>
        </div>
        <div class="mb-3">
          <label htmlFor="password" class="form-label">
            Password
          </label>
          <input
            class="form-control"
            id="password"
            type="password"
            name="password"
            defaultValue={actionData?.fields.password}
          />
        </div>
        <div className="error">
          {actionData?.fieldErrors?.password &&
            actionData?.fieldErrors?.password}
        </div>
        <button type="submit" class="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default Login;
