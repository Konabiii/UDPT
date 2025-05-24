const express = require('express');
const app = express();
require('dotenv').config();

const usersRouter = require('./routers/users.js');

app.use(express.json());

app.use('/api/users', usersRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const cors = require('cors');
app.use(cors()); // Cho phép mọi domain, hoặc cấu hình cụ thể nếu cần
