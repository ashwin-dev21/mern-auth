import React from 'react'
import {assets} from '../assets/assets.js'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext.jsx'
import { useContext } from 'react'
import axios from 'axios'
import {toast} from 'react-toastify'


const Navbar = () => {

  const navigate = useNavigate()
  const {userData , setIsLoggedin, backendUrl, setUserData} = useContext(AppContext);

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + '/api/auth/send-verify-otp');
      if (data.success) {
        navigate('/email-verify');
        toast.success(data.message);
      }else {
        toast.error(data.message);
      }

    } catch (err) {
      toast.error(err.message);
    } 
  };

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + '/api/auth/logout');
      data.success && setIsLoggedin(false);
      data.success && setUserData(false);
      navigate('/');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="w-full flex items-center justify-between p-4 sm:p-6 sm:px-24 absolute top-0">
        <img src={assets.logo} alt="logo" className="w-28 sm:w-32" />

        {userData ? <div className='w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group '>
          {userData.name[0].toUpperCase()}
          <div className="absolute hidden group-hover:block flex-col text-black top-0 right-0 z-10 rounded pt-10"> 
            <ul className="list-none bg-gray-100 text-sm m-0 p-2"> 

              {!userData.isAccountVerified && <li onClick={sendVerificationOtp} className='py-1 px-2 hover:bg-gray-200 cursor-pointer'>
              Verify Email</li>}
              
              <li onClick={logout} className='py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10'>
              Logout</li>
            </ul>
          </div>
        </div> :
          <button onClick={() => navigate('/login')} className="flex items-center gap-2 border border-gray-800 px-4 py-2 rounded-full text-gray-500 hover:bg-gray-700 transition-all">
          Login <img src={assets.arrow_icon} alt="" /> </button> }

        
    </div>
  )
}

export default Navbar
