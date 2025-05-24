import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useFavorites } from './FavoritesContext'
import RecipeCard from './RecipeCard'
import SignUpForm from './auth/SignUpForm'
import LoadingSpinner from './LoadingSpinner'
import './Home.css'

export const FEATURED_CUISINES = [
  { name: 'Italian' },
  { name: 'Indian' },
  { name: 'Mexican' },
  { name: 'Chinese' },
  { name: 'Mediterranean' }
]

export const CUISINES = [
  { name: 'Italian', country: 'Italy', flag: 'https://flagcdn.com/it.svg' },
  { name: 'Indian', country: 'India', flag: 'https://flagcdn.com/in.svg' },
  { name: 'Mexican', country: 'Mexico', flag: 'https://flagcdn.com/mx.svg' },
  { name: 'Chinese', country: 'China', flag: 'https://flagcdn.com/cn.svg' },
  { name: 'Japanese', country: 'Japan', flag: 'https://flagcdn.com/jp.svg' },
  { name: 'Thai', country: 'Thailand', flag: 'https://flagcdn.com/th.svg' },
  { name: 'French', country: 'France', flag: 'https://flagcdn.com/fr.svg' },
  { name: 'Mediterranean', country: 'Mediterranean', flag: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Blue_Mediterranean_flag.svg' },
  { name: 'Korean', country: 'Korea', flag: 'https://flagcdn.com/kr.svg' },
  { name: 'Vietnamese', country: 'Vietnam', flag: 'https://flagcdn.com/vn.svg' },
  { name: 'American', country: 'USA', flag: 'https://flagcdn.com/us.svg' },
  { name: 'Greek', country: 'Greece', flag: 'https://flagcdn.com/gr.svg' },
  { name: 'Spanish', country: 'Spain', flag: 'https://flagcdn.com/es.svg' },
  { name: 'German', country: 'Germany', flag: 'https://flagcdn.com/de.svg' },
  { name: 'Brazilian', country: 'Brazil', flag: 'https://flagcdn.com/br.svg' },
  { name: 'Caribbean', country: 'Caribbean', flag: 'https://upload.wikimedia.org/wikipedia/commons/3/38/Flag_of_the_Caribbean_Community.svg' },
  { name: 'Middle Eastern', country: 'Middle East', flag: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Flag_of_the_Arab_League.svg' },
  { name: 'African', country: 'Africa', flag: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Flag_of_the_African_Union.svg' },
  { name: 'Russian', country: 'Russia', flag: 'https://flagcdn.com/ru.svg' },
  { name: 'British', country: 'UK', flag: 'https://flagcdn.com/gb.svg' }
]

// Function to create a new recipe with consistent structure
export const createRecipe = ({
  id,
  title,
  description,
  image,
  time,
  difficulty,
  category,
  rating = 4.5
}) => ({
  id,
  title,
  description,
  image,
  time,
  difficulty,
  rating,
  category
})

// Function to add Indian recipes
export const addIndianRecipes = () => [
  createRecipe({
    id: 8,
    title: 'Rogan Josh',
    description: 'A classic Kashmiri curry made with tender lamb in aromatic spices and yogurt gravy',
    image: 'https://i.pinimg.com/736x/70/f1/51/70f151786fdd6ef1d8adcbef9756a075.jpg',
    time: '90 mins',
    difficulty: 'Medium',
    category: 'Indian',
    rating: 4.7
  }),
  createRecipe({
    id: 9,
    title: 'Chole Bhature',
    description: 'Spicy chickpea curry served with deep-fried bread, a popular Punjabi dish',
    image: 'https://i.pinimg.com/736x/f5/9c/9a/f59c9a7f63c2cd4bd587f3de73f184a4.jpg',
    time: '60 mins',
    difficulty: 'Medium',
    category: 'Indian',
    rating: 4.8
  }),
  createRecipe({
    id: 10,
    title: 'Hyderabadi Dum Biryani',
    description: 'Fragrant rice dish layered with spiced meat, herbs, and caramelized onions',
    image: 'https://i.pinimg.com/736x/be/04/a8/be04a81dd02f8802bcc92c67cc713a98.jpg',
    time: '120 mins',
    difficulty: 'Hard',
    category: 'Indian',
    rating: 4.9
  }),
  createRecipe({
    id: 11,
    title: 'Dhokla',
    description: 'Steamed savory cake made from fermented rice and split chickpeas, a Gujarati specialty',
    image: 'https://i.pinimg.com/736x/51/23/cb/5123cbdfab935353bfa88b8034ccff11.jpg',
    time: '45 mins',
    difficulty: 'Medium',
    category: 'Indian',
    rating: 4.5
  })
]

// Combine all recipes
export const RECIPES = [...addIndianRecipes()]

// Utility functions for recipe management
export const recipeUtils = {
  // Get recipes by category
  getRecipesByCategory: (recipes, category) => {
    return recipes.filter(recipe => recipe.category === category)
  },

  // Get random recipes from a category
  getRandomRecipes: (recipes, count) => {
    const shuffled = [...recipes].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
  },

  // Save favorites to localStorage
  saveFavoritesToStorage: (favorites) => {
    localStorage.setItem('favorites', JSON.stringify([...favorites]))
  },

  // Load favorites from localStorage
  loadFavoritesFromStorage: () => {
    const savedFavorites = localStorage.getItem('favorites')
    return savedFavorites ? new Set(JSON.parse(savedFavorites)) : new Set()
  }
}

function getSessionId() {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = Math.random().toString(36).substr(2, 16) + Date.now();
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
}

function Home({ user, searchQuery, showSignUp, setShowSignUp, onAuthSuccess, onFavoriteToggle, onGetStarted }) {
  const [expandedCategories, setExpandedCategories] = useState(new Set())
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [filteredRecipes, setFilteredRecipes] = useState([])
  const [allRecipes, setAllRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const location = useLocation();
  const { favorites, toggleFavorite, loadingFavorites } = useFavorites();

  // Fetch recipes from backend API
  useEffect(() => {
    setLoading(true)
    fetch('http://localhost:5000/api/recipes?limit=100')
      .then(res => res.json())
      .then(data => {
        setAllRecipes(data.recipes || [])
        setFilteredRecipes(data.recipes || [])
        setLoading(false)
      })
      .catch(err => {
        setError('Failed to fetch recipes from backend.')
        setLoading(false)
      })
  }, [])

  // Add search functionality
  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      const filtered = allRecipes.filter(recipe => {
        // Search in title
        if (recipe.title && recipe.title.toLowerCase().includes(query)) return true
        // Search in category
        if (recipe.category && recipe.category.toLowerCase().includes(query)) return true
        // Search in state
        if (Array.isArray(recipe.states) && recipe.states.some(state => state.toLowerCase().includes(query))) return true
        return false
      })
      setFilteredRecipes(filtered)
    } else {
      setFilteredRecipes(allRecipes)
    }
  }, [searchQuery, allRecipes])

  const handleFavoriteClick = (recipeId) => {
    toggleFavorite(recipeId)
  }

  const toggleCategory = (category) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(category)) {
        newSet.delete(category)
      } else {
        newSet.add(category)
      }
      return newSet
    })
  }

  // Update getDisplayRecipes to use filteredRecipes
  const getDisplayRecipes = (category) => {
    const categoryRecipes = filteredRecipes.filter(recipe => recipe.category === category)
    const recipesToShow = expandedCategories.has(category) 
      ? categoryRecipes 
      : categoryRecipes.slice(0, 3)
    return recipesToShow
  }

  // Update getFilteredRecipes to use filteredRecipes
  const getFilteredRecipes = () => {
    if (selectedCategory === 'All') {
      return FEATURED_CUISINES.map(category => ({
        category: category.name,
        recipes: getDisplayRecipes(category.name)
      }))
    }
    return [{
      category: selectedCategory,
      recipes: getDisplayRecipes(selectedCategory)
    }]
  }

  // Update getFavoriteRecipes to use favorites from context
  const getFavoriteRecipes = () => {
    return allRecipes.filter(recipe => favorites.has((recipe._id || recipe.id)?.toString()))
  }

  const handleViewRecipe = (recipe) => {
    setSelectedRecipe(recipe);
  }

  return (
    <div className="home">
      <header className="hero">
        <video
          className="hero-background"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        >
          <source src="https://videos.pexels.com/video-files/2620043/2620043-sd_640_360_25fps.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="hero-content">
          <h1>Discover Delicious Recipes</h1>
          <p>Explore thousands of mouth-watering recipes from around the world</p>
          <button className="cta-button" onClick={onGetStarted}>
            Get Started
          </button>
        </div>
      </header>

      <main>
        <section className="featured-recipes">
          <div className="container">
            <h2>Featured Recipes</h2>
            {loading && <LoadingSpinner size="large" />}
            {error && <div className="error-message">{error}</div>}
            
            {searchQuery && (
              (() => {
                let foundText;
                if (selectedCategory === 'All') {
                  if (filteredRecipes.length > 0) {
                    const matchedCuisines = Array.from(
                      new Set(filteredRecipes.map(r => (r.category || '').trim()))
                    );
                    foundText = `Found ${filteredRecipes.length} recipe${filteredRecipes.length !== 1 ? 's' : ''} in: ${matchedCuisines.join(', ')}`;
                  } else {
                    foundText = 'Found 0 recipes in: all cuisines';
                  }
                } else {
                  const count = filteredRecipes.filter(
                    r => (r.category || '').trim().toLowerCase() === selectedCategory.toLowerCase()
                  ).length;
                  foundText = `Found ${count} recipe${count !== 1 ? 's' : ''} in: ${selectedCategory}`;
                }
                return (
                  <div className="search-results-info">
                    <p>
                      Showing results for: "{searchQuery}"<br />
                      <span style={{ color: '#ff7575', fontWeight: 600 }}>{foundText}</span>
                    </p>
                  </div>
                );
              })()
            )}
            
            <div className="filters">
              <div className="categories">
                <button
                  className={`category-btn ${selectedCategory === 'All' ? 'active' : ''}`}
                  onClick={() => setSelectedCategory('All')}
                  style={{ position: 'relative' }}
                >
                  All
                  {searchQuery.trim() && filteredRecipes.length > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      background: '#ff6b6b',
                      color: '#fff',
                      borderRadius: '50%',
                      padding: '2px 8px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}>
                      {filteredRecipes.length}
                    </span>
                  )}
                </button>
                {FEATURED_CUISINES.map(category => {
                  const count = filteredRecipes.filter(recipe => (recipe.category || '').toLowerCase() === category.name.toLowerCase()).length;
                  return (
                    <button
                      key={category.name}
                      className={`category-btn ${selectedCategory === category.name ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(category.name)}
                      style={{ position: 'relative' }}
                    >
                      {category.name}
                      {searchQuery.trim() && count > 0 && (
                        <span style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          background: '#ff6b6b',
                          color: '#fff',
                          borderRadius: '50%',
                          padding: '2px 8px',
                          fontSize: '0.8rem',
                          fontWeight: 'bold'
                        }}>
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            
            {getFilteredRecipes().map(({ category, recipes }) => {
              const totalRecipes = filteredRecipes.filter(recipe => recipe.category === category).length
              
              return (
                <div key={category} className="category-section">
                  <h3>{category} Cuisine</h3>
                  <div className="recipe-grid">
                    {recipes.map(recipe => (
                      <RecipeCard 
                        key={recipe._id || recipe.id} 
                        recipe={recipe}
                        isFavorite={favorites.has((recipe._id || recipe.id)?.toString())}
                        onFavoriteClick={() => handleFavoriteClick((recipe._id || recipe.id)?.toString())}
                        onViewRecipe={handleViewRecipe}
                      />
                    ))}
                  </div>
                  {totalRecipes > 3 && (
                    <button 
                      className="see-more-btn"
                      onClick={() => toggleCategory(category)}
                    >
                      {expandedCategories.has(category) ? 'Show Less' : 'See More'}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      </main>

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
  )
}

export default Home 