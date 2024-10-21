import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Storeinfo from './Storeinfo';
import Storestatus from './Storestatus';
import Addstorage from './Addstorage';
import Users from './Users';
import Selling from './Sell';
import Lowstock from './Lowstock';
import {AuthProvider} from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";
function App() {
  return (

    <Router>
      <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
          <Route path="/Sell" element={<ProtectedRoute><Selling /></ProtectedRoute>} />
        <Route path="/register" element={<Register />} />
        <Route path="/storeinfo" element={<ProtectedRoute><Storeinfo /></ProtectedRoute>} />
          <Route path="/storestatus" element={<ProtectedRoute><Storestatus /></ProtectedRoute>} />
          <Route path="/addstorage" element={<ProtectedRoute><Addstorage /></ProtectedRoute>} />
          <Route path="/Users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
          <Route path="/lowstock" element={<ProtectedRoute><Lowstock /></ProtectedRoute>} />
      </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
