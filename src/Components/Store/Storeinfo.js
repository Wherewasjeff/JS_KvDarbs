import React, { useCallback, useEffect, useState, useRef } from 'react';
import TimePicker from 'react-time-picker';
import Sidebar from '../../Sidebar';
import '../../App.css';
import axios from 'axios';
import {FaInfo, FaBoxesStacked, FaUsers, FaXmark, FaStore, FaMapPin, FaTags, FaLanguage} from 'react-icons/fa6';
import { useLocation } from 'react-router-dom';
import { useAuth } from "../Authentification/AuthContext";
import { useNavigate } from "react-router-dom";
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import {
  addStorageTranslations,
  useTranslation,
  storeinfotranslations
} from "../TranslationContext";

const StoreInfo = () => {
  const [hasBackroom, setHasBackroom] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { language, switchLanguage } = useTranslation();
  const { user, setUser } = useAuth();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [isMilitary, setIsMilitary] = useState(true);
  const [storeName, setStoreName] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState('');
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const location = useLocation();
  const [updatedDays, setUpdatedDays] = useState({});
  const [workingHours, setWorkingHours] = useState({
    Mon: { startTime: '00:00', endTime: '00:00' },
    Tue: { startTime: '00:00', endTime: '00:00' },
    Wed: { startTime: '00:00', endTime: '00:00' },
    Thu: { startTime: '00:00', endTime: '00:00' },
    Fri: { startTime: '00:00', endTime: '00:00' },
    Sat: { startTime: '00:00', endTime: '00:00' },
    Sun: { startTime: '00:00', endTime: '00:00' },
  });
  const handleSubmitWorkingHours = () => {
    setUpdatedDays((prev) => ({ ...prev, [selectedDay]: true }));
    setIsOverlayVisible(false);
  };
  const handleWorkingHoursSubmit = () => {
    handleSubmitWorkingHours();
    handleCloseOverlay();
  };
  const handleChangeTime = (event, type) => {
    setWorkingHours({ ...workingHours, [selectedDay]: { ...workingHours[selectedDay], [type]: event.target.value } });
  };

  const handleBackroomChange = () => {
    setHasBackroom(!hasBackroom);
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
    setIsOverlayVisible(true);
  };

  const handleCloseOverlay = () => {
    setIsOverlayVisible(false);
  };
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data to send
    const data = {
      storename: storeName,
      address: address,
      category: category,
      backroom: hasBackroom,
      user_id: user.id,
      workingHours: workingHours,
    };

    try {
      // Send the data to the backend using Axios
      const response = await axios.post('https://stocksmart.xyz/api/store', data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`
        }
      });
      setUser((previousUser) => { return { ...previousUser, store_id: response.data.store.id } });
    } catch (error) {
      if (error.response && error.response.status === 422) {
        const validationErrors = error.response.data.errors;
        alert('Please correct the following errors:\n' + JSON.stringify(validationErrors));
      } else {
        alert('An error occurred while creating the store. Please try again.');
      }
    }
  }
  useEffect(() => {
    if (user && user.store_id !== null && user.store_id !== undefined) {
      navigate("/addstorage");
    }
  }, [user, navigate]);
  const [animationTriggered, setAnimationTriggered] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setAnimationTriggered(true); // Trigger the animation when the component mounts
  }, []);
  return (
      <div className=" max-sm:ml-0 flex h-screen">
        {/* Main Content */}
        <div
            className="w-full bg-[#f8fafe] p-10 max-sm:w-screen max-sm:p-2 flex justify-center items-center max-sm:ml-0">
          {/* Progress Bar */}
          <div className="PBSU flex justify-center w-1/2 min-w-[650px] max-lg:scale-90 max-md:scale-75 max-sm:scale-100 absolute top-[5%] items-center max-sm:justify-evenly max-sm:w-full max-sm:min-w-full">
            <div className="flex w-1/6 h-full flex-col justify-center items-center">
              <div
                  className="flex flex-col items-center z-20 h-[50px] w-1/2 max-sm:w-full rounded-full p-3 scale-up-for-info bg-gray-300">
                <FaInfo className="text-white size-full"/>
              </div>
              <span className="text-lg font-teko text-[#DF9677] max-sm:hidden">{storeinfotranslations[language].storeInfo}</span>
            </div>
            <div className="w-[10%] h-[7px] bg-gray-300 mb-6 -mx-12 flex justify-start items-center max-sm:mb-0"></div>
            <div className="flex w-1/6 h-full flex-col justify-center items-center">
              <div className="flex flex-col items-center z-20 bg-gray-300 h-[50px] w-1/2 max-sm:w-full rounded-full p-3">
                <FaBoxesStacked className="text-white size-full"/>
              </div>
              <span className="text-lg font-teko text-[#DF9677] max-sm:hidden">{storeinfotranslations[language].addStorage}</span>
            </div>
            <div className="w-[10%] h-[7px] bg-gray-300 mb-6 -mx-12 flex justify-start items-center max-sm:mb-0"></div>
            <div className="flex w-1/6 h-full flex-col justify-center items-center">
              <div className="flex flex-col items-center z-20 bg-gray-300 h-[50px] w-1/2 max-sm:w-full rounded-full p-3">
                <FaUsers className="text-white size-full"/>
              </div>
              <span className="text-lg font-teko text-[#DF9677] max-sm:hidden">{storeinfotranslations[language].employees}</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}
                className="space-y-4 max-w-md mx-auto mt-10 bg-white shadow-2xl p-8 rounded-lg fade-in shadow-gray-500 max-sm:p-4">
            <h1 className="text-4xl font-teko text-center text-[#4E82E4] mb-8">{storeinfotranslations[language].createnewstore}</h1>

            {/* Store name input */}
            <div className="flex items-center border border-gray-300 bg-white rounded py-2 px-3">
              <FaStore className="text-[#DF9677] h-5 w-5 mr-2"/>
              <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full outline-none"
                  placeholder={storeinfotranslations[language].storename}
                  required
              />
            </div>

            {/* Address input */}
            <div className="flex items-center border border-gray-300 bg-white rounded py-2 px-3">
              <FaMapPin className="text-[#DF9677] h-5 w-5 mr-2"/>
              <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full outline-none"
                  placeholder={storeinfotranslations[language].Address}
                  required
              />
            </div>

            {/* Category input */}
            <div className="flex items-center border border-gray-300 bg-white rounded py-2 px-3">
              <FaTags className="text-[#DF9677] h-5 w-5 mr-2"/>
              <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full outline-none"
                  placeholder={storeinfotranslations[language].Category}
                  required
              />
            </div>

            {/* Working Hours Section */}
            <h2 className="text-2xl font-semibold text-[#DF9677] mb-4 text-center">
              {storeinfotranslations[language].SelectwHours}
            </h2>
            <div className="border-2 border-[#DF9677] p-4 rounded-lg flex justify-center max-sm:p-2">
              <div className="grid grid-cols-7 gap-2">
                {['mon', 'tue', 'wed', 'thu', 'fri', 'Sat', 'Sun'].map(dayKey => (
                    <button
                        key={dayKey}
                        className={`text-white flex justify-center items-center py-2 px-4 rounded-lg hover:bg-[#6a9aec] text-xs ${
                            updatedDays[dayKey.charAt(0).toUpperCase() + dayKey.slice(1)]
                                ? 'bg-[#DF9677]'
                                : 'bg-[#4E82E4]'
                        }`}
                        onClick={() =>
                            handleDayClick(dayKey.charAt(0).toUpperCase() + dayKey.slice(1))
                        }
                        type="button"
                    >
                      {storeinfotranslations[language][dayKey]}
                    </button>
                ))}
              </div>
            </div>
            <button
                className="w-full bg-[#4E82E4] text-white flex justify-center items-center px-4 py-3 my-2 rounded-lg shadow-md hover:bg-[#6a9aec] transition-all transform hover:scale-105 cursor-pointer">
              {storeinfotranslations[language].Submit}
            </button>
          </form>

          {/* Overlay for working hours */}
          {isOverlayVisible && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
                <div className="bg-white p-6 rounded-lg relative w-[400px]">
                  <button
                      className="absolute top-2 right-2"
                      onClick={handleCloseOverlay}
                  >
                    <FaXmark className="w-5 text-[#4E82E4]"/>
                  </button>
                  <h1 className="text-xl font-bold mb-4">{selectedDay}</h1>
                  <p className="mb-4">
                    {storeinfotranslations[language].SelectwHours}
                  </p>
                  <div className="flex items-center mb-4">
                    <input
                    id="military-switch"
                    type="checkbox"
                    checked={isMilitary}
                    onChange={() => setIsMilitary(m => !m)}
                    className="h-4 w-4"
                    />
                    <label htmlFor="military-switch" className="ml-2 text-sm">
                    {storeinfotranslations[language].militaryTime}
                    </label>
                  </div>
                  <div className="flex w-full justify-evenly mb-2">
                    <div className="flex justify-evenly w-1/2">
                    <label className="text-sm flex w-1/3">
                    {storeinfotranslations[language].startTimeLabel}:
                    </label>
                  <TimePicker
                   onChange={value => handleChangeTime({target: {value}}, "startTime")
                    }
                    value={workingHours[selectedDay]?.startTime}
                    format={isMilitary ? "HH:mm" : "h:mm a"}
                    disableClock
                    clockIcon={null}
                    clearIcon={null}
                    className="border rounded"
                    />
                </div>

                    <div className="flex justify-between w-1/2">
                    <label className="text-sm mb-1">
                    {storeinfotranslations[language].endTimeLabel}:
                    </label>
                    <TimePicker
                    onChange={value => handleChangeTime({target: {value}}, "endTime")
                    }
                    value={workingHours[selectedDay]?.endTime}
                    format={isMilitary ? "HH:mm" : "h:mm a"}
                    disableClock
                    clockIcon={null}
                    clearIcon={null}
                    className="border rounded"
                    />
                    </div>
                  </div>
                  <button
                      className="bg-[#4E82E4] text-white py-2 px-4 rounded hover:bg-[#6a9aec] w-full"
                      onClick={handleWorkingHoursSubmit}
                  >
                    {storeinfotranslations[language].Submit}
                  </button>
                </div>
              </div>
          )}
        </div>
        {/* Language Selector */}
        <div className="absolute bottom-[3%] right-[2%] PBSU">
          {dropdownOpen && (
              <div ref={dropdownRef} className="absolute right-0 -mt-20 bg-white shadow-md rounded-lg w-[140px]">
                <div
                    className="flex items-center cursor-pointer p-2 hover:bg-gray-200"
                    onClick={() => switchLanguage('en')}
                >
                  <img
                      src="/Flags/Uk.png"
                      alt="English"
                      className="h-5 w-5 mr-2"
                  />
                  <span>English</span>
                </div>
                <div
                    className="flex items-center cursor-pointer p-2 hover:bg-gray-200"
                    onClick={() => switchLanguage('lv')}
                >
                  <img
                      src="/Flags/Latvia.png"
                      alt="Latviešu"
                      className="h-5 w-5 mr-2"
                  />
                  <span>Latviešu</span>
                </div>
              </div>
          )}
          <FaLanguage
              className="h-[50px] cursor-pointer text-5xl text-[#4E82E4]"
              onClick={() => setDropdownOpen(o => !o)}
          />
        </div>
      </div>
  );
};

export default StoreInfo;
