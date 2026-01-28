import { useRuntimeConfig, useRouter, navigateTo } from '#app'

export const useApi = () => {
  const config = useRuntimeConfig()
  const router = useRouter()
  
  const getToken = (): string | null => {
    if (process.client) {
      return localStorage.getItem('token')
    }
    return null
  }
  
  const setToken = (token: string): void => {
    if (process.client) {
      localStorage.setItem('token', token)
    }
  }
  
  const removeToken = (): void => {
    if (process.client) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }
  
  const getUser = (): any => {
    if (process.client) {
      const user = localStorage.getItem('user')
      return user ? JSON.parse(user) : null
    }
    return null
  }
  
  const setUser = (user: any): void => {
    if (process.client) {
      localStorage.setItem('user', JSON.stringify(user))
    }
  }
  
  const apiCall = async (endpoint: string, options: any = {}): Promise<any> => {
    const token = getToken()
    
    const headers: any = {
      'Content-Type': 'application/json',
      ...options.headers
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    try {
      const response = await fetch(`${config.public.apiBase}${endpoint}`, {
        ...options,
        headers
      })
      
      if (response.status === 401 || response.status === 403) {
        removeToken()
        if (process.client) {
          router.push('/login')
        }
        throw new Error('Unauthorized')
      }
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Request failed')
      }
      
      return data
    } catch (error: any) {
      throw error
    }
  }
  
  return {
    getToken,
    setToken,
    removeToken,
    getUser,
    setUser,
    apiCall
  }
}