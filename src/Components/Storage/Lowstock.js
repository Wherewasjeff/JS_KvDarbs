import React, { useState } from 'react';
import Sidebar from '../../Sidebar';
import {
  FaCalendar,
  FaClock,
  FaMagnifyingGlass,
  FaXmark,
  FaAngleLeft,
  FaAngleRight,
  FaBars,
  FaGrip,
  FaBarcode,
  FaBoxesStacked,
} from 'react-icons/fa6';

const Lowstock = () => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [showItemOverlay, setShowItemOverlay] = useState(false);

  const toggleOverlay = () => {
    setShowOverlay(!showOverlay);
  };

  const toggleItemOverlay = () => {
    setShowItemOverlay(!showItemOverlay);
  };

  const items = [
    { name: 'Item 1', barcode: '1234567890123', quantity: 10 },
    { name: 'Item 2', barcode: '2345678901234', quantity: 25 },
    { name: 'Item 3', barcode: '3456789012345', quantity: 5 },
    { name: 'Item 4', barcode: '4567890123456', quantity: 8 },
    { name: 'Item 5', barcode: '5678901234567', quantity: 12 },
    { name: 'Item 6', barcode: '6789012345678', quantity: 7 },
    { name: 'Item 1', barcode: '1234567890123', quantity: 10 },
    { name: 'Item 2', barcode: '2345678901234', quantity: 25 },
    { name: 'Item 3', barcode: '3456789012345', quantity: 5 },
    { name: 'Item 4', barcode: '4567890123456', quantity: 8 },
    { name: 'Item 5', barcode: '5678901234567', quantity: 12 },
    { name: 'Item 6', barcode: '6789012345678', quantity: 7 },
    { name: 'Item 1', barcode: '1234567890123', quantity: 10 },
    { name: 'Item 2', barcode: '2345678901234', quantity: 25 },
    { name: 'Item 3', barcode: '3456789012345', quantity: 5 },
    { name: 'Item 4', barcode: '4567890123456', quantity: 8 },
    { name: 'Item 5', barcode: '5678901234567', quantity: 12 },
    { name: 'Item 6', barcode: '6789012345678', quantity: 7 },
  ];

  return (
    <div className="ml-[16.67%] max-sm:ml-0 flex h-screen">
      <Sidebar />
      <div className=" w-full bg-[#f8fafe] p-10 -mb-24 h-screen max-sm:w-full max-sm:ml-0">
        {/* Top Container */}
        <div className="w-full h-auto flex justify-between items-center mb-4 max-sm:flex-wrap max-sm:justify-center">
          <div className="flex items-center space-x-4 max-sm:flex-wrap max-sm:justify-center max-sm:sppace-x-0">
            <div className="flex items-center border border-gray-300 bg-white rounded w-[300px] py-2 px-3 max-sm:w-3/4">
              <FaMagnifyingGlass className="mr-2 text-[#DF9677]" />
              <input type="text" className="w-full outline-none" placeholder="Search items" />
            </div>
            {/* Sort/Filter Options */}
            <select className="border border-gray-300 bg-white rounded py-2 px-3 max-sm:w-1/3 max-sm:px-0">
              <option value="">Sort by</option>
            </select>
            <select className="border border-gray-300 bg-white rounded py-2 px-3 w-1/3 max-sm:px-0">
              <option value="">Filter</option>
            </select>
            <FaBars className="border border-gray-300 p-3 size-max bg-white text-black max-sm:hidden" />
            <FaGrip className="border border-gray-300 p-3 bg-white size-max text-black max-sm:hidden" />
          </div>
          <button className="bg-[#DF9677] py-2 px-9 text-white font-semibold rounded-lg mr-2 hover:bg-[#DA8460]">
            Apply
          </button>
        </div>

        {/* Middle Container */}
        <div className="grid grid-cols-4 gap-4 justify-items-center max-sm:grid-cols-2">
          {/* Add Supplyment Button */}
          <div
            className="border border-gray-300 bg-white shadow-lg rounded-lg p-4 w-full flex flex-col items-center justify-center shadow-[#4E82E4] hover:bg-blue-50 cursor-pointer"
            onClick={toggleOverlay}
          >
            <h1 className="w-20 h-20 text-7xl font-light mb-4 rounded-full flex justify-center items-center">+</h1>
            <span className="text-lg font-bold">Add Supplyment</span>
          </div>

          {/* Item Boxes */}
          {items.map((item, index) => (
            <div
              key={index}
              className="border border-gray-300 bg-white shadow-md rounded-lg p-4 w-full flex flex-col items-center justify-center shadow-gray-300 hover:bg-blue-50 cursor-pointer"
            >
              <img src="img.png" alt={item.name} className="w-20 h-20 mb-4" />
              <h2 className="text-lg font-bold mb-2">{item.name}</h2>
              <p className="text-sm">Quantity: {item.quantity}</p>
              <p className="text-sm">Barcode: {item.barcode}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Supplyment Overlay */}
      {showOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white p-8 w-2/4 h-1/3 flex flex-col justify-center rounded-lg shadow-lg space-y-4 max-sm:w-full">
            <FaXmark className="w-5 text-[#4E82E4] absolute top-4 right-4 cursor-pointer" onClick={toggleOverlay} />
            <h2 className="text-xl text-[#4E82E4] font-bold text-center">Add Supplyment</h2>

            <form className="space-y-4">
              {/* Supplyment Date Input */}
              <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                <FaCalendar className="text-[#4E82E4] mr-2" />
                <input type="date" className="w-full outline-none" />
              </div>

              {/* Time of Delivery Input */}
              <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                <FaClock className="text-[#4E82E4] mr-2" />
                <input type="time" className="w-full outline-none" />
              </div>

              {/* Add Items Button */}
              <button
                type="button"
                className="bg-[#4E82E4] hover:bg-[#2968DE] text-white font-semibold py-2 px-4 rounded w-full"
                onClick={toggleItemOverlay}
              >
                Add Items
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Item Entry Overlay */}
      {showItemOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white p-8 w-1/3 h-1/3 rounded-lg shadow-lg space-y-4">
            <FaXmark className="w-5 text-[#4E82E4] absolute top-4 right-4 cursor-pointer" onClick={toggleItemOverlay} />
            <h2 className="text-xl text-[#4E82E4] font-bold text-center">Add Item</h2>

            <form className="space-y-4">
              {/* Barcode Input */}
              <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                <FaBarcode className="text-[#4E82E4] mr-2" />
                <input type="text" className="w-full outline-none" placeholder="Barcode" maxLength="13" />
              </div>

              {/* Quantity Input */}
              <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                <FaBoxesStacked className="text-[#4E82E4] mr-2" />
                <input type="text" className="w-full outline-none" placeholder="Quantity" />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-[#4E82E4] hover:bg-[#2968DE] text-white font-semibold py-2 px-4 rounded w-full"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Lowstock;
