import { Form } from '@remix-run/react'

export default function UserCard(user) {
  return (
    <div className=''>
      <h4>{user.user.username}</h4>
      <p>Account details</p>
      <Form action='/auth/logout' method='POST'>
        <button className='' type='submit'>
          Logout {user.username}
        </button>
      </Form>
    </div>
  )
}
