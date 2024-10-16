import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import {
  FaDollarSign,
  FaPercent,
  FaXmark,
  FaBarcode,
  FaClock,
  FaTrashCan,
  FaPen
} from 'react-icons/fa6';

const Selling = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time;
  };

  const hours = formatTime(currentTime.getHours());
  const minutes = formatTime(currentTime.getMinutes());
  const seconds = formatTime(currentTime.getSeconds());

  // Sample items array
  const [items, setItems] = useState([
    {
      id: 1,
      name: 'CD',
      barcode: '1234567890123',
      price: 10.00,
      imgSrc: '/img.png', // Placeholder image
    },
    {
      id: 2,
      name: 'Book',
      barcode: '2345678901234',
      price: 15.00,
      imgSrc: '/img.png', // Placeholder image
    },
  ]);

  // Calculate total price
  const total = items.reduce((acc, item) => acc + item.price, 0);

  // Remove item from the array
  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="w-5/6 bg-[#f8fafe] p-5 h-screen flex flex-col max-[320px]:w-screen">
        {/* Items Container */}
        <div className="flex flex-grow max-[320px]:flex-wrap">
          <div className="w-3/4 bg-white shadow-lg rounded-lg p-4 space-y-4 max-[320px]:w-full max-[320px]:h-2/3 max-[320px]:max-h-2/3 max-[320px]:mt-10">
            <h2 className="text-lg font-bold text-[#4E82E4]">Items List</h2>

            {/* Scrollable Items List */}
            <div className="border border-gray-300 p-4 rounded-lg h-5/6 overflow-y-scroll space-y-4 max-[320px]:p-1">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg shadow-md">
                  {/* Item Image */}
                  <img src={item.imgSrc} alt={item.name} className="w-14 h-14 rounded mr-4 max-[320px]:w-5 max-[320px]:h-5" />
                  {/* Item Name and Barcode */}
                  <div>
                    <p className="font-semibold outline-none">{item.name}</p>
                    <p className="text-sm text-gray-500 outline-none">Barcode: {item.barcode}</p>
                  </div>
                  {/* Item Price, Edit, and Trash Icons */}
                  <div className="flex items-center space-x-4 max-[320px]:flex-wrap max-[320px]:space-x-0 max-[320px]:justify-between">
                    <span className="font-semibold text-[#4E82E4] max-[320px]:ml-3">${item.price.toFixed(2)}</span>
                    <FaPen className="text-gray-500 cursor-pointer hover:text-blue-500 transition-colors" />
                    <FaTrashCan
                      className="text-gray-500 cursor-pointer hover:text-red-600 transition-colors"
                      onClick={() => removeItem(item.id)}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Total Row (always visible) */}
            <div className="flex justify-between items-center h-max border-t border-gray-300 pt-2 mt-2 max-[320px]:mt-0 max-[320px]:pt-0">
              <span className="font-bold text-2xl">Total:</span>
              <span className="font-bold text-2xl">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Sidebar with Buttons and Clock */}
          <div className="flex flex-col w-1/4 ml-4 max-[320px]:w-full max-[320px]:ml-0 max-[320px]:h-1/4 max-[320px]:mt-5">
            {/* Clock */}
            <div className="flex justify-center items-center p-4 bg-white shadow-lg rounded-lg mb-4 max-[320px]:p-1 max-[320px]:w-1/2">
              <FaClock className="text-[#4E82E4] mr-2" />
              <span className="text-xl font-semibold">{hours}:{minutes}:{seconds}</span>
            </div>

            {/* Buttons */}
            <button className="bg-[#4E82E4] hover:bg-[#2968DE] text-white font-semibold py-2 px-4 rounded mb-4 max-[320px]:p-1">
              Checkout
            </button>
            <button className="bg-[#4E82E4] hover:bg-[#2968DE] text-white font-semibold py-2 px-4 rounded mb-4 max-[320px]:p-1">
              Discounts
            </button>
            <button className="bg-[#DF9677] hover:bg-red-600 text-white font-semibold py-2 px-4 rounded max-[320px]:p-1">
              Cancel
            </button>
          </div>
        </div>

        {/* Barcode Input Field with Submit Button */}
        <div className="mt-4 flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3 space-x-4 max-[320px]:mt-0 max-[320px]:mb-1">
          <FaBarcode className="text-[#4E82E4] mr-2 max-[320px]:h-full max-[320px]:w-1/6" />
          <input type="text" className="w-full outline-none" placeholder="Enter Barcode" maxLength="13"/>
          <button className="bg-[#4E82E4] hover:bg-[#2968DE] text-white font-semibold py-1 px-10 rounded max-[320px]:px-2">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Selling;
