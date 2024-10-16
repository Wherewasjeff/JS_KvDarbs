import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Storeinfo from './Storeinfo';
import Storestatus from './Storestatus';
import Addstorage from './Addstorage';
import Users from './Users';
import Selling from './Sell';
import Lowstock from './Lowstock';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Sell" element={<Selling />} />
        <Route path="/register" element={<Register />} />
        <Route path="/storeinfo" element={<Storeinfo />} />
        <Route path="/storestatus" element={<Storestatus />} />
        <Route path="/addstorage" element={<Addstorage />} />
        <Route path="/Users" element={<Users />} />
        <Route path="/lowstock" element={<Lowstock />} />
      </Routes>
    </Router>
  );
}

export default App;
