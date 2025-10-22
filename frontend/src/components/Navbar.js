import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          NoteAI
        </Link>
        
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <ul className="navbar-nav">
              <li><Link to="/dashboard">Главная</Link></li>
              <li><Link to="/summarize">Создать конспект</Link></li>
              <li><Link to="/history">История</Link></li>
            </ul>
            <div className="navbar-user">
              <span>Привет, {user.email}</span>
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