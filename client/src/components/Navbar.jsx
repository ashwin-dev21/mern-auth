import React, { useContext, useState } from "react";
import { assets } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, setIsLoggedIn, setUserData, api } = useContext(AppContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Send Email Verification OTP
  const sendVerificationOtp = async () => {
    try {
      // Using the central 'api' instance from AppContext
      const { data } = await api.post("/api/auth/send-verify-otp", {
        userId: userData._id, // or userData.id
      });

      if (data.success) {
        toast.success(data.message);
        setIsMenuOpen(false);
        navigate("/email-verify");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("SEND OTP ERROR:", err);
      toast.error(
        err.response?.data?.message || err.message || "Something went wrong"
      );
    }
  };

  // User Logout
  const logout = async () => {
    try {
      const { data } = await api.post("/api/auth/logout");

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
        err.response?.data?.message || err.message || "Something went wrong"
      );
    }
  };

  return (
    <nav className="w-full flex items-center justify-between px-5 py-4 sm:px-10 md:px-16 lg:px-24 absolute top-0 z-50">
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
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="w-10 h-10 sm:w-11 sm:h-11 flex justify-center items-center rounded-full bg-black text-white font-medium cursor-pointer hover:bg-gray-800 transition"
          >
            {userData.name?.[0]?.toUpperCase()}
          </button>

          {/* BACKDROP TO CLOSE DROPDOWN ON CLICK OUTSIDE */}
          {isMenuOpen && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsMenuOpen(false)}
            />
          )}

          {/* DROPDOWN MENU */}
          {isMenuOpen && (
            <div className="absolute right-0 top-12 sm:top-14 w-44 sm:w-48 bg-gray-700 rounded-lg shadow-xl overflow-hidden z-50">
              {/* VERIFY EMAIL */}
              {!userData.isAccountVerified && (
                <button
                  type="button"
                  onClick={sendVerificationOtp}
                  className="block w-full text-left px-4 py-3 text-white hover:bg-gray-600 active:bg-gray-500 cursor-pointer transition"
                >
                  Verify Email
                </button>
              )}

              {/* LOGOUT */}
              <button
                type="button"
                onClick={logout}
                className="block w-full text-left px-4 py-3 text-white hover:bg-gray-600 active:bg-gray-500 cursor-pointer transition"
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
          className="flex items-center gap-2 border border-gray-800 px-4 py-2 rounded-full text-gray-600 hover:bg-gray-100 transition cursor-pointer"
        >
          Login
          <img src={assets.arrow_icon} alt="arrow" className="w-4" />
        </button>
      )}
    </nav>
  );
};

export default Navbar;