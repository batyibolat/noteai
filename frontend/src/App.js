import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import Login from './components/Login';
import Footer from './components/Footer';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Summarizer from './components/Summarizer';
import History from './components/History';
import Profile from './components/Profile';
import Calculator from './components/Calculator';
import Navbar from './components/Navbar';
import ThemeToggle from './components/ThemeToggle';
import HomePage from './components/HomePage';
import './components/App.css';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

// В файле App.js, обновите компонент AppContent
function AppContent() {
  const { isDark } = useTheme();

  return (
    <div className={`App ${isDark ? 'dark-theme' : 'light-theme'}`}>
      <Navbar />
      <ThemeToggle />
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <HomePage />
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/summarize" 
            element={
              <ProtectedRoute>
                <Summarizer />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/history" 
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/calculator" 
            element={
              <ProtectedRoute>
                <Calculator />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;