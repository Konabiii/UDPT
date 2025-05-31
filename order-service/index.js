const express = require('express');
const app = express();
require('dotenv').config(); // Di chuyển lên đầu để nạp biến môi trường sớm nhất
const cors = require('cors'); // Di chuyển lên đầu cùng các require khác

const usersRouter = require('./routers/users.js');
const cartRoutes = require('./routers/cart'); // Thêm dòng này
const orderRoutes = require('./routers/oder'); // Thêm dòng này
const statsRoutes = require('./routers/start'); // Thêm dòng này

app.use(express.json());
app.use(cors()); // Sử dụng CORS middleware ở đây, sau express.json() và trước các route

app.use('/api/users', usersRouter);
app.use('/api/cart', cartRoutes); // Thêm dòng này
app.use('/api/order', orderRoutes); // Thêm dòng này
app.use('/api/stats', statsRoutes); // Thêm dòng này

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});