import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import './App.css';

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentSummaries, setRecentSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchRecentSummaries();
    fetchUserProfile();
  }, []);

  const fetchRecentSummaries = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/summaries?limit=3');
      setRecentSummaries(response.data);
    } catch (error) {
      console.error('Error fetching recent summaries:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/profile');
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await axios.post('http://localhost:8081/api/summarize/file', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        // После успешной загрузки переходим на страницу суммаризатора с результатом
        navigate('/summarize', { state: { summaryResult: response.data } });
      } catch (error) {
        console.error('File upload error:', error);
        alert('Ошибка при загрузке файла');
      }
    }
  };

  const handleTextSummarize = () => {
    // Переход на страницу суммаризатора для ввода текста
    navigate('/summarize');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleSummaryClick = (summaryId) => {
    navigate(`/history#${summaryId}`);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getCompressionPercentage = (summary) => {
    if (summary.compressionRatio) {
      return `${Math.round((1 - summary.compressionRatio) * 100)}% сжатия`;
    }
    if (summary.originalLength && summary.summaryLength) {
      const ratio = summary.summaryLength / summary.originalLength;
      return `${Math.round((1 - ratio) * 100)}% сжатия`;
    }
    return '';
  };

  return (
    <div className="homepage">
      <div className="homepage-container">
        <div className="homepage-content">
          {/* Основной контент */}
          <div className="main-content">
            {/* Баннер */}
            <div className="hero-banner">
              <h1>Искусственный интеллект напишет за вас конспект</h1>
              <p>Быстрое и качественное создание конспектов из любых текстов и документов</p>
            </div>

            {/* Создание конспекта */}
            <div className="create-summary">
              <h2>Создайте новый конспект</h2>
              
              <div className="example-text">
                <p><strong>Пример:</strong> Напиши конспект по этой презентации</p>
                <div className="example-placeholder">
                  <div className="placeholder-line"></div>
                  <div className="placeholder-line"></div>
                </div>
                
                {/* Кнопка для текстового суммаризатора */}
                <button 
                  onClick={handleTextSummarize}
                  className="btn btn-primary"
                  style={{ marginTop: '1rem', width: '100%' }}
                >
                  📝 Начать создание конспекта
                </button>
              </div>

            </div>
          </div>

          {/* Боковая панель */}
          <div className="sidebar">
            {/* Профиль */}
            <div className="sidebar-profile" onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
              <div className="profile-header-sidebar">
                <div className="profile-avatar-sidebar">
                  {profile?.avatarUrl ? (
                    <img src={profile.avatarUrl} alt="Аватар" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                  ) : (
                    getInitials(profile?.fullName || user?.email)
                  )}
                </div>
                <div className="profile-info-sidebar">
                  <h3>{profile?.fullName || user?.email}</h3>
                  <p>{user?.email}</p>
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
                Нажмите для просмотра профиля →
              </div>
            </div>

            {/* Недавние конспекты */}
            <div className="recent-summaries-sidebar">
              <h3>Недавние конспекты</h3>
              
              {loading ? (
                <div className="loading">Загрузка...</div>
              ) : recentSummaries.length > 0 ? (
                recentSummaries.map(summary => (
                  <div 
                    key={summary.id} 
                    className="recent-item"
                    onClick={() => handleSummaryClick(summary.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="recent-item-header">
                      <h4 className="recent-item-title">
                        {summary.title || `Конспект #${summary.id}`}
                      </h4>
                      <span className="recent-item-meta">
                        {formatDate(summary.createdAt)}
                      </span>
                    </div>
                    <p className="recent-item-preview">
                      {summary.summaryText && summary.summaryText.length > 80 
                        ? `${summary.summaryText.substring(0, 80)}...`
                        : summary.summaryText
                      }
                    </p>
                    <div className="recent-item-stats">
                      <span>{summary.documentType || 'Текст'}</span>
                      <span className="compression-badge">
                        {getCompressionPercentage(summary)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>Пока нет созданных конспектов</p>
                  <button 
                    onClick={handleTextSummarize}
                    className="btn btn-primary"
                    style={{ marginTop: '1rem' }}
                  >
                    Создать первый конспект
                  </button>
                </div>
              )}

              {recentSummaries.length > 0 && (
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                  <button 
                    onClick={() => navigate('/history')}
                    className="btn btn-secondary"
                  >
                    Вся история →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;