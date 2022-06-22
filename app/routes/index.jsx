import { redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { getUser } from '../utils/session.server'



import cssSheet from '~/styles/app.css'
import homepageCssSheet from '~/styles/homepage.css'
import { Feature } from '../components/homepage/Feature'
import HeroSection from '../components/homepage/HeroSection'

export const links = () => {
  return [
    {
      rel: 'stylesheet',
      href: cssSheet,
    },
    {
      rel: 'stylesheet',
      href: homepageCssSheet,
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css?family=Noto Serif',
    },
  ]
}
export const loader = async ({ request }) => {
  const user = await getUser(request)
  const data = {
    user,
  }

  if (user) {
    return redirect('/dashboard')
  }

  return data
}

function Home() {
  return (
    <div className="layout">
      <HeroSection />
      <Feature />
    </div>
  )
}

export default Home
