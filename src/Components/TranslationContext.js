import React, { createContext, useContext, useState } from "react";

// Create the context
const TranslationContext = createContext();

// Translation data for authentication
const authTranslations = {
    en: {
        loginTitle: "Login",
        registerTitle: "Register",
        emailPlaceholder: "Email or Username",
        passwordPlaceholder: "Password",
        confirmPasswordPlaceholder: "Confirm Password",
        firstNamePlaceholder: "First Name",
        lastNamePlaceholder: "Last Name",
        rememberMe: "Remember me",
        loginButton: "Login",
        registerButton: "Register",
        orText: "OR",
        passwordMismatch: "Passwords do not match!",
        registrationSuccess: "Registration successful!",
    },
    lv: {
        loginTitle: "Pieslēgšanās",
        registerTitle: "Reģistrācija",
        emailPlaceholder: "E-pasts vai Lietotājvārds",
        passwordPlaceholder: "Parole",
        confirmPasswordPlaceholder: "Apstiprināt paroli",
        firstNamePlaceholder: "Vārds",
        lastNamePlaceholder: "Uzvārds",
        rememberMe: "Atcerēties mani",
        loginButton: "Pieteikties",
        registerButton: "Reģistrēties",
        orText: "VAI",
        passwordMismatch: "Paroles nesakrīt!",
        registrationSuccess: "Reģistrācija veiksmīga!",
    },
};

// Sidebar translations
export const sidebartranslations = {
    en: {
        selling: "Selling",
        storeStatus: "Store Status",
        storeInfo: "Store Info",
        storage: "Storage",
        employees: "Employees",
        replenish: "Replenishment",
        lowStock: "Low Stock",
        editProfile: "Edit Profile",
        logout: "Logout",
        language: "Language",
        welcome: "Welcome, ",
        noStore: "No store assigned",
    },
    lv: {
        selling: "Pārdošana",
        storeStatus: "Veikala statuss",
        storeInfo: "Veikala informācija",
        storage: "Krājumi",
        employees: "Darbinieki",
        replenish: "Piepildīšana",
        lowStock: "Zems krājums",
        editProfile: "Rediģēt profilu",
        logout: "Izlogoties",
        language: "Valoda",
        welcome: "Sveicināti, ",
        noStore: "Nav veikala",
    }
};

// Add storage translations – now exported as a named export
export const addStorageTranslations = {
    en: {
        doneSkip:       "Done/Skip",
        storeInfo:      "Store info",
        addStorage:     "Add storage",
        employees:      "Employees",
        searchItems:    "Search items",
        sortBy:         "Sort by",
        priceAsc:       "Price (Low to High)",
        priceDesc:      "Price (High to Low)",
        storageHigh:    "Storage Amount (High to Low)",
        storageLow:     "Storage Amount (Low to High)",
        salesfloorHigh: "Salesfloor Amount (High to Low)",
        salesfloorLow:  "Salesfloor Amount (Low to High)",
        nameAsc:        "Name (A-Z)",
        nameDesc:       "Name (Z-A)",
        filterByCategory:    "Filter by category",
        selectCategory:      "Select Category",
        addCategory:      "Create category",
        addItem:             "Add Item",
        enterProductName:    "Enter product name",
        enterSKU:            "Enter SKU",
        enterBarcode:        "Enter barcode",
        max13Digits:         "Max. 13 digits",
        enterPrice:          "Enter price",
        priceHelp:           "Max 8 digits",
        shelfNumber:         "Shelf Number",
        max3Symbols:         "max. 3 symbols",
        storageShelfNumber:  "Storage Shelf Number",
        amountInStorage:     "Amount in storage",
        amountOnSalesFloor:  "Amount on Sales Floor",
        salesFloorHelp:      "max. 2 symbols",
        submit:              "Submit",
        skuLabel:          "SKU",
        categoryLabel:     "Category",
        shelfLabel:        "Shelf",
        storageLabel:      "Storage",
        salesfloorLabel:   "Salesfloor",
        notAvailable:      "N/A",
        managecategories: "Manage categories",
    },
    lv: {
        doneSkip:       "Pabeigt/Izlaist",
        storeInfo:      "Veikala informācija",
        addStorage:     "Pievienot krājumus",
        employees:      "Darbinieki",
        searchItems:    "Meklēt preces",
        sortBy:         "Kārtot pēc",
        priceAsc:       "Cena (no zemākās uz augstāko)",
        priceDesc:      "Cena (no augstākās uz zemāko)",
        storageHigh:    "Krājumu daudzums (augstākais -> zemākais)",
        storageLow:     "Krājumu daudzums (zemākais -> augstākais)",
        salesfloorHigh: "Pārdošanas vietas daudzums (augstākais -> zemākais)",
        salesfloorLow:  "Pārdošanas vietas daudzums (zemākais -> augstākais)",
        nameAsc:        "Nosaukums (A-Z)",
        nameDesc:       "Nosaukums (Z-A)",
        filterByCategory:    "Filtrēt pēc kategorijas",
        selectCategory:      "Izvēlēties kategoriju",
        addCategory:      "Ievadīt kategoriju",
        addItem:             "Pievienot preci",
        enterProductName:    "Ievadiet preces nosaukumu",
        enterSKU:            "Ievadiet SKU",
        enterBarcode:        "Ievadiet svītrkodu",
        max13Digits:         "Maks. 13 cipari",
        enterPrice:          "Ievadiet cenu",
        priceHelp:           "Maks. 8 cipari",
        shelfNumber:         "Plaukta numurs",
        max3Symbols:         "maks. 3 simboli",
        storageShelfNumber:  "Krājuma plaukta numurs",
        amountInStorage:     "Daudzums krājumā",
        amountOnSalesFloor:  "Daudzums pārdošanas vietā",
        salesFloorHelp:      "maks. 2 simboli",
        submit:              "Iesniegt",
        skuLabel:          "SKU",
        categoryLabel:     "Kategorija",
        shelfLabel:        "Plaukts",
        storageLabel:      "Krājums",
        salesfloorLabel:   "Pārdošanas vieta",
        notAvailable:      "Nav pieejams",
        managecategories: "Pārvaldīt kategorijas",
    }
};

// You can add additional languages here following the same structure.

// Export authTranslations as the default export
export default authTranslations;

// Translation Provider
export const TranslationProvider = ({ children }) => {
    const [language, setLanguage] = useState(localStorage.getItem("language") || "en");

    const switchLanguage = (lang) => {
        setLanguage(lang);
        localStorage.setItem("language", lang);
    };

    return (
        <TranslationContext.Provider value={{ language, translations: authTranslations[language], switchLanguage }}>
            {children}
        </TranslationContext.Provider>
    );
};

// Custom hook to use translation context
export const useTranslation = () => useContext(TranslationContext);