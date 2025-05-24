import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './components/AuthPage'; //
import DashboardPlaceholder from './components/DashboardPlaceholder'; // Component dashboard mẫu
import './App.css'; // File CSS chung của App (nếu có)

// Component bảo vệ Route, yêu cầu đăng nhập để truy cập
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('user'); // Kiểm tra xem có thông tin user trong localStorage không
  if (!user) {
    // Nếu chưa đăng nhập, chuyển hướng về trang xác thực
    return <Navigate to="/auth" />; //
  }
  return children; // Nếu đã đăng nhập, cho phép truy cập
};

function App() {
  return (
    <Router>
      <div className="App">
        <main>
          <Routes>
            {/* Route cho trang xác thực (đăng nhập/đăng ký) */}
            <Route path="/auth" element={<AuthPage />} /> {/* */}

            {/* Route cho trang dashboard, được bảo vệ */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPlaceholder />
                </ProtectedRoute>
              } 
            /> {/* */}

            {/* Route mặc định: nếu đã đăng nhập thì vào dashboard, ngược lại vào trang xác thực */}
            <Route
              path="/"
              element={localStorage.getItem('user') ? <Navigate to="/dashboard" /> : <Navigate to="/auth" />}
            /> {/* */}
            {/* Bạn có thể thêm các Route khác ở đây */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;