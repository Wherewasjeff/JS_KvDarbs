import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../Authentification/AuthContext';
import Sidebar from '../../Sidebar';
import { CgSpinnerAlt } from 'react-icons/cg';
import { FaMagnifyingGlass, FaSortDown, FaSortUp, FaCalendarDays, FaTruck } from 'react-icons/fa6';
import { FaXmark } from 'react-icons/fa6';
import '../../App.css';
import { useTranslation, lowstockTranslations } from '../TranslationContext';

const LowStock = () => {
  const { authToken, user } = useAuth();
  const { language } = useTranslation();
  const t = lowstockTranslations[language] || lowstockTranslations.en;
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [sortAsc, setSortAsc] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // shipments
  const [shipments, setShipments] = useState([]);
  const [showShipmentsOverlay, setShowShipmentsOverlay] = useState(false);
  const [showScheduleOverlay, setShowScheduleOverlay] = useState(false);
  const [scheduleProducts, setScheduleProducts] = useState([]);
  const [scheduleDate, setScheduleDate] = useState('');
  const [immediate, setImmediate] = useState(false);
  const [shipAmount, setShipAmount] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [scheduleError, setScheduleError] = useState("");
  const [shipmentToDelete, setShipmentToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [store, setStore] = useState({});

  const confirmDelete = async () => {
    try {
      await axios.delete(
          `https://stocksmart.xyz/api/shipments/by-date/${shipmentToDelete.shipment_date}`,  { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setShowDeleteConfirm(false);
      setShipmentToDelete(null);
      setShowShipmentsOverlay(false);
      fetchShipments();
    } catch (err) {
    console.error("Failed to delete shipment:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchShipments();
  }, []);

  useEffect(() => {
    if (!authToken || !user?.store_id) return;
    axios.get(
        `https://stocksmart.xyz/api/show/${user.store_id}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
        )
    .then(res => setStore(res.data))
    .catch(err => console.error("Error fetching store info:", err));
  }, [authToken, user.store_id]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('https://stocksmart.xyz/api/storage', {
        params: { store_id: user.store_id },
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if(res.data.success) setProducts(res.data.data);
    } catch (e) {
      console.error(e);
    } finally { setIsLoading(false); }
  };

  const fetchShipments = async () => {
    try {
      const res = await axios.get('https://stocksmart.xyz/api/shipments', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setShipments(res.data);
    } catch(e) { console.error(e); }
  };

  const filtered = products
      .filter(p => p.product_name.toLowerCase().includes(search.toLowerCase()));
  const sorted = filtered.sort((a,b) => sortAsc
      ? a.quantity_in_storage - b.quantity_in_storage
      : b.quantity_in_storage - a.quantity_in_storage
  );

  const sortedDates = shipments
      .map(s => s.shipment_date)    // get all dates (including null)
      .filter(Boolean)              // drop null/empty
      .sort();                      // ISO strings sort chronologically
  const nextShipmentDate = sortedDates.length
      ? sortedDates[0]
      : '—';

  // schedule shipment for selected low-stock products
  const openSchedule = (product) => {
    setSelectedProduct(product);
    setShipAmount("");        // reset amount input
    setScheduleDate("");      // reset date
    setImmediate(false);
    setScheduleError("");
    setShowScheduleOverlay(true);
  };

  const submitSchedule = async () => {
    setScheduleError("");

    // Validate product selected
    if (!selectedProduct) {
      setScheduleError("No product selected");
      return;
    }

    // Validate amount
    const amt = parseInt(shipAmount, 10);
    if (isNaN(amt) || amt < 1) {
      setScheduleError("Enter a valid quantity to ship");
      return;
    }

// 1) If not immediate, user must pick a date
    if (!immediate && !scheduleDate) {
      setScheduleError('Please select a shipment date or "Immediately"');
      return;
    }

// 2) If not immediate, now validate the chosen date
    if (!immediate) {
      const today    = new Date().toISOString().split('T')[0];
      const max      = new Date();
      max.setDate(max.getDate() + 365);
      const maxString = max.toISOString().split('T')[0];

      if (scheduleDate <= today) {
        setScheduleError("Shipment date cannot be in the past or today");
        return;
      }
      if (scheduleDate > maxString) {
        setScheduleError("Shipment date cannot be more than one year ahead");
        return;
      }
    }

    try {
      await axios.post(
          "https://stocksmart.xyz/api/shipments",
          {
            shipment_date: immediate ? null : scheduleDate,
            products: [
              { id: selectedProduct.id, amount: amt }
            ]
          },
          { headers: { Authorization: `Bearer ${authToken}` } }
      );

      setShowScheduleOverlay(false);
      fetchShipments();
      fetchProducts();
    } catch (err) {
      if (err.response?.status === 422) {
        const msgs = Object.values(err.response.data.errors || {}).flat();
        setScheduleError(msgs.join(" "));
      } else {
        console.error(err);
        setScheduleError("An unexpected error occurred");
      }
    }
  };

  return (
      <div className="ml-[16.67%] max-sm:ml-0 flex min-h-screen flex-col">
        <Sidebar storeName={store.storename || user.storeName} employeeName={user.name} />
        <div className="w-full p-8 max-sm:p-4">
          {/*Top content*/}
          <div className="w-full flex max-sm:mt-12 max-md:flex-wrap justify-between items-center mb-4 max-md:justify-center">
            <div
                className="flex items-center space-x-2 w-full justify-start
               max-md:flex-wrap max-md:space-x-0 max-md:justify-between
               max-sm:justify-evenly"
            >
              <div
                  className="flex items-center border border-gray-300 bg-white
                 rounded w-1/5 py-2 px-3 max-md:w-1/2 max-sm:w-1/2"
              >
                <FaMagnifyingGlass className="mr-2 text-[#DF9677]"/>
                <input
                type="text"
                className="w-full outline-none"
                placeholder={t.searchPlaceholder}
                value={search}
                onChange={e => setSearch(e.target.value)}
                />
              </div>
              <select
                  className="border border-gray-300 w-1/5 bg-white rounded
                 py-2 px-3 max-md:w-[46%] max-sm:w-1/2"
                  value={sortAsc ? 'asc' : 'desc'}
                  onChange={e => setSortAsc(e.target.value === 'asc')}
              >
                <option value="">{t.sortByLabel}</option>
                <option value="asc">{t.sortAsc}</option>
                <option value="desc">{t.sortDesc}</option>
              </select>
            </div>
            <div className="flex items-center max-md:justify-evenly space-x-4 max-md:mt-2 max-md:w-full">
              <button
                  className="flex items-center px-2 py-1 bg-[#4E82E4] max-sm:w-1/2 hover:bg-blue-600 transition-all duration-300 text-white rounded"
                  onClick={() => setShowShipmentsOverlay(true)}
              >
                <FaTruck className="w-1/3"/>
                <p>{t.upcomingShipments}</p>
              </button>
              <div className="flex flex-col w-1/2 max-sm:w-1/2">
              <span className="text-gray-700 flex-col flex font-semibold justify-center items-center">
      {t.closestLabel}
                <div className="font-light" > {nextShipmentDate}</div>
    </span>
              </div>
            </div>
        </div>


        {/* Product List */}
        {isLoading ? (
            <CgSpinnerAlt className="animate-spin text-3xl"/>
        ) : (
            <ul className="space-y-2">
              {sorted.map(p => (
                  <li key={p.id} className="flex items-center justify-between border p-2 rounded">
                    <div className="flex items-center space-x-4">
                    <img src={p.image ? `https://stocksmart.xyz/backend/public/${p.image}` : 'noimage.png'}
                             alt={p.product_name} className="w-16 h-16 rounded-lg object-cover"/>
                        <div>
                          <div className="font-bold">{p.product_name}</div>
                          <div>{t.instorage}{p.quantity_in_storage}</div>
                          <div className="text-sm text-gray-600">{t.nextshipments} {p.next_shipments?.join(', ') || t.none }</div>
                        </div>
                      </div>
                      <button className="bg-[#4E82E4] hover:bg-blue-600 transition-all duration-300 text-white px-3 py-1 rounded" onClick={() => openSchedule(p)}>{t.scheduleButton}</button>
                    </li>
                ))}
              </ul>
          )}

          {/* Shipments Overlay */}
          {showShipmentsOverlay && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                   onClick={() => setShowShipmentsOverlay(false)}>
                <div className="bg-white p-6 rounded w-96 relative" onClick={e => e.stopPropagation()}>
                  <FaXmark className="absolute top-2 right-2 cursor-pointer"
                           onClick={() => setShowShipmentsOverlay(false)}/>
                  <h2 className="text-xl font-bold mb-4">{t.upcomingShipments}</h2>
                  <ul className="space-y-2 max-h-64 overflow-y-auto">
                    {(() => {
                      // 1) filter to dated shipments, 2) group by date, merging products arrays
                      const groups = shipments
                          .filter(s => s.shipment_date)
                          .reduce((acc, s) => {
                            if (!acc[s.shipment_date]) acc[s.shipment_date] = [];
                            // each s.products has {product_name, amount}
                            acc[s.shipment_date].push(...s.products);
                            return acc;
                          }, {});

                      // 3) render one <li> per date, combining products
                      return Object.entries(groups).map(([date, prods]) => (
                          <li key={date} className="flex justify-between items-start border p-2 rounded">
                            <div>
                              <div className="font-semibold">{date}</div>
                              <div className="text-sm">
                                Products:&nbsp;
                                {prods
                                    .map((pr, i) => `${pr.product_name} (${pr.amount})`)
                                    .join('; ')
                                }
                              </div>
                            </div>
                            <button
                                className="text-red-500 hover:underline"
                                onClick={() => {
                                  // now date is the group key, reuse your delete flow if needed
                                  setShipmentToDelete({shipment_date: date});
                                  setShowDeleteConfirm(true);
                                }}
                            >
                              {t.cancelButton}
                            </button>
                          </li>
                      ));
                    })()}
                  </ul>
                </div>
              </div>
          )}

          {showDeleteConfirm && (
              <div
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                  onClick={() => setShowDeleteConfirm(false)}
              >
                <div
                    className="bg-white p-6 rounded-lg w-80"
                    onClick={e => e.stopPropagation()}
                >
                  <p className="mb-4">
                    {t.deleteShipmentConfirm}{" "}
                    <strong>{shipmentToDelete?.shipment_date}</strong>?
                  </p>
                  <div className="flex justify-end space-x-2">
                    <button
                        className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                        onClick={() => setShowDeleteConfirm(false)}
                    >
                      {t.cancelButton}
                    </button>
                    <button
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        onClick={confirmDelete}
                    >
                      {t.saveButton}
                    </button>
                  </div>
                </div>
              </div>
          )}

          {/* Schedule Overlay */}
          {showScheduleOverlay && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                   onClick={() => setShowScheduleOverlay(false)}>
                <div className="bg-white p-6 rounded w-96 relative" onClick={e => e.stopPropagation()}>
                  <FaXmark className="absolute top-2 right-2 cursor-pointer"
                           onClick={() => setShowScheduleOverlay(false)}/>
                  <h2 className="text-xl font-bold mb-4">{t.scheduleTitle} {selectedProduct?.product_name}</h2>
                  <div className="mb-4">
                    <label className="block mb-1 font-medium">{t.amountLabel}</label>
                    <input
                        type="number"
                        min="1"
                        className="w-full border p-2 rounded"
                        value={shipAmount}
                        onChange={e => setShipAmount(e.target.value)}
                        placeholder="Enter quantity"
                    />
                  </div>
                  <div className="flex items-center mb-2 mt-4  space-x-2">
                    <label>
                      <input type="checkbox" checked={immediate} onChange={() => setImmediate(!immediate)}/>{t.immediatelyLabel}
                    </label>
                  </div>
                  {!immediate && (
                      <input
                          type="date"
                          className="border p-2 rounded w-full mb-4"
                          value={scheduleDate}
                          onChange={e => setScheduleDate(e.target.value)}
                      />
                  )}
                  <button
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                      onClick={submitSchedule}
                  >
                    {t.saveButton}
                  </button>
                  {scheduleError && (
                      <p className="text-red-500 mb-2">{scheduleError}</p>
                  )}
                </div>
              </div>
          )}
        </div>
      </div>
  );
};

export default LowStock;