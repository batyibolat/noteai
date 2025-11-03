// components/About.js
import React from 'react';

function Calculator() {
  return (
    <div className="about">
      <div className="about-header">
        <div className="hero-banner">
          <h1>О нашем AI Конспекторе</h1>
          <p>Искусственный интеллект, который делает ваше обучение проще и эффективнее</p>
        </div>
      </div>

      <div className="about-content">
        <div className="about-grid">
          {/* Миссия */}
          <div className="about-card mission-card">
            <div className="card-icon">🎯</div>
            <div className="card-content">
              <h2>Наша миссия</h2>
              <p>
                Мы стремимся сделать процесс обучения более доступным и эффективным 
                с помощью передовых технологий искусственного интеллекта. Наша цель - 
                помочь студентам, исследователям и профессионалам экономить время 
                и сосредоточиться на самом важном.
              </p>
            </div>
          </div>

          {/* Технологии */}
          <div className="about-card tech-card">
            <div className="card-icon">🤖</div>
            <div className="card-content">
              <h2>Передовые технологии</h2>
              <p>
                Наша система использует современные модели машинного обучения 
                для анализа и сжатия текстовой информации. Алгоритмы понимают 
                контекст, выделяют ключевые идеи и генерируют лаконичные, 
                информативные конспекты.
              </p>
              <div className="tech-features">
                <div className="feature-item">
                  <span className="feature-icon">📊</span>
                  <span>Анализ семантики текста</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🎯</span>
                  <span>Выделение ключевых идей</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">⚡</span>
                  <span>Быстрая обработка</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🔒</span>
                  <span>Конфиденциальность данных</span>
                </div>
              </div>
            </div>
          </div>

          {/* Команда */}
          <div className="about-card team-card">
            <div className="card-icon">👥</div>
            <div className="card-content">
              <h2>Наша команда</h2>
              <p>
                Мы - группа энтузиастов в области искусственного интеллекта, 
                разработки программного обеспечения и образовательных технологий. 
                Наша команда объединяет экспертов с многолетним опытом в создании 
                инновационных решений для образования.
              </p>
            </div>
          </div>

          {/* Преимущества */}
          <div className="about-card benefits-card">
            <div className="card-icon">⭐</div>
            <div className="card-content">
              <h2>Почему выбирают нас</h2>
              <div className="benefits-list">
                <div className="benefit-item">
                  <h3>Высокая точность</h3>
                  <p>Алгоритмы сохраняют смысл и контекст исходного текста</p>
                </div>
                <div className="benefit-item">
                  <h3>Многозадачность</h3>
                  <p>Работа с текстами любой сложности и тематики</p>
                </div>
                <div className="benefit-item">
                  <h3>Удобный интерфейс</h3>
                  <p>Интуитивно понятный дизайн для комфортной работы</p>
                </div>
                <div className="benefit-item">
                  <h3>История работы</h3>
                  <p>Доступ ко всем созданным конспектам в одном месте</p>
                </div>
              </div>
            </div>
          </div>

          {/* Статистика */}
          <div className="about-card stats-card">
            <div className="card-icon">📈</div>
            <div className="card-content">
              <h2>Мы в цифрах</h2>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-number">10K+</div>
                  <div className="stat-label">пользователей</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">50K+</div>
                  <div className="stat-label">созданных конспектов</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">95%</div>
                  <div className="stat-label">точность анализа</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">24/7</div>
                  <div className="stat-label">доступность сервиса</div>
                </div>
              </div>
            </div>
          </div>

          {/* Контакты */}
          <div className="about-card contact-card">
            <div className="card-icon">📞</div>
            <div className="card-content">
              <h2>Свяжитесь с нами</h2>
              <p>
                У вас есть вопросы или предложения? Мы всегда рады обратной связи 
                и готовы помочь вам получить максимальную пользу от нашего сервиса.
              </p>
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
                  <span className="contact-icon">💬</span>
                  <span>Telegram: @aisummarizer_support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calculator;