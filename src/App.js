import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AddProduct from './components/AddProduct';
import Products from './components/Products';
import Header from './components/Header';
import './App.css';  

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  const handleLoginSuccess = (id) => {
    setIsAuthenticated(true);
    setUserId(id);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserId(null);
    navigate('/');
  };

  return (
    <>
      <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <Routes>
        <Route
          path="/"
          element={
            <div className="App-container">
              <div className="App-card">
                <Login onLoginSuccess={handleLoginSuccess} />
                <Link className="App-toggle-link" to="/register">Nu aveți un cont? Înregistrați-vă</Link>
              </div>
            </div>
          }
        />
        <Route
          path="/register"
          element={
            <div className="App-container">
              <div className="App-card">
                <Register />
                <Link className="App-toggle-link" to="/">Aveți deja un cont? Autentificați-vă</Link>
              </div>
            </div>
          }
        />
        <Route path="/dashboard" element={<Dashboard userId={userId} />} />
        <Route path="/adauga-produs" element={<div className="App-container"><div className="App-card"><AddProduct userId={userId} /></div></div>} />
            </Routes>
    </>
  );
};

export default App;
