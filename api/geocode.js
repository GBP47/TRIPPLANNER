const CONTACT = process.env.NOMINATIM_CONTACT_EMAIL || 'no-contact-set@example.com'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { query } = req.body || {}

  if (!query || typeof query !== 'string') {
    res.status(400).json({ error: '검색어가 필요합니다.' })
    return
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(query)}`
    const response = await fetch(url, {
      headers: {
        'User-Agent': `TripPlannerDemo/1.0 (${CONTACT})`,
        'Accept-Language': 'ko',
      },
    })

    if (!response.ok) {
      res.status(502).json({ error: 'Nominatim 요청에 실패했습니다.' })
      return
    }

    const results = await response.json()

    if (!Array.isArray(results) || results.length === 0) {
      res.status(200).json({ found: false, lat: null, lon: null })
      return
    }

    const [first] = results
    res.status(200).json({
      found: true,
      lat: parseFloat(first.lat),
      lon: parseFloat(first.lon),
      displayName: first.display_name,
    })
  } catch (err) {
    res.status(502).json({ error: `지오코딩에 실패했습니다: ${err.message}` })
  }
}
