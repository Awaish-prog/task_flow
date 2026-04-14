export const getBaseApiUrl = (apiVersion: number = 1): string => {
  const origin = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
  // const origin = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

  const sanitizedOrigin = origin.replace(/\/$/, '')

  return `${sanitizedOrigin}/api/v${apiVersion}`
}

export const API_ROUTES = {
  boards: '/boards',
  cardLists: '/card_lists',
  cards: '/cards',
};