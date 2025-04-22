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
      <div className="flex h-screen bg-[#f8fafe] overflow-hidden max-2xl:flex-col">
        {/* Left side with blue background */}
        <h1 className="text-white font-semibold text-9xl absolute top-[45%] left-[18%] z-10 font-teko max-2xl:hidden max-2xl:scale-0 select-none">Stock</h1>
        <img
        src="./IconsOrange/Logoorange.png"
        alt="Logo"
        className="absolute z-10 top-[45%] left-[31.5%] w-[100px] h-[100px] fall-then-levitate max-2xl:hidden max-2xl:scale-0 select-none"
        />
        <h1 className="text-white font-semibold text-9xl absolute top-[45%] left-[36.5%] z-20 font-teko max-2xl:hiddenc max-2xl:scale-0 select-none">mart</h1>

        <div
            className="w-1/2 bg-[#f8fafe] flex justify-center items-center relative max-2xl:w-[100%] max-2xl:absolute max-2xl:h-screen max-2xl:opacity-50">
          <div
              className="w-full h-full bg-[#b4caf4] flex justify-center items-center absolute rotate-45 shift-right max-2xl:w-[150%]"></div>
          <div
              className="w-full h-full bg-[#90b1ee] flex justify-center items-center absolute rotate-45 right-36 top-2 shift-left max-2xl:w-[150%]"></div>
          <div
              className="w-full h-full bg-[#4E82E4] flex justify-center items-center absolute rotate-45 right-80 top-2 shift-diagonal max-2xl:w-[150%]"></div>
        </div>

        {/* Right side with the login form */}
        <div
            className="w-1/2 flex justify-center items-center relative max-2xl:w-screen max-2xl:overflow-hidden max-2xl:h-screen">
          <img src="/Fullofoblack.png" alt="logo"
               className="max-2xl:absolute max-2xl:top-16 max-2xl:visible hidden"/>
          <div
              className="p-10 w-1/2 ml-20 bg-[#f8fafe] rounded-lg bg-opacity-10 max-2xl:w-11/12 max-2xl:ml-0 max-2xl:bg-[#f8fafe] max-2xl:p-5">
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
