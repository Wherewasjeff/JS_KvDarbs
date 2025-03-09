import React, { useState } from 'react';
import Sidebar from '../../Sidebar';
import {
  FaHouse,
  FaInfo,
  FaBoxesStacked,
  FaUsers,
  FaStore,
  FaBarcode,
  FaPen,
  FaDollarSign,
  FaMagnifyingGlass,
  FaBoxesPacking,
  FaXmark,
  FaAngleLeft,
  FaAngleRight,
  FaLock,
  FaUser,
  FaRegTrashCan
} from 'react-icons/fa6';

const Users = () => {
  const [showOverlay, setShowOverlay] = useState(false);

  const toggleOverlay = () => {
    setShowOverlay(!showOverlay);
  };

  return (
      <div className="flex h-max ml-[16.67%] mt-28 justify-center w-5/6">
        {/* Sidebar */}
        <Sidebar/>
        {/* Main Content */}
        <div
            className="max-[320px]:w-screen bg-[#f8fafe] p-10 -mb-24 h-[80vh] flex flex-col items-center max-[320px]:p-0 max-[320px]:ml-0">
          <button
              className="bg-[#4E82E4] py-2 px-9 right-5 top-5 absolute text-white font-semibold rounded-lg mr-2 hover:bg-[#6a9aec] transition-all hover:px-12 max-[320px]:hidden">Done
          </button>
          {/* Progress Bar */}
          <div className="flex justify-center w-1/2 absolute top-[5%] items-center">
            <div className="flex w-1/6 h-full flex-col justify-center items-center">
              <div
                  className="flex flex-col items-center z-20 bg-[#4E82E4] h-[50px] w-1/2 rounded-full p-3">
                <FaInfo className="text-white size-full"/>
              </div>
              <span className="text-lg font-teko text-[#DF9677] max-[320px]:hidden">Store info</span>
            </div>
            <div className="w-[10%] h-[7px] bg-[#4E82E4] mb-6 -mx-12 flex justify-start items-center">
            </div>
            <div className="flex w-1/6 h-full flex-col justify-center items-center">
              <div
                  className="flex flex-col items-center z-20 bg-[#4E82E4] h-[50px] w-1/2 rounded-full p-3">
                <FaBoxesStacked className="text-white size-full"/>
              </div>
              <span className="text-lg font-teko text-[#DF9677] max-[320px]:hidden">Add storage</span>
            </div>
            <div className="w-[10%] h-[7px] bg-gray-300 mb-6 -mx-12 flex justify-start items-center">
              <div className="progress-bar"></div>
            </div>
            <div className="flex w-1/6 h-full flex-col justify-center items-center">
              <div className="flex flex-col items-center z-20 bg-gray-300 h-[50px] w-1/2 rounded-full p-3 scale-up-animation">
                <FaUsers className="text-white size-full"/>
              </div>
              <span className="text-lg font-teko text-[#DF9677] max-[320px]:hidden">Employees</span>
            </div>
          </div>
          {/* Middle Container - Plates */}
          <div
              className="w-full min-h-[650px] grid grid-cols-6 gap-4 p-5 max-[320px]:grid-cols-2 max-[320px]:min-h-[250px] max-[320px]:p-2 max-[320px]:gap-2">
            {/* Add Item Plate */}
            <div
                className="border border-gray-300 h-full max-[320px]:h-full max-h-[352px] bg-white shadow-lg rounded-lg p-4 flex flex-col items-center justify-center shadow-[#4E82E4] hover:bg-blue-50 cursor-pointer"
                onClick={toggleOverlay}
            >
              <h1 className="w-20 h-20 text-7xl font-light mb-4 rounded-full flex justify-center items-center">+</h1>
              <span className="text-lg font-bold">Add Worker</span>
            </div>

            {/* CD Plates */}
            {[...Array(11)].map((_, index) => (
                <div key={index}
                     className="border border-gray-300 max-h-[352px] h-full bg-white shadow-lg rounded-lg p-4 flex justify-center items-center flex-col max-[320px]:flex-wrap max-[320px]:h-full max-[320px]:p-1">
                  <img src="/Janis.jpg" alt="Item" className="w-4/6 mb-1 rounded-md max-[320px]:h-1/3"/>
                  <p className="text-center text-lg font-bold">Jānis</p>
                  <p className="text-center text-sm">Position: Cashier</p>
                  <p className="text-center text-sm">Work Experience: 2 Yrs.</p>
                  <p className="text-center text-sm">2$ p/h</p>
                  <div className="flex justify-around mt-4">
                    <button className="bg-[#4E82E4] text-white py-3 px-3 mr-1 rounded-lg hover:bg-[#6a9aec]"><FaPen/>
                    </button>
                    <button className="bg-[#DF9677] text-white py-3 px-3 ml-1 rounded-lg hover:bg-red-600">
                      <FaRegTrashCan/></button>
                  </div>
                </div>
            ))}
          </div>
        </div>
        <div className="h-20 w-full -mt-2 flex justify-center items-center absolute bottom-1">
          <button
              className="bg-[#4E82E4] hover:bg-[#2968DE] text-white flex justify-center items-center font-semibold p-5 mr-2 rounded-full">
            <FaAngleLeft/>
          </button>
          <button
              className="bg-[#4E82E4] hover:bg-[#2968DE] text-white flex justify-center items-center font-semibold p-5 ml-2 rounded-full">
            <FaAngleRight/>
          </button>
        </div>
        {/* Overlay */}
        {showOverlay && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div
                  className="relative bg-white p-8 w-1/3 h-3/7 rounded-lg shadow-lg space-y-4 max-[320px]:w-11/12 max-sm:rounded-md">
                <FaXmark className="w-5 text-[#4E82E4] absolute top-4 right-4 cursor-pointer" onClick={toggleOverlay}/>
                <h2 className="text-xl text-[#4E82E4] font-bold text-center">Add new worker</h2>

                {/* Form */}
                <form className="space-y-4 max-sm:space-y-3 max-sm:w-full">
                  {/* Name Input */}
                  <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                    <FaInfo className="text-[#4E82E4] mr-2"/>
                    <input type="text" className="w-full outline-none" placeholder="First Name"/>
                  </div>

                  {/* Last Name Input */}
                  <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                    <FaInfo className="text-[#4E82E4] mr-2"/>
                    <input type="text" className="w-full outline-none" placeholder="Last Name"/>
                  </div>

                  {/* Age Input */}
                  <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                    <FaInfo className="text-[#4E82E4] mr-2"/>
                    <input type="number" className="w-full outline-none" placeholder="Age"/>
                  </div>

                  {/* Address Input */}
                  <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                    <FaHouse className="text-[#4E82E4] mr-2"/>
                    <input type="text" className="w-full outline-none" placeholder="Address"/>
                  </div>

                  {/* Salary Input */}
                  <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                    <FaDollarSign className="text-[#4E82E4] mr-2"/>
                    <input type="number" className="w-full outline-none" placeholder="Salary"/>
                  </div>

                  {/* Position Input */}
                  <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                    <FaPen className="text-[#4E82E4] mr-2"/>
                    <input type="text" className="w-full outline-none" placeholder="Position"/>
                  </div>
                  <div className="w-full h-10 flex">
                    <div className="h-full w-4/6 flex items-center">
                      <div className="w-full h-0.5 bg-[#DF9677]"></div>
                    </div>
                    <div className="h-full w-2/6 flex justify-center items-center max-sm:w-5/6">
                      <p className="text-[#DF9677] font-semibold max-sm:text-xs">CREATE USER</p>
                    </div>
                    <div className="h-full w-4/6 flex items-center">
                      <div className="w-full h-0.5 bg-[#DF9677]"></div>
                    </div>
                  </div>
                  <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                    <FaUser className="text-[#4E82E4] mr-2"/>
                    <input type="text" className="w-full outline-none" placeholder="Username"/>
                  </div>
                  <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                    <FaLock className="text-[#4E82E4] mr-2"/>
                    <input type="text" className="w-full outline-none" placeholder="Password"/>
                  </div>
                  {/* Submit Button */}
                  <button className="bg-[#4E82E4] hover:bg-[#2968DE] text-white font-semibold py-2 px-4 rounded w-full">
                    Submit
                  </button>
                </form>
              </div>
            </div>
        )}


      </div>
  );
};

export default Users;
