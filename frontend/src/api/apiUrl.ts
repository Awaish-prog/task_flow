import { API_CONFIG } from "./config";

export const getBaseApiUrl = (apiVersion: number = 1): string => {
  const origin = API_CONFIG.BASE_URL;

  const sanitizedOrigin = origin.replace(/\/$/, '')

  return `${sanitizedOrigin}/api/v${apiVersion}`
}

export const API_ROUTES = {
  boards: '/boards',
  cardLists: '/card_lists',
  cards: '/cards',
};