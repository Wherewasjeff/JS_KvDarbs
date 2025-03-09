import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export const LoggedIn = ({ children }) => {
    const { user } = useAuth();
    if (!user) {
    }else{
        return <Navigate to="/storeinfo" />;
    }
    return children;
};

export default LoggedIn;