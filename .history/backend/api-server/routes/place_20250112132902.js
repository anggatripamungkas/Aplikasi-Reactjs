const express = require('express');
const { createPlace, getPlaces, deletePlace } = require('../controllers/placeController');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware untuk memverifikasi token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token tidak ada' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token tidak valid' });
  }
};

// Route untuk membuat laporan
router.post('/', verifyToken, createPlace);

// Route untuk mendapatkan semua laporan
router.get('/', verifyToken, getPlaces);

// Route untuk menghapus laporan berdasarkan ID
router.delete('/:id', verifyToken, deletePlace);  // Menambahkan route DELETE

// Route untuk verifikasi token
router.get('/verify-token', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token tidak ada' });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ message: 'Token valid' });
  } catch (error) {
    res.status(401).json({ message: 'Token tidak valid' });
  }
});

module.exports = router;
