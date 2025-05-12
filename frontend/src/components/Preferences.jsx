import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RecipeCard from './RecipeCard';
import './Preferences.css';

// Import the RECIPES array and recipeUtils from Home.jsx
import { RECIPES, recipeUtils } from './Home';

function Preferences() {
  const [activePanel, setActivePanel] = useState('favorites');
  const [favoritesState, setFavoritesState] = useState(() => recipeUtils.loadFavoritesFromStorage());
  const [filterCategory, setFilterCategory] = useState('All');
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const handleFavoriteClick = (recipeId) => {
    setFavoritesState(prevFavorites => {
      const newFavorites = new Set(prevFavorites);
      if (newFavorites.has(recipeId)) {
        newFavorites.delete(recipeId);
      } else {
        newFavorites.add(recipeId);
      }
      recipeUtils.saveFavoritesToStorage(newFavorites);
      return newFavorites;
    });
  };

  const handleViewRecipe = (recipe) => {
    setSelectedRecipe(recipe);
  };

  // Get favorite recipes with optional category filter
  const getFavoriteRecipes = () => {
    const favorites = RECIPES.filter(recipe => favoritesState.has(recipe.id));
    if (filterCategory === 'All') {
      return favorites;
    }
    return favorites.filter(recipe => recipe.category === filterCategory);
  };

  // Get unique categories from favorite recipes
  const getFavoriteCategories = () => {
    const categories = new Set(getFavoriteRecipes().map(recipe => recipe.category));
    return ['All', ...Array.from(categories)];
  };

  return (
    <div className="preferences-container">
      <div className="preferences-header">
        <h1>My Kitchen</h1>
        <div className="preferences-tabs">
          <button 
            className={`tab-button ${activePanel === 'favorites' ? 'active' : ''}`}
            onClick={() => setActivePanel('favorites')}
          >
            <i className="fas fa-heart"></i> My Favorites
          </button>
          <button 
            className={`tab-button ${activePanel === 'settings' ? 'active' : ''}`}
            onClick={() => setActivePanel('settings')}
          >
            <i className="fas fa-cog"></i> Settings
          </button>
        </div>
      </div>

      <div className="preferences-content">
        {activePanel === 'favorites' ? (
          <div className="favorites-panel">
            <div className="favorites-filters">
              <h3>Filter by Cuisine</h3>
              <div className="category-filters">
                {getFavoriteCategories().map(category => (
                  <button
                    key={category}
                    className={`category-btn ${filterCategory === category ? 'active' : ''}`}
                    onClick={() => setFilterCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {getFavoriteRecipes().length > 0 ? (
              <div className="recipe-grid">
                {getFavoriteRecipes().map(recipe => (
                  <RecipeCard 
                    key={recipe.id}
                    recipe={recipe}
                    isFavorite={true}
                    onFavoriteClick={() => handleFavoriteClick(recipe.id)}
                    onViewRecipe={handleViewRecipe}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-favorites">
                <div className="empty-illustration">
                  <i className="fas fa-heart-broken"></i>
                </div>
                <h2>No Favorites Yet!</h2>
                <p>Start exploring our delicious recipes and save your favorites here</p>
                <Link to="/" className="explore-btn">
                  <i className="fas fa-utensils"></i>
                  Explore Recipes
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="settings-panel">
            <h2>Settings</h2>
            <p>Customize your experience...</p>
          </div>
        )}
      </div>

      {selectedRecipe && (
        <div className="recipe-modal-overlay" onClick={() => setSelectedRecipe(null)}>
          <div className="recipe-modal" onClick={(e) => e.stopPropagation()}>
            <button className="recipe-modal-close" onClick={() => setSelectedRecipe(null)}>×</button>
            <h2>{selectedRecipe.title}</h2>
            
            {selectedRecipe.ingredients && (
              <div className="recipe-ingredients">
                <h3>Ingredients:</h3>
                <ul>
                  {selectedRecipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
            )}

            {selectedRecipe.steps && (
            <div className="recipe-steps">
              <h3>Steps:</h3>
                {selectedRecipe.steps.map((step, index) => (
                  <div key={index} className="recipe-step">
                    <h4>{step.title}</h4>
                    <ol>
                      {step.instructions.map((instruction, idx) => (
                        <li key={idx}>{instruction}</li>
                      ))}
              </ol>
            </div>
                ))}
              </div>
            )}

            {selectedRecipe.tips && (
              <div className="recipe-tips">
                <h3>Tips:</h3>
                <ul>
                  {selectedRecipe.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Preferences; 