import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RecipeCard from './RecipeCard';
import LoadingSpinner from './LoadingSpinner';
import './Preferences.css';
import { useFavorites } from './FavoritesContext';

function Preferences() {
  const [activePanel, setActivePanel] = useState('favorites');
  const [filterCategory, setFilterCategory] = useState('All');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [allRecipes, setAllRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { favorites, toggleFavorite, loadingFavorites } = useFavorites();

  // Fetch all recipes from backend
  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/api/recipes?limit=100')
      .then(res => res.json())
      .then(data => {
        setAllRecipes(data.recipes || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch recipes from backend.');
        setLoading(false);
      });
  }, []);

  const handleFavoriteClick = (recipeId) => {
    toggleFavorite(recipeId);
  };

  const handleViewRecipe = (recipe) => {
    setSelectedRecipe(recipe);
  };

  // Get favorite recipes with optional category filter
  const getFavoriteRecipes = () => {
    const favoritesList = allRecipes.filter(recipe => favorites.has((recipe._id || recipe.id)?.toString()));
    if (filterCategory === 'All') {
      return favoritesList;
    }
    return favoritesList.filter(recipe => recipe.category === filterCategory);
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

            {loading && <LoadingSpinner size="medium" />}
            {error && <div className="error-message">{error}</div>}

            {getFavoriteRecipes().length > 0 ? (
              <div className="recipe-grid">
                {getFavoriteRecipes().map(recipe => (
                  <RecipeCard 
                    key={recipe._id || recipe.id}
                    recipe={recipe}
                    isFavorite={true}
                    onFavoriteClick={() => handleFavoriteClick((recipe._id || recipe.id)?.toString())}
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