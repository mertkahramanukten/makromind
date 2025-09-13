import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, UserProfile, LabResults, MacroPlan, UserPreferences } from './types';

interface AppStore extends AppState {
  // Actions
  setUserProfile: (profile: UserProfile) => void;
  setLabResults: (results: LabResults) => void;
  setUserPreferences: (preferences: UserPreferences) => void;
  setMacroPlan: (plan: MacroPlan) => void;
  clearAll: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      // Initial state
      userProfile: null,
      labResults: null,
      userPreferences: null,
      macroPlan: null,

      // Actions
      setUserProfile: (profile: UserProfile) =>
        set({ userProfile: profile }),

      setLabResults: (results: LabResults) =>
        set({ labResults: results }),

      setUserPreferences: (preferences: UserPreferences) =>
        set({ userPreferences: preferences }),

      setMacroPlan: (plan: MacroPlan) =>
        set({ macroPlan: plan }),

      clearAll: () =>
        set({
          userProfile: null,
          labResults: null,
          userPreferences: null,
          macroPlan: null,
        }),
    }),
    {
      name: 'makromind-storage',
    }
  )
);
