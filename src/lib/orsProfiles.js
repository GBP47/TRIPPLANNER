import { TRANSPORT_MODES } from '../constants/themeOptions.js'

export function getOrsProfile(transportKey) {
  const mode = TRANSPORT_MODES.find((m) => m.key === transportKey)
  return mode ? mode.orsProfile : 'foot-walking'
}
