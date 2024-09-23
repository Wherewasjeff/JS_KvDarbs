import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Storeinfo from './Storeinfo';
import Addstorage from './Addstorage';
import Users from './Users';
import Selling from './Sell';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Sell" element={<Selling />} />
        <Route path="/register" element={<Register />} />
        <Route path="/storeinfo" element={<Storeinfo />} />
        <Route path="/addstorage" element={<Addstorage />} />
        <Route path="/Users" element={<Users />} />
      </Routes>
    </Router>
  );
}

export default App;
