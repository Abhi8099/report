"use client"

import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const markerIcon = L.icon({
  iconUrl: '/images/icon/vector.png', 
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
    "Armenia": [40.0692, 45.0382],
    "Bangladesh": [23.685, 90.3563],
    "Brazil": [-14.2350, -51.9253],
    "Canada": [56.1304, -106.3468],
    "China": [35.8617, 104.1954],
    "Germany": [51.1657, 10.4515],
    "India": [20.5937, 78.9629],
    "Indonesia": [-0.7893, 113.9213],
    "Lithuania": [55.1694, 23.8813],
    "Netherlands": [52.3792, 4.8994],
    "New Zealand": [-40.9006, 174.8860],
    "Pakistan": [30.3753, 69.3451],
    "Philippines": [12.8797, 121.7740],
    "Poland": [51.9194, 19.1451],
    "Russia": [61.5240, 105.3188],
    "Sweden": [60.1282, 18.6435],
    "Türkiye": [38.9637, 35.2433],
    "United Arab Emirates": [23.4241, 53.8478],
    "United Kingdom": [55.3781, -3.4360],
    "United States": [37.0902, -95.7129],
  }

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