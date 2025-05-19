import React, { useContext, useEffect } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/navbar.css";
import Doctors from "../pages/Doctors";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { token, setToken } = useContext(AppContext);

  const logout = () => {
    setToken(false);
    localStorage.removeItem("token");
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <div className="flex items-center justify-between px-4 md:px-8 lg:px-12 py-5 mb-6 border-b border-b-gray-400">
      {/* Logo */}
      <div className="flex-shrink-0">
        <img
          onClick={() => navigate("/")}
          className="w-40 md:w-48 lg:w-56 cursor-pointer"
          src={assets.logo}
          alt="Logo"
        />
      </div>

      {/* Admin Panel Button - Centered */}
      <div className="hidden md:block mx-4">
        <a
          href="http://localhost:5174/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block border cursor-pointer border-gray-300 text-black text-sm font-medium px-4 py-2 rounded-full hover:bg-gray-100 transition-colors duration-300"
        >
          Admin Panel
        </a>
      </div>

      {/* Navigation Links - Centered and evenly spaced */}
      <div className="flex-1 flex justify-center">
        <ul className="hidden md:flex items-center gap-4 lg:gap-8 font-semibold text-sm lg:text-base">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <li className="py-2 px-2 text-center relative">
              HOME
              <hr className="border-none outline-none h-1 bg-[#5f6fff] w-3/5 m-auto hidden" />
            </li>
          </NavLink>
          <NavLink
            to="/doctors"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <li className="py-2 px-2 text-center">
              ALL DOCTORS
              <hr className="border-none outline-none h-1 bg-[#5f6fff] w-3/5 m-auto hidden" />
            </li>
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <li className="py-2 px-2 text-center">
              ABOUT
              <hr className="border-none outline-none h-1 bg-[#5f6fff] w-3/5 m-auto hidden" />
            </li>
          </NavLink>
          <NavLink
            to="/contacts"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <li className="py-2 px-2 text-center">
              CONTACT
              <hr className="border-none outline-none h-1 bg-[#5f6fff] w-3/5 m-auto hidden" />
            </li>
          </NavLink>
        </ul>
      </div>

      {/* User/Auth Section */}
      <div className="flex-shrink-0 flex items-center gap-3 md:gap-5">
        {token ? (
          <div className="flex items-center gap-3 cursor-pointer group relative">
            <img
              className="w-8 md:w-10 rounded-full"
              src={assets.profile_pic}
              alt="Profile"
            />
            <img className="w-2 md:w-3" src={assets.dropdown_icon} alt="" />
            <div className="absolute top-full right-0 mt-2 text-base font-medium text-gray-700 z-20 hidden group-hover:block">
              <div className="min-w-48 bg-stone-100 rounded-lg flex flex-col gap-3 p-3 shadow-lg">
                <p
                  onClick={() => navigate("/my-profile")}
                  className="hover:text-black cursor-pointer px-3 py-2"
                >
                  My Profile
                </p>
                <p
                  onClick={() => navigate("/my-appointments")}
                  className="hover:text-black cursor-pointer px-3 py-2"
                >
                  My Appointments
                </p>
                <p 
                  onClick={logout} 
                  className="hover:text-black cursor-pointer px-3 py-2"
                >
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="cursor-pointer bg-[#5f6fff] text-white px-6 py-2 md:px-8 md:py-3 rounded-full font-semibold text-sm md:text-base"
          >
            Create Account
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;