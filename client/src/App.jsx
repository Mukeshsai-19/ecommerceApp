import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth, AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import { LayoutDashboard, User, PlusCircle, LogOut } from 'lucide-react';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const Navbar = () => {
  const { user, signout } = useAuth();
  if (!user) return null;

  return (
    <nav className="nav">
      <div className="nav-title">SellerApp</div>
      <div style={{ display: 'flex', gap: '15px' }}>
        <Link to="/"><LayoutDashboard size={22} /></Link>
        <Link to="/profile"><User size={22} /></Link>
        <button onClick={signout} style={{ background: 'none', cursor: 'pointer', color: 'var(--error)' }}>
          <LogOut size={22} />
        </button>
      </div>
    </nav>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/add-product" element={<PrivateRoute><AddProduct /></PrivateRoute>} />
            <Route path="/edit-product/:id" element={<PrivateRoute><EditProduct /></PrivateRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
