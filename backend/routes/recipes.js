const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');

// Get all recipes with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const recipes = await Recipe.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Recipe.countDocuments();

    res.json({
      recipes,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalRecipes: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get recipe by ID
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new recipe
router.post('/', async (req, res) => {
  try {
    // Ensure states is an array
    const recipeData = { ...req.body };
    if (recipeData.state && !recipeData.states) {
      recipeData.states = [recipeData.state];
      delete recipeData.state;
    }
    if (recipeData.states && !Array.isArray(recipeData.states)) {
      recipeData.states = [recipeData.states];
    }
    const recipe = new Recipe(recipeData);
    const savedRecipe = await recipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update recipe
router.put('/:id', async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.state && !updateData.states) {
      updateData.states = [updateData.state];
      delete updateData.state;
    }
    if (updateData.states && !Array.isArray(updateData.states)) {
      updateData.states = [updateData.states];
    }
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete recipe
router.delete('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get recipes by category
router.get('/category/:category', async (req, res) => {
  try {
    const recipes = await Recipe.find({ category: req.params.category });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get recipes by state
router.get('/state/:state', async (req, res) => {
  try {
    const recipes = await Recipe.find({ states: req.params.state });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search recipes
router.get('/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    const recipes = await Recipe.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/cuisine/:cuisine/states', async (req, res) => {
  try {
    const cuisine = req.params.cuisine;
    const recipes = await Recipe.find({ category: cuisine });
   
    const allStates = [...new Set(recipes.flatMap(r => r.states))];
    res.json({ states: allStates });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 