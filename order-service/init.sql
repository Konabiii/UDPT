-- Table: orders
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: order_items
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  product_id VARCHAR(100),
  quantity INTEGER,
  price DECIMAL(10,2)
);

-- Table: order_stats (optional)
CREATE TABLE order_stats (
  id SERIAL PRIMARY KEY,
  stat_date DATE NOT NULL,
  total_orders INTEGER,
  total_sales DECIMAL(10,2)
);