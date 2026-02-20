import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistrationForm from './components/RegistrationForm';
import LandingPage from './components/LandingPage';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Subscription from './components/Subscription';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import ContentStudio from './components/ContentStudio';

import Chatbot from './components/Chatbot';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/studio" element={<ContentStudio />} />
      </Routes>
      <Chatbot />
    </Router>
  );
}

export default App;
