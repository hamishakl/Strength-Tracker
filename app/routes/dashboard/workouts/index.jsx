import React from 'react'
import Navbar from '~/components/ui/PagesNavbar'
import Masonry from 'react-masonry-css'


export default function index() {
  return (
    <>
      <Navbar data={['My Workouts', 'workouts/new', 'Workout']} />
    </>
  )
}
