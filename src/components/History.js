import React, { useState, useEffect } from 'react';
import axios from 'axios';

const History = () => {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSummaries();
  }, []);

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('ru-RU');
  };

  if (loading) {
    return <div className="loading">Загрузка истории...</div>;
  }

  return (
    <div className="history">
      <h1>История конспектов</h1>
      
      {error && <div className="error">{error}</div>}
      
      {summaries.length === 0 ? (
        <div className="text-center">
          <p>У вас пока нет созданных конспектов.</p>
          <p>
            <a href="/summarize" className="btn btn-primary">
              Создать первый конспект
            </a>
          </p>
        </div>
      ) : (
        <div>
          {summaries.map((summary) => (
            <div key={summary.id} className="history-item">
              <div className="history-date">
                Создано: {formatDate(summary.createdAt)}
              </div>
              
              {summary.originalText && (
                <div className="history-original">
                  <strong>Исходный текст:</strong><br />
                  {summary.originalText.length > 200 
                    ? `${summary.originalText.substring(0, 200)}...` 
                    : summary.originalText}
                </div>
              )}
              
              <div className="history-summary">
                <strong>Конспект:</strong><br />
                {summary.summaryText}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;