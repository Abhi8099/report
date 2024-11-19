"use client"

import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const markerIcon = L.icon({
  iconUrl: '/images/icon/Vector.png', 
  iconSize: [17, 25], 
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

type ActiveUsersData = {
  [country: string]: number
}

type CountryCoordinates = {
  [country: string]: [number, number]
}

type OpenPopupsState = {
  [country: string]: boolean | 'clicked'
}

function PopupController({ openPopups }: { openPopups: OpenPopupsState }) {
  const map = useMap()

  useEffect(() => {
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        const country = layer.options.title
        if (country && openPopups[country]) {
          layer.openPopup()
        } else {
          layer.closePopup()
        }
      }
    })
  }, [map, openPopups])

  return null
}

export default function WorldMap({ activeUsersData = {} }: { activeUsersData?: ActiveUsersData }) {
  const [isMounted, setIsMounted] = useState(false)
  const [openPopups, setOpenPopups] = useState<OpenPopupsState>({})

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const countryCoordinates: CountryCoordinates = {
    "Afghanistan": [33.9391, 67.7100],
    "Albania": [41.1533, 20.1683],
    "Algeria": [28.0339, 1.6596],
    "Andorra": [42.5078, 1.5211],
    "Angola": [-11.2027, 17.8739],
    "Argentina": [-38.4161, -63.6167],
    "Armenia": [40.0692, 45.0382],
    "Australia": [-25.2744, 133.7751],
    "Austria": [47.5162, 14.5501],
    "Azerbaijan": [40.1431, 47.5769],
    "Bangladesh": [23.685, 90.3563],
    "Belarus": [53.7098, 27.9534],
    "Belgium": [50.8503, 4.3517],
    "Bolivia": [-16.2902, -63.5887],
    "Brazil": [-14.2350, -51.9253],
    "Canada": [56.1304, -106.3468],
    "Chile": [-35.6751, -71.5430],
    "China": [35.8617, 104.1954],
    "Colombia": [4.5709, -74.2973],
    "Cuba": [21.5218, -77.7812],
    "Denmark": [56.2639, 9.5018],
    "Egypt": [26.8206, 30.8025],
    "Finland": [61.9241, 25.7482],
    "France": [46.6034, 1.8883],
    "Germany": [51.1657, 10.4515],
    "Greece": [39.0742, 21.8243],
    "India": [20.5937, 78.9629],
    "Indonesia": [-0.7893, 113.9213],
    "Italy": [41.8719, 12.5674],
    "Japan": [36.2048, 138.2529],
    "Kenya": [-1.286389, 36.817223],
    "Lithuania": [55.1694, 23.8813],
    "Mexico": [23.6345, -102.5528],
    "Netherlands": [52.3792, 4.8994],
    "New Zealand": [-40.9006, 174.8860],
    "Nigeria": [9.0820, 8.6753],
    "Pakistan": [30.3753, 69.3451],
    "Philippines": [12.8797, 121.7740],
    "Poland": [51.9194, 19.1451],
    "Portugal": [39.3999, -8.2245],
    "Russia": [61.5240, 105.3188],
    "Saudi Arabia": [23.8859, 45.0792],
    "South Africa": [-30.5595, 22.9375],
    "Spain": [40.4637, -3.7492],
    "Sweden": [60.1282, 18.6435],
    "Türkiye": [38.9637, 35.2433],
    "Ukraine": [48.3794, 31.1656],
    "United Arab Emirates": [23.4241, 53.8478],
    "United Kingdom": [55.3781, -3.4360],
    "United States": [37.0902, -95.7129],
    "Venezuela": [6.4238, -66.5897],
    "Vietnam": [14.0583, 108.2772],
    "Zimbabwe": [-19.0154, 29.1549],
  };
  

  const handleMarkerHover = (country: string, isEntering: boolean) => {
    if (isEntering) {
      setOpenPopups(prev => ({ ...prev, [country]: true }))
    } else {
      setOpenPopups(prev => ({ ...prev, [country]: prev[country] === 'clicked' }))
    }
  }

  const handleMarkerClick = (country: string) => {
    setOpenPopups(prev => ({ ...prev, [country]: 'clicked' }))
  }

  if (!isMounted) {
    return null
  }

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{ height: '600px', width: '100%' }}
      minZoom={2}
      maxBounds={[[-90, -180], [90, 180]]}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {Object.entries(activeUsersData).map(([country, count]) => {
        const coordinates = countryCoordinates[country]
        if (coordinates) {
          return (
            <Marker 
              key={country} 
              position={coordinates} 
              icon={markerIcon}
              title={country}
              eventHandlers={{
                mouseover: () => handleMarkerHover(country, true),
                mouseout: () => handleMarkerHover(country, false),
                click: () => handleMarkerClick(country),
              }}
            >
              <Popup>
                <strong>{country}</strong>
                <br />
                Active Users: {count}
              </Popup>
            </Marker>
          )
        }
        return null
      })}
      <PopupController openPopups={openPopups} />
    </MapContainer>
  )
}