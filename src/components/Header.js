import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css'; 

const Header = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <header className="App-header">
      <div className="App-logo-container">
        <h1 className="App-title">
          PrețMonitor
          <img className="App-logo" src="/logo.png" alt="PrețMonitor Logo" />
        </h1>
      </div>
      {isAuthenticated && (
        <div className="App-nav-links">
          <Link className="App-nav-link" to="/adauga-produs">Adaugă produs</Link>
          <button className="App-logout-button" onClick={handleLogout}>Delogare</button>
        </div>
      )}
    </header>
  );
};

export default Header;
