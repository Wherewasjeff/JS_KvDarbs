import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    // Load user data from localStorage if available
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    // Function to login and save user data
    const login = (userData, token) => {
        setUser(userData);
        setAuthToken(token);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("authToken", token);
    };


    // Function to update user (for example, adding store_id after store creation)
    const updateUser = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser)); // Sync with localStorage
    };

    const [authToken, setAuthToken] = useState(() => {
        return localStorage.getItem("authToken") || null;
    });


    // Function to logout and clear user data from state and localStorage
    const logout = () => {
        setUser(null);
        setAuthToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
        navigate("/");
    };


    // Automatically update localStorage when `user` state changes
    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, authToken, setUser: updateUser, login, logout }}>
        {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);
