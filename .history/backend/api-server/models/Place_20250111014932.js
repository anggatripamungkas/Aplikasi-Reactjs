const mongoose = require('mongoose');

const PlaceSchema = new mongoose.Schema({
  location: { type: String, required: true },
  description: { type: String, required: true },
});

module.exports = mongoose.model('Place', PlaceSchema, 'place');
