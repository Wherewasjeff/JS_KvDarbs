import React, { useState, useEffect } from 'react';
import '../../App.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaUser, FaLanguage } from "react-icons/fa6";
import axios from 'axios';
import { useTranslation } from "../TranslationContext";
import authTranslations from '../TranslationContext';

function Register() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { language, switchLanguage } = useTranslation();
  const translations = authTranslations[language] || authTranslations.en;
  const navigate = useNavigate();
  const [animateExit, setAnimateExit] = useState(false);
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

  const [passwordErrors, setPasswordErrors] = useState({
    length: false,
    number: false,
    match: false
  });

  const validatePassword = (password, confirm) => {
    const errors = {
      length: password.length >= 8,
      number: /\d/.test(password),
      match: password === confirm
    };
    setPasswordErrors(errors);
    return Object.values(errors).every(v => v);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validatePassword(formData.password, formData.confirmPassword)) {
      setError('Please fix password validation issues');
      return;
    }

    try {
      const response = await axios.post('https://stocksmart.xyz/api/register', {
        name: formData.name,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 201) {
        setSuccess(true);
        setError('');
        setAnimateExit(true);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        // Handle email exists error specifically
        if (error.response.data.errors?.email) {
          setError(translations.emailExistsError);
        }
        // Handle password validation errors
        else if (error.response.data.errors?.password) {
          setError(error.response.data.errors.password[0]);
        }
        // Fallback to general error
        else {
          setError(error.response.data.message || 'Failed to register. Please try again.');
        }
      } else {
        setError('Failed to register. Please try again.');
      }
    }
  };
  useEffect(() => {
    if (animateExit) {
      const timer = setTimeout(() => {
        navigate('/'); // Navigate after animation
      }, 500); // Adjust time to match your animation duration
      return () => clearTimeout(timer);
    }
  }, [animateExit, navigate]);

  const renderPasswordRules = () => (
      <div className="text-sm text-gray-600 mt-1 space-y-1">
        <p>{translations.passwordRulesTitle}:</p>
        <div className={`flex items-center transition-all duration-300 ${passwordErrors.length ? 'text-green-500' : 'text-red-500'}`}>
          <span className="mr-1">•</span>
          {translations.passwordRuleLength}
        </div>
        <div className={`flex items-center transition-all duration-300 ${passwordErrors.number ? 'text-green-500' : 'text-red-500'}`}>
          <span className="mr-1">•</span>
          {translations.passwordRuleNumber}
        </div>
        <div className={`flex items-center transition-all duration-300 ${passwordErrors.match ? 'text-green-500' : 'text-red-500'}`}>
          <span className="mr-1">•</span>
          {translations.passwordRuleMatch}
        </div>
      </div>
  );
  return (
      <div className="flex h-screen bg-[#f8fafe] overflow-hidden max-md:flex-col">
        {/* Left side with blue background - Changed to orange shades */}
        <div className="absolute top-[45%] left-[20%] max-2xl:left-[5%] transition-all duration-300 flex z-20">
          <h1 className="text-white font-semibold text-9xl z-10 font-teko max-lg:hidden max-md:scale-0 select-none">Stock</h1>
          <img
              src="./IconsBlue/Logoblue.png"
              alt="Logo"
              className="z-10 w-[100px] h-[100px] fall-then-levitate ml-2 max-lg:hidden max-md:scale-0 select-none"
          />
          <h1 className="text-white font-semibold text-9xl z-20 font-teko max-lg:hidden max-md:scale-0 select-none">mart</h1>
        </div>
        <div
            className="w-1/2 bg-[#f8fafe] flex justify-center items-center relative max-md:w-[100%] max-lg:absolute max-lg:h-screen max-md:opacity-50">
          <div
              className="w-full h-full bg-[#f5dfd6] flex justify-center items-center absolute rotate-45 transition-all duration-300 shift-right max-lg:left-[-10%] max-lg:w-[150%]"></div>
          <div
              className="w-full h-full bg-[#ecc0ad] flex justify-center items-center absolute rotate-45 transition-all duration-300 right-36 top-2 shift-left max-lg:left-[-50%] max-lg:w-[150%]"></div>
          <div
              className="w-full h-full bg-[#DF9677] flex justify-center items-center absolute rotate-45 transition-all duration-300 right-80 top-2 shift-diagonal max-lg:left-[-90%] max-lg:w-[150%]"></div>
        </div>
        {/* Right side with the registration form */}
        <div
            className="w-1/2 flex justify-center items-center relative max-lg:w-screen max-lg:overflow-hidden max-lg:h-screen">
          <img src="/Fullogowhite.png" alt="logo" className="max-md:relative max-md:top-16 max-md:visible hidden"/>
          <div
              className="p-10 w-1/2 ml-20 bg-[#f8fafe] min-w-[300px] max-md:p-5 fade-in rounded-lg bg-opacity-10 max-xl:bg-opacity-50 transition-all duration-300 max-md:w-5/6 max-md:ml-0">
            <h2 className="text-[#4E82E4] text-5xl font-semibold mb-6 font-teko select-none">{translations.registerTitle}</h2>

            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && <p className="text-green-500 mb-4">{translations.registrationSuccess}</p>}

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Name Input */}
              <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                <FaUser className="h-5 w-5 mr-2 bg-white text-[#4E82E4]"/>
                <input
                    type="text"
                    id="name"
                    className="w-full outline-none"
                    placeholder={translations.firstNamePlaceholder}
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                />
              </div>

              {/* Last Name Input */}
              <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                <FaUser className="h-5 w-5 mr-2 bg-white text-[#4E82E4]"/>
                <input
                    type="text"
                    id="lastName"
                    className="w-full outline-none"
                    placeholder={translations.lastNamePlaceholder}
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                />
              </div>

              {/* Email Input */}
              <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                <FaEnvelope className="h-5 w-5 mr-2 bg-white text-[#4E82E4]"/>
                <input
                    type="email"
                    id="email"
                    className="w-full outline-none"
                    placeholder={translations.emailPlaceholder}
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                />
              </div>

              {/* Password Input */}
              <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                <FaLock className="h-5 w-5 mr-2 bg-white text-[#4E82E4]"/>
                <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onBlur={() => validatePassword(formData.password, formData.confirmPassword)}
                    className="w-full outline-none"
                    placeholder={translations.passwordPlaceholder}
                    required
                />
              </div>

              {/* Confirm Password Input */}
              <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                <FaLock className="h-5 w-5 mr-2 bg-white text-[#4E82E4]"/>
                <input
                    type="password"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    onBlur={() => validatePassword(formData.password, formData.confirmPassword)}
                    className="w-full outline-none"
                    placeholder={translations.confirmPasswordPlaceholder}
                    required
                />
              </div>
              {renderPasswordRules()}
              <button className="bg-[#4E82E4] hover:bg-[#2968DE] text-white font-semibold py-2 px-4 rounded w-full">
                {translations.registerButton}
              </button>

              <div className="w-full h-10 flex">
                <div className="h-full w-4/6 flex items-center">
                  <div className="w-full h-0.5 bg-[#DF9677]"></div>
                </div>
                <div className="h-full w-1/6 flex justify-center items-center">
                  <p className="text-[#DF9677]">{translations.orText}</p>
                </div>
                <div className="h-full w-4/6 flex items-center">
                  <div className="w-full h-0.5 bg-[#DF9677]"></div>
                </div>
              </div>

              <Link to="/">
                <button className="bg-[#DF9677] hover:bg-[#DA8460] text-white font-semibold py-2 px-4 rounded w-full">
                  {translations.loginButton}
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
                <div className="flex items-center cursor-pointer p-2 hover:bg-gray-200"
                     onClick={() => switchLanguage('en')}>
                  <img src="/Flags/Uk.png" alt="English" className="h-5 w-5 mr-2"/>
                  <span>English</span>
                </div>
                <div className="flex items-center cursor-pointer p-2 hover:bg-gray-200"
                     onClick={() => switchLanguage('lv')}>
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
