import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CUISINES } from './Home'
import './Cuisines.css'

const STATES_BY_COUNTRY = {
  India: [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ],
  Italy: [
    'Abruzzo',
    'Aosta Valley (Valle d\'Aosta) – Autonomous',
    'Apulia (Puglia)',
    'Basilicata',
    'Calabria',
    'Campania',
    'Emilia-Romagna',
    'Friuli Venezia Giulia – Autonomous',
    'Lazio',
    'Liguria',
    'Lombardy (Lombardia)',
    'Marche',
    'Molise',
    'Piedmont (Piemonte)',
    'Sardinia (Sardegna) – Autonomous',
    'Sicily (Sicilia) – Autonomous',
    'Trentino-Alto Adige/Südtirol – Autonomous',
    'Tuscany (Toscana)',
    'Umbria',
    'Veneto'
  ]
  // Add more countries and their states as needed
}

const CuisineStates = () => {
  const { cuisineName } = useParams()
  const navigate = useNavigate()
  const cuisine = CUISINES.find(c => c.name.toLowerCase() === cuisineName.toLowerCase())
  const country = cuisine ? cuisine.country : null
  const states = country ? STATES_BY_COUNTRY[country] : []

  return (
    <div className="cuisines-page">
      <div className="cuisines-container">
        <h2>{country ? `${country} States` : 'States'}</h2>
        <div className="cuisine-grid">
          {states && states.length > 0 ? (
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