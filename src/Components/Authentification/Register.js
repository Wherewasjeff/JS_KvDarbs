import React, { useState } from 'react';
import '../../App.css';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaUser, FaLanguage } from "react-icons/fa6";
import axios from 'axios';  // Axios for API requests

function Register() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    try {
      const response = await axios.post('http://my-laravel-app.test/api/register',
          {
        name: formData.name,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      // Handle successful registration
      if (response.status === 201) {
        setSuccess(true);
        setError('');
        // Optionally, redirect or show a success message
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message || 'Failed to register. Please try again.');
      } else {
        setError('Failed to register. Please try again.');
      }
    }
  };

  return (
      <div className="flex h-screen bg-[#f8fafe] overflow-hidden max-[320px]:flex-col">
        {/* Left side with blue background */}
        <h1 className="text-white font-semibold text-9xl absolute top-[45%] left-[18%] z-10 font-teko select-none max-[320px]:hidden">Stock</h1>
        <h1 className="text-white font-semibold text-9xl absolute top-[45%] left-[37%] z-20 font-teko select-none max-[320px]:hidden">mart</h1>
        <img
            src="/IconsBlue/Logoblue.png"
            alt="Logo"
            className="absolute z-10 top-[45%] left-[31.5%] w-[100px] fall-then-levitate select-none max-[320px]:hidden"
        />
        <div
            className="w-1/2 bg-[#f8fafe] flex justify-center items-center relative max-[320px]:absolute max-[320px]:w-full max-[320px]:h-full max-[320px]:opacity-50">
          <div
              className="w-full h-full bg-[#f5dfd6] flex justify-center items-center absolute rotate-45 shift-right"></div>
          <div
              className="w-full h-full bg-[#ecc0ad] flex justify-center items-center absolute rotate-45 right-36 top-2 shift-left"></div>
          <div
              className="w-full h-full bg-[#DF9677] flex justify-center items-center absolute rotate-45 right-80 top-2 shift-diagonal"></div>
        </div>

        {/* Right side with the registration form */}
        <div className="w-1/2 flex justify-center items-center relative max-[320px]:w-full max-[320px]:h-screen">
          <img src="/Fullofoblack.png" alt="logo"
               className="max-[320px]:absolute max-[320px]:top-14 max-[320px]:visible min-[321px]:hidden"/>
          <div
              className="p-10 w-1/2 ml-20 max-[320px]:w-11/12 max-[320px]:ml-0 max-[320px]:bg-[#f8fafe] rounded-lg max-[320px]:p-5">
            {/* Registration title with Teko font */}
            <h2 className="text-[#4E82E4] text-5xl font-semibold mb-6 font-teko max-[320px]:mb-2 select-none">Register</h2>

            {/* Display error message */}
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {success && <div className="text-green-500 mb-4">Registration successful!</div>}

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Name input with icon */}
              <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                <FaUser className="h-4 w-4 mr-2 bg-white text-[#4E82E4]"/>
                <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full outline-none"
                    placeholder="First Name"
                    required
                />
              </div>

              {/* Last Name input with icon */}
              <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                <FaUser className="h-4 w-4 mr-2 bg-white text-[#4E82E4]"/>
                <input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full outline-none"
                    placeholder="Last Name"
                    required
                />
              </div>

              {/* Email input with icon */}
              <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                <FaEnvelope className="h-4 w-4 mr-2 bg-white text-[#4E82E4]"/>
                <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full outline-none"
                    placeholder="Email address"
                    required
                />
              </div>

              {/* Password input with icon */}
              <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                <FaLock className="h-4 w-4 mr-2 bg-white text-[#4E82E4]"/>
                <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full outline-none"
                    placeholder="Password"
                    required
                />
              </div>

              {/* Confirm Password input with icon */}
              <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                <FaLock className="h-4 w-4 mr-2 bg-white text-[#4E82E4]"/>
                <input
                    type="password"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full outline-none"
                    placeholder="Confirm Password"
                    required
                />
              </div>

              <button className="bg-[#4E82E4] hover:bg-[#2968DE] text-white font-semibold py-2 px-4 rounded w-full">
                Register
              </button>

              {/* OR separator */}
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
          <FaLanguage className="h-[50px] cursor-pointer text-5xl text-[#DA8460]" onClick={toggleDropdown}></FaLanguage>
          {dropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white shadow-md rounded-lg w-[140px]">
                <div className="flex items-center cursor-pointer p-2 hover:bg-gray-200">
                  <img src="/Flags/Uk.png" alt="English" className="h-5 w-5 mr-2"/>
                  <span>English</span>
                </div>
                <div className="flex items-center cursor-pointer p-2 hover:bg-gray-200">
                  <img src="/Flags/Latvia.png" alt="Latviešu" className="h-5 w-5 mr-2"/>
                  <span>Latviešu</span>
                </div>
              </div>
          )}
        </div>
      </div>
  );
}

export default Register;
