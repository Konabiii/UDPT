import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import BookStoreApp from './components/BookStoreApp'; // Import BookStoreApp
// import DashboardPlaceholder from './components/DashboardPlaceholder'; // Không còn cần DashboardPlaceholder

// Component bảo vệ Route, yêu cầu đăng nhập để truy cập
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('user'); // Lấy thông tin người dùng từ localStorage

  if (!user) {
    // Nếu chưa đăng nhập, chuyển hướng về trang xác thực
    return <Navigate to="/auth" />;
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
            <Route path="/auth" element={<AuthPage />} />

            {/* Route cho trang chính của cửa hàng, được bảo vệ */}
            <Route
              path="/dashboard" // Giữ nguyên path /dashboard như cấu hình cũ của bạn
              element={
                <ProtectedRoute>
                  <BookStoreApp /> {/* Hiển thị BookStoreApp */}
                </ProtectedRoute>
              }
            />

            {/* Route mặc định: nếu đã đăng nhập thì vào dashboard, ngược lại vào trang xác thực */}
            <Route
              path="/"
              element={localStorage.getItem('user') ? <Navigate to="/dashboard" /> : <Navigate to="/auth" />}
            />
            {/* Bạn có thể thêm các Route khác ở đây */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
