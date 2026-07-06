import axios, { AxiosError } from 'axios'
import { createLogger } from '../utils/logger'

interface ApiErrorPayload {
  message?: string
}

export const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

export const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 6000,
  headers: {
    'Content-Type': 'application/json',
  },
})

const logger = createLogger('api')

const getApiErrorMessage = (error: AxiosError<ApiErrorPayload>): string => {
  const backendMessage = error.response?.data?.message

  if (backendMessage) {
    return backendMessage
  }

  if (error.code === 'ECONNABORTED') {
    return 'A API demorou para responder. Tente novamente em instantes.'
  }

  if (!error.response) {
    return 'Não foi possível conectar com a API da FlowPay.'
  }

  if (error.response.status === 404) {
    return 'Recurso nao encontrado na API da FlowPay.'
  }

  if (error.response.status === 409) {
    return 'A operação entrou em conflito com o estado atual dos dados.'
  }

  if (error.response.status >= 500) {
    return 'A API da FlowPay encontrou um erro interno.'
  }

  return error.message || 'Não foi possível comunicar com a API da FlowPay.'
}

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorPayload>) => {
    logger.error('API request failed', {
      code: error.code,
      method: error.config?.method,
      status: error.response?.status,
      url: error.config?.url,
    })

    return Promise.reject(new Error(getApiErrorMessage(error)))
  },
)
