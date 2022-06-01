import React from "react";
import { json } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { getUser } from "~/utils/session.server";
import { useState } from "react";
import { db } from "~/utils/db.server";

import { changePassword } from "~/utils/session.server";

function badRequest(data) {
  return json(data, { status: 400 });
}
function goodRequest(data) {
  return json(data, { status: 200 });
}

export const loader = async ({ request }) => {
  const user = await getUser(request);
  return user;
};

function validatePassword(password) {
  if (typeof password !== 'string' || password.length < 6) {
    return 'Password must be at least 6 characters'
  } else if (typeof password !== 'string' || password.search(/[0-9]/) == -1) {
    return 'Password must contain atleast 1 number'
  } else if (typeof password !== 'string' || password.search(/[A-Z]/) == -1) {
    return 'Password must contain atleast 1 upper case letter'
  }
}

// function passwordMatch(a, b, state) {
//   if (a != b) {
//     return 'Confirmed password does not match'
//   } else {
//     state = 4
//     return 'passwords match'
//   }
// }

export const action = async ({ request, params }) => {
  const form = await request.formData();
  const name = form.get("name");

  if (form.get("_method") === "name") {
    const user = await getUser(request);

    await db.user.update({
      where: { id: user.id },
      data: {
        name: name,
      },
    });

    return null;
  }
  if (form.get("_method") === "email") {
    const user = await getUser(request);
    const email = form.get("email");
    const fields = { email };
    const emailExists = await db.user.findFirst({
      where: {
        email,
      },
    });
    if (emailExists) {
      return badRequest({
        fields,
        fieldErrors: { email: `the email address: ${email} already exists.` },
      });
    }

    await db.user.update({
      where: { id: user.id },
      data: {
        email: email,
      },
    });


    return null;
  }

  if (form.get("_method") === "password") {

    const user = await getUser(request);
    const email = user.email
    const oldPassword = form.get("old-password")
    const newPassword = form.get("new-password")
    const confirmNewPassword = form.get("confirm-new-password")

    
    // const passwordHash = await bcrypt.hash(password, 10);
    const fields = { oldPassword };
    
    if (confirmNewPassword != newPassword){
      return badRequest({
        fields,
        fieldErrors: { password: "Passwords don't match" },
      })
    }
    
    const fieldErrors = {
      password: validatePassword(newPassword),
    }

    if (Object.values(fieldErrors).some(Boolean)) {
      return badRequest({ fieldErrors, fields })
    }

    const passwordTrue = await changePassword({ email, oldPassword, newPassword });
    if (!passwordTrue) {
      return badRequest({
        fields,
        fieldErrors: { password: "Invalid Credentials" },
      })
    }

    return goodRequest({
      fields,
      fieldErrors: { password: "Password changed successfully" },
    });

  }

  return null;
};

export default function register() {
  const actionData = useActionData();

  let [count, setPage] = useState(0);

  const user = useLoaderData();
  return (
    <div>
      {count === 1 && (
        <>
          <div>
            <form method="POST" className="">
              <input type="hidden" name="_method" value="name" />
              <input
                className=""
                name="name"
                type="text"
                placeholder={user.name}
              />
              <button type="submit" className="">
                Save
              </button>
            </form>
          </div>
          <div>
            <h1 className="" onClick={() => setPage((count = 2))}>
              {user.email}
            </h1>
            <a className="menu-item" onClick={() => setPage((count = 2))}>
              Edit email
            </a>
          </div>
          <button onClick={() => setPage((count = 3))}>Change password</button>
        </>
      )}

      {count === 0 && (
        <>
          <div>
            <h1 className="" onClick={() => setPage((count = 1))}>
              {user.name}
            </h1>
            <a className="menu-item" onClick={() => setPage((count = 1))}>
              Edit name
            </a>
          </div>
          <div>
            <h1 className="" onClick={() => setPage((count = 2))}>
              {user.email}
            </h1>
            <a className="menu-item" onClick={() => setPage((count = 2))}>
              Edit email
            </a>
          </div>
          <div className="error">
            {actionData?.fieldErrors?.email &&
              actionData?.fieldErrors?.email}
          </div>
          <button onClick={() => setPage((count = 3))}>Change password</button>
          <div className="error">
            {actionData?.fieldErrors?.password && actionData?.fieldErrors?.password}
          </div>
        </>
      )}

      {count === 2 && (
        <>
          <div>
            <h1 className="" onClick={() => setPage((count = 1))}>
              {user.name}
            </h1>
            <a className="menu-item" onClick={() => setPage((count = 1))}>
              Edit name
            </a>
          </div>
          <div>
            <form method="POST" className="">
              <input type="hidden" name="_method" value="email" />
              <input
                className=""
                name="email"
                type="text"
                placeholder={user.email}
              />
              <div className="error">
                {actionData?.fieldErrors?.email &&
                  actionData?.fieldErrors?.email}
              </div>
              <button type="submit" className="">
                Save
              </button>
            </form>
          </div>
          <button onClick={() => setPage((count = 3))}>Change password</button>
          <div className="error">
            {actionData?.fieldErrors?.password && actionData?.fieldErrors?.password}
          </div>
        </>
      )}

      {count === 3 && (
        <>
          <div>
            <h1 className="" onClick={() => setPage((count = 1))}>
              {user.name}
            </h1>
            <a className="menu-item" onClick={() => setPage((count = 1))}>
              Edit name
            </a>
          </div>
          <div>
            <h1 className="" onClick={() => setPage((count = 2))}>
              {user.email}
            </h1>
            <a className="menu-item" onClick={() => setPage((count = 2))}>
              Edit email
            </a>
          </div>
          <form method="POST">
            <input type="hidden" name="_method" value="password" />
            <label htmlFor="old-password">Old password</label>
            <div className="error">
              {actionData?.fieldErrors?.password && actionData?.fieldErrors?.password}
            </div>
            <input type="password" name="old-password" />
            <label htmlFor="new-password">New password</label>
            <input type="password" name="new-password" />
            <label htmlFor="confirm-new-password">Confirm new password</label>
            <input type="password" name="confirm-new-password" />
            <button type="submit">Submit</button>
          </form>
        </>
      )}
    </div>
  );
}
