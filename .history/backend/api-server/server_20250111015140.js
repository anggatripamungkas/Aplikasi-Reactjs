require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const loginRoutes = require('./routes/login');
const placeRoutes = require('./routes/place');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/login', loginRoutes);
app.use('/api/places', placeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
