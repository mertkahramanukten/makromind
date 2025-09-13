import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, UserProfile, LabResults, MacroPlan } from './types';

interface AppStore extends AppState {
  // Actions
  setUserProfile: (profile: UserProfile) => void;
  setLabResults: (results: LabResults) => void;
  setMacroPlan: (plan: MacroPlan) => void;
  clearAll: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      // Initial state
      userProfile: null,
      labResults: null,
      macroPlan: null,

      // Actions
      setUserProfile: (profile: UserProfile) =>
        set({ userProfile: profile }),

      setLabResults: (results: LabResults) =>
        set({ labResults: results }),

      setMacroPlan: (plan: MacroPlan) =>
        set({ macroPlan: plan }),

      clearAll: () =>
        set({
          userProfile: null,
          labResults: null,
          macroPlan: null,
        }),
    }),
    {
      name: 'makromind-storage',
    }
  )
);
