import React, { useState } from 'react';
import axios from 'axios';
// Import các component UI từ Shadcn UI
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// Không còn cần Select components vì không chọn vai trò nữa
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

function Login({ onForgotPasswordClick }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    // role: 'buyer' // Không cần khởi tạo role ở đây nữa, sẽ gán cứng khi gửi request
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Hàm handleRoleChange không còn cần thiết

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!formData.email || !formData.password) {
      setError('Vui lòng nhập email và mật khẩu.');
      return;
    }

    try {
      // Gửi request đăng nhập với vai trò mặc định là 'buyer'
      const response = await axios.post('/api/users/login', {
        email: formData.email,
        password: formData.password,
        role: 'buyer' // Gán cứng vai trò là 'buyer' khi gửi request
      });
      setMessage('Đăng nhập thành công!');
      console.log('Login successful:', response.data);

      // Lưu thông tin người dùng và vai trò 'buyer' vào localStorage
      localStorage.setItem('user', JSON.stringify({ ...response.data.user, role: 'buyer' }));
      // localStorage.setItem('userRole', 'buyer'); // Không cần lưu role riêng nữa nếu nó luôn là 'buyer'

      setFormData({ email: '', password: '' }); // Reset form
      window.location.href = '/dashboard'; // Chuyển hướng sau khi đăng nhập thành công
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Đã có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.');
      }
      console.error('Login error:', err);
    }
  };

  return (
    <div className="login-form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <Label htmlFor="login_email">Email</Label>
          <Input
            id="login_email"
            name="email"
            type="text"
            value={formData.email}
            onChange={handleChange}
            placeholder="Nhập email"
            required
          />
        </div>

        <div className="form-group">
          <Label htmlFor="login_password">Mật khẩu</Label>
          <div className="password-wrapper">
            <Input
              id="login_password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
              required
            />
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowPassword(!showPassword)}
              className="show-hide-btn"
            >
              {showPassword ? "Ẩn" : "Hiện"}
            </Button>
          </div>
          <Button
            type="button"
            variant="link"
            onClick={onForgotPasswordClick}
            className="forgot-password-link"
          >
            Quên mật khẩu?
          </Button>
        </div>

        {/* Đã xóa ô chọn vai trò */}

        <Button type="submit" className="submit-button mt-4">
          Đăng nhập
        </Button>
      </form>

      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}
    </div>
  );
}

export default Login;
