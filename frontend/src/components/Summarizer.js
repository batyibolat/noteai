import React, { useState } from 'react';
import axios from 'axios';

const Summarizer = () => {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSummarize = async () => {
    if (!text.trim()) {
      setError('Пожалуйста, введите текст для конспектирования');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8080/api/summaries/summarize', {
        text: text
      });

      setSummary(response.data.summary);
    } catch (error) {
      setError(error.response?.data || 'Ошибка при создании конспекта');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/api/summarize/file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSummary(response.data.summary);
    } catch (error) {
      setError(error.response?.data?.error || 'Ошибка при обработке файла');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([summary], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'конспект.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleClear = () => {
    setText('');
    setSummary('');
    setError('');
  };

  return (
    <div className="summarizer">
      <h1>Создание AI-конспекта</h1>
      
      {error && <div className="error">{error}</div>}
      
      <div className="file-upload">
        <input
          type="file"
          id="file-upload"
          onChange={handleFileUpload}
          accept=".pdf,.docx,.doc,.txt"
          style={{ display: 'none' }}
        />
        <label htmlFor="file-upload" className="upload-btn">
          📁 Загрузить файл (PDF, DOCX, TXT)
        </label>
        <span>или введите текст ниже:</span>
      </div>

      <textarea
        className="text-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Введите текст для конспектирования или загрузите файл..."
        disabled={loading}
      />

      <div className="actions">
        <button 
          onClick={handleSummarize} 
          className="btn btn-primary"
          disabled={loading || !text.trim()}
        >
          {loading ? 'Создание конспекта...' : 'Создать конспект'}
        </button>
        
        <button 
          onClick={handleClear} 
          className="btn btn-secondary"
          disabled={loading}
        >
          Очистить
        </button>
      </div>

      {summary && (
        <div className="summary-result">
          <h3>Ваш конспект:</h3>
          <div className="summary-text">{summary}</div>
          
          <button 
            onClick={handleDownload} 
            className="download-btn"
          >
            📥 Скачать конспект
          </button>
        </div>
      )}
      
      {loading && (
        <div className="loading">
          <p>AI обрабатывает ваш запрос... Это может занять несколько секунд.</p>
        </div>
      )}
    </div>
  );
};

export default Summarizer;