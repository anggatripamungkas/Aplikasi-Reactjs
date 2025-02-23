const Place = require('../models/Place');

exports.createPlace = async (req, res) => {
  try {
    const { location, description } = req.body;

    const newPlace = new Place({ location, description });
    await newPlace.save();

    res.status(201).json(newPlace);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getPlaces = async (req, res) => {
  try {
    const places = await Place.find();
    res.status(200).json(places);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fungsi deletePlace yang baru
exports.deletePlace = async (req, res) => {
  try {
    const { id } = req.params;  // Mengambil ID dari params
    const place = await Place.findByIdAndDelete(id);  // Menggunakan findByIdAndDelete untuk menghapus berdasarkan ID
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }
    res.status(200).json({ message: 'Place deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
