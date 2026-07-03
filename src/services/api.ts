import axios, { AxiosError } from 'axios'

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

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorPayload>) => {
    const message =
      error.response?.data?.message ??
      error.message ??
      'Não foi possível comunicar com a API da FlowPay.'

    return Promise.reject(new Error(message))
  },
)
