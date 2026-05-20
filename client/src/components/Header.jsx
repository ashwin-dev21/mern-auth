import React from 'react'
import {assets} from '../assets/assets.js'
import { AppContext } from '../context/AppContext.jsx'
import { useContext } from 'react'

const Header = () => {
  const {userData} = useContext(AppContext);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
        <img src={assets.header_img} alt="" className="w-36 h-36 rounded-full mb-6"/>
        <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium'>
            Hey {userData ? userData.name : 'Developer'}! 
            <img src={assets.hand_wave} alt="" className="w-8 aspect-square" />
        </h1>
        <h2 className='text-2xl sm:text-5xl font-semibold mb-3'>Welcome to your dashboard!</h2>
        <p className='mb-8 max-w-md '>lore ipsum dolor sit amet, consectetur adipiscing elit.</p>
        <button className="border border-gray-800 px-8 py-2 rounded-full text-gray-500 hover:bg-gray-700 transition-all">
            Get Started
        </button>
    </div>
  )
}

export default Header