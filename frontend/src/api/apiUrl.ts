export const apiUrl = (apiVersion: number = 1): string => {
  const origin = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

  const sanitizedOrigin = origin.replace(/\/$/, '')

  return `${sanitizedOrigin}/api/v${apiVersion}`
}