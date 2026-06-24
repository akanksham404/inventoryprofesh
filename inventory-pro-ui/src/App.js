import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

export default function App() {
  const [auth, setAuth] = useState({ token: null, role: null, username: null });

  // 1. Check local storage on initial load to keep user logged in after a refresh
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const username = localStorage.getItem('username');
    if (token) {
      setAuth({ token, role, username });
    }
  }, []);

  // 2. 🚨 THE FIX: Create the exact function your Login.js is expecting!
  const handleLoginSuccess = () => {
    // Login.js just saved the token to localStorage, so we grab it to update the React state
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const username = localStorage.getItem('username');

    setAuth({ token, role, username });
  };

  const handleLogout = () => {
    localStorage.clear();
    setAuth({ token: null, role: null, username: null });
  };

  return (
    <Router>
      <Routes>
        {/* 3. 🚨 Pass onLoginSuccess down to the Login component */}
        <Route
          path="/login"
          element={!auth.token ? <Login onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/dashboard" />}
        />

        <Route
          path="/dashboard"
          element={auth.token ? <Dashboard auth={auth} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />

        <Route
          path="*"
          element={<Navigate to={auth.token ? "/dashboard" : "/login"} />}
        />
      </Routes>
    </Router>
  );
}