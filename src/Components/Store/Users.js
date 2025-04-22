import React, { useEffect, useState } from "react";
import { useAuth } from "../Authentification/AuthContext"; // Import auth context
import axios from "axios";
import Sidebar from '../../Sidebar';
import {
  FaHouse,
  FaInfo,
  FaBoxesStacked,
  FaUsers,
  FaPen,
  FaDollarSign,
  FaCheck,
  FaXmark,
  FaLock,
  FaUser,
  FaRegTrashCan
} from 'react-icons/fa6';
import {useNavigate} from "react-router-dom";
import {FaHome} from "react-icons/fa";
const Users = () => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const navigate = useNavigate();
  const { authToken } = useAuth(); // Get auth token
  const { user } = useAuth(); // Get logged-in user
  const [workers, setWorkers] = useState([]); // Store workers
  const [formData, setFormData] = useState({ // Store worker form data
    name: "",
    lastname: "",
    age: "",
    address: "",
    salary: "",
    position: "",
    username: "",
    password: "",
  });
  const [store, setStore] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [selectedWorkerId, setSelectedWorkerId] = useState(null);

  const toggleOverlay = () => {
    setShowOverlay(!showOverlay);
  };
  const handleDoneClick = () => {
    setIsDone(true); // Start animation

    setTimeout(() => {
      navigate('/storestatus'); // Redirect after 2 seconds
    }, 2000);
  };
  const fetchWorkers = async () => {
    if (!user.store_id) {
      console.error("Store ID is missing!");
      return;
    }

    try {
      const response = await axios.get(`https://stocksmart.xyz/api/workers?store_id=${user.store_id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (Array.isArray(response.data)) {
        setWorkers(response.data); // Store fetched workers
      } else {
        console.warn("Unexpected API response:", response.data);
        setWorkers([]);
      }
    } catch (error) {
      console.error("Error fetching workers:", error.response ? error.response.data : error);
    }
  };
  useEffect(() => {
    fetchWorkers();
  }, [authToken]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user.store_id) {
      console.error("Store ID is missing!");
      return;
    }

    try {
      console.log("Submitting worker data:", formData); // Debugging

      let response;
      if (editMode) {
        response = await axios.put(`https://stocksmart.xyz/api/workers/${selectedWorkerId}`, {
          ...formData,
          store_id: user.store_id,
        }, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
      } else {
        response = await axios.post("https://stocksmart.xyz/api/workers", {
          ...formData,
          store_id: user.store_id,
        }, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
      }

      console.log("Worker saved:", response.data);

      setShowOverlay(false); // Close overlay
      fetchWorkers(); // Refresh workers list
      setFormData({ // Reset form
        name: "",
        lastname: "",
        age: "",
        address: "",
        salary: "",
        position: "",
        username: "",
        password: "",
      });
      setEditMode(false);
      setSelectedWorkerId(null);
    } catch (error) {
      console.error("Error saving worker:", error.response ? error.response.data : error);
    }
  };
  const handleEdit = (worker) => {
    setFormData({
      name: worker.name,
      lastname: worker.lastname,
      age: worker.age,
      address: worker.address,
      salary: worker.salary,
      position: worker.position,
      username: worker.username,
      password: "", // Don't prefill password
    });
    setSelectedWorkerId(worker.id);
    setEditMode(true);
    setShowOverlay(true);
  };

  const handleDelete = async (workerId) => {
    try {
      await axios.delete(`https://stocksmart.xyz/api/workers/${workerId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      fetchWorkers(); // Refresh list
    } catch (error) {
      console.error("Error deleting worker:", error.response ? error.response.data : error);
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
        setStore(response.data); // Store the fetched store data here
        console.log("Fetched store data:", response.data);
      } catch (error) {
        console.error("Error fetching store data:", error);
      }
    };
    getStoreInfo();
  }, [authToken, user.store_id]);
  return (
      <div className="ml-[16.67%] flex h-screen justify-center w-5/6 max-sm:w-full max-sm:ml-0">
        {/* Sidebar */}
        <Sidebar storeName={store.storename} employeeName={user.name}/>
        {/* Main Content */}
        <div
            className="bg-[#f8fafe] p-10 mt-24 h-[80vh] flex w-full flex-col items-center max-sm:p-0 max-sm:ml-0">
          <button
              className="bg-[#4E82E4] py-2 px-9 right-5 top-5 absolute text-white font-semibold rounded-lg hover:bg-[#6a9aec] transition-all hover:scale-110 max-sm:absolute max-sm:top-[95%] max-sm:w-11/12 max-sm:left-5 max-sm:right-0"
              onClick={handleDoneClick}
          >
            Done/Skip
          </button>
          {/* Progress Bar */}
          <div className="flex justify-center w-1/2 absolute top-[5%] items-center max-sm:justify-evenly max-sm:w-full">
            <div className="flex w-1/6 h-full flex-col justify-center items-center">
              <div
                  className="flex flex-col items-center z-20 bg-[#4E82E4] h-[50px] w-1/2 max-sm:w-full rounded-full p-3">
                <FaCheck className="text-white size-full"/>
              </div>
              <span className="text-lg font-teko text-[#DF9677] max-sm:hidden">Store info</span>
            </div>
            <div className="w-[10%] h-[7px] bg-[#4E82E4] mb-6 -mx-12 flex justify-start items-center max-sm:mb-0">
            </div>
            <div className="flex w-1/6 h-full flex-col justify-center items-center">
              <div
                  className="flex flex-col items-center z-20 bg-[#4E82E4] h-[50px] w-1/2 max-sm:w-full rounded-full p-3">
                <FaCheck className="text-white size-full"/>
              </div>
              <span className="text-lg font-teko text-[#DF9677] max-sm:hidden">Store info</span>
            </div>
            <div
                className="w-[10%] h-[7px] bg-gray-300 mb-6 -mx-12 flex justify-start items-center max-sm:mb-0">
              <div className="progress-bar"></div>
            </div>
            <div className="flex w-1/6 h-full flex-col justify-center items-center">
              <div
                  className={`flex flex-col items-center bg-gray-300 z-20 h-[50px] w-1/2 max-sm:w-full rounded-full p-3 scale-up-animation 
                  ${isDone ? 'done' : ''}`}>

                {/* Old icon fades out, new icon fades in */}
                <FaUsers
                    className={`text-white size-full ${isDone ? 'icon-fade-out absolute bottom-[0%] scale-50' : ''}`}/>
                <FaCheck className={`text-white size-full ${isDone ? 'icon-fade-in' : 'hidden'}`}/>
              </div>
              <span className="text-lg font-teko text-[#DF9677] max-sm:hidden">Add storage</span>
            </div>
          </div>
          {/* Middle Container - Plates */}
          <div
              className="w-full min-h-12 grid grid-cols-6 gap-4 p-5 max-sm:grid-cols-2 max-sm:min-h-[250px] max-sm:p-2 max-sm:gap-2">
            {/* Add Item Plate */}
            <div
                className="border border-gray-300 max-sm:h-full max-h-[352px] bg-white shadow-lg rounded-lg p-4 flex flex-col items-center justify-center shadow-[#4E82E4] hover:bg-blue-50 cursor-pointer"
                onClick={toggleOverlay}
            >
              <h1 className="w-20 h-20 text-7xl font-light mb-4 rounded-full flex justify-center items-center">+</h1>
              <span className="text-lg font-bold">Add Worker</span>
            </div>

            {workers.length > 0 ? (
                workers.map((worker) => (
                    <div key={worker.id}
                         className="border border-gray-300 max-h-[352px] h-full w-full bg-white shadow-lg rounded-lg p-2 flex justify-evenly items-center flex-col max-sm:flex-wrap max-sm:h-full max-sm:p-1">
                      <p className="text-center text-lg font-bold">{worker.name} {worker.lastname}</p>
                      <p className="text-center text-sm">Position: {worker.position}</p>
                      <p className="text-center text-sm">Age: {worker.age}</p>
                      <p className="text-center text-sm">${worker.salary} p/h</p>
                      <div className="flex justify-around mt-4">
                        <button className="bg-[#4E82E4] text-white py-3 px-3 mr-1 rounded-lg hover:bg-[#6a9aec]"
                                onClick={() => {
                                  setEditMode(true);
                                  setSelectedWorkerId(worker.id);
                                  setFormData({
                                    name: worker.name,
                                    lastname: worker.lastname,
                                    age: worker.age,
                                    address: worker.address,
                                    salary: worker.salary,
                                    position: worker.position,
                                    username: worker.username || "", // Handle optional username
                                    password: "", // Leave password blank
                                  });
                                  setShowOverlay(true);
                                }}>
                          <FaPen/>
                        </button>
                        <button className="bg-[#DF9677] text-white py-3 px-3 ml-1 rounded-lg hover:bg-red-600"
                                onClick={async () => {
                                  if (window.confirm(`Are you sure you want to delete ${worker.name}?`)) {
                                    try {
                                      await axios.delete(`https://stocksmart.xyz/api/workers/${worker.id}`, {
                                        headers: { Authorization: `Bearer ${authToken}` },
                                      });
                                      fetchWorkers(); // Refresh workers list
                                    } catch (error) {
                                      console.error("Error deleting worker:", error.response ? error.response.data : error);
                                    }
                                  }
                                }}>
                          <FaRegTrashCan/>
                        </button>
                      </div>
                    </div>
                ))
            ) : (
                <p className="col-span-6 absolute top-1/2 right-1/3 text-center text-gray-500 text-lg">No workers found for this store.</p>
            )}
          </div>
        </div>
        {/* Overlay */}
        {showOverlay && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div
                  className="relative bg-white p-8 w-1/3 h-3/7 rounded-lg shadow-lg space-y-4 max-sm:p-4 max-sm:w-11/12 max-sm:rounded-md">
                <FaXmark className="w-5 text-[#4E82E4] absolute top-4 right-4 cursor-pointer" onClick={toggleOverlay}/>
                <h2 className="text-xl text-[#4E82E4] font-bold text-center">Add new worker</h2>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4 max-sm:space-y-3 max-sm:w-full">
                  {/* Name Input */}
                  <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                    <FaInfo className="text-[#4E82E4] mr-2"/>
                    <input
                        type="text"
                        className="w-full outline-none"
                        placeholder="First Name"
                        value={formData.name}  // Bind input value to formData
                        onChange={(e) => setFormData({...formData, name: e.target.value})}  // Update formData
                    />
                  </div>

                  <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                    <FaInfo className="text-[#4E82E4] mr-2"/>
                    <input
                        type="text"
                        className="w-full outline-none"
                        placeholder="Last Name"
                        value={formData.lastname}  // Bind input value to formData
                        onChange={(e) => setFormData({...formData, lastname: e.target.value})}  // Update formData
                    />
                  </div>

                  <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                    <FaInfo className="text-[#4E82E4] mr-2"/>
                    <input
                        type="number"
                        className="w-full outline-none"
                        placeholder="Age"
                        value={formData.age}  // Bind input value to formData
                        onChange={(e) => setFormData({...formData, age: e.target.value})}  // Update formData
                    />
                  </div>

                  <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                    <FaHome className="text-[#4E82E4] mr-2"/>
                    <input
                        type="text"
                        className="w-full outline-none"
                        placeholder="Address"
                        value={formData.address}  // Bind input value to formData
                        onChange={(e) => setFormData({...formData, address: e.target.value})}  // Update formData
                    />
                  </div>

                  <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                    <FaDollarSign className="text-[#4E82E4] mr-2"/>
                    <input
                        type="number"
                        className="w-full outline-none"
                        placeholder="Salary"
                        value={formData.salary}  // Bind input value to formData
                        onChange={(e) => setFormData({...formData, salary: e.target.value})}  // Update formData
                    />
                  </div>

                  <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                    <FaPen className="text-[#4E82E4] mr-2"/>
                    <input
                        type="text"
                        className="w-full outline-none"
                        placeholder="Position"
                        value={formData.position}  // Bind input value to formData
                        onChange={(e) => setFormData({...formData, position: e.target.value})}  // Update formData
                    />
                  </div>
                  <div className="w-full h-10 flex">
                    <div className="h-full w-2/6 flex items-center">
                      <div className="w-full h-0.5 bg-[#DF9677]"></div>
                    </div>
                    <div className="h-full w-3/6 flex justify-center items-center max-sm:full">
                      <p className="text-[#DF9677] font-semibold max-sm:text-xs">CREATE USER (OPTIONAL)</p>
                    </div>
                    <div className="h-full w-2/6 flex items-center">
                      <div className="w-full h-0.5 bg-[#DF9677]"></div>
                    </div>
                  </div>
                  <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                    <FaUser className="text-[#4E82E4] mr-2"/>
                    <input
                        type="text"
                        className="w-full outline-none"
                        placeholder="Username"
                        value={formData.username}  // Bind input value to formData
                        onChange={(e) => setFormData({...formData, username: e.target.value})}  // Update formData
                    />
                  </div>

                  <div className="flex items-center border border-gray-300 bg-white rounded w-full py-2 px-3">
                    <FaLock className="text-[#4E82E4] mr-2"/>
                    <input
                        type="password"
                        className="w-full outline-none"
                        placeholder="Password"
                        value={formData.password}  // Bind input value to formData
                        onChange={(e) => setFormData({...formData, password: e.target.value})}  // Update formData
                    />
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

export default Users;
