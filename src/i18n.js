import i18n from "i18next";
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector'; // Auto-detect language
import XHR from 'i18next-xhr-backend'; // To load translations from external files

// Example language resources
const resources = {
    en: {
        translation: {
            "Selling": "Selling",
            "Store Status": "Store Status",
            "Storage": "Storage",
            "Employees": "Employees",
            "Replenish": "Replenish",
            "Low stock": "Low stock",
            "Store Info": "Store Info",
            "Edit profile": "Edit profile",
            "Log out": "Log out",
        },
    },
    lv: {
        translation: {
            "Selling": "Pārdošana",
            "Store Status": "Veikala statuss",
            "Storage": "Krājumi",
            "Employees": "Darbinieki",
            "Replenish": "Pievienot krājumus",
            "Low stock": "Zems krājums",
            "Store Info": "Veikala informācija",
            "Edit profile": "Rediģēt profilu",
            "Log out": "Izrakstīties",
        },
    },
};

i18n
    .use(LanguageDetector)
    .use(XHR)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en', // Default language
        interpolation: {
            escapeValue: false, // React already does escaping
        },
    });

export default i18n;
