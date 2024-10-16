import React, { useState } from 'react';
import Sidebar from './Sidebar';
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
  FaGrip,
  FaBars,
  FaRegTrashCan
} from 'react-icons/fa6';

const Users = () => {
  const [showOverlay, setShowOverlay] = useState(false);

  const toggleOverlay = () => {
    setShowOverlay(!showOverlay);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />
      {/* Main Content */}
      <div className="w-5/6 max-[320px]:w-screen bg-[#f8fafe] p-10 -mb-24 h-screen max-[320px]:p-0">
        <button className="bg-[#4E82E4] py-2 px-9 right-5 top-5 absolute text-white font-semibold rounded-lg mr-2 hover:bg-[#6a9aec] transition-all hover:px-12 max-[320px]:hidden">Done
        </button>
        <div className="flex justify-center mb-8">
          <div className="flex flex-col items-center w-auto h-24">
            <div className="flex w-[150%] h-1/2 justify-between">
              <div className="flex flex-col items-center z-20 bg-[#4E82E4] h-full rounded-full p-3 max-[320px]:hidden">
                <FaInfo className="text-white size-12" />
              </div>
              <div className="top-[7%] left-[51%] z-10 absolute flex-grow bg-[#4E82E4] w-[150px] h-[5px] max-[320px]:hidden"></div>
              <div className="flex flex-col items-center z-20 h-full bg-[#4E82E4] rounded-full p-3 max-[320px]:hidden">
                <FaBoxesStacked className="text-white size-12" />
              </div>
              <div className="top-[7%] left-[59.5%] z-10 absolute flex-grow bg-[#4E82E4] w-[150px] h-[5px] max-[320px]:hidden"></div>
              <div className="flex flex-col items-center h-full z-20 bg-[#4E82E4] rounded-full p-3 max-[320px]:hidden">
                <FaUsers className="text-white size-12" />
              </div>
            </div>
            <div className="flex w-[160%] justify-between h-1/6 mb-10 mr-7">
              <span className="text-md font-teko text-[#DF9677] ml-9 max-[320px]:hidden">Store info</span>
              <span className="text-md font-teko text-[#DF9677] ml-3 max-[320px]:hidden">Add storage</span>
              <span className="text-md font-teko text-[#DF9677] max-[320px]:hidden">Add employees</span>
            </div>
          </div>
        </div>
        {/* Top Container - Search, Sort, Filter */}
        {/* Middle Container - Plates */}
        <div className="w-full min-h-[650px] grid grid-cols-4 gap-4 p-5 max-[320px]:grid-cols-2 max-[320px]:min-h-[250px] max-[320px]:p-2 max-[320px]:gap-2">
          {/* Add Item Plate */}
          <div
            className="border border-gray-300 h-full max-[320px]:h-full bg-white shadow-lg rounded-lg p-4 flex flex-col items-center justify-center shadow-[#4E82E4] hover:bg-blue-50 cursor-pointer"
            onClick={toggleOverlay}
          >
            <h1 className="w-20 h-20 text-7xl font-light mb-4 rounded-full flex justify-center items-center">+</h1>
            <span className="text-lg font-bold">Add Worker</span>
          </div>

          {/* CD Plates */}
          {[...Array(5)].map((_, index) => (
            <div key={index} className="border border-gray-300 h-full bg-white shadow-lg rounded-lg p-4 flex justify-center items-center flex-col max-[320px]:flex-wrap max-[320px]:h-full max-[320px]:p-1">
              <img src="/Janis.jpg" alt="Item" className="h-1/2 mx-auto mb-1 max-[320px]:h-1/3" />
              <p className="text-center text-lg font-bold">Jānis</p>
              <p className="text-center text-sm">Position: Cashier</p>
              <p className="text-center text-sm">Work Experience: 2 Yrs.</p>
              <p className="text-center text-sm">2$ p/h</p>
              <div className="flex justify-around mt-4">
                <button className="bg-[#4E82E4] text-white py-3 px-3 mr-1 rounded-lg hover:bg-[#6a9aec]"><FaPen/></button>
                <button className="bg-[#DF9677] text-white py-3 px-3 ml-1 rounded-lg hover:bg-red-600"><FaRegTrashCan/></button>
              </div>
            </div>
          ))}
        </div>
        <div className="h-20 w-full -mt-2 flex justify-center items-center">
          <button
            className="bg-[#4E82E4] hover:bg-[#2968DE] text-white flex justify-center items-center font-semibold p-5 mr-2 rounded-full">
            <FaAngleLeft />
          </button>
          <button
            className="bg-[#4E82E4] hover:bg-[#2968DE] text-white flex justify-center items-center font-semibold p-5 ml-2 rounded-full">
            <FaAngleRight />
          </button>
        </div>
      </div>

      {/* Overlay */}
      {showOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white p-8 w-1/3 h-3/7 rounded-lg shadow-lg space-y-4 max-[320px]:w-11/12">
            <FaXmark className="w-5 text-[#4E82E4] absolute top-4 right-4 cursor-pointer" onClick={toggleOverlay}/>
            <h2 className="text-xl text-[#4E82E4] font-bold text-center">Add new worker</h2>

            {/* Form */}
            <form className="space-y-4">
              {/* Name Input */}
              <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                <FaInfo className="text-[#4E82E4] mr-2"/>
                <input type="text" className="w-full outline-none" placeholder="First Name" />
              </div>

              {/* Last Name Input */}
              <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                <FaInfo className="text-[#4E82E4] mr-2"/>
                <input type="text" className="w-full outline-none" placeholder="Last Name" />
              </div>

              {/* Age Input */}
              <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                <FaInfo className="text-[#4E82E4] mr-2"/>
                <input type="number" className="w-full outline-none" placeholder="Age" />
              </div>

              {/* Address Input */}
              <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                <FaHouse className="text-[#4E82E4] mr-2"/>
                <input type="text" className="w-full outline-none" placeholder="Address" />
              </div>

              {/* Salary Input */}
              <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                <FaDollarSign className="text-[#4E82E4] mr-2"/>
                <input type="number" className="w-full outline-none" placeholder="Salary" />
              </div>

              {/* Position Input */}
              <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                <FaPen className="text-[#4E82E4] mr-2"/>
                <input type="text" className="w-full outline-none" placeholder="Position" />
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
