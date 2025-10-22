import React, { useState, useEffect } from 'react';
import axios from 'axios';

const History = () => {
  const [summaries, setSummaries] = useState([]);
  const [filteredSummaries, setFilteredSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, favorites
  const [selectedSummary, setSelectedSummary] = useState(null);

  useEffect(() => {
    fetchSummaries();
  }, []);

  useEffect(() => {
    filterSummaries();
  }, [summaries, searchTerm, filter]);

  const fetchSummaries = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/summaries');
      setSummaries(response.data);
    } catch (error) {
      console.error('History fetch error:', error);
      setError('Ошибка при загрузке истории');
    } finally {
      setLoading(false);
    }
  };

  const filterSummaries = () => {
    let filtered = summaries;

    // Фильтр по избранному
    if (filter === 'favorites') {
      filtered = filtered.filter(summary => summary.isFavorite);
    }

    // Поиск
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(summary => 
        summary.title?.toLowerCase().includes(term) ||
        summary.summaryText?.toLowerCase().includes(term) ||
        summary.tags?.toLowerCase().includes(term)
      );
    }

    setFilteredSummaries(filtered);
  };

  const handleToggleFavorite = async (summaryId) => {
    try {
      const response = await axios.post(`http://localhost:8081/api/summaries/${summaryId}/favorite`);
      
      // Обновляем локальное состояние
      setSummaries(prev => prev.map(summary => 
        summary.id === summaryId 
          ? { ...summary, isFavorite: response.data.isFavorite }
          : summary
      ));
    } catch (error) {
      console.error('Toggle favorite error:', error);
      setError('Ошибка при обновлении избранного');
    }
  };

  const handleDeleteSummary = async (summaryId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот конспект?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8081/api/summaries/${summaryId}`);
      setSummaries(prev => prev.filter(summary => summary.id !== summaryId));
    } catch (error) {
      console.error('Delete summary error:', error);
      setError('Ошибка при удалении конспекта');
    }
  };

  const handleDownloadSummary = (summary) => {
    const content = `Конспект: ${summary.title}\n\n${summary.summaryText}\n\nСоздан: ${formatDate(summary.createdAt)}`;
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain; charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `конспект-${summary.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (length) => {
    if (!length) return '0 символов';
    return `${length.toLocaleString()} символов`;
  };

  const getCompressionPercentage = (ratio) => {
    if (!ratio) return '0%';
    return `${Math.round((1 - ratio) * 100)}%`;
  };

  if (loading) {
    return <div className="loading">Загрузка истории...</div>;
  }

  return (
    <div className="history">
      <div className="history-header">
        <h1>История конспектов</h1>
        <div className="history-stats">
          Всего: {summaries.length} | 
          Показано: {filteredSummaries.length} |
          Избранных: {summaries.filter(s => s.isFavorite).length}
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {/* Панель поиска и фильтров */}
      <div className="history-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Поиск по названию, содержанию или тегам..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Все
          </button>
          <button 
            className={`filter-btn ${filter === 'favorites' ? 'active' : ''}`}
            onClick={() => setFilter('favorites')}
          >
            ⭐ Избранные
          </button>
        </div>
      </div>

      {filteredSummaries.length === 0 ? (
        <div className="empty-state">
          {summaries.length === 0 ? (
            <>
              <h3>У вас пока нет созданных конспектов</h3>
              <p>Создайте свой первый конспект, чтобы увидеть его здесь</p>
              <a href="/summarize" className="btn btn-primary">
                Создать первый конспект
              </a>
            </>
          ) : (
            <>
              <h3>Конспекты не найдены</h3>
              <p>Попробуйте изменить поисковый запрос или фильтр</p>
            </>
          )}
        </div>
      ) : (
        <div className="history-grid">
          {filteredSummaries.map((summary) => (
            <div key={summary.id} className="history-card">
              <div className="card-header">
                <h3 className="card-title">
                  {summary.title || `Конспект #${summary.id}`}
                </h3>
                <div className="card-actions">
                  <button 
                    onClick={() => handleToggleFavorite(summary.id)}
                    className={`favorite-btn ${summary.isFavorite ? 'favorited' : ''}`}
                    title={summary.isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
                  >
                    ⭐
                  </button>
                  <button 
                    onClick={() => handleDownloadSummary(summary)}
                    className="action-btn"
                    title="Скачать конспект"
                  >
                    📥
                  </button>
                  <button 
                    onClick={() => handleDeleteSummary(summary.id)}
                    className="action-btn delete"
                    title="Удалить конспект"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <div className="card-meta">
                <span className="meta-item">
                  📅 {formatDate(summary.createdAt)}
                </span>
                {summary.originalLength && (
                  <span className="meta-item">
                    📊 {formatFileSize(summary.originalLength)} → {formatFileSize(summary.summaryLength)}
                  </span>
                )}
                {summary.compressionRatio && (
                  <span className="meta-item">
                    🎯 Сжатие: {getCompressionPercentage(summary.compressionRatio)}
                  </span>
                )}
                {summary.documentType && (
                  <span className="meta-item">
                    📄 {summary.documentType}
                  </span>
                )}
              </div>

              <div className="card-content">
                <div className="summary-preview">
                  {summary.summaryText && summary.summaryText.length > 200 
                    ? `${summary.summaryText.substring(0, 200)}...`
                    : summary.summaryText
                  }
                </div>

                {summary.originalText && (
                  <details className="original-text-details">
                    <summary>Показать исходный текст</summary>
                    <div className="original-text">
                      {summary.originalText.length > 500 
                        ? `${summary.originalText.substring(0, 500)}...`
                        : summary.originalText
                      }
                    </div>
                  </details>
                )}

                {summary.tags && (
                  <div className="card-tags">
                    {summary.tags.split(',').map((tag, index) => (
                      <span key={index} className="tag">
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;