import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { NormalizedCustomDiet, validateCustomDietsImport, DietValidationResult } from './dietSchema';

// Custom diets store state
interface CustomDietsState {
  items: NormalizedCustomDiet[];
  lastImport: {
    timestamp: number;
    result: DietValidationResult;
  } | null;
}

// Custom diets store actions
interface CustomDietsActions {
  addMany: (diets: NormalizedCustomDiet[]) => void;
  addOne: (diet: NormalizedCustomDiet) => void;
  removeByKey: (key: string) => void;
  clear: () => void;
  importFromJson: (json: unknown) => DietValidationResult;
  updateLastImport: (result: DietValidationResult) => void;
  getByKey: (key: string) => NormalizedCustomDiet | undefined;
  getAllKeys: () => string[];
}

// Combined store type
type CustomDietsStore = CustomDietsState & CustomDietsActions;

// Default state
const defaultState: CustomDietsState = {
  items: [],
  lastImport: null,
};

// Create the store
export const useCustomDietsStore = create<CustomDietsStore>()(
  persist(
    (set, get) => ({
      ...defaultState,

      // Add multiple diets
      addMany: (diets: NormalizedCustomDiet[]) => {
        set((state) => {
          // Filter out duplicates by key
          const existingKeys = new Set(state.items.map(item => item.key));
          const newDiets = diets.filter(diet => !existingKeys.has(diet.key));
          
          return {
            items: [...state.items, ...newDiets],
          };
        });
      },

      // Add single diet
      addOne: (diet: NormalizedCustomDiet) => {
        set((state) => {
          // Check if key already exists
          const existingIndex = state.items.findIndex(item => item.key === diet.key);
          
          if (existingIndex >= 0) {
            // Update existing diet
            const updatedItems = [...state.items];
            updatedItems[existingIndex] = diet;
            return { items: updatedItems };
          } else {
            // Add new diet
            return { items: [...state.items, diet] };
          }
        });
      },

      // Remove diet by key
      removeByKey: (key: string) => {
        set((state) => ({
          items: state.items.filter(item => item.key !== key),
        }));
      },

      // Clear all custom diets
      clear: () => {
        set({ items: [], lastImport: null });
      },

      // Import from JSON data
      importFromJson: (json: unknown): DietValidationResult => {
        const result = validateCustomDietsImport(json);
        
        if (result.diets.length > 0) {
          // Add successfully validated diets
          get().addMany(result.diets);
          
          // Update last import info
          get().updateLastImport(result);
        }
        
        return result;
      },

      // Update last import result
      updateLastImport: (result: DietValidationResult) => {
        set({
          lastImport: {
            timestamp: Date.now(),
            result,
          },
        });
      },

      // Get diet by key
      getByKey: (key: string): NormalizedCustomDiet | undefined => {
        return get().items.find(item => item.key === key);
      },

      // Get all diet keys
      getAllKeys: (): string[] => {
        return get().items.map(item => item.key);
      },
    }),
    {
      name: 'makromind.customDiets.v1', // localStorage key
      version: 1,
      
      // Migration function for future versions
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Handle migration from version 0 to 1 if needed
          return {
            ...defaultState,
            ...persistedState,
          };
        }
        return persistedState;
      },
      
      // Partialize to only persist necessary data
      partialize: (state) => ({
        items: state.items,
        lastImport: state.lastImport,
      }),
    }
  )
);

// Selectors for common use cases
export const customDietsSelectors = {
  // Get all custom diets
  getAllCustomDiets: () => useCustomDietsStore.getState().items,
  
  // Get custom diet by key
  getCustomDietByKey: (key: string) => useCustomDietsStore.getState().getByKey(key),
  
  // Get custom diet keys
  getCustomDietKeys: () => useCustomDietsStore.getState().getAllKeys(),
  
  // Check if custom diet exists
  hasCustomDiet: (key: string) => useCustomDietsStore.getState().getByKey(key) !== undefined,
  
  // Get last import info
  getLastImport: () => useCustomDietsStore.getState().lastImport,
  
  // Get custom diets count
  getCustomDietsCount: () => useCustomDietsStore.getState().items.length,
};

// Helper functions for external use
export const customDietsHelpers = {
  // Create a new custom diet from basic data
  createCustomDiet: (data: {
    name: string;
    description: string;
    defaultMacros: { proteinPct: number; carbPct: number; fatPct: number };
    carbCapGrams?: number;
    tags?: string[];
    scoringAdjust?: { plus?: Record<string, number>; minus?: Record<string, number> };
  }): NormalizedCustomDiet => {
    const key = `custom:${data.name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()}`;
    
    return {
      key,
      name: data.name,
      description: data.description,
      defaultMacros: data.defaultMacros,
      carbCapGrams: data.carbCapGrams,
      tags: data.tags,
      scoringAdjust: data.scoringAdjust,
    };
  },

  // Export custom diets to JSON
  exportCustomDiets: (): string => {
    const diets = useCustomDietsStore.getState().items;
    return JSON.stringify({ diets }, null, 2);
  },

  // Clear all data (including localStorage)
  clearAllData: () => {
    useCustomDietsStore.getState().clear();
    localStorage.removeItem('makromind.customDiets.v1');
  },
};

// Hook for React components
export const useCustomDiets = () => {
  const store = useCustomDietsStore();
  
  return {
    customDiets: store.items,
    lastImport: store.lastImport,
    addMany: store.addMany,
    addOne: store.addOne,
    removeByKey: store.removeByKey,
    clear: store.clear,
    importFromJson: store.importFromJson,
    getByKey: store.getByKey,
    getAllKeys: store.getAllKeys,
    count: store.items.length,
    hasCustomDiets: store.items.length > 0,
  };
};
