import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'

const Home = () => {
  return (
   <div className='flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-blue-200 to-green-400 relative' >
    <Header />
    <Navbar />
    
   </div>
  )
}

export default Home