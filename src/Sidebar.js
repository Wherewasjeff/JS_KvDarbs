// Sidebar.js
import React, { useState } from 'react';
import { FaHouse, FaInfo, FaBoxesStacked, FaUsers, FaCartFlatbed, FaCartShopping, FaBoxOpen, FaBars, FaPen } from 'react-icons/fa6';
import { FaTimes } from 'react-icons/fa'; // FaTimes icon for closing
import { Link, useNavigate } from 'react-router-dom';


const Sidebar = ({employeeName}) => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };
    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
        navigate('/')
    };
    return (
        <>
            {/* Sidebar visible for screens wider than 320px */}
            <div
                className="hidden sm:block bg-white min-h-screen w-1/5 shadow-xl shadow-gray-400 z-20 flex-col items-center py-8">
                {/* Logo */}
                <div className="flex items-center justify-center mb-12">
                    <img src="/Fullofoblack.png" alt="StockSmart Logo" className="w-3/5"/>
                </div>

                {/* Sidebar Buttons */}
                <Link to="/sell" className="w-full flex justify-center">
                    <button
                        className="w-4/5 bg-[#4E82E4] text-white flex items-center px-4 py-3 my-2 rounded-lg shadow-md hover:bg-[#6a9aec] transition-all transform hover:scale-105 cursor-pointer">
                        <FaCartShopping className="w-6 mr-2"/>
                        Selling
                    </button>
                </Link>
                <Link to="/Storestatus" className="w-full flex justify-center">
                    <button
                        className="w-4/5 bg-[#4E82E4] text-white flex items-center px-4 py-3 my-2 rounded-lg shadow-md hover:bg-[#6a9aec] transition-all transform hover:scale-105 cursor-pointer">
                        <FaHouse className="w-6 mr-2"/>
                        Store Status
                    </button>
                </Link>
                <Link to="/storeinfo" className="w-full flex justify-center">
                    <button
                        className="w-4/5 bg-[#4E82E4] text-white flex items-center px-4 py-3 my-2 rounded-lg shadow-md hover:bg-[#6a9aec] transition-all transform hover:scale-105 cursor-pointer">
                        <FaInfo className="w-6 mr-2"/>
                        Store Info
                    </button>
                </Link>
                <Link to="/addstorage" className="w-full flex justify-center">
                    <button
                        className="w-4/5 bg-[#4E82E4] text-white flex items-center px-4 py-3 my-2 rounded-lg shadow-md hover:bg-[#6a9aec] transition-all transform hover:scale-105 cursor-pointer">
                        <FaBoxesStacked className="w-6 mr-2"/>
                        Storage
                    </button>
                </Link>
                <Link to="/Users" className="w-full flex justify-center">
                    <button
                        className="w-4/5 bg-[#4E82E4] text-white flex items-center px-4 py-3 my-2 rounded-lg shadow-md hover:bg-[#6a9aec] transition-all transform hover:scale-105 cursor-pointer">
                        <FaUsers className="w-6 mr-2"/>
                        Employees
                    </button>
                </Link>
                <Link to="/replenishment" className="w-full flex justify-center">
                    <button
                        className="w-4/5 bg-[#4E82E4] text-white flex items-center px-4 py-3 my-2 rounded-lg shadow-md hover:bg-[#6a9aec] transition-all transform hover:scale-105 cursor-pointer">
                        <FaCartFlatbed className="w-6 mr-2"/>
                        Replenishment
                    </button>
                </Link>
                <Link to="/lowstock" className="w-full flex justify-center">
                    <button
                        className="w-4/5 bg-[#4E82E4] text-white flex items-center px-4 py-3 my-2 rounded-lg shadow-md hover:bg-[#6a9aec] transition-all transform hover:scale-105 cursor-pointer">
                        <FaBoxOpen className="w-6 mr-2"/>
                        Low stock
                    </button>
                </Link>
                <div className="w-full text-center mt-32 font-teko text-4xl text-[#4E82E4]">
                    <p>Store Name</p>
                </div>
                {employeeName && (
                    <div className="w-full text-center font-teko text-2xl text-[#4E82E4]">
                        <p>Welcome, {employeeName}!</p>
                    </div>
                )}
                <div className="w-full justify-center items-center flex">
                    <button
                        className="w-2/5 bg-[#4E82E4] text-white flex items-center px-4 py-1 my-2 rounded-lg shadow-md hover:bg-[#6a9aec] transition-all transform hover:scale-105 cursor-pointer">
                        <FaPen className="w-6 mr-2"/>
                        Edit profile
                    </button>
                </div>
                <div className="w-full flex justify-center">
                    <button onClick={logout}
                        className="w-2/5 bg-[#DF9677] text-white flex justify-center font-bold items-center px-4 py-1 my-6 rounded-lg shadow-md hover:bg-red-600 transition-all transform cursor-pointer">
                        Log out
                    </button>
                </div>
            </div>
            {/* Button visible for screens smaller than 320px */}
            <div className="sm:hidden absolute top-0 left-0 p-2">
                <button
                    onClick={toggleSidebar}
                    className="text-white bg-[#4E82E4] p-2 m-2 rounded-md"
                >
                    <FaBars size={24}/>
                </button>
            </div>

            {/* Sidebar Overlay for smaller screens */}
            <div
                className={`sm:hidden fixed top-0 left-0 w-4/5 h-full z-30 bg-white shadow-xl shadow-gray-400 transform transition-transform duration-300 ease-in-out ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex justify-between p-4">
                    <img src="/Fullofoblack.png" className="w-4/6 -mt-2"/>
                    <button onClick={toggleSidebar} className="text-gray-700">
                        <FaTimes size={24}/>
                    </button>
                </div>
                {/* Sidebar Buttons */}
                <Link to="/sell" className="w-full flex justify-center">
                    <button
                        className="w-5/6 bg-[#4E82E4] text-white flex items-center px-4 py-4 my-2 mt-5 rounded-lg shadow-md hover:bg-[#6a9aec] transition-all transform hover:scale-105 cursor-pointer">
                        <FaCartShopping className="w-6 mr-2"/>
                        Selling
                    </button>
                </Link>
                <Link to="/src/Storestatus" className="w-full flex justify-center">
                    <button
                        className="w-5/6 bg-[#4E82E4] text-white flex items-center px-4 py-4 my-2 rounded-lg shadow-md hover:bg-[#6a9aec] transition-all transform hover:scale-105 cursor-pointer">
                        <FaHouse className="w-6 mr-2"/>
                        Store Status
                    </button>
                </Link>
                <Link to="/storeinfo" className="w-full flex justify-center">
                    <button
                        className="w-5/6 bg-[#4E82E4] text-white flex items-center px-4 py-4 my-2 rounded-lg shadow-md hover:bg-[#6a9aec] transition-all transform hover:scale-105 cursor-pointer">
                        <FaInfo className="w-6 mr-2"/>
                        Store Info
                    </button>
                </Link>
                <Link to="/addstorage" className="w-full flex justify-center">
                    <button
                        className="w-5/6 bg-[#4E82E4] text-white flex items-center px-4 py-4 my-2 rounded-lg shadow-md hover:bg-[#6a9aec] transition-all transform hover:scale-105 cursor-pointer">
                        <FaBoxesStacked className="w-6 mr-2"/>
                        Storage
                    </button>
                </Link>
                <Link to="/Users" className="w-full flex justify-center">
                    <button
                        className="w-5/6 bg-[#4E82E4] text-white flex items-center px-4 py-4 my-2 rounded-lg shadow-md hover:bg-[#6a9aec] transition-all transform hover:scale-105 cursor-pointer">
                        <FaUsers className="w-6 mr-2"/>
                        Employees
                    </button>
                </Link>
                <Link to="/replanishment" className="w-full flex justify-center">
                    <button
                        className="w-5/6 bg-[#4E82E4] text-white flex items-center px-4 py-4 my-2 rounded-lg shadow-md hover:bg-[#6a9aec] transition-all transform hover:scale-105 cursor-pointer">
                        <FaCartFlatbed className="w-6 mr-2"/>
                        Replanishment
                    </button>
                </Link>
                <Link to="/lowstock" className="w-full flex justify-center">
                    <button
                        className="w-5/6 bg-[#4E82E4] text-white flex items-center px-4 py-4 my-2 rounded-lg shadow-md hover:bg-[#6a9aec] transition-all transform hover:scale-105 cursor-pointer">
                        <FaBoxOpen className="w-6 mr-2"/>
                        Low stock
                    </button>
                </Link>
                <div className="w-full text-center mt-10 font-teko text-4xl text-[#4E82E4]">
                    <p>Store Name</p>
                </div>
                {employeeName && (
                    <div className="w-full text-center font-teko text-2xl text-[#4E82E4]">
                        <p>Welcome, {employeeName}!</p>
                    </div>
                )}
                <div className="w-full justify-center items-center flex">
                    <button
                        className="w-3/5 bg-[#4E82E4] text-white flex items-center px-4 py-3 my-2 rounded-lg shadow-md hover:bg-[#6a9aec] transition-all transform hover:scale-105 cursor-pointer">
                        <FaPen className="w-6 mr-2"/>
                        Edit profile
                    </button>
                </div>
                <div className="w-full flex justify-center">
                    <button onClick={logout}
                            className="w-2/5 bg-[#DF9677] text-white flex justify-center font-bold items-center px-4 py-2 my-2 rounded-lg shadow-md hover:bg-red-600 transition-all transform cursor-pointer">
                        Log out
                    </button>
                </div>

                </div>
            </>
            );
            };

            export default Sidebar;
