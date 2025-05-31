const express = require('express');
const router = express.Router();
const pool = require('../database');
const bcrypt = require('bcrypt');

// REGISTER
router.post('/register', async (req, res) => {
  const { email, password, full_name } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, full_name) VALUES ($1, $2, $3) RETURNING *',
      [email, hash, full_name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Email không tồn tại' });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Sai mật khẩu' });
    }

    res.json({ message: 'Đăng nhập thành công', user: { id: user.id, email: user.email, full_name: user.full_name } });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi máy chủ' });
  }
});

// UPDATE user (edit thông tin user)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { email, password, full_name } = req.body;

  try {
    // Nếu có password, hash lại
    let password_hash;
    if (password) {
      password_hash = await bcrypt.hash(password, 10);
    }

    // Câu truy vấn update động dựa vào dữ liệu gửi lên
    const fields = [];
    const values = [];
    let idx = 1;

    if (email) {
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

    values.push(id); // id cuối cùng
    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User không tồn tại' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE user theo id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User không tồn tại' });
    }
    res.json({ message: 'Xóa user thành công', user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
