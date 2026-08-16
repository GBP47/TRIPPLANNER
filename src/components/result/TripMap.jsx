import { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useTripStore } from '../../store/tripStore.js'

function numberedIcon(number) {
  return L.divIcon({
    className: '',
    html: `<div style="background:#4f46e5;color:#fff;width:26px;height:26px;border-radius:9999px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;box-shadow:0 1px 4px rgba(0,0,0,0.35);border:2px solid #fff;">${number}</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  })
}

function FitBounds({ positions }) {
  const map = useMap()

  useEffect(() => {
    if (positions.length === 0) return
    if (positions.length === 1) {
      map.setView(positions[0], 14)
      return
    }
    map.fitBounds(positions, { padding: [40, 40] })
  }, [map, positions])

  return null
}

export default function TripMap() {
  const itinerary = useTripStore((s) => s.itinerary)
  const selectedDay = useTripStore((s) => s.selectedDay)
  const route = useTripStore((s) => s.routes[selectedDay])

  const day = itinerary?.days.find((d) => d.day === selectedDay)

  const markers = useMemo(() => {
    if (!day) return []
    return day.places
      .map((place, index) => ({ place, index }))
      .filter(({ place }) => place.coords)
      .map(({ place, index }) => ({
        position: [place.coords.lat, place.coords.lon],
        number: index + 1,
        name: place.name,
      }))
  }, [day])

  const positions = markers.map((m) => m.position)
  const routeLine = route?.geometry?.length ? route.geometry : null

  return (
    <MapContainer center={[37.5665, 126.978]} zoom={12} scrollWheelZoom className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        crossOrigin="anonymous"
      />
      {markers.map((m) => (
        <Marker key={`${selectedDay}-${m.number}`} position={m.position} icon={numberedIcon(m.number)}>
          <Popup>{m.name}</Popup>
        </Marker>
      ))}
      {routeLine && <Polyline positions={routeLine} pathOptions={{ color: '#4f46e5', weight: 4, opacity: 0.7 }} />}
      <FitBounds positions={positions} />
    </MapContainer>
  )
}
