import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { user, updateUserProfile } = useAuth(); // Выносим useAuth на верхний уровень
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    bio: '',
    avatarUrl: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/profile');
      setProfile(response.data);
      setFormData({
        firstName: response.data.firstName || '',
        lastName: response.data.lastName || '',
        phoneNumber: response.data.phoneNumber || '',
        bio: response.data.bio || '',
        avatarUrl: response.data.avatarUrl || ''
      });
    } catch (error) {
      console.error('Profile fetch error:', error);
      setError('Ошибка при загрузке профиля');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.put('http://localhost:8081/api/profile', formData);
      setProfile(response.data.profile);
      setSuccess(response.data.message);
      setEditMode(false);
      
      // Обновляем профиль в контексте
      updateUserProfile(response.data.profile);
      
      // Обновляем форму данными с сервера
      setFormData({
        firstName: response.data.profile.firstName || '',
        lastName: response.data.profile.lastName || '',
        phoneNumber: response.data.profile.phoneNumber || '',
        bio: response.data.profile.bio || '',
        avatarUrl: response.data.profile.avatarUrl || ''
      });
    } catch (error) {
      console.error('Profile update error:', error);
      setError(error.response?.data || 'Ошибка при обновлении профиля');
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      phoneNumber: profile?.phoneNumber || '',
      bio: profile?.bio || '',
      avatarUrl: profile?.avatarUrl || ''
    });
    setEditMode(false);
    setError('');
    setSuccess('');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading">Загрузка профиля...</div>;
  }

  return (
    <div className="profile">
      <div className="profile-header">
        <h1>Мой профиль</h1>
        {!editMode && (
          <button 
            onClick={() => setEditMode(true)}
            className="btn btn-primary"
          >
            Редактировать профиль
          </button>
        )}
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="profile-content">
        {!editMode ? (
          // Режим просмотра
          <div className="profile-view">
            <div className="profile-card">
              <div className="profile-avatar">
                {profile?.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="Аватар" />
                ) : (
                  <div className="avatar-placeholder">
                    {profile?.firstName ? profile.firstName[0].toUpperCase() : 'U'}
                  </div>
                )}
              </div>
              
              <div className="profile-info">
                <h2>{profile?.fullName || 'Пользователь'}</h2>
                <p className="profile-email">{profile?.email}</p>
                
                <div className="profile-details">
                  {profile?.phoneNumber && (
                    <div className="detail-item">
                      <strong>Телефон:</strong> {profile.phoneNumber}
                    </div>
                  )}
                  
                  {profile?.bio && (
                    <div className="detail-item">
                      <strong>О себе:</strong> 
                      <p>{profile.bio}</p>
                    </div>
                  )}
                  
                  <div className="detail-item">
                    <strong>Дата регистрации:</strong> {formatDate(profile?.createdAt)}
                  </div>
                  
                  {profile?.lastLogin && (
                    <div className="detail-item">
                      <strong>Последний вход:</strong> {formatDate(profile.lastLogin)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Режим редактирования
          <div className="profile-edit">
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Имя:</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Введите ваше имя"
                  />
                </div>
                
                <div className="form-group">
                  <label>Фамилия:</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Введите вашу фамилию"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Номер телефона:</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="+7 (XXX) XXX-XX-XX"
                />
              </div>

              <div className="form-group">
                <label>URL аватара:</label>
                <input
                  type="url"
                  name="avatarUrl"
                  value={formData.avatarUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              <div className="form-group">
                <label>О себе:</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Расскажите о себе..."
                  rows="4"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Сохранить изменения
                </button>
                <button 
                  type="button" 
                  onClick={handleCancel}
                  className="btn btn-secondary"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <ChangePassword />
    </div>
  );
};

// Компонент для смены пароля
const ChangePassword = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8081/api/profile/change-password', formData);
      setSuccess(response.data.message);
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowForm(false);
    } catch (error) {
      console.error('Password change error:', error);
      setError(error.response?.data || 'Ошибка при изменении пароля');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setError('');
    setSuccess('');
  };

  return (
    <div className="change-password-section">
      <div className="section-header">
        <h3>Безопасность</h3>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="btn btn-secondary"
          >
            Сменить пароль
          </button>
        )}
      </div>

      {showForm && (
        <div className="password-form-container">
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}

          <form onSubmit={handleSubmit} className="password-form">
            <div className="form-group">
              <label>Текущий пароль:</label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Новый пароль:</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                required
                minLength="6"
              />
            </div>

            <div className="form-group">
              <label>Подтвердите новый пароль:</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                minLength="6"
              />
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Смена пароля...' : 'Сменить пароль'}
              </button>
              <button 
                type="button" 
                onClick={handleCancel}
                className="btn btn-secondary"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;