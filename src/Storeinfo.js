import React, { useState } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';
import { FaInfo, FaBoxesStacked, FaUsers, FaXmark, FaStore, FaMapPin, FaTags } from 'react-icons/fa6';
import { useLocation } from 'react-router-dom';

const StoreInfo = () => {
  const [hasBackroom, setHasBackroom] = useState(false);
  const [storeName, setStoreName] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState('');
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const location = useLocation();
  const userData = JSON.parse(localStorage.getItem("user"));

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
  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare data to send
    const data = {
      storename: storeName,
      address: address,
      category: category,
      backroom: hasBackroom,
      user_id: userData.id,
    };

    // Send the data to the backend using Axios
    axios.post('http://my-laravel-app.test/api/store', data)
        .then(response => {
          console.log('Store created:', response.data);
          // Handle success (e.g., navigate to another page or show success message)
        })
        .catch(error => {
          console.error('There was an error creating the store!', error);
          // Handle error
        });
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar employeeName={userData.name}/>

      {/* Main Content */}
      <div className="w-5/6 bg-[#f8fafe] p-10 max-[320px]:w-screen max-[320px]:p-2">
        {/* Progress Bar */}
        <div className="flex justify-center mb-24">
          <div className="flex flex-col items-center w-auto h-24">
            <div className="flex w-[150%] h-1/2 justify-between">
              <div className="flex flex-col items-center z-20 bg-[#4E82E4] h-full rounded-full p-3 max-[320px]:hidden">
                <FaInfo className="text-white size-12" />
              </div>
              <div className="top-[7%] left-[51%] z-10 absolute flex-grow bg-gray-300 w-[150px] h-[5px] max-[320px]:hidden"></div>
              <div className="flex flex-col items-center z-20 h-full bg-gray-300 rounded-full p-3 max-[320px]:hidden">
                <FaBoxesStacked className="text-white size-12 " />
              </div>
              <div className="top-[7%] left-[59.5%] z-10 absolute flex-grow bg-gray-300 w-[150px] h-[5px] max-[320px]:hidden"></div>
              <div className="flex flex-col items-center h-full z-20 bg-gray-300 rounded-full p-3 max-[320px]:hidden">
                <FaUsers className="text-white size-12" />
              </div>
            </div>
            <div className="flex w-[160%] justify-between h-1/6 mb-10 mr-7 max-[320px]:hidden">
              <span className="text-md font-teko text-[#DF9677] ml-9 max-[320px]:hidden">Store info</span>
              <span className="text-md font-teko text-[#DF9677] ml-3 max-[320px]:hidden">Add storage</span>
              <span className="text-md font-teko text-[#DF9677] max-[320px]:hidden">Add employees</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto mt-10 bg-white shadow-lg p-8 rounded-lg">
          <h1 className="text-4xl font-teko text-center text-[#4E82E4] mb-8">Create New Store</h1>

          {/* Store name input */}
          <div className="flex items-center border border-gray-300 bg-white rounded py-2 px-3">
            <FaStore className="text-[#DF9677] h-5 w-5 mr-2"/>
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
            <FaMapPin className="text-[#DF9677] h-5 w-5 mr-2"/>
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
            <FaTags className="text-[#DF9677] h-5 w-5 mr-2"/>
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
          <div className="flex items-center justify-between w-full py-2 px-3">
            <span className="text-[#DF9677] text-center font-semibold">I do not have a backroom</span>
            <label className="switch">
              <input type="checkbox" checked={hasBackroom} onChange={handleBackroomChange}/>
              <span className="slider round"></span>
            </label>
            <span className="text-[#DF9677] text-center font-semibold">I do have a backroom</span>
          </div>

          {/* Working Hours Section */}
          <h2 className="text-2xl font-semibold text-[#DF9677] mb-4 text-center">Select working hours</h2>
          <div className="border-2 border-[#DF9677] p-4 rounded-lg flex justify-center">
            <div className="grid grid-cols-7 gap-2">
              {['Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.', 'Sun.'].map((day) => (
                  <button
                      key={day}
                      className="bg-[#4E82E4] text-white flex justify-center items-center py-2 px-4 rounded-lg hover:bg-[#6a9aec] text-xs"
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
                <input type="time" className="border rounded p-2 w-[45%]" />
                <input type="time" className="border rounded p-2 w-[45%]" />
              </div>
              <button
                className="bg-[#4E82E4] text-white py-2 px-4 rounded hover:bg-[#6a9aec] w-full"
                onClick={handleCloseOverlay}
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
