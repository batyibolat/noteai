// components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDisplayName = () => {
    if (userProfile?.firstName) {
      return userProfile.firstName;
    } else if (userProfile?.fullName) {
      return userProfile.fullName;
    }
    return user?.email;
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          AI Конспектер
        </Link>
        
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <ul className="navbar-nav">
              <li><Link to="/dashboard">Главная</Link></li>
              <li><Link to="/summarize">Создать конспект</Link></li>
              <li><Link to="/calculator">Калькулятор</Link></li> {/* Добавляем ссылку на калькулятор */}
              <li><Link to="/history">История</Link></li>
              <li><Link to="/profile">Профиль</Link></li>
            </ul>
            <div className="navbar-user">
              <span>Привет, {getDisplayName()}</span>
              <button onClick={handleLogout} className="logout-btn">
                Выйти
              </button>
            </div>
          </div>
        ) : (
          <ul className="navbar-nav">
            <li><Link to="/login">Вход</Link></li>
            <li><Link to="/register">Регистрация</Link></li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;