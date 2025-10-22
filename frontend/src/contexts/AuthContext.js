import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Функция для загрузки профиля пользователя
  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/profile');
      setUserProfile(response.data);
      return response.data;
    } catch (error) {
      console.error('Ошибка при загрузке профиля:', error);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userEmail = localStorage.getItem('userEmail');
    
    if (token && userEmail) {
      setUser({ email: userEmail, token });
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Загружаем профиль пользователя после установки токена
      fetchUserProfile();
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:8081/api/auth/login', {
        email,
        password
      });

      const { token } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('userEmail', email);
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser({ email, token });
      
      // Загружаем профиль после успешного входа
      const profile = await fetchUserProfile();
      
      return { success: true, profile };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Login failed' 
      };
    }
  };

  const register = async (email, phoneNumber, password) => {
    try {
      await axios.post('http://localhost:8081/api/auth/register', {
        email,
        phoneNumber,
        password
      });

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setUserProfile(null); // Сбрасываем профиль при выходе
  };

  // Функция для обновления профиля (можно вызывать после редактирования профиля)
  const updateUserProfile = (profileData) => {
    setUserProfile(profileData);
  };

  const value = {
    user,
    userProfile,
    login,
    register,
    logout,
    loading,
    fetchUserProfile,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};