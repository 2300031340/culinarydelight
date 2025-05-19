const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  recipeIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }]
});

module.exports = mongoose.model('Favorite', favoriteSchema); 