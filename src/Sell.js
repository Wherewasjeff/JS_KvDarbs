import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import {
  FaDollarSign,
  FaPercent,
  FaXmark,
  FaBarcode,
  FaClock,
  FaTrashCan
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
      id: 1,
      name: 'CD',
      barcode: '1234567890123',
      price: 10.00,
      imgSrc: '/img.png', // Placeholder image
    },
    {
      id: 1,
      name: 'CD',
      barcode: '1234567890123',
      price: 10.00,
      imgSrc: '/img.png', // Placeholder image
    },
    {
      id: 1,
      name: 'CD',
      barcode: '1234567890123',
      price: 10.00,
      imgSrc: '/img.png', // Placeholder image
    },
    {
      id: 1,
      name: 'CD',
      barcode: '1234567890123',
      price: 10.00,
      imgSrc: '/img.png', // Placeholder image
    },
    {
      id: 1,
      name: 'CD',
      barcode: '1234567890123',
      price: 10.00,
      imgSrc: '/img.png', // Placeholder image
    },
    {
      id: 1,
      name: 'CD',
      barcode: '1234567890123',
      price: 10.00,
      imgSrc: '/img.png', // Placeholder image
    },
    {
      id: 1,
      name: 'CD',
      barcode: '1234567890123',
      price: 10.00,
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
      <div className="w-5/6 bg-[#f8fafe] p-10 h-screen flex flex-col">
        {/* Items Container */}
        <div className="flex flex-grow">
          <div className="w-3/4 h-[800px] bg-white overflow-y-scroll shadow-lg rounded-lg p-4 space-y-4">
            <h2 className="text-lg font-bold text-[#4E82E4]">Items List</h2>

            {/* Items List */}
            <div className="border border-gray-300 p-4 rounded-lg space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg shadow-md">
                  {/* Item Image */}
                  <img src={item.imgSrc} alt={item.name} className="w-14 h-14 rounded mr-4" />
                  {/* Item Name and Barcode */}
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-500">Barcode: {item.barcode}</p>
                  </div>
                  {/* Item Price and Trash Icon */}
                  <div className="flex items-center space-x-4">
                    <span className="font-semibold text-[#4E82E4]">${item.price.toFixed(2)}</span>
                    <FaTrashCan
                      className="text-gray-500 cursor-pointer hover:text-red-600 transition-colors"
                      onClick={() => removeItem(item.id)}
                    />
                  </div>
                </div>
              ))}

              {/* Total Row */}
              <div className="flex justify-between border-t border-gray-300 pt-2">
                <span className="font-bold text-lg">Total:</span>
                <span className="font-bold text-lg">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Sidebar with Buttons and Clock */}
          <div className="flex flex-col w-1/4 ml-4">
            {/* Clock */}
            <div className="flex justify-center items-center p-4 bg-white shadow-lg rounded-lg mb-4">
              <FaClock className="text-[#4E82E4] mr-2" />
              <span className="text-xl font-semibold">{hours}:{minutes}:{seconds}</span>
            </div>

            {/* Buttons */}
            <button className="bg-[#4E82E4] hover:bg-[#2968DE] text-white font-semibold py-2 px-4 rounded mb-4">
              Checkout
            </button>
            <button className="bg-[#4E82E4] hover:bg-[#2968DE] text-white font-semibold py-2 px-4 rounded mb-4">
              Discounts
            </button>
            <button className="bg-[#DF9677] hover:bg-red-600 text-white font-semibold py-2 px-4 rounded">
              Cancel
            </button>
          </div>
        </div>

        {/* Barcode Input Field */}
        <div className="mt-4 flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
          <FaBarcode className="text-[#4E82E4] mr-2" />
          <input type="text" className="w-full outline-none" placeholder="Enter Barcode" />
        </div>
      </div>
    </div>
  );
};

export default Selling;
