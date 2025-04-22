import React, { useEffect, useState } from 'react';
import Sidebar from '../../Sidebar';
import { useAuth } from "../Authentification/AuthContext";
import {FaChevronLeft, FaChevronRight, FaPen, FaXmark, FaStore, FaMapPin, FaBoxesStacked, FaTags, FaDoorOpen, FaDoorClosed} from 'react-icons/fa6';
import axios from "axios";

const Storestatus = () => {
    const { user, authToken } = useAuth();
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [selectedDate, setSelectedDate] = useState(null);
    const [workingHours, setWorkingHours] = useState([]);
    const [store, setStore] = useState({});
    const [userData, setUserData] = useState(null);

    // Fetch store information and working hours from backend
    useEffect(() => {
        const getStoreInfo = async () => {
            const store_id = user.store_id;
            const userRole = localStorage.getItem('userRole'); // Get user role

            if (store_id) {
                try {
                    // Fetch store information
                    const storeResponse = await axios.get(
                        `https://stocksmart.xyz/api/show/${store_id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${user.token}`,
                            },
                        }
                    );
                    setStore(storeResponse.data);
                    setWorkingHours(storeResponse.data.working_hours);

                    // Fetch user/worker information based on role
                    if (userRole === 'worker') {
                        const workerResponse = await axios.get(
                            `https://stocksmart.xyz/api/workers/${user.id}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${user.token}`,
                                },
                            }
                        );
                        setUserData(workerResponse.data);
                    } else {
                        const userResponse = await axios.get(
                            `https://stocksmart.xyz/api/user/${user.id}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${user.token}`,
                                },
                            }
                        );
                        setUserData(userResponse.data);
                    }

                } catch (error) {
                    console.error("Error fetching store or user data:", error);
                }
            }
        };
        getStoreInfo();
    }, [user.token, user.store_id, user.id]);

    // Calendar setup
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

    const daysInCurrentMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear);
    const emptyDays = Array(firstDayOfMonth).fill(null);
    const days = [...emptyDays, ...Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1)];

    // Navigation functions
    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    // Function to find default working hours for a given weekday
    // Function to find default working hours for a given weekday
    const getDefaultWorkingHours = (dayName) => {
        const dayData = workingHours.find(hour => hour.day === dayName);
        if (dayData) {
            // Check if the opening and closing times are '00:00'
            if (dayData.opening_time === '00:00:00' && dayData.closing_time === '00:00:00') {
                return { opening_time: 'Closed', closing_time: '' };
            }
            return { opening_time: dayData.opening_time, closing_time: dayData.closing_time };
        }
        return { opening_time: 'Closed', closing_time: '' };
    };
    const [isEditOverlayVisible, setIsEditOverlayVisible] = useState(false);
    const [editableStoreInfo, setEditableStoreInfo] = useState({
        storename: store.storename,
        address: store.address,
        category: store.category,
        backroom: store.backroom
    });
    const handleSaveChanges = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`https://stocksmart.xyz/api/show/${store.id}`, editableStoreInfo);
            setStore(response.data); // Update the store state with new data
            setIsEditOverlayVisible(false); // Close overlay
        } catch (error) {
            console.error('Error updating store information:', error);
            alert('Failed to update store information.');
        }
    };
    const [isWorkingHoursEditVisible, setIsWorkingHoursEditVisible] = useState(false);
    const [editableWorkingHours, setEditableWorkingHours] = useState({
        day: '',
        opening_time: '',
        closing_time: '',
    });
    const handleSaveWorkingHours = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`https://stocksmart.xyz/api/working-hours/${editableWorkingHours.id}`, editableWorkingHours);
            // Update the working hours state with new data
            const updatedWorkingHours = workingHours.map(hour =>
                hour.id === editableWorkingHours.id ? response.data : hour
            );
            setWorkingHours(updatedWorkingHours);
            setIsWorkingHoursEditVisible(false); // Close overlay
            alert('Working hours updated successfully!');
        } catch (error) {
            console.error('Error updating working hours:', error);
            alert('Failed to update working hours.');
        }
    };
    const handleEditWorkingHours = (dayName) => {
        const dayData = workingHours.find(hour => hour.day === dayName);
        setEditableWorkingHours(dayData || { day: dayName, opening_time: '', closing_time: '' });
        setIsWorkingHoursEditVisible(true);
    };
    return (
        <div className="flex ml-[16.67%] max-sm:ml-0">
            <Sidebar storeName={store.storename} employeeName={user.name} />

            <div className=" flex-row w-full h-screen p-8 max-sm:ml-0 max-sm:w-full max-sm:p-1">
                {/* Optional: Display user information if needed */}
                {userData && (
                    <div className="mb-8">
                        <h1 className="text-4xl font-teko text-[#4E82E4]">User Information</h1>
                        <div className="mt-1 space-y-4">
                            <p><strong>Name:</strong> {userData.name} {userData.last_name}</p>
                            <p><strong>Email:</strong> {userData.email}</p>
                        </div>
                    </div>
                )}

                {/* Display Store Information */}
                {store && (
                    <div className="p-8 mb-5 shadow-lg shadow-gray-500 rounded-md bg-[#f8fafe]">
                        <button
                            className="absolute top-[5%] right-[3%] bg-[#4E82E4] text-white flex items-center px-4 py-1 my-2 rounded-lg shadow-md hover:bg-[#2263dd] transform hover:scale-105 cursor-pointer"
                            onClick={() => {
                                setEditableStoreInfo({
                                    storename: store.storename,
                                    address: store.address,
                                    category: store.category,
                                    backroom: store.backroom
                                });
                                setIsEditOverlayVisible(true);
                            }}
                        >
                            <FaPen className="w-6 mr-2"/>
                            Edit
                        </button>
                        <h1 className="text-4xl font-teko text-[#4E82E4]">Store Information</h1>
                        <div className="space-y-1">
                            <p className="flex flex-row justify-start items-center"><FaStore className="mr-2 text-[#DF9677]"/><strong className="mr-2">Store Name:</strong> {store.storename}</p>
                            <p className="flex flex-row justify-start items-center"><FaMapPin className="mr-2 text-[#DF9677]"/><strong className="mr-2">Store Address:</strong> {store.address}</p>
                            <p className="flex flex-row justify-start items-center"><FaTags className="mr-2 text-[#DF9677]"/><strong className="mr-2">Store Category:</strong> {store.category}</p>
                            <p className="flex flex-row justify-start items-center"><FaBoxesStacked className="mr-2 text-[#DF9677]"/><strong className="mr-2">Backroom Enabled:</strong> {store.backroom ? 'Yes' : 'No'}</p>
                        </div>
                    </div>
                )}

                <div className="bg-white p-4 rounded-lg shadow-lg shadow-gray-500">
                    <div className="flex justify-between items-center mb-4">
                        <button onClick={handlePrevMonth} className="text-gray-700 p-2">
                            <FaChevronLeft size={24} className="text-[#4E82E4]"/>
                        </button>
                        <div>
                            <h2 className="text-2xl font-bold">{months[currentMonth]} {currentYear}</h2>
                        </div>
                        <button onClick={handleNextMonth} className="text-gray-700 p-2">
                            <FaChevronRight size={24} className="text-[#4E82E4]" />
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-2 text-center">
                        {daysOfWeek.map((day) => (
                            <div key={day} className="font-semibold text-gray-600">{day}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2 text-center">
                        {days.map((day, index) => {
                            if (day === null) return <div key={index} />;

                            const date = new Date(currentYear, currentMonth, day);
                            const dayName = daysOfWeek[date.getDay()];
                            const hours = getDefaultWorkingHours(dayName);

                            const isClosed = hours.opening_time === 'Closed';

                            return (
                                <div
                                    key={index}
                                    className={`h-full w-full p-1.5 rounded-md cursor-pointer transition duration-200 ease-in-out 
            ${isClosed ? 'bg-red-400 hover:bg-red-500' : 'bg-blue-100 hover:bg-blue-200'} 
            hover:shadow-lg`}
                                    onClick={() => setSelectedDate({ date, hours })}
                                >
                                    <div className="text-lg font-bold text-gray-800">{day}</div>
                                    {isClosed ? (
                                        <div className="text-white text-sm font-medium">Closed</div>
                                    ) : (
                                        <div className="text-sm w-full text-gray-700 font-semibold">
                                            Working: <br /> {hours.opening_time} - {hours.closing_time}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {selectedDate && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg relative">
                            <button className="absolute top-2 right-2 text-gray-500"
                                    onClick={() => setSelectedDate(null)}>
                                <FaXmark size={24} className="text-[#4E82E4]"/>
                            </button>
                            <h1 className="text-xl font-bold mb-4 text-[#4E82E4]">Working Hours for {selectedDate.date.toDateString()}</h1>
                            <div className="mb-4">
                                <p className="flex justify-start items-center"><FaDoorOpen className="mr-2 text-[#DF9677]"/>Opening: {selectedDate.hours.opening_time}</p>
                                <p className="flex justify-start items-center"><FaDoorClosed className="mr-2 text-[#DF9677]"/>Closing: {selectedDate.hours.closing_time}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {isEditOverlayVisible && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg relative w-80">
                        <button
                            className="absolute top-2 right-2 text-gray-500"
                            onClick={() => setIsEditOverlayVisible(false)}
                        >
                            <FaXmark size={24} className="text-[#4E82E4]" />
                        </button>
                        <h1 className="text-xl font-bold mb-4 text-[#4E82E4]">Edit Store Information</h1>
                        <form onSubmit={handleSaveChanges} className="space-y-4">
                            <input
                                type="text"
                                className="w-full p-2 border rounded"
                                placeholder="Store Name"
                                value={editableStoreInfo.storename}
                                onChange={(e) =>
                                    setEditableStoreInfo((prev) => ({ ...prev, storename: e.target.value }))
                                }
                                required
                            />
                            <input
                                type="text"
                                className="w-full p-2 border rounded"
                                placeholder="Address"
                                value={editableStoreInfo.address}
                                onChange={(e) =>
                                    setEditableStoreInfo((prev) => ({ ...prev, address: e.target.value }))
                                }
                                required
                            />
                            <input
                                type="text"
                                className="w-full p-2 border rounded"
                                placeholder="Category"
                                value={editableStoreInfo.category}
                                onChange={(e) =>
                                    setEditableStoreInfo((prev) => ({ ...prev, category: e.target.value }))
                                }
                                required
                            />
                            <div className="flex items-center">
                                <label className="text-sm mr-2">Backroom Enabled:</label>
                                <input
                                    type="checkbox"
                                    checked={editableStoreInfo.backroom}
                                    onChange={(e) =>
                                        setEditableStoreInfo((prev) => ({ ...prev, backroom: e.target.checked }))
                                    }
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-[#4E82E4] text-white py-2 rounded hover:bg-[#6a9aec]"
                            >
                                Save Changes
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Storestatus;
