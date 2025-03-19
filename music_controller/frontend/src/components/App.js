import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';
import LoginPage from '../pages/LoginPage';
import Navbar from '../components/Navbar';

// Debugging: Check what is actually being imported
console.log("Home:", Home);
console.log("Profile:", Profile);
console.log("NotFound:", NotFound);
console.log("LoginPage:", LoginPage);
console.log("Navbar:", Navbar);

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
