import { create } from 'zustand'
import { THEME_KEYS } from '../constants/themeOptions.js'

const defaultThemes = THEME_KEYS.reduce((acc, { key }) => ({ ...acc, [key]: 50 }), {})

export const defaultInput = {
  city: '',
  days: 2,
  startDate: '',
  density: 50,
  touristVsLocal: 50,
  budget: 'mid',
  transport: 'walk_transit',
  themes: defaultThemes,
  companion: 'solo',
}

function withPlaceDefaults(place, day, index) {
  return {
    id: `${day}-${index}-${place.name}`,
    ...place,
    coords: null,
    geocodeStatus: 'pending',
  }
}

export const useTripStore = create((set, get) => ({
  screen: 'input',
  input: { ...defaultInput },
  itinerary: null,
  selectedDay: 1,
  routes: {},
  loading: {
    generating: false,
    geocoding: null,
    routing: false,
  },
  error: null,

  setInput: (partial) => set((state) => ({ input: { ...state.input, ...partial } })),
  setTheme: (key, value) =>
    set((state) => ({ input: { ...state.input, themes: { ...state.input.themes, [key]: value } } })),
  resetInput: () => set({ input: { ...defaultInput } }),

  setScreen: (screen) => set({ screen }),

  setItinerary: (days) =>
    set({
      itinerary: {
        days: days.map((day) => ({
          ...day,
          places: day.places.map((place, index) => withPlaceDefaults(place, day.day, index)),
        })),
      },
      selectedDay: days[0]?.day ?? 1,
      routes: {},
    }),

  setSelectedDay: (day) => set({ selectedDay: day }),

  updatePlaceGeocode: (day, index, coords) =>
    set((state) => {
      if (!state.itinerary) return {}
      const days = state.itinerary.days.map((d) => {
        if (d.day !== day) return d
        const places = d.places.map((p, i) =>
          i === index ? { ...p, coords, geocodeStatus: coords ? 'done' : 'failed' } : p,
        )
        return { ...d, places }
      })
      return { itinerary: { ...state.itinerary, days } }
    }),

  replacePlace: (day, index, newPlace) =>
    set((state) => {
      if (!state.itinerary) return {}
      const days = state.itinerary.days.map((d) => {
        if (d.day !== day) return d
        const places = d.places.map((p, i) =>
          i === index ? withPlaceDefaults(newPlace, day, index) : p,
        )
        return { ...d, places }
      })
      return { itinerary: { ...state.itinerary, days } }
    }),

  setRoute: (day, route) => set((state) => ({ routes: { ...state.routes, [day]: route } })),

  setLoading: (partial) => set((state) => ({ loading: { ...state.loading, ...partial } })),
  setError: (error) => set({ error }),

  getAllPlaceNames: () => {
    const itinerary = get().itinerary
    if (!itinerary) return []
    return itinerary.days.flatMap((d) => d.places.map((p) => p.name))
  },

  reset: () =>
    set({
      screen: 'input',
      itinerary: null,
      selectedDay: 1,
      routes: {},
      loading: { generating: false, geocoding: null, routing: false },
      error: null,
    }),
}))
