const db = require('../database');

exports.createOrder = async (req, res) => {
  const { user_id, items } = req.body;
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  try {
    const order = await db.query(
      'INSERT INTO orders(user_id, total) VALUES ($1, $2) RETURNING *',
      [user_id, total]
    );
    const orderId = order.rows[0].id;

    for (const item of items) {
      await db.query(
        'INSERT INTO order_items(order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [orderId, item.product_id, item.quantity, item.price]
      );
    }

    res.json({ message: 'Order created', orderId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await db.query('SELECT * FROM orders WHERE id = $1', [orderId]);

    const items = await db.query('SELECT * FROM order_items WHERE order_id = $1', [orderId]);

    res.json({ order: order.rows[0], items: items.rows });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};