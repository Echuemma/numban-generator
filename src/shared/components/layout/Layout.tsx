// src/shared/components/layout/Layout.tsx
import React from 'react'
import { useAppSelector } from '@/shared/hooks/redux'
import { selectUiState } from '@/features/ui/store/uiSlice'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme } = useAppSelector(selectUiState)

  return (
    <div className={`min-h-screen bg-gray-50 ${theme === 'dark' ? 'dark' : ''}`}>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center sm:justify-between h-auto sm:h-16 py-2 sm:py-0">
            <div className="flex flex-col sm:flex-row items-center">
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 text-center sm:text-left">
                NUBAN Manager
              </h1>
              <span className="ml-0 sm:ml-2 mt-2 sm:mt-0 px-2 py-1 text-xs sm:text-sm bg-blue-100 text-blue-800 rounded-full">
                Advanced
              </span>
            </div>
            <div className="flex items-center space-x-0 sm:space-x-4 mt-2 sm:mt-0">
              <span className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
                Nigerian Uniform Bank Account Number
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full lg:w-[70%] lg:mx-auto px-2 sm:px-6 lg:px-0 py-4 sm:py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-2 sm:py-4">
          <p className="text-center text-xs sm:text-sm text-gray-500">
            NUBAN Manager - Advanced React + Redux Toolkit Application
          </p>
        </div>
      </footer>
    </div>
  )
}