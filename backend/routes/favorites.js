const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');

// Get favorites for a session
router.get('/:sessionId', async (req, res) => {
  const { sessionId } = req.params;
  const fav = await Favorite.findOne({ sessionId });
  res.json(fav ? fav.recipeIds : []);
});

// Update favorites for a session
router.post('/:sessionId', async (req, res) => {
  const { sessionId } = req.params;
  const { recipeIds } = req.body;
  let fav = await Favorite.findOne({ sessionId });
  if (!fav) {
    fav = new Favorite({ sessionId, recipeIds });
  } else {
    fav.recipeIds = recipeIds;
  }
  await fav.save();
  res.json(fav.recipeIds);
});

module.exports = router; 