import { Middleware } from '@reduxjs/toolkit'

// Remove the circular import - don't import RootState here
// Use generic typing instead since we don't need the specific state shape in middleware

const loggerMiddleware: Middleware = (store) => (next) => (action) => {
  if (import.meta.env.DEV) {
    console.group(`🚀 Action: ${action.type}`)
    console.log('Previous State:', store.getState())
    console.log('Action:', action)
  }
  
  const result = next(action)
  
  if (import.meta.env.DEV) {
    console.log('Next State:', store.getState())
    console.groupEnd()
  }
  
  return result
}

const performanceMiddleware: Middleware = () => (next) => (action) => {
  const start = performance.now()
  const result = next(action)
  const end = performance.now()
  
  const duration = end - start
  if (duration > 5) { 
    console.warn(`⚠️ Slow action detected: ${action.type} took ${duration.toFixed(2)}ms`)
  }
  
  return result
}

const errorMiddleware: Middleware = () => (next) => (action) => {
  try {
    return next(action)
  } catch (error) {
    console.error('🔥 Redux Error:', error)
    console.error('Action that caused error:', action)
    throw error
  }
}

export const customMiddleware = [
  loggerMiddleware,
  performanceMiddleware,
  errorMiddleware,
]