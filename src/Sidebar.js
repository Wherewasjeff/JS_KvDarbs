// Sidebar.js
import React, { useState } from 'react';
import axios from 'axios'; // Import axios
import {
    FaHouse,
    FaInfo,
    FaBoxesStacked,
    FaUsers,
    FaCartFlatbed,
    FaCartShopping,
    FaBoxOpen,
    FaBars,
    FaPen,
    FaLanguage
} from 'react-icons/fa6';
import { FaTimes } from 'react-icons/fa';
import { BiSolidExit } from 'react-icons/bi';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "./Components/Authentification/AuthContext";
const Sidebar = ({ employeeName, storeName }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState(""); // Declare email first
    const [editableUserInfo, setEditableUserInfo] = useState({ name: "", last_name: "", email: "" });
    const { user, setUser } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isProfileOverlayOpen, setProfileOverlayOpen] = useState(false);

    const [username, setUsername] = useState(""); // Add username state

    const toggleProfileOverlay = () => setProfileOverlayOpen(!isProfileOverlayOpen);

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
        setTimeout(() => {
            window.location.reload(); // Reload the page
        }, 100); // Delay of 1000ms (1 second)
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleProfileSave = async (e) => {
        e.preventDefault();
        try {
            const authToken = localStorage.getItem('authToken');
                console.log(authToken);
            // Make sure authToken exists
            if (!authToken) {
                alert('Authorization token not found. Please log in again.');
                return;
            }
            console.log(editableUserInfo);
            const response = await axios.put(
                `http://my-laravel-app.test/api/user/${user.id}`,
                editableUserInfo,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                }
            );
            setUser(response.data); // Update user state with new data
            setProfileOverlayOpen(false); // Close overlay
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile.');
        }
    };
    const fetchUserData = async () => {
        try {
            const response = await axios.get(`http://my-laravel-app.test/api/user/${user.id}`);
            setEditableUserInfo({
                name: response.data.name,
                last_name: response.data.last_name,
                email: response.data.email
            }); // Set editableUserInfo with fetched data
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };
    return (
        <>
            {isProfileOverlayOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-1/3">
                        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
                        <form onSubmit={handleProfileSave}>
                            <div className="mb-4">
                                <label className="block text-gray-700">First Name:</label>
                                <input
                                    type="text"
                                    className="w-full border rounded p-2"
                                    value={firstName}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setFirstName(value);
                                        setEditableUserInfo((prev) => ({...prev, name: value})); // Update editableUserInfo
                                    }}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Last Name:</label>
                                <input
                                    type="text"
                                    className="w-full border rounded p-2"
                                    value={lastName}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setLastName(value);
                                        setEditableUserInfo((prev) => ({...prev, last_name: value})); // Update editableUserInfo
                                    }}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Email:</label>
                                <input
                                    type="email"
                                    className="w-full border rounded p-2"
                                    value={email}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setEmail(value);
                                        setEditableUserInfo((prev) => ({...prev, email: value})); // Update editableUserInfo
                                    }}
                                />
                            </div>
                            <div className="flex justify-end">
                                <button type="button" onClick={toggleProfileOverlay} className="mr-2">
                                    Cancel
                                </button>
                                <button type="submit" className="bg-[#4E82E4] text-white p-2 rounded">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Sidebar for larger screens */}
            <div className="hidden sm:flex flex-col fixed left-0 top-0 h-screen w-1/6 bg-white shadow-2xl shadow-gray-600 z-20 justify-between py-8">
                {/* Top Section (Logo & Buttons) */}
                <div className="flex flex-col items-center">
                    {/* Logo */}
                    <div className="flex items-center justify-center mb-8">
                        <img src="/Fullofoblack.png" alt="StockSmart Logo" className="w-3/5"/>
                    </div>

                    {/* Sidebar Buttons */}
                    <div className="flex flex-col space-y-2 w-full">
                        <Link to="/sell" className="w-full flex justify-center">
                            <button className="w-4/5 bg-[#4E82E4] text-white flex items-center px-4 py-3 rounded-lg shadow-md hover:bg-[#6a9aec] transform transition-all hover:scale-105">
                                <FaCartShopping className="w-6 mr-2"/>
                                Selling
                            </button>
                        </Link>
                        <Link to="/storestatus" className="w-full flex justify-center">
                            <button className="w-4/5 bg-[#4E82E4] text-white flex items-center px-4 py-3 rounded-lg shadow-md hover:bg-[#6a9aec] transform transition-all hover:scale-105">
                                <FaHouse className="w-6 mr-2"/>
                                Store Status
                            </button>
                        </Link>
                        {/* Sidebar Buttons */}
                        {!storeName && ( // Only show the Store Info button if storeName is not provided
                            <Link to="/storeinfo" className="w-full flex justify-center">
                                <button className="w-4/5 bg-[#4E82E4] text-white flex items-center px-4 py-3 rounded-lg shadow-md hover:bg-[#6a9aec] transform transition-all hover:scale-105">
                                    <FaInfo className="w-6 mr-2"/>
                                    Store Info
                                </button>
                            </Link>
                        )}
                        <Link to="/addstorage" className="w-full flex justify-center">
                            <button className="w-4/5 bg-[#4E82E4] text-white flex items-center px-4 py-3 rounded-lg shadow-md hover:bg-[#6a9aec] transform transition-all hover:scale-105">
                                <FaBoxesStacked className="w-6 mr-2"/>
                                Storage
                            </button>
                        </Link>
                        <Link to="/users" className="w-full flex justify-center">
                            <button className="w-4/5 bg-[#4E82E4] text-white flex items-center px-4 py-3 rounded-lg shadow-md hover:bg-[#6a9aec] transform transition-all hover:scale-105">
                                <FaUsers className="w-6 mr-2"/>
                                Employees
                            </button>
                        </Link>
                        <Link to="/replenishment" className="w-full flex justify-center">
                            <button className="w-4/5 bg-[#4E82E4] text-white flex items-center px-4 py-3 rounded-lg shadow-md hover:bg-[#6a9aec] transform transition-all hover:scale-105">
                                <FaCartFlatbed className="w-6 mr-2"/>
                                Replenish
                            </button>
                        </Link>
                        <Link to="/lowstock" className="w-full flex justify-center">
                            <button className="w-4/5 bg-[#4E82E4] text-white flex items-center px-4 py-3 rounded-lg shadow-md hover:bg-[#6a9aec] transform transition-all hover:scale-105">
                                <FaBoxOpen className="w-6 mr-2"/>
                                Low stock
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Bottom Section (Store Info, User, Edit & Logout) */}
                <div className="flex flex-col items-center mb-6">
                    {/* Store Name */}
                    <div className="text-center font-teko text-2xl text-[#DF9677]">
                        <p>{storeName ? storeName : "No store created yet"}</p>
                    </div>

                    {/* Employee Name */}
                    {employeeName && (
                        <div className="text-center font-teko text-lg text-[#4E82E4]">
                            <p>Welcome, {employeeName}!</p>
                        </div>
                    )}

                    {/* Edit Profile & Logout Buttons */}
                    <div className="flex flex-col items-center space-y-2 mt-4">
                        <button
                            onClick={toggleProfileOverlay}
                            className="w-full bg-[#4E82E4] text-white flex items-center justify-center px-4 py-2 rounded-lg shadow-md hover:bg-[#6a9aec]"
                        >
                            <FaPen className="w-5 mr-2"/>
                            Edit profile
                        </button>
                        <button
                            onClick={logout}
                            className="w-full bg-[#DF9677] text-white flex items-center justify-center px-4 py-2 rounded-lg shadow-md hover:bg-red-600"
                        >
                            <BiSolidExit className="w-5 mr-2" />
                            Log out
                        </button>
                    </div>
                </div>
            </div>


            {/* Sidebar for smaller screens */}
            <div className="absolute sm:hidden">
                {/* Burger Icon */}
                <button className="text-2xl text-gray-500 focus:outline-none m-4" onClick={toggleSidebar}>
                    {isSidebarOpen ? <FaTimes /> : <FaBars />}
                </button>

                {/* Sidebar Overlay */}
                <div
                    className={`fixed top-0 left-0 h-full w-3/4 bg-white shadow-lg z-50 transform ${
                        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } transition-transform duration-300 ease-in-out flex flex-col justify-between items-center py-8`}
                >
                    {/* Close Button */}
                    <button className="text-2xl text-gray-500 absolute top-4 right-4" onClick={toggleSidebar}>
                        <FaTimes />
                    </button>

                    {/* Top Section (Logo & Buttons) */}
                    <div className="flex flex-col items-center w-full">
                        {/* Logo */}
                        <div className="flex justify-center mb-4">
                            <img src="/Fullofoblack.png" alt="StockSmart Logo" className="w-3/5"/>
                        </div>

                        {/* Sidebar Buttons */}
                        <div className="grid grid-cols-2 gap-2 w-full px-2">
                            <Link to="/sell" className="w-full" onClick={toggleSidebar}>
                                <button className="w-full bg-[#4E82E4] text-white text-sm flex flex-col items-center py-4 rounded-lg shadow-md hover:bg-[#6a9aec]">
                                    <FaCartShopping className="w-6 mb-1" />
                                    Selling
                                </button>
                            </Link>
                            <Link to="/storestatus" className="w-full" onClick={toggleSidebar}>
                                <button className="w-full bg-[#4E82E4] text-white text-sm flex flex-col items-center py-4 rounded-lg shadow-md hover:bg-[#6a9aec]">
                                    <FaHouse className="w-6 mb-1" />
                                    Status
                                </button>
                            </Link>
                            <Link to="/storeinfo" className="w-full" onClick={toggleSidebar}>
                                <button className="w-full bg-[#4E82E4] text-white text-sm flex flex-col items-center py-4 rounded-lg shadow-md hover:bg-[#6a9aec]">
                                    <FaInfo className="w-6 mb-1" />
                                    Info
                                </button>
                            </Link>
                            <Link to="/addstorage" className="w-full" onClick={toggleSidebar}>
                                <button className="w-full bg-[#4E82E4] text-white text-sm flex flex-col items-center py-4 rounded-lg shadow-md hover:bg-[#6a9aec]">
                                    <FaBoxesStacked className="w-6 mb-1" />
                                    Storage
                                </button>
                            </Link>
                            <Link to="/users" className="w-full" onClick={toggleSidebar}>
                                <button className="w-full bg-[#4E82E4] text-white text-sm flex flex-col items-center py-4 rounded-lg shadow-md hover:bg-[#6a9aec]">
                                    <FaUsers className="w-6 mb-1" />
                                    Employees
                                </button>
                            </Link>
                            <Link to="/replenishment" className="w-full" onClick={toggleSidebar}>
                                <button className="w-full bg-[#4E82E4] text-white text-sm flex flex-col items-center py-4 rounded-lg shadow-md hover:bg-[#6a9aec]">
                                    <FaCartFlatbed className="w-6 mb-1" />
                                    Replenish
                                </button>
                            </Link>
                            <Link to="/lowstock" className="w-full" onClick={toggleSidebar}>
                                <button className="w-full bg-[#4E82E4] text-white text-sm flex flex-col items-center py-4 rounded-lg shadow-md hover:bg-[#6a9aec]">
                                    <FaBoxOpen className="w-6 mb-1" />
                                    Low stock
                                </button>
                            </Link>

                            {/* Translate Button (Now White & in the Grid) */}
                            <button
                                className="w-full text-white bg-[#4E82E4] text-sm flex flex-col items-center py-4 rounded-lg shadow-md hover:bg-[#6a9aec]"
                                onClick={toggleDropdown}
                            >
                                <FaLanguage className="w-6 mb-1" />
                                Translate
                            </button>
                        </div>

                        {/* Language Dropdown */}
                        {dropdownOpen && (
                            <div className="bg-white shadow-lg rounded-lg w-48 mt-2">
                                <div className="flex items-center cursor-pointer p-2 hover:bg-gray-200">
                                    <img src="/Flags/Uk.png" alt="English" className="h-5 w-5 mr-2" />
                                    <span>English</span>
                                </div>
                                <div className="flex items-center cursor-pointer p-2 hover:bg-gray-200">
                                    <img src="/Flags/Latvia.png" alt="Latviešu" className="h-5 w-5 mr-2" />
                                    <span>Latviešu</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bottom Section (Store Info, User, Edit & Logout) */}
                    <div className="flex flex-col items-center w-full">
                        {/* Store Name */}
                        <div className="text-center font-teko text-2xl text-[#DF9677] mb-2">
                            <p>{storeName ? storeName : "No store created yet"}</p>
                        </div>

                        {/* Employee Name */}
                        {employeeName && (
                            <div className="text-center font-teko text-lg text-[#4E82E4]">
                                <p>Welcome, {employeeName}!</p>
                            </div>
                        )}

                        {/* Profile and Logout Buttons */}
                        <div className="grid grid-cols-2 gap-4 w-full px-6 mt-4">
                            <button
                                onClick={toggleProfileOverlay}
                                className="bg-[#4E82E4] text-white flex flex-col justify-center items-center px-4 py-3 rounded-lg shadow-md hover:bg-[#6a9aec]"
                            >
                                <FaPen className="w-6 mb-1"/>
                                Edit profile
                            </button>
                            <button
                                onClick={logout}
                                className="bg-[#DF9677] text-white flex flex-col justify-center items-center px-4 py-3 rounded-lg shadow-md hover:bg-red-600"
                            >
                                <BiSolidExit className="w-6 mb-1" />
                                Log out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
