const db = require('../database');

exports.getStats = async (req, res) => {
  const { date } = req.params;

  try {
    const result = await db.query(
      'SELECT * FROM order_stats WHERE stat_date = $1',
      [date]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No stats found for this date' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.saveStats = async (req, res) => {
  const { stat_date, total_orders, total_sales } = req.body;

  try {
    await db.query(
      `
        INSERT INTO order_stats(stat_date, total_orders, total_sales)
        VALUES ($1, $2, $3)
        ON CONFLICT (stat_date) DO UPDATE
        SET total_orders = EXCLUDED.total_orders,
            total_sales = EXCLUDED.total_sales
      `,
      [stat_date, total_orders, total_sales]
    );

    res.json({ message: 'Stats saved' });
  } catch (error) {
    console.error('Error saving stats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
