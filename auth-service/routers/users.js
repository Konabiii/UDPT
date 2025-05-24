// users.js
const express = require('express');
const router = express.Router();
const pool = require('../database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// REGISTER
router.post('/register', async (req, res) => {
  const { email, password, full_name } = req.body;
  try {
    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Email không hợp lệ' });
    }
    // Kiểm tra độ dài mật khẩu
    if (password.length < 6) {
      return res.status(400).json({ error: 'Mật khẩu phải có ít nhất 6 ký tự' });
    }
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, full_name) VALUES ($1, $2, $3) RETURNING id, email, full_name',
      [email, hash, full_name]
    );
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Email không hợp lệ' });
    }
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Email không tồn tại' });
    }
    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Sai mật khẩu' });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({
      message: 'Đăng nhập thành công',
      user: { id: user.id, email: user.email, full_name: user.full_name },
      token
    });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi máy chủ' });
  }
});

// Middleware để xác thực JWT cho các API bảo vệ
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Không có token' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token không hợp lệ' });
  }
};

// UPDATE user
router.put('/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const { email, password, full_name } = req.body;
  if (req.user.id !== parseInt(id)) {
    return res.status(403).json({ error: 'Không có quyền cập nhật' });
  }
  try {
    let password_hash;
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ error: 'Mật khẩu phải có ít nhất 6 ký tự' });
      }
      password_hash = await bcrypt.hash(password, 10);
    }
    const fields = [];
    const values = [];
    let idx = 1;
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Email không hợp lệ' });
      }
      fields.push(`email = $${idx++}`);
      values.push(email);
    }
    if (password_hash) {
      fields.push(`password_hash = $${idx++}`);
      values.push(password_hash);
    }
    if (full_name) {
      fields.push(`full_name = $${idx++}`);
      values.push(full_name);
    }
    if (fields.length === 0) {
      return res.status(400).json({ error: 'Không có trường nào để cập nhật' });
    }
    values.push(id);
    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${idx} RETURNING id, email, full_name`;
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User không tồn tại' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE user
router.delete('/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  if (req.user.id !== parseInt(id)) {
    return res.status(403).json({ error: 'Không có quyền xóa' });
  }
  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id, email, full_name', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User không tồn tại' });
    }
    res.json({ message: 'Xóa user thành công', user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;