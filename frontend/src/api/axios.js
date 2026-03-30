import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)

    if (error.response?.status === 401) {
      const isLoginRequest = error.config?.url?.includes('/auth/login')

      if (!isLoginRequest) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }

    return Promise.reject(error)
  }
)

export default api