
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

const PORT = process.env.PORT || 8083;
app.listen(PORT, '127.0.0.1', () => console.log(`✅ Server running on http://127.0.0.1:${PORT}`));
