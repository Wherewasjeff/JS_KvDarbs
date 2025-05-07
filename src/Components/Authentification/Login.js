import React, { useState } from 'react';
import '../../App.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaLanguage } from 'react-icons/fa6';
import axios from 'axios';
import { useTranslation } from "../TranslationContext";
import authTranslations from '../TranslationContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [userData, setUserdata] = useState(null);
  const { language, switchLanguage } = useTranslation();
  const translations = authTranslations[language] || authTranslations.en;

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://stocksmart.xyz/api/login', {
        identifier: email,
        password,
      }, { withCredentials: true });

      const { token, user, role } = response.data;

      // Store token and user role
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userRole', role); // Store role (owner or worker)
      localStorage.removeItem("pageHiddenTime");

      console.log("Login successful:", user);

      // Redirect based on role
      if (role === "owner") {
        navigate('/storeinfo');
      } else if (role === "worker") {
        navigate('/storeinfo'); // Workers see the same dashboard
      }

      // Wait for a brief moment before reloading the page
      setTimeout(() => {
        window.location.reload();
      }, 0);
    } catch (error) {
      setErrorMessage('Invalid email/username or password');
      console.error('Login failed:', error);
    }
  };

  return (
      <div className="flex h-screen bg-[#f8fafe] overflow-hidden max-md:flex-col">
        {/* Left side with blue background */}
        <div className="absolute top-[45%] left-[20%] max-2xl:left-[5%] transition-all duration-300 flex z-20">
        <h1 className="text-white font-semibold text-9xl z-10 font-teko max-lg:hidden max-md:scale-0 select-none">Stock</h1>
        <img
        src="./IconsOrange/Logoorange.png"
        alt="Logo"
        className="z-10 w-[100px] h-[100px] fall-then-levitate ml-2 max-lg:hidden max-md:scale-0 select-none"
        />
        <h1 className="text-white font-semibold text-9xl z-20 font-teko max-lg:hidden max-md:scale-0 select-none">mart</h1>
      </div>
        <div
            className="w-1/2 bg-[#f8fafe] flex justify-center items-center relative max-md:w-[100%] max-lg:absolute max-lg:h-screen max-md:opacity-50">
          <div
              className="w-full h-full bg-[#b4caf4] flex justify-center items-center absolute rotate-45 transition-all duration-300 shift-right max-lg:left-[-10%] max-lg:w-[150%]"></div>
          <div
              className="w-full h-full bg-[#90b1ee] flex justify-center items-center absolute rotate-45 transition-all duration-300 right-36 top-2 shift-left max-lg:left-[-50%] max-lg:w-[150%]"></div>
          <div
              className="w-full h-full bg-[#4E82E4] flex justify-center items-center absolute rotate-45 transition-all duration-300 right-80 top-2 shift-diagonal max-lg:left-[-90%] max-lg:w-[150%]"></div>
        </div>

        {/* Right side with the login form */}
        <div
            className="w-1/2 flex justify-center items-center relative max-lg:w-screen max-lg:overflow-hidden max-lg:h-screen">
          <img src="/Fullogowhite.png" alt="logo"
               className="max-md:relative max-md:top-16 max-md:visible hidden"/>
          <div
              className="p-10 w-1/2 ml-20 bg-[#f8fafe] min-w-[300px] max-md:p-5 fade-in rounded-lg bg-opacity-10 max-xl:bg-opacity-50 transition-all duration-300 max-md:w-5/6 max-md:ml-0">
            {/* Login title with Teko font */}
            <h2 className="text-[#DF9677] text-5xl font-semibold mb-6 font-teko select-none">{translations.loginTitle}</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Email input with icon */}
              <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                <FaEnvelope className="h-5 w-5 mr-2 bg-white text-[#DF9677]"/>
                <input
                    type="text"
                    id="identifier"
                    className="w-full outline-none"
                    placeholder={translations.emailPlaceholder}
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
                    placeholder={translations.passwordPlaceholder}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
              </div>

              {errorMessage && <p className="text-red-500">{errorMessage}</p>}

              <div className="flex justify-between items-center">
                <div>
                  <input type="checkbox" id="remember" className="mr-2"/>
                  <label htmlFor="remember" className="text-gray-700">{translations.rememberMe}</label>
                </div>
              </div>

              <button className="bg-[#DF9677] hover:bg-[#DA8460] text-white font-semibold py-2 px-4 rounded w-full">{translations.loginButton}</button>
              <div className="w-full h-10 flex">
                <div className="h-full w-4/6 flex items-center">
                  <div className="w-full h-0.5 bg-[#4E82E4]"></div>
                </div>
                <div className="h-full w-1/6 flex justify-center items-center">
                  <p className="text-[#4E82E4]">{translations.orText}</p>
                </div>
                <div className="h-full w-4/6 flex items-center">
                  <div className="w-full h-0.5 bg-[#4E82E4]"></div>
                </div>
              </div>
              <Link to="/register">
                <button className="bg-[#4E82E4] hover:bg-[#2968DE] text-white font-semibold py-2 px-4 rounded w-full">{translations.registerButton}</button>
              </Link>
            </form>
          </div>
        </div>

        {/* Language button and dropdown */}
        <div className="absolute top-[3%] right-[2%] fall-animation">
          <FaLanguage className="h-[50px] cursor-pointer text-5xl text-[#4E82E4]" onClick={toggleDropdown}></FaLanguage>
          {dropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white shadow-md rounded-lg w-[140px]">
                <div className="flex items-center cursor-pointer p-2 hover:bg-gray-200" onClick={() => switchLanguage('en')}>
                  <img src="/Flags/Uk.png" alt="English" className="h-5 w-5 mr-2"/>
                  <span>English</span>
                </div>
                <div className="flex items-center cursor-pointer p-2 hover:bg-gray-200" onClick={() => switchLanguage('lv')}>
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
