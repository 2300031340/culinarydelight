import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { RECIPES, recipeUtils } from './Home'
import RecipeCard from './RecipeCard'
import './Cuisines.css'

// Map states to recipe titles (expand as needed)
const STATE_RECIPES = {
  'Andhra Pradesh': ['Masala Dosa', 'Rava Kesari', 'Bobbatlu (Andhra Style Sweet Roti)', 'Chakkera Pongali', 'Gunta Punugulu', 'Garelu – Andhra Style Medu Vada', 'Upma – Andhra Style'],
  'Punjab': ['Butter Chicken'],
  'Gujarat': ['Dhokla'],
  'Telangana': ['Hyderabadi Dum Biryani'],
  'Maharashtra': ['Pav Bhaji'],
  'West Bengal': ['Fish Curry'],
  'Tamil Nadu': ['Chettinad Chicken'],
  'Kerala': ['Appam with Stew'],
  'Goa': ['Goan Fish Curry'],
  'Karnataka': ['Bisi Bele Bath'],
  'Rajasthan': ['Dal Baati Churma'],
  'Uttar Pradesh': ['Tunday Kababi'],
  'Assam': ['Assam Laksa'],
  'Bihar': ['Litti Chokha'],
  'Odisha': ['Dalma'],
  'Madhya Pradesh': ['Poha'],
  'Haryana': ['Bhutte Ka Kees'],
  'Chhattisgarh': ['Chana Samosa'],
  'Jharkhand': ['Thekua'],
  'Manipur': ['Eromba'],
  'Meghalaya': ['Jadoh'],
  'Mizoram': ['Bai'],
  'Nagaland': ['Smoked Pork with Bamboo Shoot'],
  'Sikkim': ['Phagshapa'],
  'Tripura': ['Mui Borok'],
  'Arunachal Pradesh': ['Thukpa'],
  'Himachal Pradesh': ['Chana Madra'],
  'Uttarakhand': ['Aloo Ke Gutke'],
  // Italian regions:
  'Lazio': ['Classic Pasta Carbonara'],
  'Campania': ['Pizza Margherita'],
  'Emilia-Romagna': ['Tagliatelle al Ragù (Bolognese)'],
  'Liguria': ['Pesto alla Genovese'],
  'Sicily (Sicilia) – Autonomous': ['Arancini'],
  'Veneto': ['Risotto alla Milanese'],
  'Tuscany (Toscana)': ['Ribollita'],
  'Piedmont (Piemonte)': ['Bagna Cauda'],
  'Lombardy (Lombardia)': ['Ossobuco alla Milanese'],
  'Sardinia (Sardegna) – Autonomous': ['Pane Carasau'],
  // Add more as you add recipes
}

const StateRecipes = () => {
  const { cuisineName, stateName } = useParams()
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [favoritesState, setFavoritesState] = useState(() => recipeUtils.loadFavoritesFromStorage())
  const [showSearch, setShowSearch] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    recipeUtils.saveFavoritesToStorage(favoritesState)
  }, [favoritesState])

  // Filter recipes by state
  const stateRecipes = RECIPES.filter(recipe => 
    recipe.category === cuisineName && 
    recipe.state === stateName
  )

  // Filter by search value (title, description, ingredients)
  const filteredStateRecipes = searchValue.trim()
    ? stateRecipes.filter(recipe => {
        const query = searchValue.toLowerCase().trim()
        if (recipe.title.toLowerCase().includes(query)) return true
        if (recipe.description && recipe.description.toLowerCase().includes(query)) return true
        if (recipe.ingredients && recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(query))) return true
        return false
      })
    : stateRecipes

  console.log('StateRecipes page for:', stateName)
  console.log('Recipes for this state:', stateRecipes)

  const handleFavoriteClick = (recipeId) => {
    setFavoritesState(prev => {
      const newSet = new Set(prev)
      if (newSet.has(recipeId)) {
        newSet.delete(recipeId)
      } else {
        newSet.add(recipeId)
      }
      return newSet
    })
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
        <div className="recipe-grid">
          {filteredStateRecipes.length > 0 ? (
            filteredStateRecipes.map(recipe => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isFavorite={favoritesState.has(recipe.id)}
                onFavoriteClick={() => handleFavoriteClick(recipe.id)}
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