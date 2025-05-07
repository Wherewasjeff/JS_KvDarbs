import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from "../Authentification/AuthContext";
import Sidebar from '../../Sidebar';
import {addStorageTranslations, replenishTranslations} from '../TranslationContext';
import '../../App.css';
import {
    FaBoxesStacked,
    FaStore,
    FaBox,
    FaMagnifyingGlass,
    FaCircleExclamation,
    FaXmark
} from 'react-icons/fa6';
import {FaExclamationCircle, FaQuestionCircle} from 'react-icons/fa';
import {CgDisplayFullwidth, CgInbox} from "react-icons/cg";
import { CgSpinnerAlt } from "react-icons/cg";

const Replenishment = () => {
    const { authToken } = useAuth();
    const { user } = useAuth();
    const [store, setStore] = useState({});
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [language, setLanguage] = useState(localStorage.getItem("language") || "en");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [sortOption, setSortOption] = useState("");
    const [showReplenishOverlay, setShowReplenishOverlay] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [replenishAmount, setReplenishAmount] = useState("");
    const [returnAmount,    setReturnAmount]    = useState("");
    const [replenishError,  setReplenishError]  = useState("");
    const [returnError,     setReturnError]     = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);


    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("https://stocksmart.xyz/api/storage", {
                    params: { store_id: user.store_id },
                });

                if (response.data.success) {
                    setProducts(response.data.data.map(p => ({
                        ...p,
                        quantity_in_storage: parseInt(p.quantity_in_storage),
                        quantity_in_salesfloor: parseInt(p.quantity_in_salesfloor)
                    })));
                }
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching products:", error);
                setIsLoading(false);
            }
        };

        if (user?.store_id) fetchProducts();
    }, [user?.store_id]);

    useEffect(() => {
        const getStoreInfo = async () => {
            if (!authToken || !user?.store_id) return;

            try {
                const response = await axios.get(
                    `https://stocksmart.xyz/api/show/${user.store_id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                        },
                    }
                );
                setStore(response.data);
            } catch (error) {
                console.error("Error fetching store data:", error);
            }
        };

        getStoreInfo();
    }, [authToken, user?.store_id])

    // Search debounce
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Sorting logic
    const sortedProducts = [...products].sort((a, b) => {
        switch(sortOption) {
            case "storage_high": return b.quantity_in_storage - a.quantity_in_storage;
            case "storage_low": return a.quantity_in_storage - b.quantity_in_storage;
            case "salesfloor_low": return a.quantity_in_salesfloor - b.quantity_in_salesfloor;
            case "salesfloor_high": return b.quantity_in_salesfloor - a.quantity_in_salesfloor;
            default: return 0;
        }
    });

    // Filtered products
    const filteredProducts = sortedProducts.filter(product =>
        product.product_name.toLowerCase().includes(debouncedQuery.toLowerCase())
    );

    const handleReplenish = async () => {
        if (!selectedProduct || !replenishAmount) return;
        const amount = parseInt(replenishAmount);

        // Add validation
        if (isNaN(amount)) {
            setReplenishError(replenishTranslations[language]?.invalidAmount
                || "Please enter a valid number");
            return;
        }

        if (amount > selectedProduct.quantity_in_storage) {
            setReplenishError(replenishTranslations[language]?.insufficientStock
                || "Not enough stock in storage");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await axios.post(
                `https://stocksmart.xyz/api/replenish/${selectedProduct.id}`,
                { amount: amount },  // Ensure proper parameter name
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                setProducts(prev => prev.map(p => p.id === selectedProduct.id ? {
                    ...p,
                    quantity_in_storage: p.quantity_in_storage - amount,
                    quantity_in_salesfloor: p.quantity_in_salesfloor + amount
                } : p));

                setShowReplenishOverlay(false);
                setReplenishAmount("");
            }
        } catch (error) {
            console.error("Replenishment failed:", error);
            alert(replenishTranslations[language]?.replenishFailed || "Replenishment failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReturn = async () => {
        // clear previous error
        setReturnError("");

        // basic guard
        if (!selectedProduct || !returnAmount) return;

        const amt = parseInt(returnAmount, 10);

        // validate numeric
        if (isNaN(amt)) {
            setReturnError("Please enter a valid number");
            return;
        }

        // validate against salesfloor stock
        if (amt > selectedProduct.quantity_in_salesfloor) {
            setReturnError("Not enough stock on salesfloor");
            return;
        }

        setIsSubmitting(true);

        try {
            const resp = await axios.post(
                `https://stocksmart.xyz/api/return/${selectedProduct.id}`,
                { amount: amt },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (resp.data.success) {
                // update your product list in state
                setProducts(ps =>
                    ps.map(p =>
                        p.id === selectedProduct.id
                            ? {
                                ...p,
                                quantity_in_storage:    p.quantity_in_storage + amt,
                                quantity_in_salesfloor: p.quantity_in_salesfloor - amt,
                            }
                            : p
                    )
                );

                // reset overlay
                setShowReplenishOverlay(false);
                setReturnAmount("");
                setReturnError("");
            } else {
                // handle API-level errors
                setReturnError(resp.data.error || "Could not return stock");
            }
        } catch (err) {
            console.error("Return failed:", err);
            setReturnError("Could not return stock");
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div className="ml-[16.67%] max-lg:ml-[200px] max-sm:ml-0 flex min-h-screen flex-col">
            <Sidebar storeName={store.storename} employeeName={user.name}/>

            <div className="w-full max-sm:ml-0 flex gap-4 justify-center mt-4 text-sm flex-wrap max-sm:text-xs">
                <div className="flex items-center gap-2 bg-red-100 px-3 py-1.5 rounded-md">
                    <FaExclamationCircle className="text-red-500 scale-150 bg-black max-md:scale-125 max-sm:scale-100 rounded-full"/>
                    {replenishTranslations[language]?.zeroSalesfloor}
                </div>
                <div className="flex items-center gap-2 bg-yellow-100 px-3 py-1.5 rounded-md">
                    <FaQuestionCircle className="text-yellow-500 scale-150 max-md:scale-125 max-sm:scale-100 bg-black rounded-full"/>
                    {replenishTranslations[language]?.exceedSalesfloor}
                </div>
            </div>

            <div
                className="w-full bg-[#f8fafe] p-10 max-xl:p-5 min-h-screen max-sm:w-screen flex flex-col justify-start items-center max-sm:ml-0 max-sm:p-2">
                {/* Search and Sort */}
                <div className="w-full flex justify-between items-center mb-4 flex-wrap max-sm:justify-center">
                    <div
                        className="flex items-center space-x-2 w-full justify-start max-md:flex-wrap max-md:space-x-0 max-md:justify-between max-sm:justify-evenly">
                        <div
                            className="flex items-center border border-gray-300 bg-white rounded w-1/5 py-2 px-3 max-md:w-1/2 max-sm:w-2/5">
                            <FaMagnifyingGlass className="mr-2 text-[#DF9677]"/>
                            <input
                                type="text"
                                className="w-full outline-none"
                                placeholder={replenishTranslations[language]?.searchItems || "Search products..."}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <select
                            className="border border-gray-300 w-1/5 bg-white rounded py-2 px-3 max-md:w-[46%] max-sm:w-2/5"
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                        >
                            <option value="">{replenishTranslations[language]?.sortBy || "Sort By"}</option>
                            <option
                                value="storage_high">{replenishTranslations[language]?.storageHigh || "Storage High"}</option>
                            <option
                                value="storage_low">{replenishTranslations[language]?.storageLow || "Storage Low"}</option>
                            <option
                                value="salesfloor_high">{replenishTranslations[language]?.salesfloorHigh || "Salesfloor High"}</option>
                            <option
                                value="salesfloor_low">{replenishTranslations[language]?.salesfloorLow || "Salesfloor Low"}</option>
                        </select>
                    </div>
                </div>
                {/* Product Grid */}
                {isLoading ? (
                    <div className="w-full grid grid-cols-4 gap-4 max-sm:grid-cols-2 max-md:grid-cols-3 animate-pulse">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
                        ))}
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="w-full grid grid-cols-6 gap-4 max-sm:grid-cols-2 max-md:grid-cols-3 max-xl:grid-cols-4 max-2xl:grid-cols-5">
                        {filteredProducts.map(product => (
                            <div key={product.id}
                                 className="border border-gray-300 bg-white rounded-lg p-4 shadow-sm relative">
                                {/* Status Indicator */}
                                {product.quantity_in_salesfloor === 0 ? (
                                    <FaExclamationCircle
                                        className="absolute -top-1 -right-1 scale-150 text-red-500 bg-black rounded-full ring-2 ring-red-500"/>
                                ) : product.quantity_in_salesfloor > product.should_be ? (
                                    <FaQuestionCircle
                                        className="absolute -top-1 -right-1 scale-150 text-yellow-400 bg-black rounded-full ring-2 ring-yellow-400"/>
                                ) : null}

                                <div className="w-full h-48 mb-4">
                                    <img
                                        src={product.image ? `https://stocksmart.xyz/backend/public/${product.image}` : 'http://stocksmart.xyz/noimage.png'}
                                        alt={product.product_name}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-bold text-lg truncate transition-all">{product.product_name}</h3>
                                    <div className="space-y-1 text-gray-600">
                                        <p className="flex items-center transition-all responsive-text">
                                            <FaBox className="mr-2"/>
                                            {replenishTranslations[language]?.shelfLabel || "Shelf"}: {product.shelf_num || "N/A"}
                                        </p>
                                        <p className="flex items-center transition-all responsive-text">
                                            <CgDisplayFullwidth className="mr-2"/>
                                            {replenishTranslations[language]?.storageNumberLabel || "Storage Location"}: {product.storage_num || "N/A"}
                                        </p>
                                        <p className="flex items-center transition-all responsive-text">
                                            <FaBoxesStacked className="mr-2"/>
                                            {replenishTranslations[language]?.storageLabel || "In Storage"}: {product.quantity_in_storage}
                                        </p>
                                        <p className="flex items-center transition-all responsive-text">
                                            <FaStore className="mr-2"/>
                                            {replenishTranslations[language]?.salesfloorLabel || "On Salesfloor"}: {product.quantity_in_salesfloor}
                                        </p>
                                        <p className={`flex items-center transition-all responsive-text`}>
                                            <CgInbox className="mr-2"/>
                                            {addStorageTranslations[language].shouldbe} : {product.should_be}
                                        </p>
                                    </div>
                                    <button
                                        className="bg-[#4E82E4] w-full text-white py-2 rounded-lg shadow-md hover:bg-[#6a9aec] hover:scale-105 transition-all duration-300"
                                        onClick={() => {
                                            setSelectedProduct(product);
                                            setShowReplenishOverlay(true);
                                        }}
                                    >
                                        {replenishTranslations[language]?.replenish || "Replenish"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-lg">
                        {replenishTranslations[language]?.noProducts || "No products found"}
                    </p>
                )}

                {/* Replenishment Overlay */}
                {showReplenishOverlay && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowReplenishOverlay(false)}>
                        <div className="bg-white p-6 pt-4 rounded-lg w-96" onClick={e => e.stopPropagation()}>
                            <div className="w-full flex mb-4 justify-between items-center">
                            <h2 className="text-xl font-bold flex items-center">
                                {replenishTranslations[language]?.replenish || "Replenish"} {selectedProduct?.product_name}
                            </h2>
                            <FaXmark
                                className="text-[#4E82E4] hover:text-gray-800 scale-110 cursor-pointer"
                                onClick={() => setShowReplenishOverlay(false)}
                            />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1">{replenishTranslations[language]?.replenish || "Replenish"} (max {selectedProduct.quantity_in_storage})</label>
                                <input
                                    type="number"
                                    inputMode="numeric"
                                    min="1"
                                    max={selectedProduct.quantity_in_storage}
                                    className="w-full border p-2 rounded"
                                    value={replenishAmount}
                                    onChange={e => setReplenishAmount(e.target.value)}
                                />
                                {replenishError && (
                                    <p className="mt-1 text-sm text-red-500">{replenishError}</p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1">{replenishTranslations[language]?.returntostorage || "Return to storage"} (max {selectedProduct.quantity_in_salesfloor})</label>
                                <input
                                    type="number"
                                    inputMode="numeric"
                                    min="1"
                                    max={selectedProduct.quantity_in_salesfloor}
                                    className="w-full border p-2 rounded"
                                    value={returnAmount}
                                    onChange={e => setReturnAmount(e.target.value)}
                                />
                                {returnError && (
                                    <p className="mt-1 text-sm text-red-500">{returnError}</p>
                                )}
                            </div>
                            <div className="flex justify-end gap-4">
                                <button
                                    className="px-4 py-2 bg-[#4E82E4] hover:bg-[#DA8460] duration-300 transition-all text-white rounded disabled:opacity-20 disabled:cursor-not-allowed"
                                    disabled={isSubmitting || !replenishAmount}
                                    onClick={handleReplenish}
                                >
                                    {replenishTranslations[language]?.replenish || "Replenish"}
                                </button>
                                <button
                                    className="px-4 py-2 bg-[#4E82E4] hover:bg-[#DA8460] duration-300 transition-all text-white rounded disabled:opacity-20 disabled:cursor-not-allowed"
                                    disabled={isSubmitting || !returnAmount}
                                    onClick={handleReturn}
                                >
                                    {replenishTranslations[language]?.returntostorage || "Return to storage"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Replenishment;