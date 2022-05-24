import React from "react";
import { useLoaderData, json, useActionData } from "remix";
import { getUser } from "~/utils/session.server";
import { useState } from "react";
import { db } from "~/utils/db.server";
import bcrypt from "bcrypt";

import { changePassword } from "~/utils/session.server";

function badRequest(data) {
  return json(data, { status: 400 });
}

export const loader = async ({ request }) => {
  const user = await getUser(request);
  return user;
};

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

    if (form.get("_method") === "password") {
      const password = form.get("");
      const passwordHash = await bcrypt.hash(password, 10);

      const passwordTrue = await changePassword({ email, password });
      if (!passwordTrue) {
        return badRequest({
          fields,
          fieldErrors: { password: "Invalid Credentials" },
        });
      }
      // return createUserSession(user.id, "/dashboard");

      await db.user.update({
        where: { id: user.id },
        data: {
          passwordHash: passwordHash,
        },
      });
    }

    return null;
  }

  let data = form.get("_rename");
  if (data != undefined) {
    const exercise = await db.exercise.findUnique({
      where: { id: params.exerciseId },
    });

    await db.exercise.update({
      where: { id: params.exerciseId },
      data: {
        title: data,
      },
    });
  }

  return null;
};

export default function register() {
  const actionData = useActionData();

  let [count, setPage] = useState(0);

  const user = useLoaderData();
  console.log(user);
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
                onBlur={console.log("blurrr")}
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
          <button onClick={() => setPage((count = 3))}>Change password</button>
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
                onBlur={console.log("blurrremail")}
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
          <form action="POST">
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
