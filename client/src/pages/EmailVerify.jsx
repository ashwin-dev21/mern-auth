import React, { use, useEffect } from 'react'
import {assets} from '../assets/assets.js'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext.jsx'
import axios from 'axios'
import { toast } from 'react-toastify'
// import { get } from 'mongoose'
import { useState } from 'react'




const EmailVerify = () => {

  axios.defaults.withCredentials = true;

  const {backendUrl, isLoggedIn, userData, getUserData} = useContext(AppContext);

  const navigate = useNavigate();

  const inputRefs = React.useRef([]);

  const handleInput = (e, index) => {
    if(e.target.value.length === 1 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if(e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData('text').slice(0, 6).split('');
    pasteData.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      // Handle OTP verification logic here
      const otpArray = inputRefs.current.map(e => e.value);
      const otp = otpArray.join('');

      const {data} = await axios.post('/api/auth/verify-account', {otp});
      if(data.success) {
        toast.success(data.message);
        getUserData();
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      
    }
  }

  useEffect(() => {
    isLoggedIn && userData && userData.isAccountVerified && navigate('/') 
  }, [isLoggedIn, userData]);

  return (
    <div className='flex items-center justify-center min-h-screen
    bg-linear-to-br from-blue-200 to-green-400-400 relative'> 

     <img src={assets.logo} alt="" onClick={() => navigate('/')} 
     className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />
        <form onSubmit={onSubmitHandler} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Email Verify Otp</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter the OTP sent to your email</p>
          <div className='mb-8 flex justify-between' onPaste={handlePaste}>
            {Array(6).fill(0).map((_, index) => (
              <input type='text' maxLength={1} key={index} required
                className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md'
                ref={e => inputRefs.current[index] = e}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                
                />
            ))}
          </div>
          <button className='w-full py-3 bg-linear-to-r from-indigo-500 to-indigo-900 rounded-full text-white'>
            Verify Email</button>
        </form>
    </div>
  )
}

export default EmailVerify