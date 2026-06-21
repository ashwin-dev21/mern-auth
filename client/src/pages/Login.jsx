import { useState, useContext } from 'react';
import { assets } from '../assets/assets.js';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext.jsx';
import { toast } from 'react-toastify';
import axios from 'axios';

const Login = () => {

  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContext);

  const [state, setState] = useState('Sign Up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      if (state === 'Sign Up') {

        const { data } = await axios.post(
          backendUrl + '/api/auth/register',
          { name, email, password }
        );

        if (data.success) {
          localStorage.setItem("token", data.token);

          setIsLoggedin(true);
          getUserData();

          toast.success("Account created");
          navigate('/');
        } else {
          toast.error(data.message);
        }

      } else {

        const { data } = await axios.post(
          backendUrl + '/api/auth/login',
          { email, password }
        );

        if (data.success) {
          localStorage.setItem("token", data.token);

          setIsLoggedin(true);
          getUserData();

          toast.success("Login successful");
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
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-linear-to-br from-blue-200 to-green-400-400 relative'>
      <img
        src={assets.logo}
        alt=""
        onClick={() => navigate('/')}
        className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'
      />

      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
        <h2 className='text-3xl font-semibold text-white text-center mb-3'>
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </h2>

        <form onSubmit={onSubmitHandler}>

          {state === 'Sign Up' && (
            <input
              className='mb-4 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            className='mb-4 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className='mb-4 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className='w-full py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold'>
            {state}
          </button>
        </form>

        <p
          onClick={() => navigate('/reset-password')}
          className='text-center mt-3 cursor-pointer text-indigo-400'
        >
          Forgot Password?
        </p>

        <p className='text-center mt-4'>
          {state === 'Sign Up'
            ? "Already have an account?"
            : "Don't have an account?"}

          <span
            className='text-blue-500 cursor-pointer ml-1'
            onClick={() => setState(state === 'Sign Up' ? 'Login' : 'Sign Up')}
          >
            Switch
          </span>
        </p>

      </div>
    </div>
  );
};

export default Login;