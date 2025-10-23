import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Navbar = () => {
  const { user, userProfile, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
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
              <li><Link to="/calculator">Калькулятор</Link></li>
              <li><Link to="/history">История</Link></li>
              <li><Link to="/profile">Профиль</Link></li>
            </ul>
            <div className="navbar-user" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span>Привет, {getDisplayName()}</span>
              <button 
                onClick={toggleTheme} 
                className="theme-btn"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: 'white',
                  padding: '0.5rem',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '1.2rem'
                }}
              >
                {isDark ? '🌙' : '☀️'}
              </button>
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