import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { FaHouse, FaInfo, FaBoxesStacked, FaUsers, FaXmark, FaStore, FaMapPin, FaTags } from 'react-icons/fa6';
import { BiSolidCog } from "react-icons/bi";

const StoreInfo = () => {
  const [hasBackroom, setHasBackroom] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');

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

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="w-5/6 bg-[#f8fafe] border-l-2 border-[#4E82E4] p-10">
        <button
          className="bg-[#4E82E4] py-2 px-9 right-5 top-5 absolute text-white font-semibold rounded-lg mr-2 hover:bg-[#6a9aec] transition-all hover:px-12">Next step
        </button>
        {/* Progress Bar */}
        <div className="flex justify-center mb-24">
          <div className="flex flex-col items-center w-auto h-24">
            <div className="flex w-[150%] h-1/2 justify-between">
              <div className="flex flex-col items-center z-20 bg-[#4E82E4] h-full rounded-full p-3">
                <FaInfo className="text-white size-12" />
              </div>
              <div className="top-[7%] left-[51%] z-10 absolute flex-grow bg-gray-300 w-[150px] h-[5px]"></div>
              <div className="flex flex-col items-center z-20 h-full bg-gray-300 rounded-full p-3">
                <FaBoxesStacked className="text-white size-12" />
              </div>
              <div className="top-[7%] left-[59.5%] z-10 absolute flex-grow bg-gray-300 w-[150px] h-[5px]"></div>
              <div className="flex flex-col items-center h-full z-20 bg-gray-300 rounded-full p-3">
                <FaUsers className="text-white size-12" />
              </div>
            </div>
            <div className="flex w-[160%] justify-between h-1/6 mb-10 mr-7">
              <span className="text-md font-teko text-[#DF9677] ml-9">Store info</span>
              <span className="text-md font-teko text-[#DF9677] ml-3">Add storage</span>
              <span className="text-md font-teko text-[#DF9677]">Add employees</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form className="space-y-6 max-w-md mx-auto mt-10 bg-white shadow-lg p-8 rounded-lg">
          <h1 className="text-4xl font-teko text-center text-[#4E82E4] mb-8">Create New Store</h1>

          {['Store name', 'Address', 'Category'].map((placeholder, index) => (
            <div key={index} className="flex items-center border border-gray-300 bg-white rounded py-2 px-3">
              {/* Use appropriate icons from react-icons */}
              {placeholder === 'Store name' && <FaStore className="text-[#DF9677] h-5 w-5 mr-2" />}
              {placeholder === 'Address' && <FaMapPin className="text-[#DF9677] h-5 w-5 mr-2" />}
              {placeholder === 'Category' && <FaTags className="text-[#DF9677] h-5 w-5 mr-2" />}
              <input
                type="text"
                className="w-full outline-none"
                placeholder={placeholder}
              />
            </div>
          ))}

          {/* Backroom Switch */}
          <div className="flex items-center justify-between w-full py-2 px-3">
            <span className="text-[#DF9677] text-center font-semibold">I do not have a backroom</span>
            <label className="switch">
              <input type="checkbox" checked={hasBackroom} onChange={handleBackroomChange} />
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
