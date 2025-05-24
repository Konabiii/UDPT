// src/components/ForgotPassword.jsx
import React, { useState } from 'react';
//import axios from 'axios';
// You might want to reuse AuthPage.css or create specific styles

function ForgotPassword({ onBackToLogin }) {
  const [formData, setFormData] = useState({ email: '' }); //
  const [message, setMessage] = useState(''); //
  const [error, setError] = useState(''); //

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value }); //
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); //
    setMessage(''); //
    setError(''); //

    if (!formData.email) {
      setError('Vui lòng nhập số điện thoại hoặc email.'); //
      return;
    }

    try {
      // **IMPORTANT**: Replace with your actual API endpoint for sending a password reset code/link.
      // This is a placeholder for the frontend logic.
      // Example: await axios.post('/api/users/request-password-reset', formData);
      console.log('Requesting password reset for:', formData.email); //
      setMessage(`Nếu tài khoản ${formData.email} được tìm thấy, một hướng dẫn khôi phục mật khẩu sẽ được gửi.`); //
      setFormData({ email: '' }); // Optionally reset form
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error); //
      } else {
        setError('Đã có lỗi xảy ra. Vui lòng thử lại sau.'); //
      }
      console.error('Forgot password error:', err); //
    }
  };

  return (
    <div className="forgot-password-content"> {/* */}
      <h2>Quên Mật Khẩu</h2> {/* */}
      <p style={{ marginBottom: '20px', fontSize: '14px', color: '#555', textAlign: 'center' }}>
        Nhập email đã đăng ký của bạn. Chúng tôi sẽ gửi cho bạn một mã để đặt lại mật khẩu.
      </p> {/* */}
      <form onSubmit={handleSubmit}> {/* */}
        <div className="form-group"> {/* */}
          <label htmlFor="reset_email">Email</label> {/* */}
          <input
            type="text" // Using text to allow both phone and email easily
            id="reset_email"
            name="email"
            className="form-input-field" //
            value={formData.email}
            onChange={handleChange}
            placeholder="Nhập số điện thoại hoặc email"
            required
          /> {/* */}
        </div>
        <button type="submit" className="submit-button">Gửi mã</button> {/* */}
      </form>
      {message && <p className="message success" style={{ marginTop: '15px' }}>{message}</p>} {/* */}
      {error && <p className="message error" style={{ marginTop: '15px' }}>{error}</p>} {/* */}
      <button
        onClick={onBackToLogin} //
        className="form-link"
        style={{ display: 'block', textAlign: 'center', marginTop: '25px', color: '#007bff', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}
      >
        Quay lại Đăng nhập
      </button> {/* */}
    </div>
  );
}

export default ForgotPassword;