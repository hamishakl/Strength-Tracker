import React from "react";
import { useLoaderData } from "remix";
import { getUser } from "~/utils/session.server";
import { db } from "~/utils/db.server";
import exercise from "./$exerciseId";


export const loader = async({ request }) => {
    const user = await getUser(request)
    const exercises = await db.exercise.findMany({
        where: { userId: user.id },
      });
      return exercises
}

export default function newPr() {
    const exercises = useLoaderData();
    
    return (
    <div class="container">
      <h1>New PR</h1>
      <form>
        <div className="mb-3">
            <select class="form-select" aria-label="Default select example">
                <option selected>Open this select menu</option>
            {exercises.map((exercise) => (
                <option key={exercise.id} value={exercise.title}>{exercise.title}</option>
            ))}
          </select>
        </div>
        <div class="mb-3">
          <label for="exampleInputEmail1" class="form-label">
            Email address
          </label>
          <input
            type="email"
            class="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
          />
          <div id="emailHelp" class="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div class="mb-3">
          <label for="exampleInputPassword1" class="form-label">
            Password
          </label>
          <input
            type="password"
            class="form-control"
            id="exampleInputPassword1"
          />
        </div>
        <div class="mb-3 form-check">
          <input type="checkbox" class="form-check-input" id="exampleCheck1" />
          <label class="form-check-label" for="exampleCheck1">
            Check me out
          </label>
        </div>
        <button type="submit" class="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}
