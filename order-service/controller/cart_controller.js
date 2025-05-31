const db = require('../database');

exports.createCart = async (req, res) => {
  const { user_id } = req.body;
  try { // Thêm try-catch block
    const result = await db.query(
      'INSERT INTO carts(user_id) VALUES($1) RETURNING *',
      [user_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error creating cart:', err); // Log lỗi để dễ debug
    res.status(500).json({ error: 'Failed to create cart', details: err.message }); // Trả về lỗi chi tiết hơn
  }
};

exports.addItemToCart = async (req, res) => {
  const { cartId } = req.params;
  const { product_id, quantity, price } = req.body;

  try {
    await db.query(
      'INSERT INTO cart_items(cart_id, product_id, quantity, price) VALUES ($1, $2, $3, $4) ON CONFLICT (cart_id, product_id) DO UPDATE SET quantity = EXCLUDED.quantity, price = EXCLUDED.price',
      [cartId, product_id, quantity, price]
    );
    res.json({ message: 'Item added/updated in cart' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCart = async (req, res) => {
  const { cartId } = req.params;

  const cart = await db.query('SELECT * FROM carts WHERE id = $1', [cartId]);
  const items = await db.query('SELECT * FROM cart_items WHERE cart_id = $1', [cartId]);

  res.json({ cart: cart.rows[0], items: items.rows });
};

// Cập nhật thông tin một item trong giỏ hàng
exports.updateCartItem = async (req, res) => {
  const { cartId, productId } = req.params;
  const { quantity, price } = req.body;

  try {
    const result = await db.query(
      'UPDATE cart_items SET quantity = $1, price = $2 WHERE cart_id = $3 AND product_id = $4 RETURNING *',
      [quantity, price, cartId, productId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    res.json({ message: 'Item updated', item: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Xóa một sản phẩm khỏi giỏ hàng
exports.deleteCartItem = async (req, res) => {
  const { cartId, productId } = req.params;

  try {
    const result = await db.query(
      'DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2 RETURNING *',
      [cartId, productId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    res.json({ message: 'Item deleted from cart' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Xóa toàn bộ giỏ hàng
exports.deleteCart = async (req, res) => {
  const { cartId } = req.params;

  try {
    await db.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);
    const result = await db.query('DELETE FROM carts WHERE id = $1 RETURNING *', [cartId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    res.json({ message: 'Cart deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
