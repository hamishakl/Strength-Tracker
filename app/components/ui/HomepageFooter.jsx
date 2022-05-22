import { Link } from "remix"

export default function Homepagefooter() {
  return (
    <footer className='homepage__footer'>
    <div className="footer__contents">
        <h3 className='home-logo logo--animation'>Strength Tracker</h3>
        <Link className='' to='/auth/register'>
            Register
        </Link>
        <Link className='' to='/auth/login'>
            Login
        </Link>
        <p>Track your workouts, exercises, personal records, exercise goals and volume.</p>
        <p>Strength Tracker is a project designed and developed by ‎
            <a target={'blank'} href={'https://www.hamishhenare.com'}>
                Hamish Henare.
            </a>
        </p>
        <p>hello@strengthtracker.com</p>
    </div>
    <div className="footer__contents">
        {/* <p>Strength Tracker is a project designed and developed by ‎
            <a target={'blank'} href={'https://www.hamishhenare.com'}>
            Hamish Henare.
            </a>
            </p>
        <p>hello@strengthtracker.com</p> */}
    </div>
        <div className="footer__contents">
            <blockquote className='quote'>
                “No man has the right to be an amateur in the matter of physical training. It is a shame for a man to grow old without seeing the beauty and strength of which his body is capable.”
                <br></br>
                <br></br>
                ― Socrates
            </blockquote>
        </div>
</footer>
  )
}


