import React, { useState } from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaLanguage, FaLock } from 'react-icons/fa6';

function App() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="flex h-screen bg-[#f8fafe] overflow-hidden">
      {/* Left side with blue background */}
      <h1 className="text-white font-semibold text-9xl absolute top-[45%] left-[18%] z-10 font-teko">Stock</h1>
      <h1 className="text-white font-semibold text-9xl absolute top-[45%] left-[37%] z-20 font-teko">mart</h1>
      <img
        src="/IconsOrange/Logoorange.png"
        alt="Logo"
        className="absolute z-10 top-[45%] left-[31.5%] w-[100px] fall-then-levitate"
      />
      <div className="w-1/2 bg-[#f8fafe] flex justify-center items-center relative">
        <div
          className="w-full h-full bg-[#b4caf4] flex justify-center items-center absolute rotate-45 shift-right"></div>
        <div
          className="w-full h-full bg-[#90b1ee] flex justify-center items-center absolute rotate-45 right-36 top-2 shift-left"></div>
        <div
          className="w-full h-full bg-[#4E82E4] flex justify-center items-center absolute rotate-45 right-80 top-2 shift-diagonal"></div>
        {/* Main Stocker text with Teko font */}
      </div>
      {/* Right side with the login form */}
      <div className="w-1/2 flex justify-center items-center relative">
        <div className="p-10 w-1/2 ml-20 bg-[#f8fafe] rounded-lg bg-opacity-10">
          {/* Login title with Teko font */}
          <h2 className="text-[#DF9677] text-5xl font-semibold mb-6 font-teko">Login</h2>
          <form className="space-y-4">
            {/* Email input with icon */}
            <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
              <FaEnvelope className="h-5 w-5 mr-2 bg-white text-[#DF9677]" />
              <input
                type="email"
                id="email"
                className="w-full outline-none"
                placeholder="Email address or Username"
              />
            </div>

            {/* Password input with icon */}
            <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
              <FaLock className="h-5 w-5 mr-2 bg-white text-[#DF9677]" />
              <input
                type="password"
                id="password"
                className="w-full outline-none"
                placeholder="Password"
              />
            </div>

            <div className="flex justify-between items-center">
              <div>
                <input type="checkbox" id="remember" className="mr-2" />
                <label htmlFor="remember" className="text-gray-700">Remember me</label>
              </div>
            </div>

            <button className="bg-[#DF9677] hover:bg-[#DA8460] text-white font-semibold py-2 px-4 rounded w-full">
              Login
            </button>
            <div className="w-full h-10 flex">
              <div className="h-full w-4/6 flex items-center">
                <div className="w-full h-0.5 bg-[#4E82E4]"></div>
              </div>
              <div className="h-full w-1/6 flex justify-center items-center">
                <p className="text-[#4E82E4]">OR</p>
              </div>
              <div className="h-full w-4/6 flex items-center">
                <div className="w-full h-0.5 bg-[#4E82E4]"></div>
              </div>
            </div>
            <Link to="/register">
              <button className="bg-[#4E82E4] hover:bg-[#2968DE] text-white font-semibold py-2 px-4 rounded w-full">
                Register
              </button>
            </Link>
          </form>
        </div>
      </div>

      {/* Language button and dropdown */}
      <div className="absolute top-[3%] right-[2%] fall-animation">
        <FaLanguage className="h-[50px] cursor-pointer text-5xl text-[#4E82E4]" onClick={toggleDropdown}></FaLanguage>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 bg-white shadow-md rounded-lg w-[140px]">
            <div className="flex items-center cursor-pointer p-2 hover:bg-gray-200 w-">
              <img src="/Flags/Uk.png" alt="English" className="h-5 w-5 mr-2" />
              <span>English</span>
            </div>
            <div className="flex items-center cursor-pointer p-2 hover:bg-gray-200 w-full">
              <img src="/Flags/Latvia.png" alt="Latviešu" className="h-5 w-5 mr-2" />
              <span>Latviešu</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
