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
import { IoMdPricetag } from "react-icons/io";
import { CgSpinnerAlt, CgDisplayFullwidth, CgDisplaySpacing, CgInbox } from "react-icons/cg";
const AddStorage = () => {
    const { authToken } = useAuth();
    const { user, setUser } = useAuth();
    const [store, setStore] = useState({});
    const [language, setLanguage] = useState(localStorage.getItem("language") || "en");
    const [products, setProducts] = useState([]);
    const [showOverlay, setShowOverlay] = useState(false);
    const [showManageCategories, setShowManageCategories] = useState(false);
    const [showAssignCategories, setShowAssignCategories] = useState(false);
    const [assignToUncategorized, setAssignToUncategorized] = useState(false);
    const [selectedProductsForAssign, setSelectedProductsForAssign] = useState(new Set());
    const [categories, setCategories] = useState([]);
    const [isListView, setIsListView] = useState(false);
    const [deleteProduct, setDeleteProduct] = useState(null);
    const [showDeleteOverlay, setShowDeleteOverlay] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [showDeleteCategoryOverlay, setShowDeleteCategoryOverlay] = useState(false);
    const [sortOption, setSortOption] = useState("");
    const [editingProductId, setEditingProductId] = useState(null);
    const isEditing = Boolean(editingProductId);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [isDone, setIsDone] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const [isSearching, setIsSearching] = useState(false);
    const [imagePreview, setImagePreview] = useState('');
    const [submissionErrors, setSubmissionErrors] = useState({});

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
        product.product_name
            .toLowerCase()
            .startsWith(debouncedQuery.toLowerCase())
    );
    useEffect(() => {
        setIsSearching(true);
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
            setIsSearching(false);
        }, 300);
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
        quantity_in_salesfloor: '0',
        should_be: '1',
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
                    price: parseFloat(product.price),
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
                {
                    category: formData.newCategory,
                    store_id: user.store_id
                },
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
            return response.data.category.id;
        } catch (error) {
            console.error("Error adding category:", error.response ? error.response.data : error);
            return null;
        }
    };

    const usageCounts = categories.reduce((acc, c) => {
        acc[c.id] = products.filter(p => p.category_id === c.id).length;
        return acc;
    }, {});

    const usageNames = categories.reduce((acc, c) => {
        acc[c.id] = products
            .filter(p => p.category_id === c.id)
            .map(p => p.product_name);
        return acc;
    }, {});

    const handleDoneClick = () => {
        setIsDone(true);                             // trigger animation
        localStorage.setItem('isdonestorage', 'yes'); // persist immediately
        setTimeout(() => navigate('/users'), 2000);   // after 2s, go
    };

    const toggleOverlay = () => {
        if (!showOverlay) {
            setEditingProductId(null);
            setFormData({
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
                quantity_in_salesfloor: '0',
            });
            setImagePreview('');
        }
        setShowOverlay(!showOverlay);
    };

    const handleViewToggle = () => {
        setIsListView(!isListView);
    };

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            const file = files[0];
            if (file) {
                const allowedTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
                let error = "";
                if (file.size > 2097152) {
                    error = "File too large (max 2MB)";
                } else if (!allowedTypes.includes(file.type)) {
                    error = "Invalid file type. Allowed: PNG, JPG, GIF, WebP";
                }
                setImageError(error);
                if (!error) {
                    setFormData(prev => ({ ...prev, image: file }));
                    setImagePreview(URL.createObjectURL(file));
                }
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmissionErrors({});

        if (!user?.store_id) {
            console.error("Error: Store ID is missing!");
            setIsSubmitting(false);
            return;
        }

        let categoryIdToUse = formData.category_id;
        if (formData.newCategory.trim() !== "") {
            try {
                const response = await axios.post(
                    "https://stocksmart.xyz/api/categories",
                    {
                        category: formData.newCategory,
                        store_id: user.store_id
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${authToken}`,
                            'Accept': 'application/json',
                        },
                    }
                );
                categoryIdToUse = response.data.category.id;
                setCategories(prevCategories => [...prevCategories, response.data.category]);
            } catch (error) {
                console.error("Error creating new category:", error);
                setIsSubmitting(false);
                return;
            }
        }

        // Build FormData with all fields
        const formDataToSend = new FormData();
        formDataToSend.append("store_id", user.store_id);
        formDataToSend.append("product_name", formData.product_name);
        formDataToSend.append("sku", formData.sku || "");
        formDataToSend.append("barcode", formData.barcode);
        if (categoryIdToUse) formDataToSend.append("category_id", categoryIdToUse);
        const appendNumericField = (fieldName, value) => {
            const num = parseFloat(value);
            if (isNaN(num)) return; // Added missing parentheses

            // Special handling for price
            if (fieldName === "price") {
                formDataToSend.append(fieldName, value);
            } else {
                formDataToSend.append(fieldName, num);
            }
        };

        appendNumericField("price", formData.price);
        appendNumericField("shelf_num", formData.shelf_num);
        appendNumericField("storage_num", formData.storage_num);
        appendNumericField("quantity_in_storage", formData.quantity_in_storage);
        appendNumericField("quantity_in_salesfloor", formData.quantity_in_salesfloor);
        appendNumericField("should_be", formData.should_be);

        if (formData.image) formDataToSend.append("image", formData.image);

        try {
            let response;

            if (editingProductId) {
                formDataToSend.append("_method", "PUT");
                response = await axios.post(
                    `https://stocksmart.xyz/api/storage/${editingProductId}`,
                    formDataToSend,
                    {
                        headers: {
                            "Authorization": `Bearer ${authToken}`,
                            "X-HTTP-Method-Override": "PUT"
                        }
                    }
                );
            } else {
                // Normal "create" path
                response = await axios.post(
                    "https://stocksmart.xyz/api/storage",
                    formDataToSend,
                    {
                        headers: {
                            "Authorization": `Bearer ${authToken}`
                            // again, no need to set Content-Type manually
                        }
                    }
                );
            }

            // Update local state & UI
            setProducts(prev =>
                editingProductId
                    ? prev.map(item => item.id === editingProductId ? {
                        ...response.data.storageItem,
                        price: Number(response.data.storageItem.price)
                    } : item)
                    : [...prev, {
                        ...response.data.storageItem,
                        price: Number(response.data.storageItem.price)
                    }]
            );
            setShowOverlay(false);
            setEditingProductId(null);
            setFormData({
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
                quantity_in_salesfloor: '0',
            });
            await fetchProducts();
        } catch (error) {
            if (error.response?.status === 422) {
                setSubmissionErrors(error.response.data.errors || {});
            } else {
                setSubmissionErrors({
                    general: [error.response?.data?.message || "An unexpected error occurred"]
                });
            }
            console.error("Error adding/updating product:", error.response?.data || error);
        } finally {
            setIsSubmitting(false);
        }
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
    const [storageDone, setStorageDone] = useState(
        localStorage.getItem('isdonestorage') === 'yes'
    );


    const handleEdit = (product) => {
        setFormData({
            image: null,  // file inputs cannot be prefilled, but we clear it
            product_name: product.product_name || '',
            sku:            product.sku            || '',
            barcode:        product.barcode        || '',
            category_id:    product.category_id?.toString() || '',
            newCategory:    '',
            price:          product.price?.toString() || '',
            shelf_num:      product.shelf_num?.toString() || '',
            storage_num:    product.storage_num?.toString() || '',
            quantity_in_storage:    product.quantity_in_storage?.toString() || '',
            quantity_in_salesfloor: product.quantity_in_salesfloor?.toString() || '0',
            should_be: product.should_be?.toString() || '1',
        });

        // show existing image in preview
        setImagePreview(
            product.image
                ? `https://stocksmart.xyz/backend/public/${product.image}`
                : 'http://stocksmart.xyz/noimage.png'
        );

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

    const closeAllCategoryOverlays = () => {
        setShowManageCategories(false);
        setShowAssignCategories(false);
        setSelectedProductsForAssign(new Set());
        setAssignToUncategorized(false);
    };

    const handleCategoryDelete = (category) => {
        setCategoryToDelete(category);
        setShowDeleteCategoryOverlay(true);
    };

    const openAssignOverlay = () => {
        setShowManageCategories(false);
        setShowAssignCategories(true);
        // Reset form and selection state when opening the overlay
        setFormData(prev => ({
            ...prev,
            category_id: '',
            newCategory: ''
        }));
        setSelectedProductsForAssign(new Set());
        setAssignToUncategorized(false);
    };

    const toggleProductSelection = (id) => {
        setSelectedProductsForAssign(prev => {
            const s = new Set(prev);
            s.has(id) ? s.delete(id) : s.add(id);
            return s;
        });
    };

    const handleAssign = async () => {
        // Check if a category is selected or a new one is being created
        let categoryIdToUse = formData.category_id;

        // If new category is being created
        if (formData.newCategory.trim() !== "") {
            try {
                const response = await axios.post(
                    "https://stocksmart.xyz/api/categories",
                    {
                        category: formData.newCategory,
                        store_id: user.store_id
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${authToken}`,
                            'Accept': 'application/json',
                        },
                    }
                );
                categoryIdToUse = response.data.category.id;
                setCategories(prevCategories => [...prevCategories, response.data.category]);
            } catch (error) {
                console.error("Error adding category:", error.response ? error.response.data : error);
                return; // Stop the process if category creation fails
            }
        }

        // Get the product IDs to update
        const productsToUpdate = assignToUncategorized
            ? products.filter(p => !p.category_id).map(p => p.id)
            : Array.from(selectedProductsForAssign);

        try {
            // Make the API call to assign categories
            const response = await axios.post(
                "https://stocksmart.xyz/api/assign-categories",
                {
                    product_ids: productsToUpdate,
                    category_id: categoryIdToUse
                },
                {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Accept': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                // Update local state
                setProducts(prevProducts =>
                    prevProducts.map(product => {
                        if (productsToUpdate.includes(product.id)) {
                            return {
                                ...product,
                                category_id: categoryIdToUse,
                                category_name: categories.find(c => c.id === categoryIdToUse)?.category || formData.newCategory
                            };
                        }
                        return product;
                    })
                );
                // Refresh data
                await fetchCategories();
                await fetchProducts();
            } else {
                console.error("Assignment failed:", response.data);
            }
            // Update local state
            setProducts(prevProducts =>
                prevProducts.map(product => {
                    if (productsToUpdate.includes(product.id)) {
                        const categoryName = categories.find(cat => cat.id === parseInt(categoryIdToUse))?.category ||
                            formData.newCategory ||
                            "Uncategorized";
                        return {
                            ...product,
                            category_id: parseInt(categoryIdToUse),
                            category_name: categoryName
                        };
                    }
                    return product;
                })
            );

            // Close overlay and reset state
            closeAllCategoryOverlays();

            // Clear selection state
            setSelectedProductsForAssign(new Set());
            setFormData({
                ...formData,
                category_id: '',
                newCategory: ''
            });

            // Refresh the categories and products
            await fetchCategories();
            await fetchProducts();

        } catch (error) {
            console.error("Error assigning categories:", error.response ? error.response.data : error);
        }
    };

    const confirmCategoryDelete = async () => {
        try {
            await axios.delete(`https://stocksmart.xyz/api/categories/${categoryToDelete.id}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Accept': 'application/json'
                }
            });

            // Update categories state
            setCategories(prevCategories =>
                prevCategories.filter(cat => cat.id !== categoryToDelete.id)
            );

            // Update products that had this category
            setProducts(prevProducts =>
                prevProducts.map(product => {
                    if (product.category_id === categoryToDelete.id) {
                        return {
                            ...product,
                            category_id: null,
                            category_name: "None"
                        };
                    }
                    return product;
                })
            );

            setShowDeleteCategoryOverlay(false);
            setCategoryToDelete(null);
        } catch (error) {
            console.error('Error deleting category:', error.response ? error.response.data : error);
        }
    };

    const renderAssignCategoriesOverlay = () => {
        const isCategorySelected = formData.category_id !== '';
        const isNewCategoryEntered = formData.newCategory.trim() !== '';
        const canAssign = isCategorySelected || isNewCategoryEntered;

        // Get uncategorized products for when "assign to all uncategorized" is checked
        const uncategorizedProducts = products.filter(p => !p.category_id);

        // Products to display in the checkbox list
        const displayProducts = assignToUncategorized ? uncategorizedProducts : products;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 overflow-hidden flex items-center justify-center z-50">
                <div className="bg-white w-1/3 p-3 rounded-lg max-h-[80vh] overflow-y-auto min-w-[300px]">
                    <div className="flex flex-row mb-4 justify-between items-center">
                        <h2 className="text-xl font-bold">{addStorageTranslations[language].assigncategories}</h2>
                        <FaXmark className="w-5 text-[#4E82E4] cursor-pointer" onClick={closeAllCategoryOverlays}/>
                    </div>
                    {/* Category Input */}
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                            <FaPen className="text-[#4E82E4] mr-2"/>
                            <select
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleChange}
                                className="w-full outline-none"
                                disabled={isNewCategoryEntered}
                            >
                                <option value="">{addStorageTranslations[language].selectCategory || "Select Category"}</option>
                                {Array.isArray(categories) && categories.map((category) => (
                                    <option key={category.id} value={category.id}>{category.category}</option>
                                ))}
                            </select>
                        </div>
                        {/* OR Divider */}
                        <div className="flex items-center justify-center">
                            <span className="text-[#4E82E4]">{addStorageTranslations[language].or}</span>
                        </div>
                        {/* New Category Input */}
                        <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                            <FaPen className="text-[#4E82E4] mr-2"/>
                            <input
                                type="text"
                                className="w-full outline-none"
                                placeholder={addStorageTranslations[language].addCategory || "Add New Category"}
                                name="newCategory"
                                value={formData.newCategory}
                                onChange={handleChange}
                                disabled={isCategorySelected}
                            />
                        </div>
                    </div>
                    <div className="flex items-center mb-4">
                        <input
                            type="checkbox"
                            checked={assignToUncategorized}
                            onChange={() => {
                                const newAssign = !assignToUncategorized;
                                setAssignToUncategorized(newAssign);
                                if (newAssign) {
                                    const uncategorizedIds = products.filter(p => !p.category_id).map(p => p.id);
                                    setSelectedProductsForAssign(new Set(uncategorizedIds));
                                } else {
                                    setSelectedProductsForAssign(new Set());
                                }
                            }}
                            id="assign-uncategorized-checkbox"
                        />
                        <label htmlFor="assign-uncategorized-checkbox" className="ml-2 font-semibold">
                            {addStorageTranslations[language].adduncategorized} ({uncategorizedProducts.length})
                        </label>
                    </div>
                    {!assignToUncategorized && (
                        <div className="max-h-[50vh] overflow-y-auto">
                            <ul className="space-y-2 max-w-full">
                                {displayProducts.map(p => (
                                    <li key={p.id} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`product-${p.id}`}
                                            checked={selectedProductsForAssign.has(p.id)}
                                            onChange={() => toggleProductSelection(p.id)}
                                            disabled={!canAssign || (assignToUncategorized && p.category_id)}
                                        />
                                        <label htmlFor={`product-${p.id}`} className="ml-2 flex-grow truncate">
                                            {p.product_name}
                                            {p.category_id && (
                                                <span className="text-gray-500 ml-2 text-sm">
                                                    ({addStorageTranslations[language].currently} {categories.find(c => c.id === p.category_id)?.category || 'Uncategorized'})
                                                </span>
                                            )}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <div className="mt-4 flex justify-end">
                        <button
                            className={`py-2 px-9 text-white font-semibold rounded-lg transition-all ${
                                canAssign ? 'bg-[#4E82E4] hover:bg-[#6a9aec] hover:scale-105' : 'bg-gray-400 cursor-not-allowed'
                            }`}
                            onClick={handleAssign}
                            disabled={!canAssign}
                        >
                            {addStorageTranslations[language].assign}
                        </button>
                    </div>
                </div>
            </div>
        );
    };
    return (
        <div className="ml-[16.67%] max-lg:ml-[200px] max-sm:ml-0 flex min-h-screen flex-col">
            <Sidebar storeName={store.storename} employeeName={user.name}/>
            <div
                className={`${storageDone ? 'mt-0 pt-0 pb-10 ' : 'mt-24 '}transition-all duration-300 w-full bg-[#f8fafe] p-10 max-xl:p-5 min-h-screen max-sm:w-screen flex flex-col justify-start items-center max-sm:ml-0 max-sm:p-2`}>
                {/* Top fixed buttons */}
                <div className="flex w-full justify-between items-center py-2 ">
                    <div className={`flex ${storageDone ? 'w-full max-sm:justify-end' : 'w-2/5'}`}>
                        <button
                            className={`${storageDone ? 'w-full hover:scale-100 max-sm:w-5/6 ' : ''}bg-[#4E82E4] w-full max-md:py-4 max-[510px]:text-sm max-[460px]:text-xs max-sm:px-5 max-[330px]:px-2 py-2 px-9 text-white font-semibold rounded-lg hover:bg-[#6a9aec] transition-all duration-300 hover:scale-110`}
                            onClick={toggleOverlay}
                        >
                            + {addStorageTranslations[language].addItem}
                        </button>
                    </div>
                    {!storageDone && (
                        <button
                            className="bg-[#4E82E4] w-2/5 py-2 px-9 text-white font-semibold max-md:py-4 max-[510px]:text-sm max-[460px]:text-xs max-sm:px-5 max-[330px]:px-2 rounded-lg hover:bg-[#6a9aec] transition-all hover:scale-110 max-sm:block"
                            onClick={handleDoneClick}
                        >
                            {addStorageTranslations[language].doneSkip}
                        </button>
                    )}
                </div>
                {/* Progress Bar */}
                {!storageDone && (
                    <div
                        className="flex justify-center w-1/2 min-w-[650px] max-lg:scale-90 max-md:scale-75 max-sm:scale-100 absolute top-[5%] items-center max-sm:justify-evenly max-sm:w-full max-sm:min-w-full">
                        <div className="flex w-1/6 h-full flex-col justify-center items-center">
                            <div
                                className="flex flex-col items-center z-20 bg-[#4E82E4] h-[50px] w-1/2 max-sm:w-full rounded-full p-3">
                                <FaCheck className="text-white size-full"/>
                            </div>
                            <span className="text-lg font-teko text-[#DF9677] max-sm:hidden">{addStorageTranslations[language].storeInfo}</span>
                        </div>
                        <div
                            className="w-[10%] h-[7px] bg-gray-300 mb-6 -mx-12 flex justify-start items-center max-sm:mb-0">
                            <div className="progress-bar"></div>
                        </div>
                        <div className="flex w-1/6 h-full flex-col justify-center items-center">
                            <div className={`flex flex-col items-center bg-gray-300 z-20 h-[50px] w-1/2 max-sm:w-full rounded-full p-3 scale-up-animation ${isDone ? 'done' : ''}`}>
                                <FaBoxesStacked className={`text-white size-full ${isDone ? 'icon-fade-out absolute bottom-[0%] scale-50' : ''}`}/>
                                <FaCheck className={`text-white size-full ${isDone ? 'icon-fade-in' : 'hidden'}`}/>
                            </div>
                            <span className="text-lg font-teko text-[#DF9677] max-sm:hidden">{addStorageTranslations[language].addStorage}</span>
                        </div>
                        <div className="w-[10%] h-[7px] bg-gray-300 mb-6 -mx-12 flex justify-center items-center max-sm:mb-0"></div>
                        <div className="flex w-1/6 h-full flex-col justify-center items-center">
                            <div className="flex flex-col items-center z-20 bg-gray-300 h-[50px] w-1/2 max-sm:w-full rounded-full p-3">
                                <FaUsers className="text-white size-full"/>
                            </div>
                            <span className="text-lg font-teko text-[#DF9677] max-sm:hidden">{addStorageTranslations[language].employees}</span>
                        </div>
                    </div>
                )}
                {/* Top Container - Search, Sort, Filter */}
                <div className={`w-full flex justify-between items-center mb-4 flex-wrap max-sm:justify-center`}>
                    <div className="flex items-center space-x-2 w-full justify-start max-md:flex-wrap max-md:space-x-0 max-md:justify-between max-sm:justify-evenly">
                        <div
                            className="flex items-center border border-gray-300 bg-white rounded w-1/5 py-2 px-3 max-md:w-1/2 max-sm:w-2/5">
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
                            className="border border-gray-300 w-1/5 bg-white rounded py-2 px-3 max-md:w-[46%] max-sm:w-2/5"
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
                            className="border border-gray-300 w-1/5 bg-white rounded py-2 px-3 max-md:w-1/2 max-sm:w-2/5"
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
                        <button
                            className="bg-white h-[42px] px-4 text-black font-semibold border border-gray-300 rounded hover:bg-gray-50 transition-all max-sm:block max-lg:text-sm max-md:text-xs max-lg:px-2 max-md:w-1/3 max-sm:w-2/5"
                            onClick={() => setShowManageCategories(true)}
                        >
                            {addStorageTranslations[language].managecategories}
                        </button>
                        <FaBars
                            onClick={() => setIsListView(true)}
                            className={`border border-gray-300 transition-all duration-300 bg-white text-black w-10 h-10 p-2 cursor-pointer hover:bg-gray-200 max-sm:hidden ${isListView ? 'hidden' : ''}`}
                        />
                        <FaGrip
                            onClick={() => setIsListView(false)}
                            className={`border border-gray-300 transition-all duration-300 bg-white text-black w-10 h-10 p-2 cursor-pointer hover:bg-gray-200 max-sm:hidden ${!isListView ? 'hidden' : ''}`}
                        />
                    </div>
                </div>
                {/* Middle Container - Product Cards */}
                {(isLoading || isSearching) ? (
                    <div className="w-full grid grid-cols-4 gap-4 max-sm:grid-cols-2 max-md:grid-cols-3 animate-pulse">
                        {Array.from({length: 8}).map((_, idx) => (
                            <div key={idx} className="bg-gray-300 h-[300px] rounded-lg"></div>
                        ))}
                    </div>
                ) : (
                    <div className={`w-full grid gap-4 ${isListView ? 'grid-cols-1 gap-2' : 'grid-cols-6'} max-sm:grid-cols-3 max-[450px]:grid-cols-2 max-sm:gap-2 max-md:grid-cols-3 max-xs:grid-cols-2 max-lg:grid-cols-3 max-xl:grid-cols-4 max-2xl:grid-cols-5 max-sm:p-0`}>
                        {searchedProducts.length > 0 ? (
                            searchedProducts.map(product => (
                                <div
                                    key={product.id}
                                    className={`border border-gray-300 bg-white shadow-md rounded-lg p-2 ${isListView ? 'flex flex-row items-center' : 'flex flex-col justify-between'}`}
                                >
                                    {/* Square Product Image */}
                                    <div className={`${isListView ? 'w-52 h-52 mr-2' : 'w-full h-48 mb-4'}`}>
                                        <img
                                            src={product.image ? `https://stocksmart.xyz/backend/public/${product.image}` : 'http://stocksmart.xyz/noimage.png'}
                                            alt={product.product_name}
                                            className="w-full h-full object-cover rounded-lg shadow-gray-300 shadow-lg pointer-events-none"
                                        />
                                    </div>
                                    {/* Product Details */}
                                    <div className="flex flex-col w-full">
                                        <h3 className="font-bold truncate responsive-heading">
                                            {product.product_name}
                                        </h3>
                                        <p className="mb-1 responsive-heading text-ellipsis overflow-hidden text-nowrap">
                                            {addStorageTranslations[language].skuLabel} : {product.sku || addStorageTranslations[language].notAvailable}
                                        </p>
                                        <p className="flex items-center text-gray-500 responsive-text text-ellipsis overflow-hidden text-nowrap">
                                            <FaBarcode className="mr-2 min-w-[12px]"/>
                                            {product.barcode || addStorageTranslations[language].notAvailable}
                                        </p>
                                        <p className="flex items-center text-gray-500 responsive-text">
                                            <FaBoxesStacked className="mr-2"/>
                                            {addStorageTranslations[language].categoryLabel} : {product.category?.category || "None"}
                                        </p>
                                        <p className={`flex items-center transition-all responsive-text ${highlightedField === "price" ? "text-[#4E82E4] font-extrabold" : "text-gray-500"}`}>
                                            <IoMdPricetag className="mr-2"/>
                                            {addStorageTranslations[language].price} : {Number(product.price).toFixed(2)}
                                        </p>
                                        <p className="flex items-center text-gray-500 responsive-text">
                                            <CgDisplayFullwidth className="mr-2"/>
                                            {addStorageTranslations[language].storagenumberlabel} : {product.storage_num || addStorageTranslations[language].notAvailable}
                                        </p>
                                        <p className="flex items-center text-gray-500 responsive-text">
                                            <CgDisplaySpacing className="mr-2"/>
                                            {addStorageTranslations[language].shelfLabel} : {product.shelf_num || addStorageTranslations[language].notAvailable}
                                        </p>
                                        <p className={`flex items-center transition-all responsive-text ${highlightedField === "storage" ? "text-[#4E82E4] font-extrabold" : "text-gray-500"}`}>
                                            <FaBoxesStacked className="mr-2"/>
                                            {addStorageTranslations[language].storageLabel} : {product.quantity_in_storage}
                                        </p>
                                        <p className={`flex items-center transition-all responsive-text ${highlightedField === "salesfloor" ? "text-[#4E82E4] font-extrabold" : "text-gray-500"}`}>
                                            <FaStore className="mr-2"/>
                                            {addStorageTranslations[language].salesfloorLabel} : {product.quantity_in_salesfloor}
                                        </p>
                                        <p className={`flex items-center transition-all responsive-text underline text-gray-500`}>
                                            <CgInbox className="mr-2"/>
                                            {addStorageTranslations[language].shouldbe} : {product.should_be}
                                        </p>
                                        {/* Action Buttons */}
                                        <div className="flex justify-between w-full mt-4">
                                            <button
                                                className="bg-blue-500 text-white px-4 py-2 w-1/3 rounded hover:bg-blue-600 flex items-center justify-center"
                                                onClick={() => handleEdit(product)}
                                            >
                                                <FaPen/>
                                            </button>
                                            <button
                                                className="bg-[#DF9677] text-white px-4 py-2 rounded w-1/3 flex justify-center hover:bg-red-600"
                                                onClick={() => confirmDelete(product)}
                                            >
                                                <FaTrashCan/>
                                            </button>
                                        </div>
                                    </div>
                                    {showDeleteCategoryOverlay && (
                                        <div
                                            className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                                            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                                                <h2 className="text-lg font-bold mb-4">
                                                Are you sure you want to delete the category "{categoryToDelete?.category}"?
                                                </h2>
                                                <p className="text-red-500 font-semibold">
                                                    Used by {usageCounts[categoryToDelete?.id]} products.
                                                </p>
                                                <div className="flex justify-center gap-4 mt-4">
                                                    <button
                                                        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                                                        onClick={() => setShowDeleteCategoryOverlay(false)}
                                                    >
                                                        No
                                                    </button>
                                                    <button
                                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                                        onClick={confirmCategoryDelete}
                                                    >
                                                        Yes
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {/* Product Delete Confirmation Overlay */}
                                    {showDeleteOverlay && (
                                        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                                            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                                                <h2 className="text-lg font-bold mb-4">
                                                    {addStorageTranslations[language].areyousure}"{deleteProduct?.product_name}"?
                                                </h2>
                                                <div className="flex justify-center gap-4 mt-4">
                                                    <button
                                                        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                                                        onClick={() => setShowDeleteOverlay(false)}
                                                    >
                                                        No
                                                    </button>
                                                    <button
                                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                                        onClick={handleDelete}
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
                            <p className="text-center responsive-btext transition-all duration-300 col-span-4 text-gray-500 absolute">No products available.</p>
                        )}
                    </div>
                )}
            </div>

            {/* Overlay for Add/Edit Item */}
            {showOverlay && (
                <div className="fixed inset-0 bg-black bg-opacity-50 overflow-hidden flex items-center justify-center z-30">
                    <div className="relative bg-white p-4 w-2/3 h-auto rounded-lg shadow-lg space-y-4 max-sm:w-full max-sm:h-auto max-sm:px-2">
                        <FaXmark className="w-5 text-[#4E82E4] absolute top-4 right-4 cursor-pointer" onClick={toggleOverlay}/>
                        <h2 className="text-xl text-[#4E82E4] font-bold text-center">{addStorageTranslations[language].addItem}</h2>
                        <form className="space-y-4" onSubmit={handleSubmit}>
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
                                    required
                                    className="w-full"
                                    type="text"
                                    value={formData.product_name}
                                    onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                                    placeholder={addStorageTranslations[language].enterProductName}
                                />
                                {submissionErrors.product_name && (
                                    <span className="text-red-500 text-sm">
                                        {submissionErrors.product_name[0]}
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                                    <FaMagnifyingGlass className="text-[#4E82E4] mr-2"/>
                                    <input
                                        name="sku"
                                        className="w-full"
                                        type="text"
                                        value={formData.sku}
                                        onChange={handleChange}
                                        placeholder={addStorageTranslations[language].enterSKU}
                                    />
                                </div>
                                <small className="text-gray-400 text-sm mt-1">SKU usually is provided by supplier</small>
                            </div>
                            {/* Barcode Input */}
                            <div className="flex flex-col">
                                <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                                    <FaBarcode className="text-[#4E82E4] mr-2"/>
                                    <input
                                        required
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
                                        placeholder={addStorageTranslations[language].enterBarcode}
                                    />
                                    {submissionErrors.barcode && (
                                        <span className="text-red-500 text-sm">
                                            {submissionErrors.barcode[0]}
                                        </span>
                                    )}
                                </div>
                                <small className="text-gray-400 text-sm mt-1">{addStorageTranslations[language].max13Digits}</small>
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
                                        <option value="">{addStorageTranslations[language].selectCategory}</option>
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
                                        placeholder={addStorageTranslations[language].addCategory}
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
                                        <IoMdPricetag className="text-[#4E82E4] mr-2"/>
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
                                    <small className="text-gray-400 text-sm mt-1">{addStorageTranslations[language].priceHelp}</small>
                                </div>
                                <div className="flex flex-col w-1/3">
                                    <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                                        <FaBoxesPacking className="text-[#4E82E4] mr-2"/>
                                        <input type="text" className="w-full outline-none" placeholder={addStorageTranslations[language].shelfNumber}
                                               maxLength="3" name="shelf_num" value={formData.shelf_num}
                                               onChange={handleChange}/>
                                    </div>
                                    <small className="text-gray-400 text-sm mt-1">{addStorageTranslations[language].max3Symbols}</small>
                                </div>
                                <div className="flex flex-col w-1/3">
                                    <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                                        <FaBoxesPacking className="text-[#4E82E4] mr-2"/>
                                        <input type="text" className="w-full outline-none"
                                               placeholder={addStorageTranslations[language].storageShelfNumber}
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
                                    <input type="text" className="w-full outline-none" placeholder={addStorageTranslations[language].amountInStorage}
                                           maxLength="3"
                                           name="quantity_in_storage"
                                           value={formData.quantity_in_storage} onChange={handleChange}/>
                                </div>
                                <small className="text-gray-400 text-sm mt-1">max. 3 symbols</small>
                            </div>
                            <div className="flex flex-col">
                                <div
                                    className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                                    <FaStore className="text-[#4E82E4] mr-2"/>
                                    <input
                                        type="number"
                                        min="1"
                                        required
                                        className="w-full outline-none"
                                        placeholder={addStorageTranslations[language].inputshouldbe}
                                        name="should_be"
                                        value={formData.should_be}
                                        onChange={(e) => {
                                            const val = Math.max(1, parseInt(e.target.value) || 1);
                                            setFormData({...formData, should_be: val.toString()});
                                        }}
                                    />
                                </div>
                                <small className="text-gray-400 text-sm mt-1">Minimum required on sales floor</small>
                            </div>
                            {Object.keys(submissionErrors).length > 0 && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                    {Object.entries(submissionErrors).map(([field, messages]) => (
                                        <p key={field}>{messages[0]}</p>
                                    ))}
                                </div>
                            )}
                            <button
                                type="submit"
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
            {showManageCategories && (
                <div className="fixed inset-0 bg-black bg-opacity-50 overflow-hidden flex items-center justify-center z-20">
                    <div className="bg-white w-1/3 p-3 rounded-lg min-w-[300px] transition-all duration-300">
                        <div className="flex flex-row mb-4 justify-between items-center">
                        <h2 className="text-xl font-bold">{addStorageTranslations[language].deletecategories}</h2>
                        <FaXmark className="w-5 text-[#4E82E4] cursor-pointer" onClick={closeAllCategoryOverlays}/>
                        </div>
                        <ul className="space-y-2 max-h-80 overflow-y-scroll">
                            {categories.map(cat => (
                                <li key={cat.id} className="flex justify-between items-center">
                                    <div className="flex w-2/3">
                                    <span className="font-semibold w-1/3 max-md:w-1/2"> {cat.category}</span>
                                    <span className="text-gray-400">{addStorageTranslations[language].usedby} {usageCounts[cat.id]}</span>
                                    </div>
                                    <button
                                        className="text-red-500 hover:underline"
                                        onClick={() => handleCategoryDelete(cat)}
                                    >
                                        {addStorageTranslations[language].delete}
                                    </button>
                                </li>
                            ))}
                        </ul>
                            <button
                                className="bg-blue-500 text-white w-full py-2 rounded mt-4 transition-all font-semibold duration-300 hover:bg-[#6a9aec]"
                                onClick={openAssignOverlay}
                            >
                                {addStorageTranslations[language].assigncategories}
                            </button>
                    </div>
                </div>
            )}
            {showAssignCategories && renderAssignCategoriesOverlay()}
        </div>
    );
};

export default AddStorage;