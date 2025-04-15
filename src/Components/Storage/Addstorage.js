import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../../Sidebar';
import { addStorageTranslations } from '../TranslationContext';
import '../../App.css';
import axios from 'axios';
import { useAuth } from "../Authentification/AuthContext";
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
    FaGrip,
    FaBars,
    FaBox,
    FaTrashCan,
    FaUsers,
    FaCheck
} from 'react-icons/fa6';
import { CgSpinnerAlt } from "react-icons/cg";

// Overlay for JSON file upload
const JsonUploadOverlay = ({ onNext, onClose }) => {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === "application/json") {
            setFile(selectedFile);
        } else {
            alert("Please select a valid JSON file.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="relative bg-white p-6 w-80 rounded-lg shadow-lg">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                    X
                </button>
                <h2 className="text-xl font-bold mb-4 text-center">Upload JSON</h2>
                <div className="flex flex-col items-center">
                    <input
                        type="file"
                        accept="application/json"
                        onChange={handleFileChange}
                        className="border border-gray-300 p-2 w-full rounded mb-2"
                    />
                    <small className="text-gray-400 mb-4">Only JSON files supported</small>
                    {file && (
                        <button
                            onClick={() => onNext(file)}
                            className="bg-[#4E82E4] text-white py-2 px-4 rounded hover:bg-[#2968DE] transition-all"
                        >
                            Next
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// Overlay for JSON calibration and key mapping
const JsonCalibrationOverlay = ({ jsonFile, onMappingComplete, onClose }) => {
    const [jsonKeys, setJsonKeys] = useState([]);
    const [mapping, setMapping] = useState({
        product_name: "",
        sku: "",
        barcode: "",
        category_id: "",
        price: "",
        shelf_num: "",
        storage_num: "",
        quantity_in_storage: "",
        quantity_in_salesfloor: "",
        image: "",
    });

    useEffect(() => {
        if (jsonFile) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const jsonData = JSON.parse(event.target.result);
                    const keys = Array.isArray(jsonData) && jsonData.length > 0
                        ? Object.keys(jsonData[0])
                        : Object.keys(jsonData);
                    setJsonKeys(keys);
                } catch (err) {
                    console.error("Error parsing JSON", err);
                }
            };
            reader.readAsText(jsonFile);
        }
    }, [jsonFile]);

    const handleMappingChange = (field, value) => {
        setMapping({ ...mapping, [field]: value });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-500">
            <div className="relative bg-white p-6 w-96 rounded-lg shadow-lg">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                    X
                </button>
                <h2 className="text-xl font-bold mb-4 text-center">Calibrate Fields</h2>
                <div className="max-h-[70vh] overflow-y-auto">
                    {Object.keys(mapping).map((dbField) => (
                        <div key={dbField} className="mb-4">
                            <label className="block text-sm font-medium mb-1 capitalize">
                                {dbField}
                            </label>
                            <select
                                value={mapping[dbField]}
                                onChange={(e) => handleMappingChange(dbField, e.target.value)}
                                className="w-full border border-gray-300 p-2 rounded"
                            >
                                <option value="">-- Select JSON key --</option>
                                <option value="none">None</option>
                                {jsonKeys.map((key) => (
                                    <option key={key} value={key}>{key}</option>
                                ))}
                            </select>
                        </div>
                    ))}
                    <button
                        onClick={() => onMappingComplete(mapping)}
                        className="w-full bg-[#4E82E4] text-white py-2 px-4 rounded hover:bg-[#2968DE] transition-all"
                    >
                        Save Mapping
                    </button>
                </div>
            </div>
        </div>
    );
};

const AddStorage = () => {
    const { authToken } = useAuth();
    const { user, setUser } = useAuth();
    const [store, setStore] = useState({});
    const [language, setLanguage] = useState(localStorage.getItem("language") || "en");
    const [products, setProducts] = useState([]);
    const [showOverlay, setShowOverlay] = useState(false);
    const [categories, setCategories] = useState([]);
    const [isListView, setIsListView] = useState(false);
    const [deleteProduct, setDeleteProduct] = useState(null);
    const [showDeleteOverlay, setShowDeleteOverlay] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [sortOption, setSortOption] = useState("");
    const [editingProductId, setEditingProductId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [isDone, setIsDone] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    // For JSON upload/calibration functionality
    const [showJsonUpload, setShowJsonUpload] = useState(false);
    const [showCalibration, setShowCalibration] = useState(false);
    const [uploadedJsonFile, setUploadedJsonFile] = useState(null);
    const [fieldMapping, setFieldMapping] = useState(null);

    const filteredProducts = selectedCategory
        ? products.filter(product => product.category_id === Number(selectedCategory))
        : products;

    const [highlightedField, setHighlightedField] = useState("");

    useEffect(() => {
        if (sortOption.includes("price")) {
            setHighlightedField("price");
        } else if (sortOption.includes("storage")) {
            setHighlightedField("storage");
        } else if (sortOption.includes("salesfloor")) {
            setHighlightedField("salesfloor");
        } else {
            setHighlightedField("");
        }
    }, [sortOption]);

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
            case "storage_high":
                return b.quantity_in_storage - a.quantity_in_storage;
            case "storage_low":
                return a.quantity_in_storage - b.quantity_in_storage;
            case "salesfloor_high":
                return b.quantity_in_salesfloor - a.quantity_in_salesfloor;
            case "salesfloor_low":
                return a.quantity_in_salesfloor - b.quantity_in_salesfloor;
            default:
                return 0;
        }
    });

    const searchedProducts = sortedProducts.filter(product =>
        product.product_name.toLowerCase().startsWith(searchQuery.toLowerCase())
    );
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const [formData, setFormData] = useState({
        image: '',
        product_name: '',
        sku: '',
        barcode: '',
        category_id: '',
        newCategory: '',
        price: '',
        shelf_num: '',
        storage_num: '',
        quantity_in_storage: '',
        quantity_in_salesfloor: '',
    });
    const [imageError, setImageError] = useState("");

    const fetchProducts = async () => {
        if (!user.store_id) {
            console.error("Store ID is missing!");
            return;
        }
        try {
            const response = await axios.get("https://stocksmart.xyz/api/storage", {
                params: { store_id: user.store_id },
            });
            if (response.data.success && Array.isArray(response.data.data)) {
                const updatedProducts = response.data.data.map(product => ({
                    ...product,
                    sku: product.sku || null,
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
            const response = await axios.get("https://stocksmart.xyz/api/categories", {
                params: { store_id: user.store_id },
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
            setIsLoading(true);
            await fetchCategories();
            await fetchProducts();
            setIsLoading(false);
        };
        fetchData();
    }, [authToken]);

    const addCategory = async () => {
        if (!authToken) {
            console.error("Error: User is not authenticated!");
            return;
        }
        try {
            const response = await axios.post(
                "https://stocksmart.xyz/api/categories",
                { category: formData.newCategory },
                {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Accept': 'application/json',
                    },
                }
            );
            console.log("Category added:", response.data);
            setCategories(prevCategories => [...prevCategories, response.data.category]);
            setFormData({ ...formData, newCategory: "" });
        } catch (error) {
            console.error("Error adding category:", error.response ? error.response.data : error);
        }
    };

    const handleDoneClick = () => {
        setIsDone(true);
        setTimeout(() => {
            navigate('/users');
        }, 2000);
    };

    const toggleOverlay = () => {
        setShowOverlay(!showOverlay);
    };

    const handleViewToggle = () => {
        setIsListView(!isListView);
    };

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            const selectedFile = files[0];
            const maxSize = 2097152; // 2MB in bytes
            if (selectedFile) {
                if (selectedFile.size > maxSize) {
                    setImageError("File too large");
                    // Clear any previous image selection if file is too large
                    setFormData(prev => ({ ...prev, [name]: '' }));
                } else {
                    setImageError("");
                    setFormData(prev => ({ ...prev, [name]: selectedFile }));
                }
            }
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!user || !user.store_id) {
            console.error("Error: Store ID is missing!");
            setIsSubmitting(false);
            return;
        }

        let categoryIdToUse = formData.category_id;
        if (formData.newCategory.trim() !== "") {
            try {
                const categoryResponse = await axios.post(
                    "https://stocksmart.xyz/api/categories",
                    { category: formData.newCategory },
                    {
                        headers: {
                            "Authorization": `Bearer ${authToken}`,
                            "Accept": "application/json"
                        }
                    }
                );
                console.log("Category added:", categoryResponse.data);
                if (categoryResponse.data && categoryResponse.data.category) {
                    categoryIdToUse = categoryResponse.data.category.id;
                    setCategories(prevCategories => [...prevCategories, categoryResponse.data.category]);
                } else {
                    console.error("Invalid API response for category:", categoryResponse.data);
                    setIsSubmitting(false);
                    return;
                }
                setFormData((prev) => ({ ...prev, newCategory: "" }));
            } catch (error) {
                console.error("Error adding new category:", error.response ? error.response.data : error);
                setIsSubmitting(false);
                return;
            }
        }

        const formDataToSend = new FormData();
        formDataToSend.append("store_id", user.store_id);
        formDataToSend.append("product_name", formData.product_name);
        formDataToSend.append("sku", formData.sku || "");
        formDataToSend.append("barcode", formData.barcode);

        // Append category_id only if it is defined and non-empty
        if (categoryIdToUse && categoryIdToUse !== "") {
            formDataToSend.append("category_id", categoryIdToUse);
        }

        // For numeric fields, only append if not empty
        if (formData.price.trim() !== "") {
            formDataToSend.append("price", formData.price);
        }
        if (formData.shelf_num.trim() !== "") {
            formDataToSend.append("shelf_num", formData.shelf_num);
        }
        if (formData.storage_num.trim() !== "") {
            formDataToSend.append("storage_num", formData.storage_num);
        }
        if (formData.quantity_in_storage.trim() !== "") {
            formDataToSend.append("quantity_in_storage", formData.quantity_in_storage);
        }
        if (formData.quantity_in_salesfloor.trim() !== "") {
            formDataToSend.append("quantity_in_salesfloor", formData.quantity_in_salesfloor);
        }

        console.log("Sending data:", Object.fromEntries(formDataToSend));

        if (formData.image) {
            formDataToSend.append("image", formData.image);
        }

        try {
            let response;
            if (editingProductId) {
                response = await axios.put(
                    `https://stocksmart.xyz/api/storage/${editingProductId}`,
                    formDataToSend,
                    {
                        headers: {
                            "Authorization": `Bearer ${authToken}`,
                            "Content-Type": "multipart/form-data"
                        }
                    }
                );
                console.log("Product updated:", response.data);
            } else {
                response = await axios.post(
                    "https://stocksmart.xyz/api/storage",
                    formDataToSend,
                    {
                        headers: {
                            "Authorization": `Bearer ${authToken}`,
                            "Content-Type": "multipart/form-data"
                        }
                    }
                );
                console.log("Product added:", response.data);
            }
            setProducts((prevItems) => {
                if (editingProductId) {
                    return prevItems.map(item =>
                        item.id === editingProductId ? response.data.storageItem : item
                    );
                }
                return [...prevItems, response.data.storageItem];
            });
            setShowOverlay(false);
            setFormData({
                product_name: "",
                sku: "",
                barcode: "",
                category_id: "",
                newCategory: "",
                price: "",
                shelf_num: "",
                storage_num: "",
                quantity_in_storage: "",
                quantity_in_salesfloor: "",
                image: null,
            });
            setEditingProductId(null);
            await fetchProducts();
        } catch (error) {
            console.error("Error adding/updating product:", error.response ? error.response.data : error);
        }
        setIsSubmitting(false);
    };

    useEffect(() => {
        const getStoreInfo = async () => {
            if (!authToken || !user.store_id) {
                console.error("Store ID is missing or auth token is not available!");
                return;
            }
            try {
                const response = await axios.get(`https://stocksmart.xyz/api/show/${user.store_id}`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                setStore(response.data);
            } catch (error) {
                console.error("Error fetching store data:", error);
            }
        };
        getStoreInfo();
    }, [authToken, user.store_id]);

    const [animationTriggered, setAnimationTriggered] = useState(false);
    useEffect(() => {
        setAnimationTriggered(true);
    }, []);

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
        setEditingProductId(product.id);
        setShowOverlay(true);
    };

    const confirmDelete = (product) => {
        setDeleteProduct(product);
        setShowDeleteOverlay(true);
    };

    const handleDelete = async () => {
        if (!authToken) {
            console.error("Error: Auth token is missing!");
            return;
        }
        try {
            await axios.delete(`https://stocksmart.xyz/api/storage/${deleteProduct.id}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Accept': 'application/json'
                }
            });
            setShowDeleteOverlay(false);
            setProducts((prevProducts) => prevProducts.filter(product => product.id !== deleteProduct.id));
        } catch (error) {
            console.error('Error deleting product:', error.response ? error.response.data : error);
        }
    };

    // Handlers for JSON upload / calibration overlays
    const handleUploadNext = (file) => {
        setUploadedJsonFile(file);
        setShowJsonUpload(false);
        setShowCalibration(true);
    };

    const handleMappingComplete = (mapping) => {
        setFieldMapping(mapping);
        setShowCalibration(false);
        // Here you can send the mapping and JSON file to your backend endpoint if needed.
        console.log("Field Mapping:", mapping);
    };

    return (
        <div className="ml-[16.67%] max-lg:ml-[200px] max-sm:ml-0 flex min-h-screen flex-col">
            {/* Top fixed buttons */}
            <div className="flex justify-between items-center p-4">
                {/* Done/Skip Button */}
                <button
                    className="bg-[#4E82E4] py-2 px-9 text-white font-semibold rounded-lg hover:bg-[#6a9aec] absolute top-3 right-3 transition-all hover:scale-110 max-sm:block"
                    onClick={handleDoneClick}
                >
                    {addStorageTranslations[language].doneSkip}
                </button>
                {/* Action buttons: Add Item and Upload JSON */}
                <div className="flex space-x-4">
                    <button
                        className="bg-[#4E82E4] py-1 px-4 text-white font-semibold rounded hover:bg-[#6a9aec] transition-all hover:scale-105"
                        onClick={toggleOverlay}
                    >
                        Add Item
                    </button>
                    <button
                        className="bg-green-500 py-1 px-4 text-white font-semibold rounded hover:bg-green-600 transition-all hover:scale-105"
                        onClick={() => setShowJsonUpload(true)}
                    >
                        Upload JSON
                    </button>
                </div>
            </div>

            <Sidebar storeName={store.storename} employeeName={user.name} />
            <div className="w-full bg-[#f8fafe] p-10 max-xl:p-5 h-screen max-sm:w-screen flex flex-col justify-start items-center max-sm:ml-0 max-sm:p-2">
                {/* Progress Bar */}
                <div className="flex justify-center w-1/2 min-w-[650px] max-lg:scale-90 max-md:scale-75 max-sm:scale-100 absolute top-[5%] items-center max-sm:justify-evenly max-sm:w-full max-sm:min-w-full">
                    <div className="flex w-1/6 h-full flex-col justify-center items-center">
                        <div className="flex flex-col items-center z-20 bg-[#4E82E4] h-[50px] w-1/2 max-sm:w-full rounded-full p-3">
                            <FaCheck className="text-white size-full"/>
                        </div>
                        <span className="text-lg font-teko text-[#DF9677] max-sm:hidden">Store info</span>
                    </div>
                    <div className="w-[10%] h-[7px] bg-gray-300 mb-6 -mx-12 flex justify-start items-center max-sm:mb-0">
                        <div className="progress-bar"></div>
                    </div>
                    <div className="flex w-1/6 h-full flex-col justify-center items-center">
                        <div className={`flex flex-col items-center bg-gray-300 z-20 h-[50px] w-1/2 max-sm:w-full rounded-full p-3 scale-up-animation ${isDone ? 'done' : ''}`}>
                            <FaBoxesStacked className={`text-white size-full ${isDone ? 'icon-fade-out absolute bottom-[0%] scale-50' : ''}`}/>
                            <FaCheck className={`text-white size-full ${isDone ? 'icon-fade-in' : 'hidden'}`}/>
                        </div>
                        <span className="text-lg font-teko text-[#DF9677] max-sm:hidden">Add storage</span>
                    </div>
                    <div className="w-[10%] h-[7px] bg-gray-300 mb-6 -mx-12 flex justify-center items-center max-sm:mb-0"></div>
                    <div className="flex w-1/6 h-full flex-col justify-center items-center">
                        <div className="flex flex-col items-center z-20 bg-gray-300 h-[50px] w-1/2 max-sm:w-full rounded-full p-3">
                            <FaUsers className="text-white size-full"/>
                        </div>
                        <span className="text-lg font-teko text-[#DF9677] max-sm:hidden">Employees</span>
                    </div>
                </div>
                {/* Top Container - Search, Sort, Filter */}
                <div className="w-full h-12 flex justify-between items-center mt-24 mb-4 flex-wrap max-sm:h-32 max-sm:justify-center">
                    <div className="flex items-center space-x-2 w-full justify-start">
                        <div className="flex items-center border border-gray-300 bg-white rounded w-1/3 py-2 px-3 max-sm:w-3/4">
                            <FaMagnifyingGlass className="mr-2 text-[#DF9677]"/>
                            <input
                                type="text"
                                className="w-full outline-none"
                                placeholder={addStorageTranslations[language].searchItems}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <select
                            className="border border-gray-300 w-1/4 bg-white rounded py-2 px-3 max-sm:w-2/5"
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                        >
                            <option value="">{addStorageTranslations[language].sortBy}</option>
                            <option value="price_asc">{addStorageTranslations[language].priceAsc}</option>
                            <option value="price_desc">{addStorageTranslations[language].priceDesc}</option>
                            <option value="storage_high">{addStorageTranslations[language].storageHigh}</option>
                            <option value="storage_low">{addStorageTranslations[language].storageLow}</option>
                            <option value="salesfloor_high">{addStorageTranslations[language].salesfloorHigh}</option>
                            <option value="salesfloor_low">{addStorageTranslations[language].salesfloorLow}</option>
                            <option value="name_asc">{addStorageTranslations[language].nameAsc}</option>
                            <option value="name_desc">{addStorageTranslations[language].nameDesc}</option>
                        </select>
                        <select
                            className="border border-gray-300 w-1/4 bg-white rounded py-2 px-3 max-sm:w-3/5"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="">{addStorageTranslations[language].filterByCategory}</option>
                            {categories.length > 0 ? (
                                categories.map(category => (
                                    <option key={category.id} value={category.id}>{category.category}</option>
                                ))
                            ) : (
                                <option disabled>Loading categories...</option>
                            )}
                        </select>
                        <FaBars
                            onClick={() => setIsListView(true)}
                            className={`border border-gray-300 bg-white text-black w-10 h-10 p-2 cursor-pointer hover:bg-gray-200 max-sm:hidden ${isListView ? 'hidden' : ''}`}
                        />
                        <FaGrip
                            onClick={() => setIsListView(false)}
                            className={`border border-gray-300 bg-white text-black w-10 h-10 p-2 cursor-pointer hover:bg-gray-200 max-sm:hidden ${!isListView ? 'hidden' : ''}`}
                        />
                    </div>
                </div>
                {/* Middle Container - Product Cards */}
                {isLoading ? (
                    <div className="w-full grid grid-cols-4 gap-4 max-sm:grid-cols-2 max-md:grid-cols-3 animate-pulse">
                        {Array.from({ length: 8 }).map((_, idx) => (
                            <div key={idx} className="bg-gray-300 h-[300px] rounded-lg"></div>
                        ))}
                    </div>
                ) : (
                    <div className={`w-full max-h-[500px] grid gap-4 ${isListView ? 'grid-cols-2 gap-2' : 'grid-cols-6'} max-sm:grid-cols-3 max-sm:gap-2 max-md:grid-cols-3 max-xs:grid-cols-2 max-lg:grid-cols-3 max-xl:grid-cols-4 max-2xl:grid-cols-5 max-sm:p-0`}>
                        {searchedProducts.length > 0 ? (
                            searchedProducts.map(product => (
                                <div
                                    key={product.id}
                                    className={`border border-gray-300 bg-white shadow-md rounded-lg p-2 ${isListView ? 'flex flex-row items-center' : 'flex flex-col justify-between'}`}
                                >
                                    {/* Square Product Image */}
                                    <div className={`${isListView ? 'w-52 max-h-full mr-2' : 'w-full h-48 mb-4'}`}>
                                        <img
                                            src={product.image ? `https://stocksmart.xyz/backend/public/${product.image}` : 'http://stocksmart.xyz/noimage.png'}
                                            alt={product.product_name}
                                            className="w-full h-full object-cover rounded-lg shadow-gray-300 shadow-lg"
                                        />
                                    </div>
                                    {/* Product Details */}
                                    <div className="flex flex-col w-full">
                                        <h3
                                            className="font-bold truncate text-ellipsis whitespace-nowrap max-w-full max-md:text-sm"
                                            style={{ fontSize: 'clamp(0.75rem, 1vw, 1.125rem)' }}
                                        >
                                            {product.product_name}
                                        </h3>
                                        <p className="text-md mb-1 max-md:text-sm" >SKU: {product.sku || 'N/A'}</p>
                                        <p className="text-sm text-gray-500 flex items-center">
                                            <FaBarcode className="mr-2"/> {product.barcode || 'N/A'}
                                        </p>
                                        <p className="text-sm text-gray-500 flex items-center">
                                            <FaBoxesStacked className="mr-2"/>Category: {product.category ? product.category.category : 'Uncategorized'}
                                        </p>
                                        <p className={`text-sm flex items-center transition-all ${highlightedField === "price" ? "text-[#4E82E4] font-extrabold" : "text-gray-500"}`}>
                                            <FaDollarSign className="mr-2"/> {product.price}
                                        </p>
                                        <p className="text-sm text-gray-500 flex items-center">
                                            <FaBox className="mr-2"/> Shelf: {product.shelf_num || 'N/A'}
                                        </p>
                                        <p className={`text-sm flex items-center transition-all ${highlightedField === "storage" ? "text-[#4E82E4] font-extrabold" : "text-gray-500"}`}>
                                            <FaBoxesStacked className="mr-2"/> Storage: {product.quantity_in_storage}
                                        </p>
                                        <p className={`text-sm flex items-center transition-all ${highlightedField === "salesfloor" ? "text-[#4E82E4] font-extrabold" : "text-gray-500"}`}>
                                            <FaStore className="mr-2"/> Salesfloor: {product.quantity_in_salesfloor}
                                        </p>
                                        {/* Action Buttons */}
                                        <div className="flex justify-between w-full mt-4">
                                            <button
                                                className="bg-blue-500 text-white px-4 py-2 w-1/3 rounded hover:bg-blue-600 flex items-center justify-center"
                                                onClick={() => handleEdit(product)}
                                            >
                                                <FaPen />
                                            </button>
                                            <button
                                                className="bg-[#DF9677] text-white px-4 py-2 rounded w-1/3 flex justify-center hover:bg-red-600"
                                                onClick={() => confirmDelete(product)}
                                            >
                                                <FaTrashCan />
                                            </button>
                                        </div>
                                    </div>
                                    {/* Delete confirmation overlay */}
                                    {showDeleteOverlay && (
                                        <div className="fixed inset-0 flex justify-center items-center bg-black z-40 bg-opacity-50">
                                            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                                                <h2 className="text-lg font-bold mb-4">Are you sure you want to delete:</h2>
                                                <p className="text-red-500 font-semibold">{deleteProduct?.product_name}</p>
                                                <div className="flex justify-center gap-4 mt-4">
                                                    <button
                                                        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                                                        onClick={() => setShowDeleteOverlay(false)}
                                                    >
                                                        No
                                                    </button>
                                                    <button
                                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                                        onClick={async () => {
                                                            await handleDelete();
                                                            setShowDeleteOverlay(false);
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
                            <p className="text-center scale-125 col-span-4 text-gray-500 absolute left-1/2 top-1/2">No products available.</p>
                        )}
                    </div>
                )}
            </div>

            {/* Overlay for Add/Edit Item */}
            {showOverlay && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="relative bg-white p-4 w-2/3 h-auto rounded-lg shadow-lg space-y-4 max-sm:w-full max-sm:h-auto max-sm:px-2">
                        <FaXmark className="w-5 text-[#4E82E4] absolute top-4 right-4 cursor-pointer" onClick={toggleOverlay}/>
                        <h2 className="text-xl text-[#4E82E4] font-bold text-center">Add new item</h2>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {/* Image Upload */}
                            <div
                                className="flex flex-col items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                                <input type="file" name="image" onChange={handleChange}/>
                                {imageError && (
                                    <span className="text-red-500 text-sm mt-1">{imageError}</span>
                                )}
                            </div>
                            {/* Name Input */}
                            <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                                <FaInfo className="text-[#4E82E4] mr-2"/>
                                <input
                                    className="w-full"
                                    type="text"
                                    value={formData.product_name}
                                    onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                                    placeholder="Enter product name"
                                />
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                                    <FaMagnifyingGlass className="text-[#4E82E4] mr-2"/>
                                    <input
                                        className="w-full"
                                        type="text"
                                        value={formData.sku}
                                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                        placeholder="Enter SKU"
                                    />
                                </div>
                                <small className="text-gray-400 text-sm mt-1">SKU usually is provided by supplier</small>
                            </div>
                            {/* Barcode Input */}
                            <div className="flex flex-col">
                                <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                                    <FaBarcode className="text-[#4E82E4] mr-2"/>
                                    <input
                                        className="w-full"
                                        type="text"
                                        value={formData.barcode}
                                        maxLength={13}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^\d*$/.test(value)) {
                                                setFormData({ ...formData, barcode: value });
                                            }
                                        }}
                                        placeholder="Enter barcode"
                                    />
                                </div>
                                <small className="text-gray-400 text-sm mt-1">Max. 13 digits</small>
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
                                        placeholder={addStorageTranslations[language].selectCategory}
                                        name="newCategory"
                                        value={formData.newCategory}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            {/* Price, Shelf Number, Storage Number */}
                            <div className="flex space-x-4">
                                <div className="flex flex-col w-1/3">
                                    <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                                        <FaDollarSign className="text-[#4E82E4] mr-2"/>
                                        <input
                                            type="text"
                                            value={formData.price}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (/^\d{0,8}(\.\d{0,2})?$/.test(value) || value === "") {
                                                    setFormData({ ...formData, price: value });
                                                }
                                            }}
                                            placeholder={addStorageTranslations[language].enterPrice}
                                            className="w-full"
                                        />
                                    </div>
                                    <small className="text-gray-400 text-sm mt-1">Max 8 digits, 2 decimals | E.g: 10.00</small>
                                </div>
                                <div className="flex flex-col w-1/3">
                                    <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                                        <FaBoxesPacking className="text-[#4E82E4] mr-2"/>
                                        <input type="text" className="w-full outline-none" placeholder="Shelf Number"
                                               maxLength="3" name="shelf_num" value={formData.shelf_num}
                                               onChange={handleChange}/>
                                    </div>
                                    <small className="text-gray-400 text-sm mt-1">max. 3 symbols</small>
                                </div>
                                <div className="flex flex-col w-1/3">
                                    <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                                        <FaBoxesPacking className="text-[#4E82E4] mr-2"/>
                                        <input type="text" className="w-full outline-none"
                                               placeholder="Storage Shelf Number"
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
                                    <input type="text" className="w-full outline-none" placeholder="Amount in storage"
                                           maxLength="3"
                                           name="quantity_in_storage"
                                           value={formData.quantity_in_storage} onChange={handleChange}/>
                                </div>
                                <small className="text-gray-400 text-sm mt-1">max. 3 symbols</small>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                                    <FaStore className="text-[#4E82E4] mr-2"/>
                                    <input type="text" className="w-full outline-none" placeholder="Amount on Sales Floor"
                                           maxLength="2" name="quantity_in_salesfloor"
                                           value={formData.quantity_in_salesfloor}
                                           onChange={handleChange}/>
                                </div>
                                <small className="text-gray-400 text-sm mt-1">max. 2 symbols</small>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting || !formData.product_name || !formData.price}
                                className={`relative flex justify-center items-center bg-[#4E82E4] hover:bg-[#2968DE] text-white font-semibold py-2 px-4 rounded w-full transition-all ${isSubmitting ? 'animate-pulse' : ''}`}
                            >
                                {isSubmitting ? (
                                    <CgSpinnerAlt className="animate-spin text-white text-xl" />
                                ) : (
                                    addStorageTranslations[language].submit
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* JSON Upload and Calibration Overlays */}
            {showJsonUpload && (
                <JsonUploadOverlay
                    onNext={handleUploadNext}
                    onClose={() => setShowJsonUpload(false)}
                />
            )}

            {showCalibration && uploadedJsonFile && (
                <JsonCalibrationOverlay
                    jsonFile={uploadedJsonFile}
                    onMappingComplete={handleMappingComplete}
                    onClose={() => setShowCalibration(false)}
                />
            )}
        </div>
    );
};

export default AddStorage;