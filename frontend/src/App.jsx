import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistrationForm from './components/RegistrationForm';
import LandingPage from './components/LandingPage';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Subscription from './components/Subscription';

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
      </Routes>
      <Chatbot />
    </Router>
  );
}

export default App;
