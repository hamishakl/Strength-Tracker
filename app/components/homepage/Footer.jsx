import { Link } from '@remix-run/react'
import footerImg from '../../../public/images/footer.jpeg'

export const Footer = () => {
  return (
    <div>
      <div className="flex flex-col px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20 lg:flex-row">
        <div className="mb-5 lg:w-1/3 lg:mb-0 lg:mr-20">
          <h2 className="relative mb-4 font-sans text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-none">
            Strength Tracker
          </h2>
          <p className="mb-4 text-gray-900 lg:mb-6">
            Track your workouts, exercises, personal records, exercise goals and
            volume. Strength Tracker is a project designed and developed by
            ‎Hamish Henare.
          </p>
          <Link
            to="auth/register"
            aria-label=""
            className="inline-flex items-center font-semibold transition-colors duration-200 text-deep-purple-accent-400 hover:text-deep-purple-800"
          >
            Register
            <svg
              className="inline-block w-3 ml-2"
              fill="currentColor"
              viewBox="0 0 12 12"
            >
              <path d="M9.707,5.293l-5-5A1,1,0,0,0,3.293,1.707L7.586,6,3.293,10.293a1,1,0,1,0,1.414,1.414l5-5A1,1,0,0,0,9.707,5.293Z" />
            </svg>
          </Link>
        </div>
        <div className="flex-grow pt-1">
          {/* <div className="flex items-center mb-3">
            <span className="font-bold tracking-wide text-gray-900">
              Categories
            </span>
            <span className="ml-1">
              <svg
                className="w-5 h-5 mt-px text-deep-purple-accent-400"
                stroke="currentColor"
                viewBox="0 0 52 52"
              >
                <polygon
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  points="29 13 14 29 25 29 23 39 38 23 27 23"
                />
              </svg>
            </span>
          </div> */}
          {/* <div className="grid grid-cols-2 row-gap-6 sm:grid-cols-4">
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="transition-colors duration-300 hover:text-deep-purple-accent-700"
                >
                  Computers
                </a>
              </li>
              <li>
                <a
                  href="/"
                  className="transition-colors duration-300 hover:text-deep-purple-accent-700"
                >
                  Health
                </a>
              </li>
              <li>
                <a
                  href="/"
                  className="transition-colors duration-300 hover:text-deep-purple-accent-700"
                >
                  Reference
                </a>
              </li>
              <li>
                <a
                  href="/"
                  className="transition-colors duration-300 hover:text-deep-purple-accent-700"
                >
                  World
                </a>
              </li>
            </ul>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="transition-colors duration-300 hover:text-deep-purple-accent-700"
                >
                  eCommerce
                </a>
              </li>
              <li>
                <a
                  href="/"
                  className="transition-colors duration-300 hover:text-deep-purple-accent-700"
                >
                  Business
                </a>
              </li>
              <li>
                <a
                  href="/"
                  className="transition-colors duration-300 hover:text-deep-purple-accent-700"
                >
                  Portfolio
                </a>
              </li>
              <li>
                <a
                  href="/"
                  className="transition-colors duration-300 hover:text-deep-purple-accent-700"
                >
                  Video
                </a>
              </li>
            </ul>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="transition-colors duration-300 hover:text-deep-purple-accent-700"
                >
                  Brochure
                </a>
              </li>
              <li>
                <a
                  href="/"
                  className="transition-colors duration-300 hover:text-deep-purple-accent-700"
                >
                  Nonprofit
                </a>
              </li>
              <li>
                <a
                  href="/"
                  className="transition-colors duration-300 hover:text-deep-purple-accent-700"
                >
                  Educational
                </a>
              </li>
              <li>
                <a
                  href="/"
                  className="transition-colors duration-300 hover:text-deep-purple-accent-700"
                >
                  Sports
                </a>
              </li>
            </ul>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="transition-colors duration-300 hover:text-deep-purple-accent-700"
                >
                  Infopreneur
                </a>
              </li>
              <li>
                <a
                  href="/"
                  className="transition-colors duration-300 hover:text-deep-purple-accent-700"
                >
                  Health
                </a>
              </li>
              <li>
                <a
                  href="/"
                  className="transition-colors duration-300 hover:text-deep-purple-accent-700"
                >
                  Web
                </a>
              </li>
              <li>
                <a
                  href="/"
                  className="transition-colors duration-300 hover:text-deep-purple-accent-700"
                >
                  Personal
                </a>
              </li>
            </ul>
          </div> */}
        </div>
      </div>
      {/* <div className="relative">
        <img
          className="w-full sm:h-96"
          src={footerImg}
          alt=""
        />
        <div className="absolute inset-0 bg-gray-900 bg-opacity-50" />
      </div> */}
    </div>
  )
}
