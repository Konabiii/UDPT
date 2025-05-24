import React, { useState } from 'react';
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

function Login({ onForgotPasswordClick }) { // Receive prop
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  }); //
  const [message, setMessage] = useState(''); //
  const [error, setError] = useState(''); //
  const [showPassword, setShowPassword] = useState(false); //
  // const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value }); //
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); //
    setMessage(''); //
    setError(''); //

    if (!formData.email || !formData.password) {
      setError('Vui lòng nhập email và mật khẩu.'); //
      return;
    }

    try {
      const response = await axios.post('/api/users/login', formData); //
      setMessage('Đăng nhập thành công!'); //
      console.log('Login successful:', response.data); //
      localStorage.setItem('user', JSON.stringify(response.data.user)); //
      setFormData({ email: '', password: ''}); //
      window.location.href = '/dashboard'; //
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error); //
      } else {
        setError('Đã có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.'); //
      }
      console.error('Login error:', err); //
    }
  };

  return (
    <div className="login-form-container"> {/* */}
      <form onSubmit={handleSubmit}> {/* */}
        <div className="form-group"> {/* */}
          <label htmlFor="login_email">Email</label> {/* */}
          <input
            type="text" // Changed to text for flexibility
            id="login_email"
            name="email"
            className="form-input-field" // Apply general class
            value={formData.email}
            onChange={handleChange}
            placeholder="Nhập email"
            required
          /> {/* */}
        </div>
        <div className="form-group"> {/* */}
          <label htmlFor="login_password">Mật khẩu</label> {/* */}
          <div className="password-wrapper"> {/* */}
            <input
              type={showPassword ? "text" : "password"} //
              id="login_password"
              name="password"
              className="form-input-field password-input-field" // Apply general class
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
              required
            /> {/* */}
            <button
              type="button"
              className="show-hide-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Ẩn" : "Hiện"}
            </button> {/* */}
          </div>
           {/* "Quên mật khẩu?" link moved here */}
           <button
            type="button" // Important: type="button" so it doesn't submit the form
            onClick={onForgotPasswordClick} // Use the passed prop
            className="form-link forgot-password-link" //
          >
            Quên mật khẩu?
          </button> {/* */}
        </div>
        <button type="submit" className="submit-button">Đăng nhập</button> {/* */}
      </form>
      {message && <p className="message success">{message}</p>} {/* */}
      {error && <p className="message error">{error}</p>} {/* */}
    </div>
  );
}

export default Login;