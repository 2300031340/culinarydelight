import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useFavorites } from './FavoritesContext'
import RecipeCard from './RecipeCard'
import LoadingSpinner from './LoadingSpinner'
import './Cuisines.css'

const StateRecipes = () => {
  const { cuisineName, stateName } = useParams()
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [showSearch, setShowSearch] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [allRecipes, setAllRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { favorites, toggleFavorite, loadingFavorites } = useFavorites();

  // Fetch all recipes from backend
  useEffect(() => {
    setLoading(true)
    fetch('http://localhost:5000/api/recipes?limit=100')
      .then(res => res.json())
      .then(data => {
        setAllRecipes(data.recipes || [])
        setLoading(false)
      })
      .catch(err => {
        setError('Failed to fetch recipes from backend.')
        setLoading(false)
      })
  }, [])

  // Filter recipes by state and cuisine
  const stateRecipes = allRecipes.filter(recipe => 
    recipe.category === cuisineName && 
    Array.isArray(recipe.states) && recipe.states.includes(stateName)
  )

  // Filter by search value (title, description, ingredients)
  const filteredStateRecipes = searchValue.trim()
    ? stateRecipes.filter(recipe => {
        const query = searchValue.toLowerCase().trim()
        if (recipe.title && recipe.title.toLowerCase().includes(query)) return true
        if (recipe.description && recipe.description.toLowerCase().includes(query)) return true
        if (recipe.ingredients && recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(query))) return true
        return false
      })
    : stateRecipes

  const handleFavoriteClick = (recipeId) => {
    toggleFavorite(recipeId)
  }

  const handleViewRecipe = (recipe) => {
    setSelectedRecipe(recipe)
  }

  return (
    <div className="cuisines-page">
      <div className="cuisines-container">
        <div className="state-header-with-search">
          <span
            className={`search-icon${showSearch ? ' active' : ''}`}
            onClick={() => setShowSearch(s => !s)}
            tabIndex={0}
            role="button"
            aria-label="Search recipes"
          >
            {/* FontAwesome magnifying glass SVG */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ff7575" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </span>
          <h2 style={{ marginLeft: '0.5rem' }}>{stateName} Recipes</h2>
          <div className={`state-search-bar${showSearch ? ' visible' : ''}`}>
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              autoFocus={showSearch}
            />
          </div>
        </div>
        {loading && <LoadingSpinner size="medium" />}
        {error && <div className="error-message">{error}</div>}
        <div className="recipe-grid">
          {filteredStateRecipes.length > 0 ? (
            filteredStateRecipes.map(recipe => (
              <RecipeCard
                key={recipe._id || recipe.id}
                recipe={recipe}
                isFavorite={favorites.has((recipe._id || recipe.id)?.toString())}
                onFavoriteClick={() => handleFavoriteClick((recipe._id || recipe.id)?.toString())}
                onViewRecipe={() => handleViewRecipe(recipe)}
                className="small"
              />
            ))
          ) : (
            <div>No recipes found for this state.</div>
          )}
        </div>
        {selectedRecipe && (
          <div className="recipe-modal-overlay" onClick={() => setSelectedRecipe(null)}>
            <div className="recipe-modal" onClick={e => e.stopPropagation()}>
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
    </div>
  )
}

export default StateRecipes 