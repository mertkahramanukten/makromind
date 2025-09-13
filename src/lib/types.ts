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
  dietRecommendations: string[];
}

export interface CalculationResult {
  macroPlan: MacroPlan;
  userProfile: UserProfile;
  labResults: LabResults;
}

export interface AppState {
  userProfile: UserProfile | null;
  labResults: LabResults | null;
  macroPlan: MacroPlan | null;
}
