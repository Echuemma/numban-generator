// src/app/middleware/persistenceMiddleware.ts

import { Middleware, UnknownAction } from '@reduxjs/toolkit';
import { StorageService } from '../../shared/services/storageService';

const storage = StorageService.getInstance();

// Define which slices to persist
const PERSISTABLE_SLICES = ['nuban', 'validation', 'filters', 'ui'] as const;

export const persistenceMiddleware: Middleware = 
  (store) => (next) => (action: any) => {
    const result = next(action);
    
    // Don't persist during hydration or initialization
    if (action.type.includes('@@redux/INIT') || 
        action.type.includes('persist/REHYDRATE') ||
        action.type.includes('@@INIT')) {
      return result;
    }

    // Only persist actions from specific slices
    const shouldPersist = PERSISTABLE_SLICES.some(slice => 
      action.type.startsWith(`${slice}/`)
    );

    if (shouldPersist) {
      const state = store.getState() as any; // Type assertion to avoid circular dependency
      
      // Persist complete state that matches your slice structure
      const persistableState = {
        nuban: {
          // Include all the properties from your nubanSlice that should be persisted
          accounts: state.nuban?.accounts || [],
          generationHistory: state.nuban?.generationHistory || [],
          currentAccount: state.nuban?.currentAccount || null,
          banks: state.nuban?.banks || [],
          lastGenerated: state.nuban?.lastGenerated || null,
          validationResults: state.nuban?.validationResults || {},
          filters: state.nuban?.filters || {},
          pagination: state.nuban?.pagination || {
            currentPage: 1,
            pageSize: 10,
            totalCount: 0,
            totalPages: 0,
          },
          selectedAccounts: state.nuban?.selectedAccounts || [],
          sortBy: state.nuban?.sortBy || 'createdAt',
          sortOrder: state.nuban?.sortOrder || 'desc',
          // Don't persist loading states
          loading: false,
          isLoading: false,
          isGenerating: false,
          isValidating: false,
          error: null,
          lastFetch: state.nuban?.lastFetch || null
        },
        validation: {
          history: state.validation?.history || [],
          stats: state.validation?.stats || {
            totalValidations: 0,
            validCount: 0,
            invalidCount: 0,
            lastValidatedAt: null
          },
          // Don't persist loading states
          isValidating: false,
          error: null
        },
        filters: state.filters || {},
        ui: {
          theme: state.ui?.theme || 'system',
          sidebarCollapsed: state.ui?.sidebarCollapsed || false,
          layout: state.ui?.layout || {
            viewMode: 'table',
            pageSize: 10,
            compactMode: false
          },
          // Don't persist loading states and notifications
          activeModal: null,
          notifications: [],
          loading: {
            global: false,
            operations: {}
          },
          errors: {
            global: null,
            field: {}
          }
        },
        lastUpdated: new Date().toISOString()
      };

      // Debounce storage writes to improve performance
      if (typeof window !== 'undefined') {
        clearTimeout((window as any).__persistTimeout);
        (window as any).__persistTimeout = setTimeout(() => {
          try {
            // Use simple setItem call - remove complex StorageConfig
            storage.setItem('app_state', persistableState);
          } catch (error) {
            console.warn('Failed to persist state:', error);
          }
        }, 500);
      }
    }

    return result;
  };