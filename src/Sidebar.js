// Sidebar.js
import React from 'react';
import { FaHouse, FaInfo, FaBoxesStacked, FaUsers, FaCartFlatbed, FaCartShopping, FaBoxOpen } from 'react-icons/fa6';
import { BiSolidCog } from 'react-icons/bi';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="bg-white min-h-screen w-1/5 shadow-xl shadow-gray-400 z-20 flex flex-col items-center py-8">
      {/* Logo */}
      <div className="flex items-center mb-12">
        <img src="/Fullofoblack.png" alt="StockSmart Logo" className="w-full" />
      </div>

      {/* Sidebar Buttons */}
      <button
        className="w-4/5 bg-[#4E82E4] text-white flex items-center px-4 py-3 my-2 rounded-lg shadow-md hover:bg-[#6a9aec] transition-all transform hover:scale-105 cursor-pointer">
        <FaCartShopping className="w-6 mr-2" />
        Selling
      </button>
      <button
        className="w-4/5 bg-[#4E82E4] text-white flex items-center px-4 py-3 my-2 rounded-lg shadow-md hover:bg-[#6a9aec] transition-all transform hover:scale-105 cursor-pointer">
        <FaHouse className="w-6 mr-2" />
        Store Status
      </button>
      <Link to="/storeinfo" className="w-4/5">
        <button
          className="w-full bg-[#4E82E4] text-white flex items-center px-4 py-3 my-2 rounded-lg shadow-md hover:bg-[#6a9aec] transition-all transform hover:scale-105 cursor-pointer">
          <FaInfo className="w-6 mr-2" />
          Store Info
        </button>
      </Link>
      <Link to="/addstorage" className="w-4/5">
        <button
          className="w-full bg-[#4E82E4] text-white flex items-center px-4 py-3 my-2 rounded-lg shadow-md hover:bg-[#6a9aec] transition-all transform hover:scale-105 cursor-pointer">
          <FaBoxesStacked className="w-6 mr-2" />
          Storage
        </button>
      </Link>
      <Link to="/Users" className="w-4/5">
        <button
          className="w-full bg-[#4E82E4] text-white flex items-center px-4 py-3 my-2 rounded-lg shadow-md hover:bg-[#6a9aec] transition-all transform hover:scale-105 cursor-pointer">
          <FaUsers className="w-6 mr-2" />
          Employees
        </button>
      </Link>
      <button
        className="w-4/5 bg-[#4E82E4] text-white flex items-center px-4 py-3 my-2 rounded-lg shadow-md hover:bg-[#6a9aec] transition-all transform hover:scale-105 cursor-pointer">
        <FaCartFlatbed className="w-6 mr-2" />
        Replanishment
      </button>
      <button
        className="w-4/5 bg-[#4E82E4] text-white flex items-center px-4 py-3 my-2 rounded-lg shadow-md hover:bg-[#6a9aec] transition-all transform hover:scale-105 cursor-pointer">
        <FaBoxOpen className="w-6 mr-2" />
        Low stock
      </button>
    </div>
  );
};

export default Sidebar;
