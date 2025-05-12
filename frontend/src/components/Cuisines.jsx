import React from 'react'
import { CUISINES } from './Home'
import './Cuisines.css'
import { useNavigate } from 'react-router-dom'

const Cuisines = () => {
  const navigate = useNavigate()
  return (
    <div className="cuisines-page">
      <div className="cuisines-container">
        <h2>All Cuisines</h2>
        <div className="cuisine-grid">
          {CUISINES.map(cuisine => (
            <div
              className="cuisine-rect cuisine-flag-bg"
              key={cuisine.name}
              onClick={() => navigate(`/cuisines/${cuisine.name}`)}
              style={{
                cursor: 'pointer',
                backgroundImage: `url(${cuisine.flag})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                color: '#fff',
                textShadow: '0 2px 8px rgba(0,0,0,0.7)',
                fontWeight: 'bold',
                overflow: 'hidden'
              }}
            >
              <span className="cuisine-flag-label">{cuisine.name}</span>
              <div className="cuisine-flag-overlay"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Cuisines 