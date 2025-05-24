import React, { useState } from 'react';
import Register from './Register';
import Login from './Login';
import ForgotPassword from './ForgotPassword'; // Import the new component
import './AuthPage.css';

function AuthPage() {
  const [currentView, setCurrentView] = useState('login'); // 'login', 'register', 'forgotPassword'

  const showLogin = () => setCurrentView('login');
  const showRegister = () => setCurrentView('register');
  const showForgotPassword = () => setCurrentView('forgotPassword');

  return (
    <div className="auth-container">
      {currentView !== 'forgotPassword' && (
        <div className="auth-tabs">
          <button
            className={`tab-button ${currentView === 'login' ? 'active' : ''}`}
            onClick={showLogin}
          >
            Đăng nhập
          </button>
          <button
            className={`tab-button ${currentView === 'register' ? 'active' : ''}`}
            onClick={showRegister}
          >
            Đăng ký
          </button>
        </div>
      )}

      <div className="auth-content">
        {currentView === 'login' && <Login onForgotPasswordClick={showForgotPassword} />}
        {currentView === 'register' && <Register />}
        {currentView === 'forgotPassword' && <ForgotPassword onBackToLogin={showLogin} />}
      </div>
    </div>
  );
}

export default AuthPage;