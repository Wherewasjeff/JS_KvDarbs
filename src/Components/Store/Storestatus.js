import React, { useEffect, useState } from 'react';
import Sidebar from '../../Sidebar';
import { useAuth } from "../Authentification/AuthContext";
import {
    FaChevronLeft,
    FaChevronRight,
    FaPen,
    FaXmark,
    FaStore,
    FaMapPin,
    FaBoxesStacked,
    FaTags,
    FaCalendarDays,
    FaCalendar
} from 'react-icons/fa6';
import '../../App.css';
import { CgSpinnerAlt } from "react-icons/cg";
import axios from "axios";
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { statusTranslations, useTranslation } from "../TranslationContext";
const logoUrl = process.env.PUBLIC_URL + '/Fulllogobw.png';
const Storestatus = () => {
    const { user, authToken } = useAuth();
    const { language, switchLanguage } = useTranslation();
    const translations = statusTranslations[language] || statusTranslations.en;
    const [savingHours, setSavingHours] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [selectedDate, setSelectedDate] = useState(null);
    const [workingHours, setWorkingHours] = useState({});
    const [store, setStore] = useState({});
    const [userData, setUserData] = useState(null);
    const [isManageHoursOverlayVisible, setIsManageHoursOverlayVisible] = useState(false);
    const [selectedDay, setSelectedDay] = useState('');
    const [isMilitary, setIsMilitary] = useState(true);
    const [updatedDays, setUpdatedDays] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [customOverrides, setCustomOverrides] = useState({});
    const [isIncomeOverlayVisible, setIsIncomeOverlayVisible] = useState(false);
    const [incomeData, setIncomeData] = useState({dates: [], cashiers: [], data: {}, totals: { byCashier: {}, byDate: {}, monthTotal: 0}
    });
    const [isLoadingIncome, setIsLoadingIncome] = useState(false);
    const curr   = localStorage.getItem('currency') || 'USD';
    const symbol = {
        USD: '$',
        EUR: '€',
        GBP: '£'
    }[curr] || '$';
    const [weekStartsOn, setWeekStartsOn] = useState(
        localStorage.getItem('weekStartsOn') || 'Sunday'
    );
    const handleWeekStartChange = (day) => {
        setWeekStartsOn(day);
        localStorage.setItem('weekStartsOn', day);
    };
    const fetchIncome = async () => {
        setIsLoadingIncome(true);
        try {
            // 1) Fetch all sales for this store
            const { data: allSalesRaw } = await axios.get(
                'https://stocksmart.xyz/api/sales',
                {
                    params: { store_id: store.id },
                    headers: { Authorization: `Bearer ${authToken}` }
                }
            );

            // 2) Keep only the current month/year
            const allSales = allSalesRaw.filter(s => {
                const d = new Date(s.date);
                return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
            });

            // 3) Build unique, sorted date list
            const dates = Array.from(new Set(allSales.map(s => s.date))).sort();

            // 4) Build unique cashier list
            const cashiers = Array.from(new Set(allSales.map(s => s.seller_name)))
                .map(name => ({ id: name, name }));

            // 5) Prepare containers
            const data = {}, totalsByCashier = {}, totalsByDate = {};
            cashiers.forEach(c => {
                data[c.id] = {};
                totalsByCashier[c.id] = 0;
                dates.forEach(d => data[c.id][d] = 0);
            });
            dates.forEach(d => totalsByDate[d] = 0);

            // 6) Aggregate per-day and per-cashier
            allSales.forEach(s => {
                const key = s.seller_name, day = s.date;
                const amount = s.sold * parseFloat(s.price);
                data[key][day] += amount;
                totalsByCashier[key] += amount;
                totalsByDate[day] += amount;
            });

            // 7) Compute month total
            const monthTotal = Object.values(totalsByDate).reduce((a, b) => a + b, 0);

            // 8) Update state in one go
            setIncomeData({
                dates,
                cashiers,
                data,
                totals: { byCashier: totalsByCashier, byDate: totalsByDate, monthTotal }
            });
        } catch (e) {
            console.error('Failed fetching income data', e);
        } finally {
            setIsLoadingIncome(false);
        }
    };

    const handleSeeIncome = () => {
        setIsIncomeOverlayVisible(true);
        fetchIncome();
    };

    const handleCloseIncomeOverlay = () => {
        setIsIncomeOverlayVisible(false);
    };
    useEffect(() => {
        if (isIncomeOverlayVisible) {
            fetchIncome();
        }
    }, [currentMonth, currentYear, isIncomeOverlayVisible]);

    const [customHours, setCustomHours] = useState({
        opening_time: '00:00',
        closing_time: '00:00',
        comment: ''
    });
    const [isCustomClosed, setIsCustomClosed] = useState(false);

    useEffect(() => {
        if (!selectedDate) return;

        // 1) Seed from weekly default
        const defaultOt = selectedDate.hours.opening_time === 'Closed'
            ? '00:00'
            : selectedDate.hours.opening_time.slice(0, 5);
        const defaultCt = selectedDate.hours.closing_time && selectedDate.hours.closing_time !== ''
            ? selectedDate.hours.closing_time.slice(0, 5)
            : '00:00';

        setCustomHours({
            opening_time: defaultOt,
            closing_time: defaultCt,
            comment: ''
        });
        setIsCustomClosed(defaultOt === '00:00' && defaultCt === '00:00');

        // 2) Try loading an existing override for that date
        const dateStr = selectedDate.date.toISOString().split('T')[0];
        axios.get(
            'https://stocksmart.xyz/api/custom-working-hours',
            {
                params: { date: dateStr, store_id: store.id },
                headers: { Authorization: `Bearer ${authToken}` }
            }
        )
            .then(res => {
                const ot = res.data.opening_time.slice(0, 5);
                const ct = res.data.closing_time.slice(0, 5);
                setCustomHours({
                    opening_time: ot,
                    closing_time: ct,
                    comment: res.data.comment || ''
                });
                setIsCustomClosed(ot === '00:00' && ct === '00:00');
            })
            .catch(() => {
                // no existing override — keep the weekly default
            });
    }, [selectedDate, store.id, authToken]);

    const handleSaveCustomHours = async () => {
            setSavingHours(true);
        try {
            const dateStr = selectedDate.date.toISOString().split('T')[0];
            const payload = {
                date:       dateStr,
                opening_time: customHours.opening_time,
                closing_time: customHours.closing_time,
                comment:      customHours.comment,
                store_id:     store.id
            };

            const res = await axios.post('https://stocksmart.xyz/api/custom-working-hours',
                payload,
                { headers: { Authorization: `Bearer ${authToken}` } }
            );

            setSelectedDate(sd => ({...sd,
                hours: {
            opening_time: payload.opening_time,
            closing_time: payload.closing_time
            }
        }));
            setCustomOverrides(prev => ({
                    ...prev,
                    [dateStr]: res.data
                }));
            setSelectedDate(sd => ({
                ...sd,
                hours: {
                opening_time: payload.opening_time,
                closing_time: payload.closing_time
            },
        comment: payload.comment
        }));
    setIsManageHoursOverlayVisible(false);
    setSelectedDate(null);
            } catch (e) {console.error('Failed saving custom hours', e);
        } finally {
            setSavingHours(false);
        }
    };

    const handleDayClick = (day) => {
        setSelectedDay(day);
        setIsManageHoursOverlayVisible(true);
    };

    const handleCloseHoursOverlay = () => {
        setIsManageHoursOverlayVisible(false);
    };

    const handleTimeChange = (time, type) => {
        const formattedTime = time ? time.slice(0, 5) : '00:00'; // Ensure HH:mm format
        setWorkingHours(prev => ({
            ...prev,
            [selectedDay.toLowerCase()]: {
                ...prev[selectedDay.toLowerCase()],
                [type]: formattedTime
            }
        }));
    };

    useEffect(() => {
        const getStoreInfo = async () => {
            setIsLoading(true);
            const userRole = localStorage.getItem('userRole');
            const store_id = userRole === 'worker'
                ? user.store_id // Assuming workers have store_id
                : user.store_id;

            if (!store_id || !authToken) return;

            try {
                // Fetch store information (works for both roles)
                const storeResponse = await axios.get(
                    `https://stocksmart.xyz/api/show/${store_id}`,
                    { headers: { Authorization: `Bearer ${authToken}` } }
                );
                setStore(storeResponse.data);
                const hoursArray = storeResponse.data.working_hours;
                const hoursObject = hoursArray.reduce((acc, hour) => {
                    acc[hour.day.toLowerCase()] = hour; // Force lowercase (e.g., "Tue" → "tue")
                    return acc;
                }, {});
                setWorkingHours(hoursObject);
                const customRes = await axios.get(
                    'https://stocksmart.xyz/api/custom-working-hours/all',
                {params: { store_id },
                        headers: { Authorization: `Bearer ${authToken}` }
                }
            );
                const map = customRes.data.reduce((acc, entry) => {
                    acc[entry.date] = entry;
                    return acc;
                    }, {});
                setCustomOverrides(map);

                // Fetch user/worker data
                if (userRole === 'worker') {
                    const workerResponse = await axios.get(
                        `https://stocksmart.xyz/api/workers/${user.id}`,
                        { headers: { Authorization: `Bearer ${authToken}` } }
                    );
                    setUserData({
                        ...workerResponse.data,
                        name: workerResponse.data.first_name,
                        last_name: workerResponse.data.last_name
                    });
                } else {
                    const userResponse = await axios.get(
                        `https://stocksmart.xyz/api/user/${user.id}`,
                        { headers: { Authorization: `Bearer ${authToken}` } }
                    );
                    setUserData(userResponse.data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        getStoreInfo();
    }, [authToken, user.store_id, user.id]);

    // Calendar setup
    const months = language === 'lv'
        ? ['Janvāris', 'Februāris', 'Marts', 'Aprīlis', 'Maijs', 'Jūnijs', 'Jūlijs', 'Augusts', 'Septembris', 'Oktobris', 'Novembris', 'Decembris']
        : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const daysOfWeek = weekStartsOn === 'Monday'
        ? [translations.monday, translations.tuesday, translations.wednesday, translations.thursday, translations.friday, translations.saturday, translations.sunday]
        : [translations.sunday, translations.monday, translations.tuesday, translations.wednesday, translations.thursday, translations.friday, translations.saturday];
    const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (month, year) => {
        const day = new Date(year, month, 1).getDay();
        return weekStartsOn === 'Monday'
            ? (day === 0 ? 6 : day - 1)  // Adjust for Monday start
            : day;                       // Keep Sunday start
    };

    const daysInCurrentMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear);
    const emptyDays = Array(firstDayOfMonth).fill(null);
    const days = [...emptyDays, ...Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1)];

    // Navigation functions
    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const getDefaultWorkingHours = (dayName) => {
        if (!dayName) {
            return { opening_time: 'Closed', closing_time: '' };
        }

        const dayMap = {
            // English
            monday: "mon",
            tuesday: "tue",
            wednesday: "wed",
            thursday: "thu",
            friday: "fri",
            saturday: "sat",
            sunday: "sun",
            // Latvian
            pirmdiena: "mon",
            otrdiena: "tue",
            tresdiena: "wed",
            ceturtdiena: "thu",
            piektdiena: "fri",
            sestdiena: "sat",
            svetdiena: "sun"
        };

        const normalizedDay = dayName
            .toLowerCase()
            .replace(/\s/g, "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
        const dayKey = dayMap[normalizedDay] || normalizedDay.slice(0, 3); // Fallback to first 3 letters

        const dayData = workingHours[dayKey];

        if (dayData) {
            // Trim time strings to "HH:mm" (ignore seconds)
            const opening = dayData.opening_time.slice(0, 5);
            const closing = dayData.closing_time.slice(0, 5);

            if (opening === "00:00" && closing === "00:00") {
                return { opening_time: "Closed", closing_time: "" };
            }
            return { opening_time: opening, closing_time: closing };
        }

        return { opening_time: "Closed", closing_time: "" };
    };

    const [isEditOverlayVisible, setIsEditOverlayVisible] = useState(false);
    const [editableStoreInfo, setEditableStoreInfo] = useState({
        storename: store.storename,
        address: store.address,
        category: store.category,
        backroom: store.backroom
    });
    const handleSaveChanges = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                `https://stocksmart.xyz/api/show/${store.id}`,
                editableStoreInfo,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );
            setStore(response.data); // Update the store state with new data
            setIsEditOverlayVisible(false); // Close overlay
        } catch (error) {
            console.error('Error updating store information:', error);
        }
    };
    const [isWorkingHoursEditVisible, setIsWorkingHoursEditVisible] = useState(false);
    const [editableWorkingHours, setEditableWorkingHours] = useState({
        day: '',
        opening_time: '',
        closing_time: '',
    });

    const handleSaveWorkingHours = async (e) => {
        e.preventDefault();
        setSavingHours(true);
        try {
            const dayKey = selectedDay.toLowerCase();
            const payload = {
                day: dayKey,
                opening_time: (workingHours[dayKey]?.opening_time || '00:00').slice(0, 5),
                closing_time: (workingHours[dayKey]?.closing_time || '00:00').slice(0, 5)
            };

            const url = workingHours[dayKey]?.id
                ? `https://stocksmart.xyz/api/working-hours/${workingHours[dayKey].id}`
                : `https://stocksmart.xyz/api/working-hours`;

            const response = await axios({
                method: workingHours[dayKey]?.id ? 'put' : 'post',
                url,
                data: payload,
                headers: { Authorization: `Bearer ${authToken}` }
            });

            setWorkingHours(prev => ({
                ...prev,
                [dayKey]: response.data
            }));

            setIsManageHoursOverlayVisible(false);
            window.location.reload();
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setSavingHours(false);
        }
    };

    const handleDownloadPDF = async () => {
        // 0) Pull currency + language from localStorage
        const currCode = localStorage.getItem('currency') || 'USD';
        const symbol = { USD:'$', EUR:'€', GBP:'£' }[currCode] || '$';

        const lang = localStorage.getItem('language') || 'en';
        const t = {
            en: {
                date:       'Date:',
                total:      'TOTAL:',
                incomeFor:  'Income for',
                assembled:  'Assembled with:'
            },
            lv: {
                date:       'Datums:',
                total:      'KOPA:',
                incomeFor:  'Ienakumi',
                assembled:  'Sakartots ar:'
            }
        }[lang];

        // 1) Create PDF
        const doc = new jsPDF({ unit: 'pt', format: 'a4' });
        const W = doc.internal.pageSize.getWidth();

        // 2) Header
        const monthYear = new Date(currentYear, currentMonth)
            .toLocaleString('default',{ month:'long', year:'numeric'});
        doc.setFontSize(18);
        doc.setFont(undefined,'bold');
        doc.text(store.storename.toUpperCase(), W/2, 40, { align:'center' });
        doc.text(`${t.incomeFor} ${monthYear}`,  W/2, 60, { align:'center' });

        // 3) Build dates & rows
        const numDays = new Date(currentYear, currentMonth+1,0).getDate();
        const allDates = Array.from({length:numDays},(_,i)=>{
            const d = new Date(currentYear, currentMonth, i+1);
            return {
                iso:   d.toISOString().slice(0,10),
                label: `${String(i+1).padStart(2,'0')}.${String(currentMonth+1).padStart(2,'0')}`
            };
        });

        // 4) Head: [Date:, cashier names..., TOTAL:]
        const head = [
            t.date,
            ...incomeData.cashiers.map(c=>c.name),
            t.total
        ];

        // 5) Body rows
        const body = allDates.map(({iso,label})=>{
            let dayTotal = 0;
            const row = [ label ];
            incomeData.cashiers.forEach(c=>{
                const amt = incomeData.data[c.id]?.[iso] || 0;
                row.push( amt>0 ? `${symbol}${amt.toFixed(2)}` : '' );
                dayTotal += amt;
            });
            row.push(`${symbol}${dayTotal.toFixed(2)}`);
            return row;
        });

        // 6) Draw the table, including a foot row that spans all cols
        autoTable(doc, {
            head: [ head ],
            body,
            foot: [[{
                content: `${lang==='lv' ? 'Summas kopa:' : 'Month total:'} ${symbol}${incomeData.totals.monthTotal.toFixed(2)}`,
                colSpan: head.length,
                styles: {
                    halign: 'center',
                    fillColor: [240,240,240],
                    fontStyle: 'bold'
                }
            }]],
            startY: 80,
            theme: 'grid',
            margin: { left:40, right:40 },
            styles: { textColor:0, fontSize:9, halign:'right' },
            headStyles: { fillColor:[255,255,255], textColor:0, fontStyle:'bold' },
            alternateRowStyles: { fillColor:[255,255,255] },
            columnStyles: { 0: { halign:'left' } }
        });

        // 7) Footer text + logo
        const y = doc.lastAutoTable.finalY + 30;
        doc.setFontSize(10);
        doc.setFont(undefined,'normal');
        doc.text(t.assembled, W/2, y, { align:'center' });

        try {
            const blob = await fetch(logoUrl).then(r=>r.blob());
            const dataUrl = await new Promise(r=>{
                const fr = new FileReader();
                fr.onloadend = ()=>r(fr.result);
                fr.readAsDataURL(blob);
            });
            const logoW = 120;
            const logoH = logoW * (476/2336);
            doc.addImage(dataUrl,'PNG',(W-logoW)/2,y+5,logoW,logoH);
        } catch(e){
            console.warn('Logo load failed:',e);
        }

        // 8) Save
        const mm = String(currentMonth+1).padStart(2,'0');
        const filename = `${store.storename.replace(/\s+/g,'_')}_income_${mm}_${currentYear}.pdf`;
        doc.save(filename);
    };
    const handleEditWorkingHours = (dayName) => {
        // Changed from .find() to object access
        const dayData = workingHours[dayName.toLowerCase()] || {
            day: dayName,
            opening_time: '00:00:00',
            closing_time: '00:00:00'
        };
        setEditableWorkingHours(dayData);
        setIsWorkingHoursEditVisible(true);
    };
    return (
        <div className="flex ml-[16.67%] max-sm:ml-0 flex-wrap">
            <Sidebar storeName={store.storename} employeeName={user.name}/>

            <div className=" flex-row w-full h-screen p-8 max-sm:ml-0 max-sm:w-full max-sm:p-1">
                {/* Display Store Information */}
                {store && (
                    <div className="p-8 mb-5 shadow-lg shadow-gray-500 rounded-md bg-[#f8fafe]">
                        <h1 className="text-4xl font-teko text-[#4E82E4]">{translations.storeInformation}</h1>
                        <button
                            className="absolute top-[5%] right-[3%] max-xl:right-[5%] bg-[#4E82E4] text-white transition-all duration-300 flex items-center px-4 py-1 my-2 rounded-lg shadow-md hover:bg-[#6a9aec] transform hover:scale-105 cursor-pointer"
                            onClick={() => {
                                setEditableStoreInfo({
                                    storename: store.storename,
                                    address: store.address,
                                    category: store.category,
                                    backroom: store.backroom
                                });
                                setIsEditOverlayVisible(true);
                            }}
                        >
                            <FaPen className="w-6 mr-2"/>
                            {translations.edit}
                        </button>
                        <div className="absolute top-[10%] right-[3%] max-xl:right-[5%] max-sm:top-[21%] max-sm:w-full max-sm:right-0 flex items-center gap-2">
                            <div className="radio-inputs bg-[#f0f4f9] p-1 rounded-lg flex max-sm:w-full justify-evenly">
                                <FaCalendar className="text-[#4E82E4] w-6 h-6"/>
                                <p className="mx-4">{translations.startfrom}</p>
                                <label className="radio">
                                    <input
                                        className="hidden"
                                        type="radio"
                                        name="weekStart"
                                        checked={weekStartsOn === 'Monday'}
                                        onChange={() => handleWeekStartChange('Monday')}
                                    />
                                    <span className="name px-4 py-1 text-sm text-gray-600 rounded-md transition-colors">
                Mon
            </span>
                                </label>
                                <label className="radio">
                                    <input
                                        className="hidden"
                                        type="radio"
                                        name="weekStart"
                                        checked={weekStartsOn === 'Sunday'}
                                        onChange={() => handleWeekStartChange('Sunday')}
                                    />
                                    <span className="name px-4 py-1 text-sm text-gray-600 rounded-md transition-colors">
                Sun
            </span>
                                </label>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="flex flex-row justify-start items-center"><FaStore
                                className="mr-2 text-[#DF9677]"/><strong className="mr-2">
                                {translations.storeName}</strong> {store.storename}</p>
                            <p className="flex flex-row justify-start items-center"><FaMapPin
                                className="mr-2 text-[#DF9677]"/><strong className="mr-2">
                                {translations.storeAddress}</strong> {store.address}</p>
                            <p className="flex flex-row justify-start items-center"><FaTags
                                className="mr-2 text-[#DF9677]"/><strong className="mr-2">
                                {translations.storeCategory}</strong> {store.category}</p>
                        </div>
                    </div>
                )}
                {isLoading ? (
                    <div className="grid grid-cols-7 gap-2 animate-pulse">
                        {Array.from({length: daysInCurrentMonth + firstDayOfMonth}).map((_, idx) => (
                            <div key={idx} className="h-24 bg-gray-300 rounded-lg"></div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white p-4 rounded-lg shadow-lg shadow-gray-500">
                        <div className="flex justify-between items-center mb-4">
                            <button onClick={handlePrevMonth} className="text-gray-700 p-2">
                                <FaChevronLeft size={24} className="text-[#4E82E4]"/>
                            </button>
                            <div>
                                <h2 className="text-2xl font-bold">{months[currentMonth]} {currentYear}</h2>
                        </div>
                        <button onClick={handleNextMonth} className="text-gray-700 p-2">
                            <FaChevronRight size={24} className="text-[#4E82E4]"/>
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-2 text-center">
                        {daysOfWeek.map((day) => (
                            <div key={day} className="font-semibold text-gray-600">{day}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2 text-center">
                        {days.map((day, index) => {
                            if (day === null) return <div key={index}/>;

                            const date = new Date(currentYear, currentMonth, day);
                            const getAdjustedDayIndex = (date, weekStartsOn) => {
                                const dayIndex = date.getDay();
                                return weekStartsOn === 'Monday'
                                    ? (dayIndex === 0 ? 6 : dayIndex - 1) // Sunday becomes 6, Monday 0, etc.
                                    : dayIndex;
                            };
                            const adjustedIndex = getAdjustedDayIndex(date, weekStartsOn);
                            const dayName = daysOfWeek[adjustedIndex];
                            const dateStr = date.toISOString().split('T')[0];
                            const override = customOverrides[dateStr];
                            const isCustom = Boolean(override);

                            const hours = override
                                ? {
                                    opening_time: override.opening_time.slice(0, 5),
                                    closing_time: override.closing_time.slice(0, 5)
                                }
                                : getDefaultWorkingHours(dayName);

                            const isClosed =
                                hours.opening_time === 'Closed' ||
                                (hours.opening_time === '00:00' && hours.closing_time === '00:00');
                            const comment  = override?.comment;
                            return (
                                <div
                                    key={index}
                                    className={`h-full w-full p-1.5 rounded-md cursor-pointer transition ${isCustom ? 'border-b-2 border-black hover:shadow-md hover:shadow-gray-500 transition-all duration-300' : ''} ${isClosed
                                        ? 'bg-red-400 hover:bg-red-500 hover:shadow-md hover:shadow-gray-500 transition-all duration-300'
                                        : 'bg-blue-100 hover:bg-blue-200 hover:shadow-md hover:shadow-gray-500 transition-all duration-300'}hover:shadow-lg
    `}
                                    onClick={() => setSelectedDate({date, hours, comment})}
                                >
                                    <div className="text-lg font-bold text-gray-800">{day}</div>
                                    {isClosed ? (
                                        <div className="text-white text-sm font-medium">{translations.closed}</div>
                                    ) : (
                                        <div className="text-sm w-full text-gray-700 font-semibold">
                                            {hours.opening_time} – {hours.closing_time}
                                        </div>
                                    )}
                                    {comment && (
                                        <div
                                            className={`text-xs mt-1 truncate ${isClosed ? 'text-white' : 'text-gray-600'}`}>
                                            "{comment}"
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    </div>
                )}
                <div>
                    <div className="mt-6 flex gap-4 justify-between">
                        {isIncomeOverlayVisible && (
                            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                                <div
                                    className="bg-white p-6 rounded-lg shadow-lg relative w-[90%] max-md:w-[99%] max-md:p-2 max-sm:p-1 max-w-4xl overflow-auto transition-all duration-300">
                                    <button
                                        className="absolute top-2 right-2 text-gray-500"
                                        onClick={handleCloseIncomeOverlay}>
                                        <FaXmark size={24} className="text-[#4E82E4]"/>
                                    </button>
                                    <h2 className="text-2xl font-bold mb-4 text-[#4E82E4]">
                                        {translations.incomeFor}{new Date(currentYear, currentMonth)
                                        .toLocaleString('default', {month: 'long', year: 'numeric'})}
                                    </h2>

                                    {isLoadingIncome ? (
                                        <div className="flex justify-center py-10">
                                            <CgSpinnerAlt className="animate-spin text-4xl text-[#4E82E4]"/>
                                        </div>
                                    ) : incomeData.dates.length === 0 ? (
                                        <p className="text-center py-10 text-gray-600">{translations.noData}</p>
                                    ) : (
                                        <>
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full border-collapse">
                                                    <thead>
                                                    <tr>
                                                        <th className="border px-2 py-1 bg-gray-100">Cashier</th>
                                                        {incomeData.dates.map(date => (
                                                            <th key={date}
                                                                className="border px-2 py-1 bg-gray-100 text-sm">
                                                                {new Date(date).getDate()}
                                                            </th>
                                                        ))}
                                                        <th className="border px-2 py-1 bg-gray-200">Total</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {incomeData.cashiers.map(c => (
                                                        <tr key={c.id}>
                                                            <td className="border px-2 py-1 font-medium">{c.name}</td>
                                                            {incomeData.dates.map(date => (
                                                                <td key={date} className="border px-2 py-1 text-right">
                                                                    {(incomeData.data[c.id]?.[date] || 0).toFixed(2)}{symbol}
                                                                </td>
                                                            ))}
                                                            <td className="border px-2 py-1 text-right font-semibold">
                                                                {(incomeData.totals.byCashier[c.id] || 0).toFixed(2)}{symbol}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {/* Date totals row */}
                                                    <tr className="font-semibold bg-gray-100">
                                                        <td className="border px-2 py-1">{translations.dayTotal}</td>
                                                        {incomeData.dates.map(date => (
                                                            <td key={date} className="border px-2 py-1 text-right">
                                                                {((incomeData.totals.byDate?.[date] || 0)).toFixed(2)}{symbol}
                                                            </td>
                                                        ))}
                                                        <td className="border px-2 py-1 text-right font-bold underline">{(incomeData.totals.monthTotal || 0).toFixed(2)}{symbol}</td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </>
                                    )}
                                    <div className="flex justify-between mt-4">
                                        <button onClick={handlePrevMonth} className="p-2">
                                            <FaChevronLeft size={24} className="text-[#4E82E4]"/>
                                        </button>
                                        <button
                                            onClick={handleDownloadPDF}
                                            disabled={incomeData.dates.length === 0}
                                            className={`px-6 py-3 rounded-lg transition ${incomeData.dates.length === 0 ? 'bg-gray-300 cursor-not-allowed text-gray-600' : 'bg-[#4E82E4] text-white hover:bg-[#6a9aec] hover:scale-105'}
                                            `}>{translations.downloadPDF}</button>
                                    <button onClick={handleNextMonth} className="p-2">
                                        <FaChevronRight size={24} className="text-[#4E82E4]"/>
                                    </button>
                                </div>
                            </div>
                            </div>
                            )}
                        <button
                            className="bg-[#4E82E4] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#6a9aec] hover:scale-105 transition-all duration-300"
                            onClick={() => setIsManageHoursOverlayVisible(true)}
                        >
                            {translations.manageHours}
                        </button>
                        <button
                            className="bg-[#DF9677] text-white px-6 py-3 shadow-md rounded-lg hover:bg-[#ec8a6a] hover:scale-105 transition-all duration-300"
                            onClick={handleSeeIncome}
                    >{translations.seeIncome}
                    </button>
                </div>
            </div>

                {selectedDate && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg relative w-80">
                            <button
                                className="absolute top-2 right-2 text-gray-500"
                                onClick={() => setSelectedDate(null)}
                            >
                                <FaXmark size={24} className="text-[#4E82E4]" />
                            </button>
                            <h1 className="text-xl font-bold mb-4 text-[#4E82E4]">
                                {translations.hoursFor}{selectedDate.date.toDateString()}
                            </h1>

                            {/* Default weekly hours */}
                            <p className="text-sm mb-2">
                                <strong>{translations.defaultHours}</strong>{' '}
                                {selectedDate.hours.opening_time} – {selectedDate.hours.closing_time}
                            </p>

                            {/* Custom override form */}
                            <div className="flex flex-col gap-4">
                                <div>
                                    <div className="flex items-center mb-4">
                                        <input
                                            id="closed-switch"
                                            type="checkbox"
                                            checked={isCustomClosed}
                                            onChange={() => {
                                                const closed = !isCustomClosed;
                                                setIsCustomClosed(closed);
                                                if (closed) {
                                                    setCustomHours(ch => ({
                                                        ...ch,
                                                        opening_time: '00:00',
                                                        closing_time: '00:00'
                                                    }));
                                                }
                                            }}
                                            className="mr-2"
                                        />
                                        <label htmlFor="closed-switch" className="text-sm">
                                            {translations.closed}
                                        </label>
                                    </div>

                                            <label className="block mb-1 text-sm">{translations.customOpening}</label>
                                            <TimePicker
                                                onChange={val =>
                                                    setCustomHours(ch => ({
                                                        ...ch,
                                                        opening_time: val ? val.slice(0, 5) : '00:00'
                                                    }))
                                                }
                                                value={customHours.opening_time}
                                                format={isMilitary ? "HH:mm" : "h:mm a"}
                                                disableClock clockIcon={null} clearIcon={null}
                                                className="w-full border rounded p-2"
                                                disabled={isCustomClosed}
                                            />
                                    </div>
                                    <div>
                                    <label className="block mb-1 text-sm">{translations.customClosing}</label>
                                    <TimePicker
                                        onChange={val =>
                                            setCustomHours(ch => ({
                                                ...ch,
                                                closing_time: val ? val.slice(0,5) : '00:00'
                                            }))
                                        }
                                        value={customHours.closing_time}
                                        format={isMilitary ? "HH:mm" : "h:mm a"}
                                        disableClock clockIcon={null} clearIcon={null}
                                        className="w-full border rounded p-2"
                                        disabled={isCustomClosed}
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm">{translations.comment}</label>
                                    <textarea
                                        className="w-full border rounded p-2"
                                        rows={3}
                                        value={customHours.comment}
                                        onChange={e =>
                                            setCustomHours(ch => ({
                                                ...ch,
                                                comment: e.target.value
                                            }))
                                        }
                                    />
                                </div>
                                <button
                                    className="w-full bg-[#4E82E4] text-white py-2 rounded hover:bg-[#6a9aec]"
                                    onClick={handleSaveCustomHours}
                                >
                                    {savingHours
                                        ? <CgSpinnerAlt className="animate-spin inline" />
                                        : translations.saveCustomHours}
                                </button>
                            </div>

                            {/* Show saved comment below */}
                            {customHours.comment && (
                                <p className="mt-4 text-xs text-gray-600">
                                    <em>{translations.note}</em> {customHours.comment}
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>
            {isEditOverlayVisible && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg relative w-80">
                        <button
                            className="absolute top-2 right-2 text-gray-500"
                            onClick={() => setIsEditOverlayVisible(false)}
                        >
                            <FaXmark size={24} className="text-[#4E82E4]"/>
                        </button>
                        <h1 className="text-xl font-bold mb-4 text-[#4E82E4]"></h1>
                        <form onSubmit={handleSaveChanges} className="space-y-4">
                            <input
                                type="text"
                                className="w-full p-2 border rounded"
                                placeholder={translations.storeName}
                                value={editableStoreInfo.storename}
                                onChange={(e) =>
                                    setEditableStoreInfo((prev) => ({...prev, storename: e.target.value}))
                                }
                                required
                            />
                            <input
                                type="text"
                                className="w-full p-2 border rounded"
                                placeholder={translations.storeAddress}
                                value={editableStoreInfo.address}
                                onChange={(e) =>
                                    setEditableStoreInfo((prev) => ({...prev, address: e.target.value}))
                                }
                                required
                            />
                            <input
                                type="text"
                                className="w-full p-2 border rounded"
                                placeholder={translations.storeCategory}
                                value={editableStoreInfo.category}
                                onChange={(e) =>
                                    setEditableStoreInfo((prev) => ({...prev, category: e.target.value}))
                                }
                                required
                            />
                            <button
                                type="submit"
                                className="w-full bg-[#4E82E4] text-white py-2 rounded hover:bg-[#6a9aec]"
                            >
                                {translations.saveChanges}
                            </button>
                        </form>
                    </div>
                </div>
            )}
            {isManageHoursOverlayVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg relative w-[90%] max-w-2xl">
                        <button
                            className="absolute top-2 right-2"
                            onClick={handleCloseHoursOverlay}
                        >
                            <FaXmark className="w-5 text-[#4E82E4]" />
                        </button>

                        <h2 className="text-2xl font-semibold text-[#DF9677] mb-4 text-center">
                            Manage Working Hours
                        </h2>

                        <div className="border-2 border-[#DF9677] p-4 rounded-lg flex justify-center">
                            <div className="grid grid-cols-7 gap-2 w-full">
                                {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map(dayKey => (
                                    <button
                                        key={dayKey}
                                        className={`text-white flex justify-center items-center py-2 px-4 rounded-lg hover:bg-[#6a9aec] text-xs ${
                                            updatedDays[dayKey.toUpperCase()]
                                                ? 'bg-[#DF9677]'
                                                : 'bg-[#4E82E4]'
                                        }`}
                                        onClick={() => handleDayClick(dayKey.toUpperCase())}
                                        type="button"
                                    >
                                        {dayKey.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {selectedDay && (
                            <div className="mt-6 p-4 border rounded-lg">
                                <div className="flex items-center mb-4">
                                    <input
                                        id="military-switch"
                                        type="checkbox"
                                        checked={isMilitary}
                                        onChange={() => setIsMilitary(m => !m)}
                                        className="h-4 w-4"
                                    />
                                    <label htmlFor="military-switch" className="ml-2 text-sm">
                                        {translations.use24hFormat}
                                    </label>
                                </div>

                                <div className="flex flex-col md:flex-row gap-4 justify-between">
                                    <div className="flex-1">
                                        <label className="block mb-2 text-sm font-medium">
                                            {translations.openingTime}
                                        </label>
                                        <TimePicker
                                            onChange={value => {
                                                const formattedTime = value ? value.slice(0, 5) : '00:00';
                                                handleTimeChange(formattedTime, 'opening_time');
                                            }}
                                            value={workingHours[selectedDay.toLowerCase()]?.opening_time || '00:00'}
                                            format={isMilitary ? "HH:mm" : "h:mm a"}
                                            disableClock
                                            clockIcon={null}
                                            clearIcon={null}
                                            className="w-full border rounded p-2"
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <label className="block mb-2 text-sm font-medium">
                                            {translations.closingTime}
                                        </label>
                                        <TimePicker
                                            onChange={value => {
                                                const formattedTime = value ? value.slice(0, 5) : '00:00';
                                                handleTimeChange(formattedTime, 'closing_time');
                                            }}
                                            value={workingHours[selectedDay.toLowerCase()]?.closing_time || '00:00'}
                                            format={isMilitary ? "HH:mm" : "h:mm a"}
                                            disableClock
                                            clockIcon={null}
                                            clearIcon={null}
                                            className="w-full border rounded p-2"
                                        />
                                    </div>
                                </div>

                                <button
                                    className="w-full bg-[#4E82E4] text-white py-2 px-4 rounded hover:bg-[#6a9aec] mt-4"
                                    onClick={handleSaveWorkingHours}
                                >
                                    {translations.saveChanges}
                                </button>
                            </div>
                        )}
                        {savingHours && (
                            <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-50">
                                <CgSpinnerAlt className="animate-spin text-5xl text-white" />
                                <p className="text-white mt-4">{translations.saving}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Storestatus;
