import { Link, redirect } from "remix";

export const action = async ({request}) => {
    const form = await request.formData()
    const title = form.get('title')
    const body = form.get('body')

    const fields = {title, body}


    console.log(fields);
    return redirect('/exercises')
}

function NewExercise() {
  return (
    <>
    <div className="page-header">
        <h1>New exercise</h1>
        <Link to='/exercises' className="btn btn-reverse">
            Back
        </Link>
    </div>
    <div className="page-content">
        <form method="POST">
            <div className="form-control">
                <label htmlFor="title">Title</label>
                <input type="text" name="title" id="title" />
            </div>
            <div className="form-control">
                <label htmlFor="body">Exercise Body</label>
                <input type="text" name="body" id="body" />
            </div>
            <button type="submit" className="btn btn-block">
                Add exercise
            </button>
        </form>
    </div>
    </>
  );
}

export default NewExercise;
