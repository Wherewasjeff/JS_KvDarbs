import React, { useCallback, useEffect, useState } from 'react';
import Sidebar from '../../Sidebar';
import '../../App.css';
import axios from 'axios';
import { FaInfo, FaBoxesStacked, FaUsers, FaXmark, FaStore, FaMapPin, FaTags} from 'react-icons/fa6';
import { useLocation } from 'react-router-dom';
import { useAuth } from "../Authentification/AuthContext";
import { useNavigate } from "react-router-dom";

const StoreInfo = () => {
  const [hasBackroom, setHasBackroom] = useState(false);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
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
    setAnimationTriggered(true); // Trigger the animation when the component mounts
  }, []);
  return (
      <div className=" max-sm:ml-0 flex h-screen">
        {/* Main Content */}
        <div className="w-full bg-[#f8fafe] p-10 max-sm:w-screen max-sm:p-2 flex justify-center items-center max-sm:ml-0">
          {/* Progress Bar */}
          <div className="flex justify-center w-1/2 absolute PBSU top-[5%] items-center">
            <div className="flex w-1/6 h-full flex-col justify-center items-center">
              <div className="flex flex-col items-center z-20 h-[50px] w-1/2 rounded-full p-3 scale-up-for-info bg-gray-300">
                <FaInfo className="text-white size-full"/>
              </div>
              <span className="text-lg font-teko text-[#DF9677] max-sm:hidden">Store info</span>
            </div>
            <div className="w-1/6 h-[7px] bg-gray-300 mb-6 -mx-12 flex justify-center items-center"></div>
            <div className="flex w-1/6 h-full flex-col justify-center items-center">
              <div className="flex flex-col items-center z-20 bg-gray-300 h-[50px] w-1/2 rounded-full p-3">
                <FaBoxesStacked className="text-white size-full"/>
              </div>
              <span className="text-lg font-teko text-[#DF9677] max-sm:hidden">Add storage</span>
            </div>
            <div className="w-1/6 h-[7px] bg-gray-300 mb-6 -mx-12 flex justify-center items-center"></div>
            <div className="flex w-1/6 h-full flex-col justify-center items-center">
              <div className="flex flex-col items-center z-20 bg-gray-300 h-[50px] w-1/2 rounded-full p-3">
                <FaUsers className="text-white size-full"/>
              </div>
              <span className="text-lg font-teko text-[#DF9677] max-sm:hidden">Employees</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}
                className="space-y-4 max-w-md mx-auto mt-10 bg-white shadow-2xl p-8 rounded-lg shadow-gray-500 max-sm:p-4">
            <h1 className="text-4xl font-teko text-center text-[#4E82E4] mb-8">Create New Store</h1>

            {/* Store name input */}
            <div className="flex items-center border border-gray-300 bg-white rounded py-2 px-3">
              <FaStore className="text-[#DF9677] h-5 w-5 mr-2" />
              <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full outline-none"
                  placeholder="Store name"
                  required
              />
            </div>

            {/* Address input */}
            <div className="flex items-center border border-gray-300 bg-white rounded py-2 px-3">
              <FaMapPin className="text-[#DF9677] h-5 w-5 mr-2" />
              <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full outline-none"
                  placeholder="Address"
                  required
              />
            </div>

            {/* Category input */}
            <div className="flex items-center border border-gray-300 bg-white rounded py-2 px-3">
              <FaTags className="text-[#DF9677] h-5 w-5 mr-2" />
              <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full outline-none"
                  placeholder="Category"
                  required
              />
            </div>

            {/* Backroom Switch */}
            <div className="flex items-center justify-start w-full py-2 px-3">
              <span className="text-[#DF9677] text-center font-semibold text-lg mr-2">Add backroom:</span>
              <label className="switch scale-75">
                <input type="checkbox" checked={hasBackroom} onChange={handleBackroomChange} />
                <span className="slider round"></span>
              </label>
            </div>

            {/* Working Hours Section */}
            <h2 className="text-2xl font-semibold text-[#DF9677] mb-4 text-center">Select working hours</h2>
            <div className="border-2 border-[#DF9677] p-4 rounded-lg flex justify-center max-sm:p-2">
              <div className="grid grid-cols-7 gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <button
                        key={day}
                        className={`text-white flex justify-center items-center py-2 px-4 rounded-lg hover:bg-[#6a9aec] text-xs ${
                            updatedDays[day] ? 'bg-[#DF9677]' : 'bg-[#4E82E4]'
                        }`}
                        onClick={() => handleDayClick(day)}
                        type="button"
                    >
                      {day}
                    </button>
                ))}
              </div>
            </div>

            <button
                className="w-full bg-[#4E82E4] text-white flex justify-center items-center px-4 py-3 my-2 rounded-lg shadow-md hover:bg-[#6a9aec] transition-all transform hover:scale-105 cursor-pointer">
              Submit
            </button>
          </form>

          {/* Overlay for working hours */}
          {isOverlayVisible && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
                <div className="bg-white p-6 rounded-lg relative w-[400px]">
                  <button className="absolute top-2 right-2" onClick={handleCloseOverlay}>
                    <FaXmark className="w-5 text-[#4E82E4]" />
                  </button>
                  <h1 className="text-xl font-bold mb-4">{selectedDay}</h1>
                  <p className="mb-4">Choose working hours</p>
                  <div className="flex justify-between mb-4">
                    <input type="time" onChange={(event) => handleChangeTime(event, "startTime")} className="border rounded p-2 w-[45%]" />
                    <input type="time" onChange={(event) => handleChangeTime(event, "endTime")} className="border rounded p-2 w-[45%]" />
                  </div>
                  <button
                      className="bg-[#4E82E4] text-white py-2 px-4 rounded hover:bg-[#6a9aec] w-full"
                      onClick={handleWorkingHoursSubmit}  // Updated here
                  >
                    Submit
                  </button>
                </div>
              </div>
          )}
        </div>
      </div>
  );
};

export default StoreInfo;
