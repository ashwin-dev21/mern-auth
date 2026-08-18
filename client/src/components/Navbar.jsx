import React, { useContext, useState } from "react";
import { assets } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";
import { toast } from "react-toastify";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();

  const {
    userData,
    setIsLoggedIn,
    setUserData,
    api,
  } = useContext(AppContext);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const sendVerificationOtp = async () => {
    console.log("VERIFY EMAIL CLICKED");

    try {
      console.log("Calling send-verify-otp API...");

      // ✅ FIX: Passed {} as body instead of 'data'
      const { data } = await axios.post(
        'http://localhost:4000/api/send-verify-otp',
        {},
        { withCredentials: true }
      );

      console.log("API RESPONSE:", data);

      if (data.success) {
        toast.success(data.message);
        setIsMenuOpen(false);
        navigate("/email-verify");
      } else {
        toast.error(data.message);
      }

    } catch (err) {
      console.error("SEND OTP ERROR:", err);
      console.log("STATUS:", err.response?.status);
      console.log("SERVER RESPONSE:", err.response?.data);
      console.log("HEADERS:", err.response?.headers);

      toast.error(
        err.response?.data?.message ||
        err.message ||
        "Something went wrong"
      );
    }
  };

  const logout = async () => {
    try {
      const { data } = await axios.post(
        'http://localhost:4000/api/logout',
        {},
        { withCredentials: true }
      );

      if (data.success) {
        setIsLoggedIn(false);
        setUserData(null);
        setIsMenuOpen(false);

        toast.success(data.message);
        navigate("/");
      }

    } catch (err) {
      console.error("LOGOUT ERROR:", err);

      toast.error(
        err.response?.data?.message ||
        err.message ||
        "Something went wrong"
      );
    }
  };

  return (
    <div className="w-full flex items-center justify-between px-5 py-4 sm:px-10 md:px-16 lg:px-24 absolute top-0 z-50">

      {/* LOGO */}
      <img
        src={assets.logo}
        alt="logo"
        className="w-28 sm:w-32 cursor-pointer"
        onClick={() => navigate("/")}
      />

      {/* USER MENU */}
      {userData ? (
        <div className="relative">

          {/* PROFILE BUTTON */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-10 h-10 sm:w-11 sm:h-11 flex justify-center items-center rounded-full bg-black text-white font-medium cursor-pointer hover:bg-gray-800 transition"
          >
            {userData.name?.[0]?.toUpperCase()}
          </button>

          {/* DROPDOWN */}
          {isMenuOpen && (
            <div
              className="
                absolute
                right-0
                top-12
                sm:top-14
                w-44
                sm:w-48
                bg-gray-700
                rounded-lg
                shadow-xl
                overflow-hidden
                z-999
              "
            >

              {/* VERIFY EMAIL */}
              {!userData.isAccountVerified && (
                <button
                  type="button"
                  onClick={sendVerificationOtp}
                  className="
                    block
                    w-full
                    text-left
                    px-4
                    py-3
                    text-white
                    hover:bg-gray-600
                    active:bg-gray-500
                    cursor-pointer
                    transition
                  "
                >
                  Verify Email
                </button>
              )}

              {/* LOGOUT */}
              <button
                type="button"
                onClick={logout}
                className="
                  block
                  w-full
                  text-left
                  px-4
                  py-3
                  text-white
                  hover:bg-gray-600
                  active:bg-gray-500
                  cursor-pointer
                  transition
                "
              >
                Logout
              </button>

            </div>
          )}

        </div>
      ) : (

        /* LOGIN BUTTON */
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="
            flex
            items-center
            gap-2
            border
            border-gray-800
            px-4
            py-2
            rounded-full
            text-gray-600
            hover:bg-gray-100
            transition
          "
        >
          Login

          <img
            src={assets.arrow_icon}
            alt=""
            className="w-4"
          />
        </button>

      )}

    </div>
  );
};

export default Navbar;