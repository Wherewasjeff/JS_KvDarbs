import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../../Sidebar';
import '../../App.css';
import axios from 'axios';
import { useAuth } from "../Authentification/AuthContext"; // Import the auth context
import {
  FaInfo,
  FaBoxesStacked,
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
  FaTrashCan, FaUsers
} from 'react-icons/fa6';

const AddStorage = () => {
  const { authToken } = useAuth();
  const { user, setUser } = useAuth();
  const [store, setStore] = useState({});
  const [products, setProducts] = useState([]); // New state for products
  const [showOverlay, setShowOverlay] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isListView, setIsListView] = useState(false); // New state for switching between grid and list view
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [showDeleteOverlay, setShowDeleteOverlay] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(""); // Selected category for filtering
  const [sortOption, setSortOption] = useState(""); // Sorting option
  const [searchQuery, setSearchQuery] = useState("");
    const filteredProducts = selectedCategory
        ? products.filter(product => product.category_id == selectedCategory)
        : products;

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortOption) {
            case "price_asc":
                return a.price - b.price;
            case "price_desc":
                return b.price - a.price;
            case "name_asc":
                return a.product_name.localeCompare(b.product_name);
            case "name_desc":
                return b.product_name.localeCompare(a.product_name);
            default:
                return 0;
        }
    });

    const searchedProducts = sortedProducts.filter(product =>
        product.product_name.toLowerCase().startsWith(searchQuery.toLowerCase())
    );

    const [formData, setFormData] = useState({
    image: '',
    product_name: '',
    barcode: '',
    category_id: '', // category selection
    newCategory: '', // new category input
    price: '',
    shelf_num: '',
    storage_num: '',
    quantity_in_storage: '',
    quantity_in_salesfloor: '',
  });

    const fetchProducts = async () => {
        if (!user.store_id) {
            console.error("Store ID is missing!");
            return;
        }

        try {
            const response = await axios.get("http://my-laravel-app.test/api/storage", {
                params: { store_id: user.store_id },
            });

            if (response.data.success && Array.isArray(response.data.data)) {
                const updatedProducts = response.data.data.map(product => ({
                    ...product,
                    category_name: categories.find(cat => cat.id === product.category_id)?.category || "Uncategorized"
                }));

                setProducts(updatedProducts);
            } else {
                console.warn("Unexpected API response format:", response.data);
                setProducts([]);
            }
        } catch (error) {
            console.error("Error fetching products:", error.response ? error.response.data : error);
        }
    };

    const fetchCategories = async () => {
        if (!authToken || !user.store_id) {
            console.error("Auth token or store ID is missing!");
            return;
        }

        try {
            const response = await axios.get("http://my-laravel-app.test/api/categories", {
                params: { store_id: user.store_id },  // ✅ Add store_id
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Accept': 'application/json'
                }
            });

            if (Array.isArray(response.data)) {
                setCategories(response.data);
            } else {
                console.warn("Unexpected API response format:", response.data);
                setCategories([]);
            }
        } catch (error) {
            console.error("Error fetching categories:", error.response ? error.response.data : error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchCategories(); // Fetch categories first
            await fetchProducts();   // Fetch products AFTER categories are loaded
        };

        fetchData();
    }, [authToken]);  // Depend on authToken to retry when it becomes available

    const addCategory = async () => {
    if (!authToken) {
      console.error("Error: User is not authenticated!");
      return;
    }

    try {
      const response = await axios.post(
          "http://my-laravel-app.test/api/categories",
          { category: formData.newCategory }, // Send only category, store_id is determined in backend
          {
            headers: {
              'Authorization': `Bearer ${authToken}`, // Include authentication token
              'Accept': 'application/json',
            },
          }
      );

      console.log("Category added:", response.data);

      // **Update categories state** after adding a new category
      setCategories(prevCategories => [...prevCategories, response.data.category]);

      // **Reset the new category input field**
      setFormData({ ...formData, newCategory: "" });

    } catch (error) {
      console.error("Error adding category:", error.response ? error.response.data : error);
    }
  };



  // Toggle overlay visibility
  const toggleOverlay = () => {
    setShowOverlay(!showOverlay);
  };

  // Handle view toggle between grid/list view
  const handleViewToggle = () => {
    setIsListView(!isListView);
  };

  // Handle form input change
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: files[0], // Store the file object
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.store_id) {
      console.error("Error: Store ID is missing!");
      return;
    }

    let categoryIdToUse = formData.category_id; // Start with selected category

    // STEP 1: Check if a new category was entered
    if (formData.newCategory.trim() !== "") {
      try {
        // Create new category and get its ID
        const categoryResponse = await axios.post(
            "http://my-laravel-app.test/api/categories",
            { category: formData.newCategory },
            {
              headers: {
                'Authorization': `Bearer ${authToken}`,
                'Accept': 'application/json',
              },
            }
        );

        console.log("Category added:", categoryResponse.data);

        // Use the newly created category's ID
        categoryIdToUse = categoryResponse.data.category.id;

        // Update categories state
        setCategories((prevCategories) => [...prevCategories, categoryResponse.data.category]);

        // Clear the new category input
        setFormData((prev) => ({ ...prev, newCategory: "" }));
      } catch (error) {
        console.error("Error adding new category:", error.response ? error.response.data : error);
        return; // Stop submission if new category creation fails
      }
    }

    // STEP 2: Build FormData for product submission
    const formDataToSend = new FormData();
    formDataToSend.append("store_id", user.store_id);
    formDataToSend.append("product_name", formData.product_name);
    formDataToSend.append("barcode", formData.barcode);
    formDataToSend.append("category_id", categoryIdToUse || ""); // Use either dropdown selection or newly created category
    formDataToSend.append("price", formData.price);
    formDataToSend.append("shelf_num", formData.shelf_num);
    formDataToSend.append("storage_num", formData.storage_num);
    formDataToSend.append("quantity_in_storage", formData.quantity_in_storage);
    formDataToSend.append("quantity_in_salesfloor", formData.quantity_in_salesfloor);

    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      const response = await axios.post(
          "http://my-laravel-app.test/api/storage",
          formDataToSend,
          { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("Product added:", response.data);

      // Update products state
      setProducts((prevItems) => [...prevItems, response.data.storageItem]);

      // Close overlay and reset form fields
      setShowOverlay(false);
      setFormData({
        product_name: "",
        barcode: "",
        category_id: "", // Reset category selection
        newCategory: "", // Reset new category input
        price: "",
        shelf_num: "",
        storage_num: "",
        quantity_in_storage: "",
        quantity_in_salesfloor: "",
        image: null,
      });

      await fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };
  // Get store info for user
  useEffect(() => {
    const getStoreInfo = async () => {
      if (!authToken || !user.store_id) {
        console.error("Store ID is missing or auth token is not available!");
        return;
      }

      try {
        const response = await axios.get(`http://my-laravel-app.test/api/show/${user.store_id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setStore(response.data); // Store the fetched store data here
        console.log("Fetched store data:", response.data);
      } catch (error) {
        console.error("Error fetching store data:", error);
      }
    };
    getStoreInfo();
  }, [authToken, user.store_id]);

  // Animation trigger on component mount
  const [animationTriggered, setAnimationTriggered] = useState(false);
  useEffect(() => {
    setAnimationTriggered(true); // Trigger the animation when the component mounts
  }, []);

  // Handle edit product details
  const handleEdit = (product) => {
    setFormData({
      image: product.image || '',
      product_name: product.product_name,
      barcode: product.barcode,
      category_id: product.category_id || '',
      newCategory: '',
      price: product.price,
      shelf_num: product.shelf_num,
      storage_num: product.storage_num,
      quantity_in_storage: product.quantity_in_storage,
      quantity_in_salesfloor: product.quantity_in_salesfloor,
    });
    setShowOverlay(true);
  };

  // Confirm delete product
  const confirmDelete = (product) => {
    setDeleteProduct(product);
    setShowDeleteOverlay(true);
  };

  // Handle delete product
  const handleDelete = async () => {
    try {
      await axios.delete(`http://my-laravel-app.test/api/storage/${deleteProduct.id}`);
      setShowDeleteOverlay(false);
      window.location.reload(); // Reload the page to see the updated list
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
      <div className="flex min-h-screen">
        <Link to="/users">
        <button
            className="bg-[#4E82E4] py-2 px-9 right-5 top-5 absolute text-white font-semibold rounded-lg hover:bg-[#6a9aec] transition-all hover:scale-110 max-[320px]:hidden">Done/Skip
        </button>
        </Link>
        <Sidebar storeName={store.storename} employeeName={user.name}/>
        <div
            className="ml-[16.67%] w-5/6 bg-[#f8fafe] p-10 -mb-24 h-screen max-[320px]:w-screen flex flex-col justify-start items-center max-[320px]:ml-0 max-[320px]:p-2">
          {/* Progress Bar */}
          <div className="flex justify-center w-1/2 absolute top-[5%] items-center max-[320px]:justify-evenly max-[320px]:w-full">
            <div className="flex w-1/6 h-full flex-col justify-center items-center">
              <div
                  className="flex flex-col items-center z-20 bg-[#4E82E4] h-[50px] w-1/2 max-[320px]:w-full rounded-full p-3">
                <FaInfo className="text-white size-full"/>
              </div>
              <span className="text-lg font-teko text-[#DF9677] max-[320px]:hidden">Store info</span>
            </div>
            <div className="w-[10%] h-[7px] bg-gray-300 mb-6 -mx-12 flex justify-start items-center max-[320px]:mb-0">
              <div className="progress-bar"></div>
            </div>
            <div className="flex w-1/6 h-full flex-col justify-center items-center">
              <div
                  className="flex flex-col items-center z-20 bg-gray-300 h-[50px] w-1/2 max-[320px]:w-full rounded-full p-3 scale-up-animation">
                <FaBoxesStacked className="text-white size-full"/>
              </div>
              <span className="text-lg font-teko text-[#DF9677] max-[320px]:hidden">Add storage</span>
            </div>
            <div className="w-[10%] h-[7px] bg-gray-300 mb-6 -mx-12 flex justify-center items-center max-[320px]:mb-0"></div>
            <div className="flex w-1/6 h-full flex-col justify-center items-center">
              <div className="flex flex-col items-center z-20 bg-gray-300 h-[50px] w-1/2 max-[320px]:w-full rounded-full p-3">
                <FaUsers className="text-white size-full"/>
              </div>
              <span className="text-lg font-teko text-[#DF9677] max-[320px]:hidden">Employees</span>
            </div>
          </div>
          {/* Top Container - Search, Sort, Filter */}
          <div
              className="w-full h-12 flex justify-between items-center mt-24 mb-4 max-[320px]:h-32 max-[320px]:flex-wrap max-[320px]:w-full max-[320px]:mt-24">
              <div
                  className="flex items-center space-x-4 max-[320px]:flex-wrap max-[320px]:justify-center max-[320px]:space-x-0">
                  <div
                      className="flex items-center border border-gray-300 bg-white rounded w-[300px] py-2 px-3 max-[320px]:w-3/4">
                      <FaMagnifyingGlass className="mr-2 text-[#DF9677]"/>
                      <input
                          type="text"
                          className="w-full outline-none"
                          placeholder="Search items"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                      />
                  </div>

                  <select
                      className="border border-gray-300 bg-white rounded py-2 px-3 max-[320px]:w-2/5"
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                  >
                      <option value="">Sort by</option>
                      <option value="price_asc">Price (Low to High)</option>
                      <option value="price_desc">Price (High to Low)</option>
                      <option value="name_asc">Name (A-Z)</option>
                      <option value="name_desc">Name (Z-A)</option>
                  </select>

                  <select
                      className="border border-gray-300 bg-white rounded py-2 px-3 max-[320px]:w-3/5"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                      <option value="">Filter by category</option>
                      {categories.length > 0 ? (
                          categories.map(category => (
                              <option key={category.id} value={category.id}>{category.category}</option>
                          ))
                      ) : (
                          <option disabled>Loading categories...</option>
                      )}
                  </select>

                  {/* Toggle View Buttons */}
                  <FaBars
                      onClick={() => setIsListView(true)}
                      className={`border border-gray-300 p-3 size-max bg-white text-black cursor-pointer hover:bg-gray-200 max-[320px]:hidden ${isListView ? 'hidden' : ''}`}
                  />
                  <FaGrip
                      onClick={() => setIsListView(false)}
                      className={`border border-gray-300 p-3 bg-white size-max text-black cursor-pointer hover:bg-gray-200 max-[320px]:hidden ${!isListView ? 'hidden' : ''}`}
                  />
              </div>
          </div>

            {/* Middle Container - Plates */}
            <div
                className={`w-full max-h-[500px] grid gap-4 ${
                    isListView ? 'grid-cols-1' : 'grid-cols-6'
                } max-[320px]:grid-cols-2 max-[320px]:gap-2 max-[320px]:p-0`}
            >
            {/* Add Item Plate */}
            <div
                className={`border border-gray-300 bg-white shadow-lg rounded-lg p-4 flex items-center justify-center shadow-[#4E82E4] hover:bg-blue-50 cursor-pointer min-h-[425px] max-[320px]:min-h-0`}
                onClick={toggleOverlay}
            >
              <div className="w-full h-full flex flex-col items-center justify-center">
              <h1 className="w-full text-7xl font-light mb-4 rounded-full flex justify-center items-center">+</h1>
              <span className="text-lg font-bold">Add Item</span>
              </div>
            </div>

                {searchedProducts.length > 0 ? (
                    searchedProducts.map(product => (
                        <div key={product.id} className="border border-gray-300 bg-white h-full shadow-md rounded-lg p-3">
                      {/* Product Image */}
                      <div
                          className={`${isListView ? 'w-80 h-80 mr-4' : 'w-full mb-4 max-h-52'}`}>
                        <img
                            src={product.image ? `http://my-laravel-app.test/storage/${product.image}` : 'http://localhost:3000/noimage.png'}
                            alt={product.product_name}
                            className="w-full h-full max-w-full border-[#4E82E4] border-2 object-cover rounded-lg max-h-52"
                        />
                      </div>


                      {/* Product Details */}
                      <div className="flex flex-col w-full">
                        <h3 className="text-lg font-bold mb-1">{product.product_name}</h3>
                        <p className="text-sm text-gray-500 flex items-center">
                          <FaBarcode className="mr-2 text-[#DF9677]"/> {product.barcode || 'N/A'}
                        </p>
                          <p className="text-sm text-gray-500 flex items-center">
                              <FaBoxesStacked
                                  className="mr-2 text-[#4E82E4]"/> {product.category ? product.category.category : 'Uncategorized'}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center">
                              <FaDollarSign className="mr-2 text-green-500"/> ${product.price}
                          </p>
                        <p className="text-sm text-gray-500 flex items-center">
                          <FaBox className="mr-2 text-[#DF9677]"/> Shelf: {product.shelf_num || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center">
                          <FaBoxesPacking className="mr-2 text-[#4E82E4]"/> Storage: {product.storage_num || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center">
                          <FaBoxesStacked className="mr-2 text-green-500"/> Stock: {product.quantity_in_storage} |
                          Salesfloor: {product.quantity_in_salesfloor}
                        </p>
                        {/* Buttons */}
                        <div className="flex justify-between w-full mt-4 h-1/6">
                          <button
                              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
                              onClick={() => handleEdit(product)}
                          >
                            <FaPen className=""/></button>
                          <button
                              className="bg-[#DF9677] text-white px-4 py-2 rounded hover:bg-red-600"
                              onClick={() => confirmDelete(product)}
                          >
                            <FaTrashCan className=""/></button>
                        </div>
                      </div>
                      {showDeleteOverlay && (
                          <div className="fixed inset-0 flex justify-center items-center bg-black z-40 bg-opacity-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                              <h2 className="text-lg font-bold mb-4">Are you sure you want to delete:</h2>
                              <p className="text-red-500 font-semibold">{deleteProduct?.product_name}</p>
                              <div className="flex justify-center gap-4 mt-4">
                                <button
                                    className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                                    onClick={() => setShowDeleteOverlay(false)} // Close overlay if No is clicked
                                >
                                  No
                                </button>
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                    onClick={async () => {
                                      await handleDelete();  // Wait for deletion to complete
                                      setShowDeleteOverlay(false);  // Close overlay
                                    }}
                                >
                                  Yes
                                </button>
                              </div>
                            </div>
                          </div>
                      )}

                    </div>
                ))
            ) : (
                <p className="text-center col-span-4 text-gray-500 hidden">No products available.</p>
            )}
          </div>
        </div>

        {/* Overlay */}
        {showOverlay && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div
                  className="relative bg-white p-4 w-2/3 h-auto rounded-lg shadow-lg space-y-4 max-[320px]:w-full max-[320px]:h-auto max-[320px]:px-2">
                <FaXmark className="w-5 text-[#4E82E4] absolute top-4 right-4 cursor-pointer" onClick={toggleOverlay}/>
                <h2 className="text-xl text-[#4E82E4] font-bold text-center">Add new item</h2>

                {/* Form */}
                <form className="space-y-4" onSubmit={handleSubmit}>
                  {/* Image Upload */}
                  <div className="flex flex-col items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                    <input type="file" name="image" onChange={handleChange}/>
                  </div>

                  {/* Name Input */}
                  <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                    <FaInfo className="text-[#4E82E4] mr-2"/>
                    <input
                        className="w-full"
                        type="text"
                        value={formData.product_name}
                        onChange={(e) => setFormData({...formData, product_name: e.target.value})}
                        placeholder="Enter product name"
                    />
                  </div>

                  {/* Barcode Input */}
                  <div className="flex flex-col">
                    <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                      <FaBarcode className="text-[#4E82E4] mr-2"/>
                      <input
                          className="w-full"
                          type="text"
                          value={formData.barcode}
                          onChange={(e) => setFormData({...formData, barcode: e.target.value})}
                          placeholder="Enter barcode"
                      />
                    </div>
                    <small className="text-gray-400 text-sm mt-1">max. 13 symbols</small>
                  </div>

                  {/* Category Input */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                      <FaPen className="text-[#4E82E4] mr-2"/>
                      <select
                          name="category_id"
                          value={formData.category_id}
                          onChange={handleChange}
                          className="w-full outline-none"
                      >
                        <option value="">Select Category</option>
                        {Array.isArray(categories) && categories.map((category) => (
                            <option key={category.id} value={category.id}>{category.category}</option>
                        ))}
                      </select>

                    </div>

                    {/* OR Divider */}
                    <div className="flex items-center justify-center">
                      <span className="text-[#4E82E4]">OR</span>
                    </div>

                    {/* New Category Input */}
                    <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                      <FaPen className="text-[#4E82E4] mr-2"/>
                      <input
                          type="text"
                          className="w-full outline-none"
                          placeholder="Add New Category"
                          name="newCategory"
                          value={formData.newCategory}
                          onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Price, Shelf Number, and Storage Shelf Number Input Fields */}
                  <div className="flex space-x-4">
                    {/* Price Input */}
                    <div className="flex flex-col w-1/3">
                      <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                        <FaDollarSign className="text-[#4E82E4] mr-2"/>
                        <input
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                            placeholder="Enter price"
                        />
                      </div>
                      <small className="text-gray-400 text-sm mt-1">max. 10 symbols | E.g: 10.00</small>
                    </div>

                    {/* Shelf Number Input */}
                    <div className="flex flex-col w-1/3">
                      <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                        <FaBoxesPacking className="text-[#4E82E4] mr-2"/>
                        <input type="text" className="w-full outline-none" placeholder="Shelf Number" maxLength="3"
                               name="shelf_num" value={formData.shelf_num}
                               onChange={handleChange}/>
                      </div>
                      <small className="text-gray-400 text-sm mt-1">max. 3 symbols</small>
                    </div>

                    {/* Storage Shelf Number Input */}
                    <div className="flex flex-col w-1/3">
                      <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                        <FaBoxesPacking className="text-[#4E82E4] mr-2"/>
                        <input type="text" className="w-full outline-none" placeholder="Storage Shelf Number"
                               maxLength="3" name="storage_num" value={formData.storage_num}
                               onChange={handleChange}/>
                      </div>
                      <small className="text-gray-400 text-sm mt-1">max. 3 symbols</small>
                    </div>
                  </div>

                  {/* Quantity Input */}
                  <div className="flex flex-col">
                    <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                      <FaBoxesStacked className="text-[#4E82E4] mr-2"/>
                      <input type="text" className="w-full outline-none" placeholder="Amount in storage" maxLength="3"
                             name="quantity_in_storage"
                             value={formData.quantity_in_storage} onChange={handleChange}/>
                    </div>
                    <small className="text-gray-400 text-sm mt-1">max. 3 symbols</small>
                  </div>

                  {/* Amount in Sales Floor Input */}
                  <div className="flex flex-col">
                    <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                      <FaStore className="text-[#4E82E4] mr-2"/>
                      <input type="text" className="w-full outline-none" placeholder="Amount on Sales Floor"
                             maxLength="2" name="quantity_in_salesfloor" value={formData.quantity_in_salesfloor}
                             onChange={handleChange}/>
                    </div>
                    <small className="text-gray-400 text-sm mt-1">max. 2 symbols</small>
                  </div>

                  {/* Submit Button */}
                  <button
                      type="submit"
                      disabled={!formData.product_name || !formData.price} // Disable if required fields are empty
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

export default AddStorage;
