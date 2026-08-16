export function estimateTotalBudget(days) {
  return days.reduce((total, day) => {
    return total + day.places.reduce((sum, place) => sum + (place.estimatedCost || 0), 0)
  }, 0)
}

export function formatKrw(amount) {
  return `${Math.round(amount).toLocaleString('ko-KR')}원`
}
