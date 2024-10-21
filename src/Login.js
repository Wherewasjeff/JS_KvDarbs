import React, { useState } from 'react';
import './App.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaLanguage } from 'react-icons/fa6';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [userData, setUserdata] = useState(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://my-laravel-app.test/api/login', {
        email,
        password,
      }, { withCredentials: true }); // Sends the credentials with the request
      const userdata = response.data.user
      console.log(userdata)
      if (response){
        setUserdata(userdata);
        console.log(response.data.user.last_name);
      }
      if (response.data.token) {
        // Store token (optional, depends on your auth flow)
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Redirect to a different page (e.g., dashboard)
        navigate('/storeinfo', {});
      }
    } catch (error) {
      // Handle errors
      setErrorMessage('Invalid email or password');
      console.error('Error during login:', error);
    }
  };


  return (
      <div className="flex h-screen bg-[#f8fafe] overflow-hidden max-[320px]:flex-col max-[320px]:w-[320px]">
        {/* Left side with blue background */}
        <h1 className="text-white font-semibold text-9xl absolute top-[45%] left-[18%] z-10 font-teko max-[320px]:hidden select-none">Stock</h1>
        <img
            src="/IconsOrange/Logoorange.png"
            alt="Logo"
            className="absolute z-10 top-[45%] left-[31.5%] w-[100px] h-[100px] fall-then-levitate max-[320px]:hidden select-none"
        />
        <h1 className="text-white font-semibold text-9xl absolute top-[45%] left-[37%] z-20 font-teko max-[320px]:hidden select-none">mart</h1>

        <div
            className="w-1/2 bg-[#f8fafe] flex justify-center items-center relative max-[320px]:w-[100%] max-[320px]:absolute max-[320px]:h-screen max-[320px]:opacity-50">
          <div
              className="w-full h-full bg-[#b4caf4] flex justify-center items-center absolute rotate-45 shift-right max-[320px]:w-[150%]"></div>
          <div
              className="w-full h-full bg-[#90b1ee] flex justify-center items-center absolute rotate-45 right-36 top-2 shift-left max-[320px]:w-[150%]"></div>
          <div
              className="w-full h-full bg-[#4E82E4] flex justify-center items-center absolute rotate-45 right-80 top-2 shift-diagonal max-[320px]:w-[150%]"></div>
        </div>

        {/* Right side with the login form */}
        <div
            className="w-1/2 flex justify-center items-center relative max-[320px]:w-screen max-[320px]:overflow-hidden max-[320px]:h-screen">
          <img src="/Fullofoblack.png" alt="logo"
               className="max-[320px]:absolute max-[320px]:top-28 max-[320px]:visible min-[321px]:hidden"/>
          <div
              className="p-10 w-1/2 ml-20 bg-[#f8fafe] rounded-lg bg-opacity-10 max-[320px]:w-11/12 max-[320px]:ml-0 max-[320px]:bg-[#f8fafe] max-[320px]:p-5">
            {/* Login title with Teko font */}
            <h2 className="text-[#DF9677] text-5xl font-semibold mb-6 font-teko select-none">Login</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Email input with icon */}
              <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                <FaEnvelope className="h-5 w-5 mr-2 bg-white text-[#DF9677]"/>
                <input
                    type="email"
                    id="email"
                    className="w-full outline-none"
                    placeholder="Email address or Username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
              </div>

              {/* Password input with icon */}
              <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                <FaLock className="h-5 w-5 mr-2 bg-white text-[#DF9677]"/>
                <input
                    type="password"
                    id="password"
                    className="w-full outline-none"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
              </div>

              {errorMessage && <p className="text-red-500">{errorMessage}</p>}

              <div className="flex justify-between items-center">
                <div>
                  <input type="checkbox" id="remember" className="mr-2"/>
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

export default Login;
