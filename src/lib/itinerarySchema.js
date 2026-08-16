import { z } from 'zod'

export const placeSchema = z.object({
  name: z.string().min(1),
  category: z.string().optional(),
  durationMinutes: z.number().int().positive(),
  description: z.string().min(1),
  estimatedCost: z.number().nonnegative(),
})

export const daySchema = z.object({
  day: z.number().int().positive(),
  places: z.array(placeSchema).min(1),
})

export const itinerarySchema = z.object({
  days: z.array(daySchema).min(1),
})

export const replacementPlaceSchema = placeSchema

export function parseItinerary(raw) {
  return itinerarySchema.safeParse(raw)
}

export function parseReplacementPlace(raw) {
  return replacementPlaceSchema.safeParse(raw)
}
