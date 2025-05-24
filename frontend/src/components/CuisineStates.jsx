import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CUISINES } from './Home'
import './Cuisines.css'

const CuisineStates = () => {
  const { cuisineName } = useParams()
  const navigate = useNavigate()
  const cuisine = CUISINES.find(c => c.name.toLowerCase() === cuisineName.toLowerCase())
  const country = cuisine ? cuisine.country : null
  const [states, setStates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!cuisineName) return;
    setLoading(true)
    setError(null)
    fetch(`http://localhost:5000/api/recipes/cuisine/${cuisineName}/states`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch states')
        return res.json()
      })
      .then(data => {
        setStates(data.states || [])
        setLoading(false)
      })
      .catch(err => {
        setError('Could not load states for this cuisine.')
        setLoading(false)
      })
  }, [cuisineName])

  return (
    <div className="cuisines-page">
      <div className="cuisines-container">
        <h2>{country ? `${country} States` : 'States'}</h2>
        <div className="cuisine-grid">
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>{error}</div>
          ) : states && states.length > 0 ? (
            states.map(state => (
              <div
                className="cuisine-rect"
                key={state}
                onClick={() => navigate(`/cuisines/${cuisineName}/${encodeURIComponent(state)}`)}
                style={{ cursor: 'pointer' }}
              >
                {state}
              </div>
            ))
          ) : (
            <div>No states found for this cuisine.</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CuisineStates 