import React, { useContext } from "react";
import { assets } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();

  const {
    userData,
    setIsLoggedIn,
    setUserData,
    api,
  } = useContext(AppContext);

  const sendVerificationOtp = async () => {
    try {
      const { data } = await api.post("/api/auth/send-verify-otp");

      if (data.success) {
        toast.success(data.message);
        navigate("/email-verify");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const logout = async () => {
    try {
      const { data } = await api.post("/api/auth/logout");

      if (data.success) {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setUserData(null);

        toast.success(data.message);

        navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="w-full flex items-center justify-between p-4 sm:p-6 sm:px-24 absolute top-0">
      <img
        src={assets.logo}
        alt="logo"
        className="w-28 sm:w-32 cursor-pointer"
        onClick={() => navigate("/")}
      />

      {userData ? (
        <div className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group">
          {userData.name[0].toUpperCase()}

          <div className="absolute hidden group-hover:block top-0 right-0 pt-10 z-10">
            <ul className="bg-gray-700 text-sm rounded shadow-lg">

              {!userData.isAccountVerified && (
                <li
                  onClick={sendVerificationOtp}
                  className="py-2 px-4 hover:bg-gray-600 cursor-pointer"
                >
                  Verify Email
                </li>
              )}

              <li
                onClick={logout}
                className="py-2 px-4 hover:bg-gray-600 cursor-pointer"
              >
                Logout
              </li>

            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 border border-gray-800 px-4 py-2 rounded-full text-gray-600 hover:bg-gray-100"
        >
          Login
          <img src={assets.arrow_icon} alt="" />
        </button>
      )}
    </div>
  );
};

export default Navbar;