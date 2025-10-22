import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <h1>Добро пожаловать, {user?.email}!</h1>
      <p>Используйте AI Конспектер для создания умных конспектов из ваших материалов</p>
      
      <div className="dashboard-cards">
        <Link to="/summarize" className="card">
          <h3>📝 Создать конспект</h3>
          <p>Загрузите текст или документ для создания AI-конспекта</p>
        </Link>
        
        <Link to="/history" className="card">
          <h3>📚 История конспектов</h3>
          <p>Просмотрите ваши ранее созданные конспекты</p>
        </Link>
      </div>
      
      <div className="features mt-2">
        <h2>Возможности:</h2>
        <ul style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
          <li>📄 Поддержка различных форматов: PDF, DOCX, TXT</li>
          <li>🤖 Умное AI-конспектирование с помощью Gemini</li>
          <li>💾 Сохранение истории конспектов</li>
          <li>📥 Скачивание конспектов в виде файлов</li>
          <li>🔐 Безопасная аутентификация</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;