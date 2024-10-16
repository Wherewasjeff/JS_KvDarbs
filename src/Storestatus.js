import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { FaChevronLeft, FaChevronRight, FaXmark } from 'react-icons/fa6';

const Storestatus = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [selectedDate, setSelectedDate] = useState(null);
    const [workingHours, setWorkingHours] = useState({ opening: '', closing: '' });
    const [workers, setWorkers] = useState([{ name: 'Worker A' }, { name: 'Worker B' }]);
    const [additionalWorkers, setAdditionalWorkers] = useState([]);

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const getDaysInMonth = (month, year) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (month, year) => {
        return new Date(year, month, 1).getDay();
    };

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

    const daysInCurrentMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear);

    const emptyDays = Array(firstDayOfMonth).fill(null);

    const days = [...emptyDays, ...Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1)];

    const getRandomWorker = () => `Worker ${String.fromCharCode(65 + Math.floor(Math.random() * 5))}`;
    const getRandomHours = () => ({
        opening: `${Math.floor(Math.random() * 12) + 6}:00`,
        closing: `${Math.floor(Math.random() * 12) + 18}:00`,
    });

    return (
        <div className="flex">
            <Sidebar />

            <div className="flex-grow p-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-teko text-[#4E82E4]">Store Information</h1>
                    <div className="mt-4 space-y-4">
                        <p><strong>Store name:</strong> Your Store Name</p>
                        <p><strong>Store address:</strong> 1234 Store St, City, Country</p>
                        <p><strong>Store category:</strong> Retail</p>
                        <p><strong>Backroom:</strong> Enabled</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <button onClick={handlePrevMonth} className="text-gray-700 p-2">
                            <FaChevronLeft size={24} className="text-[#4E82E4]" />
                        </button>
                        <div>
                            <h2 className="text-2xl font-bold">{months[currentMonth]} {currentYear}</h2>
                        </div>
                        <button onClick={handleNextMonth} className="text-gray-700 p-2">
                            <FaChevronRight size={24} className="text-[#4E82E4]"/>
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-2 text-center">
                        {daysOfWeek.map((day) => (
                            <div key={day} className="font-semibold text-gray-600">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2 text-center">
                        {days.map((day, index) => {
                            const randomHours = getRandomHours();
                            const isClosed = Math.random() < 0.2;
                            return (
                                <div
                                    key={index}
                                    className={`py-2 px-4 rounded-md cursor-pointer ${
                                        isClosed ? 'bg-red-400' : 'bg-blue-100'
                                    }`}
                                    onClick={() => setSelectedDate(day)}
                                >
                                    <div>{day}</div>
                                    {isClosed ? (
                                        <div className="text-white">Closed</div>
                                    ) : (
                                        <>
                                            <div>
                                                Working from {randomHours.opening} - {randomHours.closing}
                                            </div>
                                            <div>Working: {getRandomWorker()}</div>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {selectedDate && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg relative">
                            <button
                                className="absolute top-2 right-2 text-gray-500"
                                onClick={() => setSelectedDate(null)}
                            >
                                <FaXmark size={24} className="text-[#4E82E4]" />
                            </button>
                            <h1 className="text-xl font-bold mb-4">Choose day data</h1>
                            <div className="mb-4">
                                <label className="block mb-2">Working hours:</label>
                                <div className="flex space-x-2">
                                    <span>From</span>
                                    <input type="time" className="border border-gray-300 rounded p-2"/>
                                    <span>To</span>
                                    <input type="time" className="border border-gray-300 rounded p-2"/>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Select Worker:</label>
                                <div className="flex space-x-2">
                                    <select className="border border-gray-300 rounded p-2 mb-2">
                                        {workers.map((worker, index) => (
                                            <option key={index} value={worker.name}>{worker.name}</option>
                                        ))}
                                    </select>
                                    <div className="flex space-x-2">
                                        <p>From</p>
                                        <input type="time" className="border border-gray-300 rounded p-2"/>
                                        <span>To</span>
                                        <input type="time" className="border border-gray-300 rounded p-2"/>
                                    </div>
                                </div>
                            </div>
                            {additionalWorkers.map((_, index) => (
                                <div key={index} className="mb-4">
                                    <label className="block mb-2">Select Additional Worker:</label>
                                    <div className="flex space-x-2">
                                        <select className="border border-gray-300 rounded p-2 mb-2">
                                            {workers.map((worker, index) => (
                                                <option key={index} value={worker.name}>{worker.name}</option>
                                            ))}
                                        </select>
                                        <div className="flex space-x-2">
                                            <input type="time" className="border border-gray-300 rounded p-2" />
                                            <span>-</span>
                                            <input type="time" className="border border-gray-300 rounded p-2" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button
                                className="bg-[#4E82E4] text-white rounded px-4 py-2 mb-2"
                                onClick={() => setAdditionalWorkers([...additionalWorkers, {}])}
                            >
                                Add worker
                            </button>
                            <button className="bg-[#4E82E4] text-white rounded px-4 py-2 ml-2">
                                Submit
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Storestatus;
