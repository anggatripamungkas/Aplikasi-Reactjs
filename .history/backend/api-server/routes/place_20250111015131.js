const express = require('express');
const { createPlace, getPlaces } = require('../controllers/placeController');
const router = express.Router();

router.post('/', createPlace);
router.get('/', getPlaces);

module.exports = router;
