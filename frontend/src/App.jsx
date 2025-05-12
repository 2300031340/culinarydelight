import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './components/Home'
import About from './components/About'
import ScrollToTop from './components/ScrollToTop'
import SignUpForm from './components/auth/SignUpForm'
import LoginForm from './components/auth/LoginForm'
import Preferences from './components/Preferences'
import Cuisines from './components/Cuisines'
import CuisineStates from './components/CuisineStates'
import StateRecipes from './components/StateRecipes'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [showSignUp, setShowSignUp] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    // Check for existing token and user type on app load
    const token = localStorage.getItem('token')
    const userType = localStorage.getItem('userType')
    if (token && userType) {
      // You might want to validate the token here
      setUser({ token, userType })
    }
  }, [])

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const handleSearch = (e) => {
    e.preventDefault()
    console.log('Searching for:', searchQuery)
  }

  const handleAuthSuccess = (userData) => {
    if (userData && userData.token) {
      setUser(userData)
      setShowSignUp(false)
      setShowLogin(false)
    } else {
      console.error('Invalid user data received:', userData)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userType')
    setUser(null)
  }

  const handleFavoriteToggle = (recipeId, isFavorite) => {
    if (isFavorite) {
      setFavorites(prev => [...prev, recipeId])
    } else {
      setFavorites(prev => prev.filter(id => id !== recipeId))
    }
  }

  const handleSwitchToLogin = () => {
    setShowSignUp(false)
    setShowLogin(true)
  }

  const handleSwitchToSignUp = () => {
    setShowLogin(false)
    setShowSignUp(true)
  }

  return (
    <Router>
      <ScrollToTop />
      <div className="app">
        <nav className="navbar">
          <div className="logo">
            <h1>Culinary Delights</h1>
          </div>
          <div className="nav-links">
            <Link to="/" onClick={handleScrollToTop}>Home</Link>
            <Link to="/cuisines" onClick={handleScrollToTop}>Cuisines</Link>
            <Link to="/about" onClick={handleScrollToTop}>About</Link>
            <Link to="/my-kitchen" onClick={handleScrollToTop}>My Kitchen</Link>
          </div>
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={handleSearch}>
              <i className="fas fa-search"></i>
            </button>
          </div>
          {user ? (
            <button onClick={handleLogout} className="cta-button">Logout</button>
          ) : (
            <button onClick={() => setShowSignUp(true)} className="cta-button">Sign Up</button>
          )}
        </nav>

        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/my-kitchen" element={<Preferences />} />
          <Route path="/cuisines/:cuisineName/:stateName" element={<StateRecipes />} />
          <Route path="/cuisines/:cuisineName" element={<CuisineStates />} />
          <Route path="/cuisines" element={<Cuisines />} />
          <Route path="/" element={
            <Home 
              user={user}
              searchQuery={searchQuery}
              showSignUp={showSignUp}
              setShowSignUp={setShowSignUp}
              onAuthSuccess={handleAuthSuccess}
              onFavoriteToggle={handleFavoriteToggle}
              onGetStarted={() => setShowSignUp(true)}
            />
          } />
        </Routes>

        <footer>
          <div className="footer-content">
            <div className="footer-section">
              <h3>About Us</h3>
              <p>Culinary Delights is your go-to destination for discovering and sharing amazing recipes.</p>
            </div>
            <div className="footer-section">
              <h3>Quick Links</h3>
              <ul>
                <li><Link to="/" className="footer-link" onClick={handleScrollToTop}>Home</Link></li>
                <li><Link to="/cuisines" className="footer-link" onClick={handleScrollToTop}>Cuisines</Link></li>
                <li><Link to="/about" className="footer-link" onClick={handleScrollToTop}>About</Link></li>
                <li><Link to="/my-kitchen" className="footer-link" onClick={handleScrollToTop}>My Kitchen</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>Connect With Us</h3>
              <div className="social-links">
                <a href="#"><i className="fab fa-facebook"></i></a>
                <a href="#"><i className="fab fa-instagram"></i></a>
                <a href="#"><i className="fab fa-pinterest"></i></a>
                <a href="#"><i className="fab fa-youtube"></i></a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Culinary Delights. All rights reserved.</p>
          </div>
        </footer>

        {showSignUp && (
          <SignUpForm 
            onClose={() => setShowSignUp(false)}
            onAuthSuccess={handleAuthSuccess}
            onSwitchToLogin={handleSwitchToLogin}
          />
        )}

        {showLogin && (
          <LoginForm
            onClose={() => setShowLogin(false)}
          onAuthSuccess={handleAuthSuccess}
            onSwitchToSignUp={handleSwitchToSignUp}
        />
        )}
      </div>
    </Router>
  )
}

export default App