import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import RegistrationForm from './components/RegistrationForm';
import MainDashboard from './components/MainDashboard';
import VendorDashboard from './components/VendorDashboard';
import AdminDashboard from './components/AdminDashboard';
import StoreHome from './components/store/StoreHome';
import StoreShop from './components/store/StoreShop';
import StoreProductDetail from './components/store/StoreProductDetail';
import StoreCart from './components/store/StoreCart';
import StoreCheckout from './components/store/StoreCheckout';
import UserOrders from './components/store/UserOrders';
import SellOnLumina from './components/SellOnLumina';

// Custom Private Route wrapper (Basic mock)
const PrivateRoute = ({ children, requiredRole }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Store Routes */}
        <Route path="/" element={<StoreHome />} />
        <Route path="/products" element={<StoreShop />} />
        <Route path="/product/:id" element={<StoreProductDetail />} />
        <Route path="/cart" element={<StoreCart />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/sell-on-lumina" element={<SellOnLumina />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <MainDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/vendor/dashboard"
          element={
            <PrivateRoute requiredRole="vendor">
              <VendorDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <PrivateRoute requiredRole="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <StoreCheckout />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <UserOrders />
            </PrivateRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
