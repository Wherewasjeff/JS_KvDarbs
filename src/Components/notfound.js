// src/Components/NotFound.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import '../App.css';
import { useTranslation, notFoundTranslations } from './TranslationContext';

export default function NotFound() {
    const { language } = useTranslation();
    const t = notFoundTranslations[language] || notFoundTranslations.en;
    return (
        <div className="flex h-screen overflow-hidden bg-[#f8fafe] max-md:flex-col">
            {/* Left decorative panels */}
            <div className="relative w-1/2 flex justify-center items-center max-md:hidden">
                <div
                    className="absolute inset-0 bg-[#b4caf4] origin-top-left transition-all duration-500 -top-[180px] shift-right"/>
                <div
                    className="absolute inset-0 bg-[#90b1ee] origin-top-left transition-all duration-700 right-36 -top-20 shift-left"/>
                <div
                    className="absolute inset-0 bg-[#4E82E4] origin-top-left transition-all h-[120vh] duration-900 right-80 top-10 shift-diagonal"/>
            </div>
            <div
                className="absolute fade-in flex flex-col max-sm:w-11/12 max-sm:left-2 justify-center space-y-4 items-center w-1/2 h-1/2 top-1/4 left-1/4">
                <div className="w-1/4 min-w-[300px] max-sm:scale-75 flex justify-between items-center">
                    <h1 className="text-9xl font-teko text-[#DF9677]">4</h1>
                    <img src="IconsBlue/Logoblue.png" className="-mt-5 w-24 h-24 fall-then-levitate"/>
                    <h1 className="text-9xl font-teko text-[#DF9677]">4</h1>
                </div>
                <p className="text-2xl font-semibold text-gray-700">
                    {t.title}
                </p>
                <p className="text-gray-500 text-center">
                    {t.description}
                </p>
                <Link
                    to="/storestatus"
                    className="inline-flex items-center justify-center space-x-2 bg-[#4E82E4] hover:bg-[#2968DE] text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300"
                >
                    <FaHome className="w-5 h-5"/>
                    <p>{t.goBack}</p>
                </Link>
        </div>
    <div className="relative w-1/2 flex max-md:hidden">
        <div className="absolute inset-0 bg-[#f5dfd6] origin-top-right -top-44 shift-right-mirror"></div>
        <div className="absolute inset-0 bg-[#ecc0ad] origin-top-right shift-left-mirror left-36 -top-20"></div>
        <div
            className="absolute inset-0 bg-[#DF9677] origin-top-right shift-antiDiagonal left-80 top-10 h-[120vh]"></div>
    </div>
</div>
)
    ;
}
