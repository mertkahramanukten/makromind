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
  // Makro planı buraya eklenecek
}

export interface AppState {
  userProfile: UserProfile | null;
  labResults: LabResults | null;
  macroPlan: MacroPlan | null;
}
