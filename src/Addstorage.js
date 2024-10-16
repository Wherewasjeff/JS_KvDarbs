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
    FaBox,
    FaTrashCan
} from 'react-icons/fa6';

const AddStorage = () => {
  const [showOverlay, setShowOverlay] = useState(false);

  const toggleOverlay = () => {
    setShowOverlay(!showOverlay);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />
      {/* Main Content */}
      <div className="w-5/6 bg-[#f8fafe] p-10 -mb-24 h-screen max-[320px]:w-screen">
        <button className="bg-[#4E82E4] py-2 px-9 right-5 top-5 absolute text-white font-semibold rounded-lg mr-2 hover:bg-[#6a9aec] transition-all hover:px-12 max-[320px]:hidden">Next Step
        </button>
        <div className="flex justify-center mb-8 max-[320px]:hidden">
          <div className="flex flex-col items-center w-auto h-24">
            <div className="flex w-[150%] h-1/2 justify-between">
              <div className="flex flex-col items-center z-20 bg-[#4E82E4] h-full rounded-full p-3 max-[320px]:hidden">
                <FaInfo className="text-white size-12" />
              </div>
              <div className="top-[7%] left-[51%] z-10 absolute flex-grow bg-[#4E82E4] w-[150px] h-[5px] max-[320px]:hidden"></div>
              <div className="flex flex-col items-center z-20 h-full bg-[#4E82E4] rounded-full p-3 max-[320px]:hidden">
                <FaBoxesStacked className="text-white size-12" />
              </div>
              <div className="top-[7%] left-[59.5%] z-10 absolute flex-grow bg-gray-300 w-[150px] h-[5px] max-[320px]:hidden"></div>
              <div className="flex flex-col items-center h-full z-20 bg-gray-300 rounded-full p-3 max-[320px]:hidden">
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
        <div className="w-full h-12 flex justify-between items-center mb-4 max-[320px]:h-32 max-[320px]:flex-wrap max-[320px]:w-full">
          <div className="flex items-center space-x-4 max-[320px]:flex-wrap max-[320px]:justify-center max-[320px]:space-x-0">
            <div className="flex items-center border border-gray-300 bg-white rounded w-[300px] py-2 px-3 max-[320px]:w-3/4">
              <FaMagnifyingGlass className="mr-2 text-[#DF9677]" />
              <input type="text" className="w-full outline-none" placeholder="Search items" />
            </div>

            <select className="border border-gray-300 bg-white rounded py-2 px-3 max-[320px]:w-2/5">
              <option value="">Sort by</option>
              <option value="quantity-asc">Quantity Ascending</option>
              <option value="quantity-desc">Quantity Descending</option>
              <option value="price-asc">Price Ascending</option>
              <option value="price-desc">Price Descending</option>
              <option value="alphabetical">Alphabetically</option>
            </select>

            <select className="border border-gray-300 bg-white rounded py-2 px-3 max-[320px]:w-3/5">
              <option value="">Filter by category</option>
              <option value="electronics">Electronics</option>
              <option value="groceries">Groceries</option>
              <option value="clothing">Clothing</option>
            </select>
            <FaBars className="border border-gray-300 p-3 size-max bg-white text-black max-[320px]:hidden" />
            <FaGrip className="border border-gray-300 p-3 bg-white size-max text-black max-[320px]:hidden" />
          </div>
          <button className="bg-[#DF9677] py-2 px-9 text-white font-semibold rounded-lg mr-2 hover:bg-[#DA8460] max-[320px]:w-full">Apply
          </button>
        </div>
        {/* Middle Container - Plates */}
        <div className="w-full min-h-[600px] grid grid-cols-4 gap-4 p-5 max-[320px]:grid-cols-2 max-[320px]:gap-2 max-[320px]:p-0">
          {/* Add Item Plate */}
          <div
            className="border border-gray-300 bg-white shadow-lg rounded-lg p-4 flex flex-col items-center justify-center shadow-[#4E82E4] hover:bg-blue-50 cursor-pointer"
            onClick={toggleOverlay}
          >
            <h1 className="w-20 h-20 text-7xl font-light mb-4 rounded-full flex justify-center items-center">+</h1>
            <span className="text-lg font-bold">Add Item</span>
          </div>

          {/* CD Plates */}
          {[...Array(7)].map((_, index) => (
            <div key={index} className="border border-gray-300 bg-white shadow-lg rounded-lg p-4">
              <img src="/img.png" alt="Item" className="w-24 h-24 mx-auto mb-4 max-[320px]:w-12 max-[320px]:h-12" />
              <p className="text-center text-lg font-bold">Product</p>
              <p className="text-center text-sm">Barcode: 19385750928</p>
              <p className="text-center text-sm">Quantity: 6</p>
              <div className="flex justify-evenly text-xl mt-4 max-[320px]:w-full max-[320px]:justify-evenly">
                <button className="bg-[#4E82E4] text-white py-3 px-3 rounded-lg hover:bg-[#6a9aec] max-[320px]:p-2 max-[320px]:text-md"><FaBox /></button>
                <button className="bg-[#DF9677] text-white py-3 px-3 rounded-lg hover:bg-red-600 max-[320px]:p-2 max-[320px]:text-md"><FaTrashCan /></button>
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
        <div className="relative bg-white p-8 w-2/3 h-3/4 rounded-lg shadow-lg space-y-4 max-[320px]:w-full max-[320px]:h-5/6">
            <FaXmark className="w-5 text-[#4E82E4] absolute top-4 right-4 cursor-pointer" onClick={toggleOverlay}/>
            <h2 className="text-xl text-[#4E82E4] font-bold text-center">Add new item</h2>

            {/* Form */}
            <form className="space-y-4">
              {/* Image Upload */}
              <div className="flex flex-col items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                <input type="file" className="w-full outline-none" accept="image/*" />
              </div>

              {/* Name Input */}
              <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                <FaInfo className="text-[#4E82E4] mr-2"/>
                <input type="text" className="w-full outline-none" placeholder="Product Name" />
              </div>

              {/* Barcode Input */}
              <div className="flex flex-col">
                <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                  <FaBarcode className="text-[#4E82E4] mr-2"/>
                  <input type="text" className="w-full outline-none" placeholder="Barcode" maxLength="13" />
                </div>
                <small className="text-gray-400 text-sm mt-1">max. 13 symbols</small>
              </div>

              {/* Category Input */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                  <FaPen className="text-[#4E82E4] mr-2"/>
                  <select className="w-full outline-none">
                    <option value="">Select Category</option>
                    <option value="electronics">Electronics</option>
                    <option value="groceries">Groceries</option>
                  </select>
                </div>

                {/* OR Divider */}
                <div className="flex items-center justify-center">
                  <span className="text-[#4E82E4]">OR</span>
                </div>

                {/* New Category Input */}
                <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                  <FaPen className="text-[#4E82E4] mr-2"/>
                  <input type="text" className="w-full outline-none" placeholder="Add New Category" />
                </div>
              </div>

              {/* Price, Shelf Number, and Storage Shelf Number Input Fields */}
              <div className="flex space-x-4">
                {/* Price Input */}
                <div className="flex flex-col w-1/3">
                  <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                    <FaDollarSign className="text-[#4E82E4] mr-2"/>
                    <input type="text" className="w-full outline-none" placeholder="Price" maxLength="10" />
                  </div>
                  <small className="text-gray-400 text-sm mt-1">max. 10 symbols | E.g: 10.00</small>
                </div>

                {/* Shelf Number Input */}
                <div className="flex flex-col w-1/3">
                  <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                    <FaBoxesPacking className="text-[#4E82E4] mr-2"/>
                    <input type="text" className="w-full outline-none" placeholder="Shelf Number" maxLength="3" />
                  </div>
                  <small className="text-gray-400 text-sm mt-1">max. 3 symbols</small>
                </div>

                {/* Storage Shelf Number Input */}
                <div className="flex flex-col w-1/3">
                  <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                    <FaBoxesPacking className="text-[#4E82E4] mr-2"/>
                    <input type="text" className="w-full outline-none" placeholder="Storage Shelf Number" maxLength="3" />
                  </div>
                  <small className="text-gray-400 text-sm mt-1">max. 3 symbols</small>
                </div>
              </div>

              {/* Quantity Input */}
              <div className="flex flex-col">
                <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                  <FaBoxesStacked className="text-[#4E82E4] mr-2"/>
                  <input type="text" className="w-full outline-none" placeholder="Amount in storage" maxLength="3"/>
                </div>
                <small className="text-gray-400 text-sm mt-1">max. 3 symbols</small>
              </div>

              {/* Amount in Sales Floor Input */}
              <div className="flex flex-col">
                <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                  <FaStore className="text-[#4E82E4] mr-2"/>
                  <input type="text" className="w-full outline-none" placeholder="Amount on Sales Floor" maxLength="2"/>
                </div>
                <small className="text-gray-400 text-sm mt-1">max. 2 symbols</small>
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

export default AddStorage;
