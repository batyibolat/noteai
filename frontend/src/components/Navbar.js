import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Navbar = () => {
  const { user, userProfile, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const getDisplayName = () => {
    if (userProfile?.firstName) {
      return userProfile.firstName;
    } else if (userProfile?.fullName) {
      return userProfile.fullName;
    }
    return user?.email;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            AI Конспектер
          </Link>
          
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              {/* Десктопное меню */}
              <ul className="navbar-nav">
                <li><Link to="/dashboard">Главная</Link></li>
                <li><Link to="/summarize">Создать конспект</Link></li>
                <li><Link to="/calculator">О нас</Link></li>
                <li><Link to="/history">История</Link></li>
                <li><Link to="/profile">Профиль</Link></li>
              </ul>
              
              <div className="navbar-user" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span>Привет, {getDisplayName()}</span>
                <button 
                  onClick={toggleTheme} 
                  className="theme-toggle"
                >
                  {isDark ? '🌙' : '☀️'}
                </button>
                <button onClick={handleLogout} className="logout-btn">
                  Выйти
                </button>
              </div>

              {/* Кнопка бургер-меню для мобильных */}
              <button 
                className="mobile-menu-btn"
                onClick={toggleMobileMenu}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  display: 'none'
                }}
              >
                ☰
              </button>
            </div>
          ) : (
            <>
              {/* Десктопное меню для неавторизованных */}
              <ul className="navbar-nav">
                <li><Link to="/login">Вход</Link></li>
                <li><Link to="/register">Регистрация</Link></li>
              </ul>

              {/* Кнопка бургер-меню для мобильных */}
              <button 
                className="mobile-menu-btn"
                onClick={toggleMobileMenu}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  display: 'none'
                }}
              >
                ☰
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Мобильное меню */}
      <div className={`mobile-nav ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-nav-header">
          <div className="navbar-brand">AI Конспектер</div>
          <button 
            onClick={toggleMobileMenu}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '1.5rem',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>

        {user ? (
          <>
            <ul className="mobile-nav-links">
              <li><Link to="/dashboard" onClick={handleNavClick}>Главная</Link></li>
              <li><Link to="/summarize" onClick={handleNavClick}>Создать конспект</Link></li>
              <li><Link to="/calculator" onClick={handleNavClick}>О нас</Link></li>
              <li><Link to="/history" onClick={handleNavClick}>История</Link></li>
              <li><Link to="/profile" onClick={handleNavClick}>Профиль</Link></li>
            </ul>
            
            <div className="mobile-nav-user">
              <div style={{ 
                padding: '1rem', 
                background: 'var(--background-secondary)', 
                borderRadius: '8px',
                marginBottom: '1rem'
              }}>
                <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                  Привет, {getDisplayName()}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  {user?.email}
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  onClick={toggleTheme} 
                  className="theme-toggle"
                  style={{
                    flex: 1,
                    background: 'var(--background-secondary)',
                    border: '1px solid var(--border-primary)',
                    color: 'var(--text-primary)',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1.1rem'
                  }}
                >
                  {isDark ? '🌙 Тёмная' : '☀️ Светлая'}
                </button>
                <button 
                  onClick={handleLogout} 
                  style={{
                    flex: 1,
                    background: 'var(--error-bg)',
                    border: '1px solid var(--error-border)',
                    color: 'var(--error-text)',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Выйти
                </button>
              </div>
            </div>
          </>
        ) : (
          <ul className="mobile-nav-links">
            <li><Link to="/login" onClick={handleNavClick}>Вход</Link></li>
            <li><Link to="/register" onClick={handleNavClick}>Регистрация</Link></li>
          </ul>
        )}
      </div>

      {/* Оверлей для мобильного меню */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-nav-overlay"
          onClick={toggleMobileMenu}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1999,
            display: 'none'
          }}
        />
      )}
    </>
  );
};

export default Navbar;