import React from 'react';
import './RecipeCard.css';

function RecipeCard({ recipe, isFavorite, onFavoriteClick, onViewRecipe }) {
  const handleFavoriteClick = (e) => {
    e.preventDefault(); // Prevent navigation when clicking the heart
    onFavoriteClick(recipe.id);
  };

  const handleViewRecipe = (e) => {
    e.preventDefault(); // Prevent navigation
    onViewRecipe(recipe);
  };

  return (
    <div className="recipe-card">
      <div className="recipe-image">
        <img src={recipe.image} alt={recipe.title} />
      </div>
      <div className="recipe-content">
        <h3>{recipe.title}</h3>
        <p>{recipe.description}</p>
        <div className="recipe-meta">
          <div className="time-difficulty">
            <span className="time">
              <i className="far fa-clock"></i> {recipe.time}
            </span>
            <span className="difficulty">
              <i className="fas fa-signal"></i> {recipe.difficulty}
            </span>
          </div>
        </div>
        <div className="recipe-footer">
          <div className="recipe-actions">
            <button 
              className={`favorite-button ${isFavorite ? 'active' : ''}`}
              onClick={handleFavoriteClick}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <i className={`${isFavorite ? 'fas' : 'far'} fa-heart`}></i>
            </button>
          </div>
          <button onClick={handleViewRecipe} className="view-recipe-btn">
            View Recipe
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecipeCard; 