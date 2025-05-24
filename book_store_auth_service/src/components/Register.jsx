import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [formData, setFormData] = useState({
    email: '', // Will serve as 'Số điện thoại/Email'
    password: '',
    full_name: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!formData.full_name || !formData.email || !formData.password) {
      setError('Vui lòng điền đầy đủ thông tin.');
      return;
    }
    // Basic password validation (example)
    if (formData.password.length < 6) {
        setError('Mật khẩu phải có ít nhất 6 ký tự.');
        return;
    }

    try {
      await axios.post('/api/users/register', formData);
      setMessage('Đăng ký thành công! Bạn có thể đăng nhập ngay.');
      setFormData({ email: '', password: '', full_name: '' });
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Đã có lỗi xảy ra khi đăng ký. Vui lòng thử lại.');
      }
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="register-form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="reg_full_name">Họ và Tên</label>
          <input
            type="text"
            id="reg_full_name"
            name="full_name"
            className="form-input-field" 
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Nhập họ và tên"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="reg_email">Email</label>
          <input
            type="text" // Changed to text for flexibility
            id="reg_email"
            name="email"
            className="form-input-field" // Apply general class
            value={formData.email}
            onChange={handleChange}
            placeholder="Nhập email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="reg_password">Mật khẩu</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              id="reg_password"
              name="password"
              className="form-input-field password-input-field" // Apply general class
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
              required
            />
            <button
              type="button"
              className="show-hide-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Ẩn" : "Hiện"}
            </button>
          </div>
        </div>
        <button type="submit" className="submit-button">Đăng ký</button>
      </form>
      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}
    </div>
  );
}

export default Register;