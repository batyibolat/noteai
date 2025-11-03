// components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Основная часть футера */}
        <div className="footer-main">
          <div className="footer-section">
            <div className="footer-brand">
              <div className="footer-logo">✨ AI Конспектор</div>
              <p className="footer-description">
                Современный инструмент для создания конспектов 
                с использованием искусственного интеллекта
              </p>
            </div>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Telegram">
                <span className="social-icon">📱</span>
              </a>
              <a href="#" className="social-link" aria-label="VKontakte">
                <span className="social-icon">👥</span>
              </a>
              <a href="#" className="social-link" aria-label="GitHub">
                <span className="social-icon">💻</span>
              </a>
              <a href="#" className="social-link" aria-label="Email">
                <span className="social-icon">📧</span>
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Навигация</h3>
            <ul className="footer-links">
              <li><Link to="/dashboard" className="footer-link">Главная</Link></li>
              <li><Link to="/summarize" className="footer-link">Создать конспект</Link></li>
              <li><Link to="/history" className="footer-link">История</Link></li>
              <li><Link to="/calculator" className="footer-link">Калькулятор</Link></li>
              <li><Link to="/profile" className="footer-link">Профиль</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Информация</h3>
            <ul className="footer-links">
              <li><Link to="/calculator" className="footer-link">О нас</Link></li>
              <li><a href="#" className="footer-link">Документация</a></li>
              <li><a href="#" className="footer-link">Блог</a></li>
              <li><a href="#" className="footer-link">Обновления</a></li>
              <li><a href="#" className="footer-link">Статус системы</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Поддержка</h3>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">Помощь</a></li>
              <li><a href="#" className="footer-link">FAQ</a></li>
              <li><a href="#" className="footer-link">Контакты</a></li>
              <li><a href="#" className="footer-link">Сообщить о проблеме</a></li>
              <li><a href="#" className="footer-link">Обратная связь</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Контакты</h3>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <span>support@aisummarizer.ru</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">🌐</span>
                <span>www.aisummarizer.ru</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">🕒</span>
                <span>Круглосуточная поддержка</span>
              </div>
            </div>
          </div>
        </div>

        {/* Нижняя часть футера */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="copyright">
              © {currentYear} AI Конспектор. Все права защищены.
            </div>
            <div className="footer-legal">
              <a href="#" className="legal-link">Политика конфиденциальности</a>
              <a href="#" className="legal-link">Условия использования</a>
              <a href="#" className="legal-link">Cookie</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;