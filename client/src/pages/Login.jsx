import React from 'react'
import {assets} from '../assets/assets.js'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext.jsx'
import {toast} from 'react-toastify'
import { useContext } from 'react'
import axios from 'axios'

const Login = () => {

  const navigate = useNavigate()

  const { backendUrl , setIsLoggedin, getUserData} = useContext(AppContext);

  const [state, setState] = useState('Sign Up')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

const onSubmitHandler = async (e) => {
  try {
    e.preventDefault();

    if (state === 'Sign Up') {

      const { data } = await axios.post(
        backendUrl + '/api/auth/register',
        { name, email, password },
        { withCredentials: true }
      );

      if (data.success) {
        setIsLoggedin(true);
        getUserData();
        navigate('/');
      } else {
        toast.error(data.message);
      }

    } else {

      const { data } = await axios.post(
        backendUrl + '/api/auth/login',
        { email, password },
        { withCredentials: true }
      );

      if (data.success) {
        setIsLoggedin(true);
        getUserData();
        navigate('/');
      } else {
        toast.error(data.message);
      }
    }

  } catch (err) {
    toast.error(err.response?.data?.message || err.message);
  }
};

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-linear-to-br from-blue-200 to-green-400-400 relative' >
      <img src={assets.logo} alt="" onClick={() => navigate('/')} className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />
      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
        <h2 className='text-3xl font-semibold text-white text-center mb-3'>
          {state === 'Sign Up' ? 'Create Account' : 'Login'}</h2>
        <p className='text-center text-sm mb-6'>
          {state === 'Sign Up' ? 'Create Your Account?' : 'Login to Your Account'}</p>
        
        <form onSubmit={onSubmitHandler}>

          {state === 'Sign Up' && (
            <div className='mb-4 flex items-center gap-2 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
              <img src={assets.person_icon} alt="User Icon" />
              <input 
              onChange={(e) => setName(e.target.value)} 
              value={name}
              className='bg-transparent border-none focus:outline-none' 
              type="text" placeholder='Full Name' required />
            </div>
          )}

          <div className='mb-4 flex items-center gap-2 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt="User Icon" />
            <input  onChange={(e) => setEmail(e.target.value)} 
              value={email}
            className='bg-transparent border-none focus:outline-none' type="email" placeholder='Email or Phone Number' required />
          </div> 
          
          <div className='mb-4 flex items-center gap-2 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt="User Icon" />
            <input  onChange={(e) => setPassword(e.target.value)} 
              value={password}
            className='bg-transparent border-none focus:outline-none' type="password" placeholder='Password' required />
          </div>

          <p onClick={() => navigate('/reset-password')} className='mb-4 text-center text-sm text-indigo-500 cursor-pointer'>
            Forgot Password?
          </p>

        <button className='w-full py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold'>
          {state}
        </button>
        </form>

          {state === 'Sign Up' ? (   <p className='text-center text-sm text-indigo-500 mt-4'>
          Already Have an acount?{' '}
          <span className=' text-blue-500 cursor-pointer hover:underline' onClick={() => setState('Login')}>
            Login Here
          </span>
        </p>) 
        : ( <p className='text-center text-sm text-indigo-500 mt-4'>
          Don't Have an acount?{' '}
          <span className=' text-blue-500 cursor-pointer hover:underline' onClick={() => setState('Sign Up')}>
            Sign Up
          </span>
        </p>)}
     
        
       
      </div>
    </div>
  )
}

export default Login