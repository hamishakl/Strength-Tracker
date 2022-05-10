export default function UserCard(user) {
    return (
        <div className='user-wrapper'>
            <h4>
                {user.user.username}
            </h4>
            <p>Account details</p>
            <form action='/auth/logout' method='POST'>
                <button
                    className=''
                    type='submit'
                >
                    Logout {user.username}
                </button>
            </form>
        </div>
    )
}
