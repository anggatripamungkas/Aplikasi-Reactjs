const express = require('express');
const { createPlace, getPlaces } = require('../controllers/placeController');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware untuk memverifikasi token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Ambil token dari header
  if (!token) {
    return res.status(401).json({ message: 'Token tidak ada' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifikasi token
    req.user = decoded; // Simpan informasi user dari token
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token tidak valid' });
  }
};

// Route untuk membuat laporan
router.post('/', verifyToken, createPlace);

// Route untuk mendapatkan semua laporan
router.get('/', verifyToken, getPlaces);

// Route untuk verifikasi token
router.get('/verify-token', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token tidak ada' });
  }

  try {
     // Verifikasi token dengan kunci yang sama (JWT_SECRET) yang digunakan saat membuat token
     const decoded = jwt.verify(token, process.env.JWT_SECRET);
     req.user = decoded; // Menyimpan informasi user dari token
     next(); // Lanjutkan ke rute berikutnya jika token valid
  } catch (error) {
    res.status(401).json({ message: 'Token tidak valid' });
  }
});

module.exports = router;
