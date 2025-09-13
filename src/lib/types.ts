export type Gender = 'male' | 'female';
export type Goal = 'lose' | 'maintain' | 'gain';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'athlete';

export interface UserProfile {
  age: number;
  gender: Gender;
  height: number; // cm
  weight: number; // kg
  goal: Goal;
  activityLevel: ActivityLevel;
}

export interface LabResults {
  fastingGlucose: number; // Açlık Glukoz (mg/dL)
  hba1c: number; // HbA1c (mg/dL)
  ldl: number; // LDL (mg/dL)
  hdl: number; // HDL (mg/dL)
  triglycerides: number; // Trigliserid (mg/dL)
  totalChol?: number; // Total Kolesterol (mg/dL)
  egfr?: number; // eGFR (mL/min/1.73m²)
  ferritin?: number; // Ferritin (ng/mL)
  b12?: number; // B12 (pg/mL)
}

export interface UserPreferences {
  vegetarian: 'none' | 'vegetarian' | 'vegan';
  fastingPreference: 'none' | 'if16' | 'if1410' | 'omad';
}

export interface DietRecommendation {
  diet: string;
  score: number;
  reasons: string[];
  macros: {
    proteinPct: number;
    carbPct: number;
    fatPct: number;
  };
}

export interface MacroPlan {
  bmr: number; // Basal Metabolic Rate
  tdee: number; // Total Daily Energy Expenditure
  targetCalories: number; // Hedef kalori
  protein: {
    grams: number;
    calories: number;
    percentage: number;
  };
  carbs: {
    grams: number;
    calories: number;
    percentage: number;
  };
  fat: {
    grams: number;
    calories: number;
    percentage: number;
  };
  dietRecommendations: DietRecommendation[];
  cautions: string[];
}

export interface CalculationResult {
  macroPlan: MacroPlan;
  userProfile: UserProfile;
  labResults: LabResults;
}

export interface AppState {
  userProfile: UserProfile | null;
  labResults: LabResults | null;
  userPreferences: UserPreferences | null;
  macroPlan: MacroPlan | null;
  setUserProfile: (profile: UserProfile) => void;
  setLabResults: (results: LabResults) => void;
  setUserPreferences: (preferences: UserPreferences) => void;
  setMacroPlan: (plan: MacroPlan) => void;
  resetStore: () => void;
}
