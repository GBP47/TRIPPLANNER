export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  if (!process.env.ORS_API_KEY) {
    res.status(500).json({ error: '서버에 ORS_API_KEY가 설정되지 않았습니다.' })
    return
  }

  const { coordinates, profile } = req.body || {}

  if (!Array.isArray(coordinates) || coordinates.length < 2) {
    res.status(200).json({ geometry: [], segmentDurations: [] })
    return
  }

  try {
    const orsCoordinates = coordinates.map(([lat, lon]) => [lon, lat])

    const response = await fetch(`https://api.openrouteservice.org/v2/directions/${profile}/geojson`, {
      method: 'POST',
      headers: {
        Authorization: process.env.ORS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ coordinates: orsCoordinates }),
    })

    if (!response.ok) {
      const errText = await response.text().catch(() => '')
      res.status(502).json({ error: `ORS 경로 요청에 실패했습니다: ${errText.slice(0, 200)}` })
      return
    }

    const data = await response.json()
    const feature = data.features?.[0]

    if (!feature) {
      res.status(200).json({ geometry: [], segmentDurations: [] })
      return
    }

    const geometry = feature.geometry.coordinates.map(([lon, lat]) => [lat, lon])
    const segmentDurations = (feature.properties?.segments || []).map((s) => s.duration)

    res.status(200).json({ geometry, segmentDurations })
  } catch (err) {
    res.status(502).json({ error: `경로 계산에 실패했습니다: ${err.message}` })
  }
}
