import React, { useState } from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaUser, FaLanguage } from "react-icons/fa6";

function Register() {
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
        src="/IconsBlue/Logoblue.png"
        alt="Logo"
        className="absolute z-10 top-[45%] left-[31.5%] w-[100px] fall-then-levitate"
      />
      <div className="w-1/2 bg-[#f8fafe] flex justify-center items-center relative">
        <div
          className="w-full h-full bg-[#f5dfd6] flex justify-center items-center absolute rotate-45 shift-right"></div>
        <div
          className="w-full h-full bg-[#ecc0ad] flex justify-center items-center absolute rotate-45 right-36 top-2 shift-left"></div>
        <div
          className="w-full h-full bg-[#DF9677] flex justify-center items-center absolute rotate-45 right-80 top-2 shift-diagonal"></div>
        {/* Main Stocker text with Teko font */}
      </div>
      {/* Right side with the registration form */}
      <div className="w-1/2 flex justify-center items-center relative">
        <div className="p-10 w-1/2 ml-20">
          {/* Registration title with Teko font */}
          <h2 className="text-[#4E82E4] text-5xl font-semibold mb-6 font-teko">Register</h2>
          <form className="space-y-4">
            {/* Name input with icon */}
            <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
              <FaUser className="h-4 w-4 mr-2 bg-white text-[#4E82E4]" />
              <input
                type="text"
                id="name"
                className="w-full outline-none"
                placeholder="First Name"
              />
            </div>

            {/* Last Name input with icon */}
            <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
              <FaUser className="h-4 w-4 mr-2 bg-white text-[#4E82E4]" />
              <input
                type="text"
                id="lastName"
                className="w-full outline-none"
                placeholder="Last Name"
              />
            </div>

            {/* Email input with icon */}
            <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
              <FaEnvelope className="h-4 w-4 mr-2 bg-white text-[#4E82E4]" />
              <input
                type="email"
                id="email"
                className="w-full outline-none"
                placeholder="Email address"
              />
            </div>

            {/* Password input with icon */}
            <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
              <FaLock className="h-4 w-4 mr-2 bg-white text-[#4E82E4]" />
              <input
                type="password"
                id="password"
                className="w-full outline-none"
                placeholder="Password"
              />
            </div>

            {/* Confirm Password input with icon */}
            <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
              <FaLock className="h-4 w-4 mr-2 bg-white text-[#4E82E4]" />
              <input
                type="password"
                id="confirmPassword"
                className="w-full outline-none"
                placeholder="Confirm Password"
              />
            </div>

            <button className="bg-[#4E82E4] hover:bg-[#2968DE] text-white font-semibold py-2 px-4 rounded w-full">
              Register
            </button>
            <div className="w-full h-10 flex">
              <div className="h-full w-4/6 flex items-center">
                <div className="w-full h-0.5 bg-[#DF9677]"></div>
              </div>
              <div className="h-full w-1/6 flex justify-center items-center">
                <p className="text-[#DF9677]">OR</p>
              </div>
              <div className="h-full w-4/6 flex items-center">
                <div className="w-full h-0.5 bg-[#DF9677]"></div>
              </div>
            </div>
            <Link to="/">
            <button className="bg-[#DF9677] hover:bg-[#DA8460] text-white font-semibold py-2 px-4 rounded w-full">
              Login
            </button>
            </Link>
          </form>
        </div>
      </div>

      {/* Language button and dropdown */}
      <div className="absolute top-[3%] right-[2%] fall-animation">
        <FaLanguage className="h-[50px] cursor-pointer text-5xl text-[#DF9677]" onClick={toggleDropdown}></FaLanguage>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 bg-white shadow-md rounded-lg w-[140px]">
            <div className="flex items-center cursor-pointer p-2 hover:bg-gray-200">
              <img src="/Flags/Uk.png" alt="English" className="h-5 w-5 mr-2" />
              <span>English</span>
            </div>
            <div className="flex items-center cursor-pointer p-2 hover:bg-gray-200">
              <img src="/Flags/Latvia.png" alt="Latviešu" className="h-5 w-5 mr-2" />
              <span>Latviešu</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Register;
