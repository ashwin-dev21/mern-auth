import React, { useContext, useEffect, useRef } from 'react';
import { assets } from '../assets/assets.js';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext.jsx';
import { toast } from 'react-toastify';

const EmailVerify = () => {
  const {
    api,
    isLoggedIn,
    userData,
    getUserData,
  } = useContext(AppContext);

  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const handleInput = (e, index) => {
    const value = e.target.value;

    // Only allow numbers
    e.target.value = value.replace(/\D/g, '');

    if (
      e.target.value.length === 1 &&
      index < inputRefs.current.length - 1
    ) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (
      e.key === 'Backspace' &&
      e.target.value === '' &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pasteData = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6);

    pasteData.split('').forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });

    if (pasteData.length > 0) {
      const lastIndex = Math.min(pasteData.length - 1, 5);
      inputRefs.current[lastIndex]?.focus();
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const otp = inputRefs.current
        .map((input) => input?.value || '')
        .join('');

      if (otp.length !== 6) {
        toast.error('Please enter the complete 6-digit OTP');
        return;
      }

      console.log('Sending OTP:', otp);

      const { data } = await api.post(
        '/api/auth/verify-account',
        { otp }
      );

      console.log('Verify response:', data);

      if (data.success) {
        toast.success(data.message);

        await getUserData();

        navigate('/');
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.error('Email verification error:', error);

      toast.error(
        error.response?.data?.message ||
        error.message ||
        'Email verification failed'
      );
    }
  };

  useEffect(() => {
    if (
      isLoggedIn &&
      userData &&
      userData.isAccountVerified
    ) {
      navigate('/');
    }
  }, [isLoggedIn, userData, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to from-blue-200 to-green-400 relative">

      <img
        src={assets.logo}
        alt="Logo"
        onClick={() => navigate('/')}
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />

      <form
        onSubmit={onSubmitHandler}
        className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
      >
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Email Verify OTP
        </h1>

        <p className="text-center mb-6 text-indigo-300">
          Enter the OTP sent to your email
        </p>

        <div
          className="mb-8 flex justify-between"
          onPaste={handlePaste}
        >
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength={1}
                required
                className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md outline-none"
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-linear-to-r from-indigo-500 to-indigo-900 rounded-full text-white"
        >
          Verify Email
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;

