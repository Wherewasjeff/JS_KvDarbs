import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from './Components/Authentification/Login';
import Register from './Components/Authentification/Register';
import Storeinfo from './Components/Store/Storeinfo';
import Storestatus from './Components/Store/Storestatus';
import Addstorage from './Components/Storage/Addstorage';
import Users from './Components/Store/Users';
import Selling from './Components/Store/Sell';
import Replenishment from './Components/Storage/Replenishment';
import Lowstock from './Components/Storage/Lowstock';
import {AuthProvider} from "./Components/Authentification/AuthContext";
import ProtectedRoute from "./Components/Authentification/ProtectedRoute";
import LoggedIn from "./Components/Authentification/LoggedIn";
import { TranslationProvider } from "./Components/TranslationContext";
import NotFound from './Components/notfound';

function App() {
  return (

      <Router>
          <TranslationProvider> {/* Wrap everything inside */}
              <AuthProvider>
                  <Routes>
                      <Route path="/" element={<LoggedIn><Login /></LoggedIn>} />
                      <Route path="/Sell" element={<ProtectedRoute><Selling /></ProtectedRoute>} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/storeinfo" element={<ProtectedRoute><Storeinfo /></ProtectedRoute>} />
                      <Route path="/Storestatus" element={<ProtectedRoute><Storestatus /></ProtectedRoute>} />
                      <Route path="/Replenishment" element={<ProtectedRoute><Replenishment /></ProtectedRoute>} />
                      <Route path="/addstorage" element={<ProtectedRoute><Addstorage /></ProtectedRoute>} />
                      <Route path="/Users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
                      <Route path="/lowstock" element={<ProtectedRoute><Lowstock /></ProtectedRoute>} />
                      <Route path="*" element={<NotFound />} />
                  </Routes>
              </AuthProvider>
          </TranslationProvider>
      </Router>
  );
}

export default App;
