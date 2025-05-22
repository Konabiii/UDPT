CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  order_id INTEGER,
  amount DECIMAL(10,2) NOT NULL,
  method VARCHAR(50),
  status VARCHAR(20) DEFAULT 'pending',
  paid_at TIMESTAMP
);
