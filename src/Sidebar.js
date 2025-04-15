import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
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
    FaLanguage,
    FaXmark
} from 'react-icons/fa6';
import { CgSpinnerAlt } from "react-icons/cg";
import { BiSolidExit } from 'react-icons/bi';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "./Components/Authentification/AuthContext";
import { sidebartranslations } from './Components/TranslationContext';

const Sidebar = ({ employeeName, storeName }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isSidebarLoading, setSidebarLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const isSellPage = location.pathname === '/sell'; // Adjust if your sell route differs

    // For larger screens, use the given breakpoints:
    const sidebarResponsiveClass = isSellPage
        ? "hidden xl:flex transition-all duration-300"
        : "hidden sm:flex transition-all duration-300";

    // For mobile sidebar toggle button, use z-40 for lower than max z-index (max allowed is 50)
    const mobileSidebarClass = isSellPage
        ? "absolute xl:hidden z-40 transition-all duration-300"
        : "absolute sm:hidden z-40 transition-all duration-300";

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    // For swipe gesture on mobile:
    const touchStartX = useRef(null);
    const touchEndX = useRef(null);
    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        touchStartX.current = e.targetTouches[0].clientX;
    };

    const onTouchMove = (e) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const onTouchEnd = () => {
        if (!touchStartX.current || !touchEndX.current) return;
        if (touchStartX.current - touchEndX.current > minSwipeDistance) {
            // Swiped from right to left
            setSidebarOpen(false);
        }
        touchStartX.current = null;
        touchEndX.current = null;
    };

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [editableUserInfo, setEditableUserInfo] = useState({ name: "", last_name: "", email: "" });
    const { user, setUser } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isProfileOverlayOpen, setProfileOverlayOpen] = useState(false);
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');
    const [username, setUsername] = useState("");
    const [isChangingLanguage, setIsChangingLanguage] = useState(false);
    const isStoreLoading = !storeName;

    const toggleProfileOverlay = () => setProfileOverlayOpen(!isProfileOverlayOpen);
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
        setTimeout(() => {
            window.location.reload();
        }, 100);
    };

    const handleLanguageChange = (newLanguage) => {
        setIsChangingLanguage(true);
        setLanguage(newLanguage);
        localStorage.setItem('language', newLanguage);
        setTimeout(() => {
            window.location.reload();
        }, 3000);
    };

    const handleProfileSave = async (e) => {
        e.preventDefault();
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                alert('Authorization token not found. Please log in again.');
                return;
            }
            const response = await axios.put(
                `https://stocksmart.xyz/api/user/${user.id}`,
                editableUserInfo,
                { headers: { Authorization: `Bearer ${authToken}` } }
            );
            setUser(response.data);
            setProfileOverlayOpen(false);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile.');
        }
    };

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`https://stocksmart.xyz/api/user/${user.id}`);
            setEditableUserInfo({
                name: response.data.name,
                last_name: response.data.last_name,
                email: response.data.email
            });
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        if (storeName && employeeName) {
            setSidebarLoading(false);
        }
    }, [storeName, employeeName]);

    return (
        <>
            {/* Changing language overlay */}
            {isChangingLanguage && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col justify-center items-center z-40 transition-all duration-300">
                    <CgSpinnerAlt className="w-16 h-16 text-white animate-spin transition-all duration-300" />
                    <p className="mt-4 text-white text-xl transition-all duration-300">Changing language...</p>
                </div>
            )}

            {/* Profile editing overlay: Highest z-index of 50 */}
            {isProfileOverlayOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-all duration-300">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-1/3 transition-all duration-300">
                        <h2 className="text-2xl font-bold mb-4 transition-all duration-300">Edit Profile</h2>
                        <form onSubmit={handleProfileSave} className="transition-all duration-300">
                            <div className="mb-4 transition-all duration-300">
                                <label className="block text-gray-700 transition-all duration-300">First Name:</label>
                                <input
                                    type="text"
                                    className="w-full border rounded p-2 transition-all duration-300"
                                    value={firstName}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setFirstName(value);
                                        setEditableUserInfo((prev) => ({ ...prev, name: value }));
                                    }}
                                />
                            </div>
                            <div className="mb-4 transition-all duration-300">
                                <label className="block text-gray-700 transition-all duration-300">Last Name:</label>
                                <input
                                    type="text"
                                    className="w-full border rounded p-2 transition-all duration-300"
                                    value={lastName}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setLastName(value);
                                        setEditableUserInfo((prev) => ({ ...prev, last_name: value }));
                                    }}
                                />
                            </div>
                            <div className="mb-4 transition-all duration-300">
                                <label className="block text-gray-700 transition-all duration-300">Email:</label>
                                <input
                                    type="email"
                                    className="w-full border rounded p-2 transition-all duration-300"
                                    value={email}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setEmail(value);
                                        setEditableUserInfo((prev) => ({ ...prev, email: value }));
                                    }}
                                />
                            </div>
                            <div className="flex justify-end transition-all duration-300">
                                <button type="button" onClick={toggleProfileOverlay} className="mr-2 transition-all duration-300">
                                    Cancel
                                </button>
                                <button type="submit" className="bg-[#4E82E4] text-white p-2 rounded transition-all duration-300">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Sidebar for larger screens */}
            <div className={`${sidebarResponsiveClass} flex-col fixed left-0 top-0 h-screen w-1/6 min-w-[200px] bg-white shadow-2xl z-20 justify-between py-8 transition-all duration-300`}>
                <div className="flex flex-col items-center transition-all duration-300">
                    <div className="flex items-center justify-center mb-8 transition-all duration-300">
                        <img src="/Fullofoblack.png" alt="StockSmart Logo" className="w-4/5 transition-all duration-300" />
                    </div>
                    <div className="flex flex-col space-y-2 w-full transition-all duration-300">
                        <Link to="/sell" className="w-full flex justify-center transition-all duration-300">
                            <button
                                disabled={isStoreLoading}
                                className={`w-4/5 flex items-center px-4 py-3 rounded-lg shadow-md transition-all duration-300 ${isStoreLoading ? "bg-gray-300 animate-pulse cursor-not-allowed" : "bg-[#4E82E4] text-white hover:bg-[#6a9aec] hover:scale-105"}`}
                            >
                                {isStoreLoading ? (
                                    <CgSpinnerAlt className="w-6 h-6 mr-2 text-white animate-spin transition-all duration-300" style={{ animationDuration: "0.5s" }} />
                                ) : (
                                    <>
                                        <FaCartShopping className="w-6 mr-2 transition-all duration-300" />
                                        {sidebartranslations[language].selling}
                                    </>
                                )}
                            </button>
                        </Link>
                        <Link to="/storestatus" className="w-full flex justify-center transition-all duration-300">
                            <button
                                disabled={isStoreLoading}
                                className={`w-4/5 flex items-center px-4 py-3 rounded-lg shadow-md transition-all duration-300 ${isStoreLoading ? "bg-gray-300 animate-pulse cursor-not-allowed" : "bg-[#4E82E4] text-white hover:bg-[#6a9aec] hover:scale-105"}`}
                            >
                                {isStoreLoading ? (
                                    <CgSpinnerAlt className="w-6 h-6 mr-2 text-white animate-spin transition-all duration-300" style={{ animationDuration: "0.5s" }} />
                                ) : (
                                    <>
                                        <FaHouse className="w-6 mr-2 transition-all duration-300" />
                                        {sidebartranslations[language].storeStatus}
                                    </>
                                )}
                            </button>
                        </Link>
                        {!storeName && (
                            <Link to="/storeinfo" className="w-full flex justify-center transition-all duration-300">
                                <button
                                    disabled={isStoreLoading}
                                    className={`w-4/5 flex items-center px-4 py-3 rounded-lg shadow-md transition-all duration-300 ${isStoreLoading ? "bg-gray-300 animate-pulse cursor-not-allowed" : "bg-[#4E82E4] text-white hover:bg-[#6a9aec] hover:scale-105"}`}
                                >
                                    {isStoreLoading ? (
                                        <CgSpinnerAlt className="w-6 h-6 mr-2 text-white animate-spin transition-all duration-300" style={{ animationDuration: "0.5s" }} />
                                    ) : (
                                        <>
                                            <FaInfo className="w-6 mr-2 transition-all duration-300" />
                                            {sidebartranslations[language].storeInfo}
                                        </>
                                    )}
                                </button>
                            </Link>
                        )}
                        <Link to="/addstorage" className="w-full flex justify-center transition-all duration-300">
                            <button
                                disabled={isStoreLoading}
                                className={`w-4/5 flex items-center px-4 py-3 rounded-lg shadow-md transition-all duration-300 ${isStoreLoading ? "bg-gray-300 animate-pulse cursor-not-allowed" : "bg-[#4E82E4] text-white hover:bg-[#6a9aec] hover:scale-105"}`}
                            >
                                {isStoreLoading ? (
                                    <CgSpinnerAlt className="w-6 h-6 mr-2 text-white animate-spin transition-all duration-300" style={{ animationDuration: "0.5s" }} />
                                ) : (
                                    <>
                                        <FaBoxesStacked className="w-6 mr-2 transition-all duration-300" />
                                        {sidebartranslations[language].storage}
                                    </>
                                )}
                            </button>
                        </Link>
                        <Link to="/users" className="w-full flex justify-center transition-all duration-300">
                            <button
                                disabled={isStoreLoading}
                                className={`w-4/5 flex items-center px-4 py-3 rounded-lg shadow-md transition-all duration-300 ${isStoreLoading ? "bg-gray-300 animate-pulse cursor-not-allowed" : "bg-[#4E82E4] text-white hover:bg-[#6a9aec] hover:scale-105"}`}
                            >
                                {isStoreLoading ? (
                                    <CgSpinnerAlt className="w-6 h-6 mr-2 text-white animate-spin transition-all duration-300" style={{ animationDuration: "0.5s" }} />
                                ) : (
                                    <>
                                        <FaUsers className="w-6 mr-2 transition-all duration-300" />
                                        {sidebartranslations[language].employees}
                                    </>
                                )}
                            </button>
                        </Link>
                        <Link to="/replenishment" className="w-full flex justify-center transition-all duration-300">
                            <button
                                disabled={isStoreLoading}
                                className={`w-4/5 flex items-center px-4 py-3 rounded-lg shadow-md transition-all duration-300 ${isStoreLoading ? "bg-gray-300 animate-pulse cursor-not-allowed" : "bg-[#4E82E4] text-white hover:bg-[#6a9aec] hover:scale-105"}`}
                            >
                                {isStoreLoading ? (
                                    <CgSpinnerAlt className="w-6 h-6 mr-2 text-white animate-spin transition-all duration-300" style={{ animationDuration: "0.5s" }} />
                                ) : (
                                    <>
                                        <FaCartFlatbed className="w-6 mr-2 transition-all duration-300" />
                                        {sidebartranslations[language].replenish}
                                    </>
                                )}
                            </button>
                        </Link>
                        <Link to="/lowstock" className="w-full flex justify-center transition-all duration-300">
                            <button
                                disabled={isStoreLoading}
                                className={`w-4/5 flex items-center px-4 py-3 rounded-lg shadow-md transition-all duration-300 ${isStoreLoading ? "bg-gray-300 animate-pulse cursor-not-allowed" : "bg-[#4E82E4] text-white hover:bg-[#6a9aec] hover:scale-105"}`}
                            >
                                {isStoreLoading ? (
                                    <CgSpinnerAlt className="w-6 h-6 mr-2 text-white animate-spin transition-all duration-300" style={{ animationDuration: "0.5s" }} />
                                ) : (
                                    <>
                                        <FaBoxOpen className="w-6 mr-2 transition-all duration-300" />
                                        {sidebartranslations[language].lowStock}
                                    </>
                                )}
                            </button>
                        </Link>
                        <div className="w-full flex justify-center transition-all duration-300">
                            <button
                                className="bg-[#4E82E4] text-white flex items-center px-4 py-4 rounded-lg shadow-md transition-all duration-300 hover:bg-[#6a9aec]"
                                onClick={toggleDropdown}
                            >
                                <FaLanguage className="scale-125 transition-all duration-300" />
                            </button>
                        </div>
                    </div>
                    {dropdownOpen && (
                        <div className="mt-2 transform bg-white shadow-lg shadow-gray-500 rounded-lg w-1/2 transition-all duration-300">
                            <div className="flex items-center cursor-pointer p-2 hover:bg-gray-200 transition-all duration-300" onClick={() => handleLanguageChange('en')}>
                                <img src="/Flags/Uk.png" alt="English" className="h-5 w-5 mr-2 transition-all duration-300" />
                                <span>English</span>
                            </div>
                            <div className="flex items-center cursor-pointer p-2 hover:bg-gray-200 transition-all duration-300" onClick={() => handleLanguageChange('lv')}>
                                <img src="/Flags/Latvia.png" alt="Latviešu" className="h-5 w-5 mr-2 transition-all duration-300" />
                                <span>Latviešu</span>
                            </div>
                        </div>
                    )}
                </div>


                <div className="flex flex-col items-center w-full transition-all duration-300">
                    <div className="text-center font-teko text-2xl text-[#DF9677] scale-150 transition-all duration-300">
                        <p>{storeName ? storeName : <span className="inline-block w-32 h-6 bg-gray-300 animate-pulse rounded transition-all duration-300"></span>}</p>
                    </div>
                    {employeeName ? (
                        <div className="text-center font-teko text-lg text-[#4E82E4] transition-all duration-300">
                            <p>{sidebartranslations[language].welcome}{employeeName}!</p>
                        </div>
                    ) : (
                        <div className="text-center font-teko text-lg text-[#4E82E4] transition-all duration-300">
                            <span className="inline-block w-24 h-5 bg-gray-300 animate-pulse rounded transition-all duration-300"></span>
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-4 w-full px-6 mt-4 transition-all duration-300">
                        <button
                            onClick={toggleProfileOverlay}
                            className="w-full bg-[#4E82E4] text-white flex flex-col justify-center items-center px-4 py-3 rounded-lg shadow-md transition-all duration-300 hover:bg-[#6a9aec]"
                        >
                            <FaPen className="w-5 mr-2 transition-all duration-300" />{sidebartranslations[language].editProfile}
                        </button>
                        <button
                            onClick={logout}
                            className="w-full bg-[#DF9677] text-white flex flex-col justify-center items-center px-4 py-3 rounded-lg shadow-md transition-all duration-300 hover:bg-red-600"
                        >
                            <BiSolidExit className="w-5 mr-2 transition-all duration-300" />{sidebartranslations[language].logout}
                        </button>
                    </div>
                </div>
            </div>

            {/* Sidebar for smaller screens / Mobile Sidebar toggle */}
            <div className={`${mobileSidebarClass} top-2 left-2 transition-all duration-300`}>
                <button className="text-2xl text-gray-500 focus:outline-none m-4 z-40 transition-all duration-300"
                        onClick={toggleSidebar}>
                    <FaBars className="transition-all duration-300"/>
                </button>
                <div
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                    className={`fixed top-0 left-0 h-full w-3/4 bg-white shadow-2xl z-40 transform transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} flex flex-col justify-between items-center py-8`}
                >
                    <button className="text-2xl text-gray-500 absolute top-4 right-4 transition-all duration-300"
                            onClick={toggleSidebar}>
                        <FaXmark className="transition-all duration-300"/>
                    </button>
                    <div className="flex flex-col items-center w-full transition-all duration-300">
                        <div className="flex justify-center mb-4 transition-all duration-300">
                            <img src="/Fullofoblack.png" alt="StockSmart Logo"
                                 className="max-h-[50px] transition-all duration-300"/>
                        </div>
                        <div className="grid grid-cols-2 gap-2 w-full px-2 transition-all duration-300">
                            <Link to="/sell" className="w-full transition-all duration-300" onClick={toggleSidebar}>
                                <button
                                    className="w-full bg-[#4E82E4] text-white text-sm flex flex-col items-center py-4 rounded-lg shadow-md transition-all duration-300 hover:bg-[#2263dd]">
                                    <FaCartShopping
                                        className="w-6 mb-1 transition-all duration-300"/>{sidebartranslations[language].selling}
                                </button>
                            </Link>
                            <Link to="/storestatus" className="w-full transition-all duration-300"
                                  onClick={toggleSidebar}>
                                <button
                                    className="w-full bg-[#4E82E4] text-white text-sm flex flex-col items-center py-4 rounded-lg shadow-md transition-all duration-300 hover:bg-[#2263dd]">
                                    <FaHouse
                                        className="w-6 mb-1 transition-all duration-300"/>{sidebartranslations[language].storeStatus}
                                </button>
                            </Link>
                            {!storeName && (
                                <Link to="/storeinfo" className="w-full transition-all duration-300"
                                      onClick={toggleSidebar}>
                                    <button
                                        className="w-full bg-[#4E82E4] text-white text-sm flex flex-col items-center py-4 rounded-lg shadow-md transition-all duration-300 hover:bg-[#2263dd]">
                                        <FaInfo
                                            className="w-6 mb-1 transition-all duration-300"/>{sidebartranslations[language].storeInfo}
                                    </button>
                                </Link>
                            )}
                            <Link to="/addstorage" className="w-full transition-all duration-300"
                                  onClick={toggleSidebar}>
                                <button
                                    className="w-full bg-[#4E82E4] text-white text-sm flex flex-col items-center py-4 rounded-lg shadow-md transition-all duration-300 hover:bg-[#2263dd]">
                                    <FaBoxesStacked
                                        className="w-6 mb-1 transition-all duration-300"/>{sidebartranslations[language].storage}
                                </button>
                            </Link>
                            <Link to="/users" className="w-full transition-all duration-300" onClick={toggleSidebar}>
                                <button
                                    className="w-full bg-[#4E82E4] text-white text-sm flex flex-col items-center py-4 rounded-lg shadow-md transition-all duration-300 hover:bg-[#2263dd]">
                                    <FaUsers
                                        className="w-6 mb-1 transition-all duration-300"/>{sidebartranslations[language].employees}
                                </button>
                            </Link>
                            <Link to="/replenishment" className="w-full transition-all duration-300"
                                  onClick={toggleSidebar}>
                                <button
                                    className="w-full bg-[#4E82E4] text-white text-sm flex flex-col items-center py-4 rounded-lg shadow-md transition-all duration-300 hover:bg-[#2263dd]">
                                    <FaCartFlatbed
                                        className="w-6 mb-1 transition-all duration-300"/>{sidebartranslations[language].replenish}
                                </button>
                            </Link>
                            <Link to="/lowstock" className="w-full transition-all duration-300" onClick={toggleSidebar}>
                                <button
                                    className="w-full bg-[#4E82E4] text-white text-sm flex flex-col items-center py-4 rounded-lg shadow-md transition-all duration-300 hover:bg-[#2263dd]">
                                    <FaBoxOpen
                                        className="w-6 mb-1 transition-all duration-300"/>{sidebartranslations[language].lowStock}
                                </button>
                            </Link>
                            <button
                                className="w-full text-white bg-[#4E82E4] text-sm flex flex-col items-center py-4 rounded-lg shadow-md transition-all duration-300 hover:bg-[#6a9aec]"
                                onClick={toggleDropdown}
                            >
                                <FaLanguage className="w-6 mb-1 transition-all duration-300"/>
                                {sidebartranslations[language].language}
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col items-center w-full transition-all duration-300">
                        <div
                            className="text-center font-teko text-2xl text-[#DF9677] scale-150 transition-all duration-300">
                            <p>{storeName ? storeName : sidebartranslations[language].noStore}</p>
                        </div>
                        {employeeName && (
                            <div className="text-center font-teko text-lg text-[#4E82E4] transition-all duration-300">
                                <p>{sidebartranslations[language].welcome}{employeeName}!</p>
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-4 w-full px-6 mt-4 transition-all duration-300">
                            <button
                                onClick={toggleProfileOverlay}
                                className="w-full bg-[#4E82E4] text-white flex flex-col justify-center items-center px-4 py-3 rounded-lg shadow-md transition-all duration-300 hover:bg-[#6a9aec]"
                            >
                                <FaPen
                                    className="w-5 mr-2 transition-all duration-300"/>{sidebartranslations[language].editProfile}
                            </button>
                            <button
                                onClick={logout}
                                className="w-full bg-[#DF9677] text-white flex flex-col justify-center items-center px-4 py-3 rounded-lg shadow-md transition-all duration-300 hover:bg-red-600"
                            >
                                <BiSolidExit
                                    className="w-5 mr-2 transition-all duration-300"/>{sidebartranslations[language].logout}
                            </button>
                        </div>
                    </div>
                    {dropdownOpen && (
                        <div className="absolute top-1/2 left-2 transform bg-white shadow-lg rounded-lg w-[47%] min-w-[110px] transition-all duration-300">
                            <div className="flex items-center cursor-pointer p-1.5 hover:bg-gray-200 transition-all duration-300"
                                 onClick={() => handleLanguageChange('en')}>
                                <img src="/Flags/Uk.png" alt="English" className="h-5 w-5 mr-2 transition-all duration-300" />
                                <span>English</span>
                            </div>
                            <div className="flex items-center cursor-pointer p-1.5 hover:bg-gray-200 transition-all duration-300"
                                 onClick={() => handleLanguageChange('lv')}>
                                <img src="/Flags/Latvia.png" alt="Latviešu" className="h-5 w-5 mr-2 transition-all duration-300" />
                                <span>Latviešu</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Sidebar;