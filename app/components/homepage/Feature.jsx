import featureImg1 from '../../../public/images/feature-1.jpeg'
import featureImg2 from '../../../public/images/feature-2.jpeg'
import featureImg3 from '../../../public/images/feature-3.jpeg'

export const Feature = () => {
  return (
    <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
      <div className="max-w-xl mb-6 sm:mx-auto sm:text-center md:mb-10 lg:max-w-2xl">
        <p className="mb-1 text-xs font-semibold tracking-wide uppercase md:mb-2">
          Get started today
        </p>
        <p className="text-base text-gray-700 md:text-lg">
          Strength Tracker makes your Strength journey simple and fun.
        </p>
      </div>
      <div className="grid gap-6 row-gap-5 lg:grid-cols-3">
        <div>
          <img
            className="object-cover w-full h-64 mb-6 rounded shadow-lg lg:h-80 xl:h-96"
            src={featureImg1}
            alt=""
          />
          <h5 className="mb-2 text-xl font-bold leading-none sm:text-2xl">
            Achieve your goals
          </h5>
          <p className="text-gray-700">
            Starting a new workout routine or training program? Strength Tracker
            will help users set their goals from the start, so they can see how
            much progress they've made as they work towards them.
          </p>
        </div>
        <div>
          <img
            className="object-cover w-full h-64 mb-6 rounded shadow-lg lg:h-80 xl:h-96"
            src={featureImg2}
            alt=""
          />
          <h5 className="mb-2 text-xl font-bold leading-none sm:text-2xl">
            Easy to use
          </h5>
          <p className="text-gray-700">
            No need to dig through your phone for the notes you took at the gym.
            We’ve got a simple, intuitive design that makes tracking your
            progress easy and fun.
          </p>
        </div>
        <div>
          <img
            className="object-cover w-full h-64 mb-6 rounded shadow-lg lg:h-80 xl:h-96"
            src={featureImg3}
            alt=""
          />
          <h5 className="mb-2 text-xl font-bold leading-none sm:text-2xl">
            Track your progess
          </h5>
          <p className="text-gray-700">
            Gain clarity on which exercises are most efficient, track a variety
            of statistics (i.e., sets, reps, weight), set and track personal
            records.
          </p>
        </div>
      </div>
    </div>
  )
}
