import React from 'react'
import Navbar from '~/components/ui/PagesNavbar'


export default function index() {
  return (
    <>
      <Navbar data={['My Workouts', 'workouts/new', 'Workout']} />
    </>
  )
}
