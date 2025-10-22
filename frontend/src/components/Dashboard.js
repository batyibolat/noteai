import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalSummaries: 0,
    favoriteSummaries: 0,
    totalCharacters: 0
  });
  const [recentSummaries, setRecentSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      console.log('Fetching dashboard data for user:', user?.email);
      console.log('Authorization header:', axios.defaults.headers.common['Authorization']);

      const [summariesResponse, favoritesResponse] = await Promise.all([
        axios.get('http://localhost:8081/api/summaries'),
        axios.get('http://localhost:8081/api/summaries/favorites')
      ]);

      console.log('Summaries response:', summariesResponse.data);
      console.log('Favorites response:', favoritesResponse.data);

      const summaries = summariesResponse.data;
      const favorites = favoritesResponse.data;

      // Рассчитываем статистику на клиенте
      const totalCharacters = summaries.reduce((total, summary) => 
        total + (summary.originalLength || 0), 0
      );

      setStats({
        totalSummaries: summaries.length,
        favoriteSummaries: favorites.length,
        totalCharacters: totalCharacters
      });

      // Берем 3 последних конспекта
      setRecentSummaries(summaries.slice(0, 3));
      
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      console.error('Error response:', error.response);
      
      if (error.response?.status === 403) {
        setError('Ошибка доступа. Возможно, проблема с авторизацией. Попробуйте перезайти.');
      } else if (error.response?.status === 401) {
        setError('Не авторизован. Пожалуйста, войдите снова.');
      } else {
        setError('Ошибка при загрузке данных дашборда: ' + (error.response?.data || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    return num.toLocaleString('ru-RU');
  };

  const formatFileSize = (characters) => {
    if (characters < 1000) return `${characters} симв.`;
    if (characters < 1000000) return `${(characters / 1000).toFixed(1)} тыс. симв.`;
    return `${(characters / 1000000).toFixed(1)} млн симв.`;
  };

  const handleRetry = () => {
    setError('');
    setLoading(true);
    fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="loading">
        <p>Загрузка дашборда...</p>
        <p>Пользователь: {user?.email}</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-welcome">
        <h1>Добро пожаловать, {user?.email}!</h1>
        <p>Используйте AI Конспектер для создания умных конспектов из ваших материалов</p>
      </div>

      {error && (
        <div className="error">
          {error}
          <button onClick={handleRetry} className="btn btn-secondary" style={{marginLeft: '1rem'}}>
            Повторить
          </button>
        </div>
      )}
      
      {/* Статистика */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>{formatNumber(stats.totalSummaries)}</h3>
            <p>Всего конспектов</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-info">
            <h3>{formatNumber(stats.favoriteSummaries)}</h3>
            <p>В избранном</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-info">
            <h3>{formatFileSize(stats.totalCharacters)}</h3>
            <p>Обработано символов</p>
          </div>
        </div>
      </div>
      
      {/* Быстрые действия */}
      <div className="dashboard-cards">
        <Link to="/summarize" className="card">
          <div className="card-icon">🎯</div>
          <div className="card-content">
            <h3>Создать конспект</h3>
            <p>Загрузите текст или документ для создания AI-конспекта</p>
          </div>
        </Link>
        
        <Link to="/history" className="card">
          <div className="card-icon">📚</div>
          <div className="card-content">
            <h3>История конспектов</h3>
            <p>Просмотрите ваши ранее созданные конспекты</p>
          </div>
        </Link>
        
        <Link to="/profile" className="card">
          <div className="card-icon">👤</div>
          <div className="card-content">
            <h3>Мой профиль</h3>
            <p>Управляйте вашими настройками и данными</p>
          </div>
        </Link>
      </div>
      
      {/* Недавние конспекты */}
      {recentSummaries.length > 0 && (
        <div className="recent-summaries">
          <h2>Недавние конспекты</h2>
          <div className="recent-grid">
            {recentSummaries.map((summary) => (
              <div key={summary.id} className="recent-card">
                <div className="recent-header">
                  <h4>{summary.title || `Конспект #${summary.id}`}</h4>
                  {summary.isFavorite && <span className="favorite-badge">⭐</span>}
                </div>
                <p className="recent-preview">
                  {summary.summaryText && summary.summaryText.length > 100 
                    ? `${summary.summaryText.substring(0, 100)}...`
                    : summary.summaryText
                  }
                </p>
                <div className="recent-meta">
                  <span>📅 {new Date(summary.createdAt).toLocaleDateString('ru-RU')}</span>
                  {summary.compressionRatio && (
                    <span>🎯 {Math.round((1 - summary.compressionRatio) * 100)}% сжатия</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="recent-actions">
            <Link to="/history" className="btn btn-secondary">
              Вся история
            </Link>
          </div>
        </div>
      )}

      {!error && recentSummaries.length === 0 && stats.totalSummaries === 0 && (
        <div className="empty-dashboard">
          <div className="empty-icon">📝</div>
          <h3>У вас пока нет конспектов</h3>
          <p>Создайте свой первый конспект, чтобы увидеть статистику и историю здесь</p>
          <Link to="/summarize" className="btn btn-primary">
            Создать первый конспект
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;