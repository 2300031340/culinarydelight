import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const FavoritesContext = createContext();

function getSessionId() {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = Math.random().toString(36).substr(2, 16) + Date.now();
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
}

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(new Set());
  const [loadingFavorites, setLoadingFavorites] = useState(true);

  // Fetch favorites from backend on mount
  useEffect(() => {
    const sessionId = getSessionId();
    setLoadingFavorites(true);
    fetch(`http://localhost:5000/api/favorites/${sessionId}`)
      .then(res => res.json())
      .then(ids => {
        setFavorites(new Set((ids || []).map(id => id.toString())));
        setLoadingFavorites(false);
      })
      .catch(() => {
        setFavorites(new Set());
        setLoadingFavorites(false);
      });
  }, []);

  // Update favorites in backend whenever favorites changes
  useEffect(() => {
    if (!loadingFavorites) {
      const sessionId = getSessionId();
      fetch(`http://localhost:5000/api/favorites/${sessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeIds: Array.from(favorites) })
      });
    }
  }, [favorites, loadingFavorites]);

  // Toggle favorite
  const toggleFavorite = useCallback((recipeId) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(recipeId)) {
        newSet.delete(recipeId);
      } else {
        newSet.add(recipeId);
      }
      return newSet;
    });
  }, []);

  return (
    <FavoritesContext.Provider value={{ favorites, setFavorites, toggleFavorite, loadingFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
} 