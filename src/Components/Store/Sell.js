import React, { useState, useEffect } from 'react';
import Sidebar from '../../Sidebar';
import axios from 'axios';
import '../../App.css';
import {
  FaCalendar,
  FaDollarSign,
  FaPercent,
  FaXmark,
  FaBarcode,
  FaClock,
  FaTrashCan,
  FaPen
} from 'react-icons/fa6';
import { CgSpinnerAlt } from "react-icons/cg";
import { useAuth } from "../Authentification/AuthContext";

const Selling = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [items, setItems] = useState([]); // For storing selected items in the cart
  const { user, setUser, authToken } = useAuth();
  const [store, setStore] = useState({});
  const [loading, setLoading] = useState(false);  // For loading state
  const [showHistory, setShowHistory] = useState(false); // Toggles history overlay
  const [history, setHistory] = useState([]);         // raw sales records
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [products, setProducts] = useState([]);   // For storing fetched products
  const [barcodeInput, setBarcodeInput] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Filter products based on barcode, product name (and SKU)
  const filteredProducts = products.filter(product =>
      product.barcode.toLowerCase().includes(barcodeInput.toLowerCase()) ||
      product.product_name.toLowerCase().includes(barcodeInput.toLowerCase()) ||
      (product.sku && product.sku.toLowerCase().includes(barcodeInput.toLowerCase()))
  );

  // Limit suggestions to top 3 products
  const topProducts = filteredProducts
      .filter(product =>
          product.barcode.toLowerCase().includes(barcodeInput.toLowerCase()) ||
          product.product_name.toLowerCase().includes(barcodeInput.toLowerCase())
      )
      .slice(0, 3);

  const handleBarcodeChange = (e) => {
    setBarcodeInput(e.target.value);
    setSelectedProduct(null); // Reset selected product when typing
  };

  // Update clock every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const formatTime = (time) => (time < 10 ? `0${time}` : time);
  const formatDate = (date) => {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const hours = formatTime(currentTime.getHours());
  const minutes = formatTime(currentTime.getMinutes());
  const seconds = formatTime(currentTime.getSeconds());

  // Calculate total price (with quantity)
  const total = items.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);

  // Remove item from the cart
  const removeItem = (itemId) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  useEffect(() => {
    const getStoreInfo = async () => {
      const store_id = user.store_id;
      if (store_id && authToken) {
        try {
          const response = await axios.get(`https://stocksmart.xyz/api/show/${store_id}`, {
            headers: {
              Authorization: `Bearer ${authToken}`,
              Accept: 'application/json',
            },
          });
          setStore(response.data);  // Should contain 'storename'
        } catch (error) {
          console.error("Error fetching store data:", error);
        }
      }
    };

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const storeId = user.store_id;
        const response = await axios.get(`https://stocksmart.xyz/api/storage?store_id=${storeId}`);
        console.log('Fetched products:', response.data);
        setProducts(response.data.success && Array.isArray(response.data.data)
            ? response.data.data : []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    getStoreInfo();
    fetchProducts();
  }, [user.store_id, authToken]);

  useEffect(() => {
    if (barcodeInput) {
      const filteredNames = filteredProducts.map(product => product.product_name).join(' / ');
      console.log(`Filtered products: ${filteredNames}`);
    }
  }, [barcodeInput, filteredProducts]);

  useEffect(() => {
    const match = products.find(p => p.barcode === barcodeInput);
    if (match) handleAddItem(match);
  }, [barcodeInput, products]);

  useEffect(() => {
    if (showHistory) {
      setLoadingHistory(true);
      axios.get(
          `https://stocksmart.xyz/api/sales?store_id=${user.store_id}`,
          { headers: { Authorization: `Bearer ${authToken}` } }
      )
          .then(res => setHistory(res.data))
          .catch(err => console.error('History load failed:', err))
          .finally(() => setLoadingHistory(false));
    }
  }, [showHistory]);

  const handleAddItem = (productOverride) => {
    // if caller passed a product (from the useEffect), use it;
    // otherwise, use your existing barcode/name logic:
    const toAdd = productOverride ||
        (filteredProducts.length === 1
            ? filteredProducts[0]
            : null);
    if (!toAdd) return;

    setItems(prev => {
      const existing = prev.find(i => i.barcode === toAdd.barcode);
      if (existing) {
        return prev.map(i =>
            i.barcode === toAdd.barcode
                ? {
                  ...i,
                  // clamp at quantity_in_salesfloor
                  quantity: Math.min((i.quantity || 1) + 1, i.quantity_in_salesfloor)
                }
                : i
        );
      }
      return [
        ...prev,
        {
          ...toAdd,
          price: parseFloat(toAdd.price),
          quantity: 1,
          id: toAdd.id,
        }
      ];
    });

    setBarcodeInput('');
  };

  const updateItemQuantity = (itemId, newQuantity) => {
    setItems((prevItems) =>
        prevItems.map((item) =>
            item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
    );
  };

  const handleQuantityChange = (event, productId) => {
    const newQuantity = parseInt(event.target.value, 10);
    updateItemQuantity(productId, newQuantity);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleAddItem();
    }
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      // build payload
      const payload = {
        store_id: user.store_id,
        items: items.map(i => ({
          product_id: i.id,
          sold: i.quantity
        }))
      };

      await axios.post(
          'https://stocksmart.xyz/api/sell',
          payload,
          { headers: { Authorization: `Bearer ${authToken}` } }
      );

      // on success, clear and reload
      setItems([]);
      window.location.reload();
    } catch (error) {
      // log the actual validation errors from Laravel
      console.error('Sale submission failed:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="flex h-screen w-5/6 ml-[16.67%] max-xl:w-full max-xl:ml-0 transition-all duration-300">
        {loading && (
            <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-50">
              <CgSpinnerAlt className="animate-spin text-5xl text-white" />
              <p className="text-white mt-4">Loading...</p>
            </div>
        )}
        {/* Sidebar */}
        <Sidebar storeName={store.storename} employeeName={user.name} />
        {/* History Overlay */}
        {showHistory && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
              <div className="relative bg-white p-4 w-3/4 h-3/4 rounded-lg shadow-lg overflow-y-scroll overflow-x-hidden">
                <FaXmark
                    className="absolute top-4 right-4 text-gray-700 cursor-pointer"
                    onClick={() => setShowHistory(false)}
                />
                {loadingHistory ? (
                    <div className="flex-1 flex items-center justify-center">
                      <CgSpinnerAlt className="animate-spin text-3xl text-gray-500" />
                    </div>
                ) : (
                    history.length === 0 ? (
                        <div className="text-center text-gray-500 mt-8">No sales to show</div>
                    ) : (
                        // group by date
                        Object.entries(
                            history.reduce((acc, sale) => {
                              (acc[sale.date] ||= []).push(sale);
                              return acc;
                            }, {})
                        ).map(([date, salesOnDate]) => (
                            <div key={date} className="mb-6">
                              <div className="w-full h-8 border-b-2 mb-6 font-semibold text-gray-600">
                                {new Date(date).toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' })}
                              </div>
                              {salesOnDate.map(sale => (
                                  <div key={sale.id} className="flex justify-between p-3 shadow-md shadow-gray-400 rounded-lg my-2">
                                    <div>
                                      <span className="font-semibold">{sale.seller_name}</span>:&nbsp;
                                      <span>{sale.product_name}</span> ${sale.price.toFixed(2)} × {sale.sold}
                                    </div>
                                    <div>
                                      <span className="font-semibold">${(sale.price * sale.sold).toFixed(2)}</span>
                                      <span className="ml-4 text-sm text-gray-500">{sale.time}</span>
                                    </div>
                                  </div>
                              ))}
                              <div className="flex justify-end font-bold mt-2">
                                Total: ${salesOnDate.reduce((sum, s) => sum + s.price * s.sold, 0).toFixed(2)}
                              </div>
                            </div>
                        ))
                    )
                )}
              </div>
            </div>
        )}
        {/* Main Content container: full width inside outer container */}
        <div className="w-full bg-[#f8fafe] p-5 h-screen flex flex-col max-xl:p-2 transition-all duration-300">
          <div
              className="xl:hidden flex transition-all duration-300 mt-2 justify-evenly max-sm:justify-end max-sm:space-x-1">
          <div className="flex justify-center items-center max-md:w-1/2 w-2/5 p-2 bg-white shadow-lg rounded-lg transition-all duration-300">
              <FaCalendar className="text-[#4E82E4] mr-2 transition-all duration-300" />
              <span className="text-xl font-semibold max-sm:text-sm transition-all duration-300">
              {formatDate(currentTime)}
            </span>
            </div>
            <div className="flex justify-center items-center max-md:w-1/4 max-sm:w-1/3 w-2/5 p-2 bg-white shadow-lg rounded-lg transition-all duration-300">
              <FaClock className="text-[#4E82E4] mr-2 transition-all duration-300" />
              <span className="text-xl font-semibold max-sm:text-sm transition-all duration-300">
              {hours}:{minutes}:{seconds}
            </span>
            </div>
          </div>

          {/* Items & Sidebar Buttons Wrapper */}
          <div className="flex h-screen max-xl:flex-wrap max-xl:flex-col max-xl:mt-2 transition-all duration-300">

            {/* Items Container */}
            <div className="w-3/4 bg-white shadow-lg rounded-lg p-4 max-sm:px-1 space-y-4 flex flex-col max-xl:w-full max-xl:flex-grow transition-all duration-300">
              <h2 className="text-lg font-bold text-[#4E82E4] transition-all duration-300">Items List</h2>
              {/* Scrollable Items List */}
              <div className="flex-grow border border-gray-300 p-4 rounded-lg overflow-y-scroll space-y-4 transition-all duration-300 max-xl:p-1">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className={`relative flex justify-between items-center bg-gray-50 rounded-lg shadow-md transition-all duration-300 ${
                            item.quantity_in_salesfloor === 0 ? 'opacity-50' : ''
                        }`}
                    >
                      {item.quantity_in_salesfloor === 0 && (
                          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg pointer-events-none">
                            <span className="text-red-500 font-semibold">Insufficient quantity</span>
                          </div>
                      )}
                      {/* Item Image */}
                      <div className="w-14 h-14 max-sm:w-10 max-sm:h-10 max-sm:mr-1 flex justify-center items-center rounded max-xl:max-w-1/2 object-cover max-xl:max-h-full transition-all duration-300">
                        {item.image ? (
                            <img
                                src={item.image ? `https://stocksmart.xyz/backend/public/${item.image}` : '/noimage.png'}
                                alt={item.product_name}
                                className="w-12 h-12 object-cover rounded transition-all duration-300"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-300 m-2 flex items-center justify-center text-white transition-all duration-300">
                              Loading...
                            </div>
                        )}
                      </div>
                      {/* Item Name and Barcode */}
                      <div className="flex flex-col transition-all duration-300">
                        <p className="font-semibold max-sm:text-xs">{item.product_name}</p>
                        <p className="text-sm text-gray-500 max-sm:text-xs">Barcode: {item.barcode}</p>
                      </div>
                      {/* Quantity, Price, Edit, and Delete */}
                      <div className="flex items-center space-x-4 max-xl:space-x-2 max-xl:justify-between transition-all duration-300">
                        <div className="flex justify-center items-center space-x-2 max-md:flex-col max-md:space-x-0">
                          <p className={`${item.quantity >= item.quantity_in_salesfloor ? 'text-red-500' : 'text-[#4E82E4]'} responsive-text`}>QTY:</p>
                          <input
                              type="number"
                              min="1"
                              max={item.quantity_in_salesfloor}
                              value={item.quantity}
                              onChange={e => handleQuantityChange(e, item.id)}
                              className="bg-white border rounded px-2 py-1 w-12 text-center"
                              disabled={item.quantity_in_salesfloor === 0}
                          />
                          <span className="font-semibold max-sm:w-16 text-[#4E82E4] flex justify-center max-xl:ml-3 transition-all duration-300 responsive-text truncate">
          $ {parseFloat(item.price).toFixed(2)}
        </span>
                        </div>
                        <div className="flex h-14">
                          <FaPen
                              className="peer p-3 h-14 text-gray-500 flex justify-center items-center w-10 border-l border-gray-200 cursor-pointer hover:border-[#4E82E4] hover:bg-blue-200 hover:text-[#4E82E4] transition-all duration-300"
                              disabled={item.quantity_in_salesfloor === 0}
                          />
                          <FaTrashCan
                              className="p-3 h-14 text-gray-500 flex justify-center items-center w-10 rounded-r border-l border-gray-200 cursor-pointer peer-hover:border-[#4E82E4] hover:border-red-600 hover:bg-red-200 hover:text-red-600 transition-all duration-300 z-10"
                              onClick={() => removeItem(item.id)}
                          />
                        </div>
                      </div>
                    </div>
                ))}
              </div>
              {/* Total Row */}
              <div className="flex justify-between items-center border-t border-gray-300 pt-2 my-2 transition-all duration-300 max-xl:mt-0 max-xl:pt-0">
                <span className="font-bold text-2xl">Total:</span>
                <span className="font-bold text-2xl">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Right Sidebar with Buttons and Clock/Calendar for xl and above */}
            <div className="hidden xl:flex flex-col w-1/4 ml-4 transition-all duration-300
                          max-xl:w-full max-xl:ml-0 max-xl:h-1/6 max-xl:grid max-xl:grid-cols-2 max-xl:my-2 max-xl:gap-4">
              {/* Clock and Calendar (only visible on xl and above) */}
              <div className="flex flex-col space-y-4 mb-4 transition-all duration-300 max-xl:hidden">
                <div
                    className="flex justify-center items-center p-4 bg-white shadow-lg rounded-lg transition-all duration-300">
                  <FaCalendar className="text-[#4E82E4] mr-2 transition-all duration-300"/>
                  <span className="text-xl font-semibold transition-all duration-300">
                  {formatDate(currentTime)}
                </span>
                </div>
                <div
                    className="flex justify-center items-center p-4 bg-white shadow-lg rounded-lg transition-all duration-300">
                  <FaClock className="text-[#4E82E4] mr-2 transition-all duration-300"/>
                  <span className="text-xl font-semibold transition-all duration-300">
                  {hours}:{minutes}:{seconds}
                </span>
                </div>
              </div>
              {/* Buttons */}
              <button
                  className={`bg-[#4E82E4] hover:bg-[#2968DE] text-white font-semibold mb-4 py-2 px-4 rounded ${
                      (items.length === 0 || items.some(item => item.quantity_in_salesfloor === 0))
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                  }`}
                  onClick={handleCheckout}
                  disabled={items.length === 0 || items.some(item => item.quantity_in_salesfloor === 0)}
              >
                Checkout
              </button>
              <button
                  className={`bg-[#4E82E4] hover:bg-[#2968DE] text-white font-semibold py-2 px-4 mb-4 rounded transition-all duration-300 max-xl:m-0 ${
                      items.length === 0 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={items.length === 0}
              >
                Discounts
              </button>
              <button
                  className="bg-[#4E82E4] hover:bg-[#2968DE] text-white font-semibold py-2 px-4 mb-4 rounded transition-all duration-300 max-xl:m-0"
                  onClick={() => setShowHistory(true)}
              >
                History
              </button>
              <button
                  className="bg-[#DF9677] hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Product Suggestions (if barcode input exists) */}
          {barcodeInput && (
              <div
                  className="absolute bottom-[70px] left-86 w-1/6 min-w-[200px] border border-gray-200 bg-white shadow-sm rounded z-10 flex flex-col transition-all duration-300 overflow-y-scroll"
                  style={{ maxHeight: '300px' }}
              >
                <div className="flex flex-col w-full transition-all duration-300 max-h-48">
                  {filteredProducts
                      .filter((product) =>
                          product.barcode.toLowerCase().includes(barcodeInput.toLowerCase()) ||
                          product.product_name.toLowerCase().includes(barcodeInput.toLowerCase())
                      )
                      .map((product, index) => (
                          <div
                              key={index}
                              className="flex items-center p-2 border-b last:border-0 border-gray-100 hover:bg-gray-100 transition-all duration-300 cursor-pointer"
                              onClick={() => {
                                setSelectedProduct(product);
                                setBarcodeInput(product.product_name);
                                handleAddItem();
                              }}
                          >
                            <img
                                src={product.image ? `https://stocksmart.xyz/backend/public/${product.image}` : '/noimage.png'}
                                alt={product.product_name}
                                className="h-12 w-12 rounded-md object-cover shadow-sm transition-all duration-300"
                            />
                            <div className="flex flex-col ml-3 transition-all duration-300">
                              <p className="text-sm font-semibold">{product.product_name}</p>
                              <p className="text-xs text-gray-500 flex items-center">
                                <FaBarcode className="mr-1 text-[#4E82E4] transition-all duration-300" />
                                {product.barcode}
                              </p>
                            </div>
                          </div>
                      ))}
                </div>
              </div>
          )}

          {/* Barcode Input Field with Submit Button */}
          <div className="mt-4 flex items-center border border-gray-300 bg-white rounded w-full py-2 px-2 z-10 space-x-4 transition-all duration-300 max-xl:mt-0 max-xl:mb-1">
            <FaBarcode className="text-[#4E82E4] mr-2 max-xl:h-8 w-12 transition-all duration-300" />
            <input
                type="text"
                className="w-full outline-none transition-all duration-300"
                placeholder="Enter Barcode or name"
                maxLength="13"
                value={barcodeInput}
                onChange={handleBarcodeChange}
                onKeyDown={handleKeyDown}
            />
            <button
                className="bg-[#4E82E4] hover:bg-[#2968DE] text-white font-semibold py-1 px-4 rounded max-xl:px-3 max-xl:w-2/5 max-xl:h-full max-xl:m-0 transition-all duration-300"
                onClick={handleAddItem}
            >
              Add
            </button>
          </div>
        </div>
      </div>
  );
};

export default Selling;