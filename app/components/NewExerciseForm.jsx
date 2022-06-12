export default function NewExerciseForm(data) {
const actionData = data[0]
  return (
    <div className="page-content">
      <form method="POST">
      <input type="hidden" name="_method" value="exercise" />
        <div className="">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            defaultValue={actionData?.fields?.title}
          />
          <div className="">
            <p>
              {actionData?.fieldErrors?.title && actionData?.fieldErrors?.title}
            </p>
          </div>
        </div>
        <button type="submit" className="">
          Add exercise
        </button>
      </form>
    </div>
  )
}
