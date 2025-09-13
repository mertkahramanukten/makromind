import { UserProfile, LabResults, MacroPlan, ActivityLevel, Goal } from './types';

// Aktivite çarpanları
const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  athlete: 1.9,
};

// Kalori değerleri (gram başına)
const CALORIES_PER_GRAM = {
  protein: 4,
  carbs: 4,
  fat: 9,
};

/**
 * BMR hesaplama - Mifflin-St Jeor formülü
 */
export function calculateBMR(profile: UserProfile): number {
  const { age, gender, height, weight } = profile;
  
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

/**
 * TDEE hesaplama - BMR * Aktivite çarpanı
 */
export function calculateTDEE(profile: UserProfile, bmr: number): number {
  const activityMultiplier = ACTIVITY_MULTIPLIERS[profile.activityLevel];
  return Math.round(bmr * activityMultiplier);
}

/**
 * Hedef kalori hesaplama
 */
export function calculateTargetCalories(profile: UserProfile, tdee: number): number {
  const { goal } = profile;
  
  switch (goal) {
    case 'lose':
      return Math.round(tdee * 0.85); // %15 kalori açığı
    case 'maintain':
      return Math.round(tdee * 1.0); // Aynı kalori
    case 'gain':
      return Math.round(tdee * 1.10); // %10 kalori fazlası
    default:
      return tdee;
  }
}

/**
 * Protein hesaplama - 1.6g/kg vücut ağırlığı
 */
export function calculateProtein(profile: UserProfile, targetCalories: number) {
  const proteinGrams = Math.round(profile.weight * 1.6);
  const proteinCalories = proteinGrams * CALORIES_PER_GRAM.protein;
  const proteinPercentage = Math.round((proteinCalories / targetCalories) * 100);
  
  return {
    grams: proteinGrams,
    calories: proteinCalories,
    percentage: proteinPercentage,
  };
}

/**
 * Karbonhidrat ve yağ hesaplama
 */
export function calculateCarbsAndFat(
  targetCalories: number, 
  proteinCalories: number
) {
  const remainingCalories = targetCalories - proteinCalories;
  
  // Karbonhidrat %40, Yağ %35
  const carbsCalories = Math.round(remainingCalories * 0.4);
  const fatCalories = Math.round(remainingCalories * 0.35);
  
  const carbsGrams = Math.round(carbsCalories / CALORIES_PER_GRAM.carbs);
  const fatGrams = Math.round(fatCalories / CALORIES_PER_GRAM.fat);
  
  const carbsPercentage = Math.round((carbsCalories / targetCalories) * 100);
  const fatPercentage = Math.round((fatCalories / targetCalories) * 100);
  
  return {
    carbs: {
      grams: carbsGrams,
      calories: carbsCalories,
      percentage: carbsPercentage,
    },
    fat: {
      grams: fatGrams,
      calories: fatCalories,
      percentage: fatPercentage,
    },
  };
}

/**
 * Diyet önerileri hesaplama
 */
export function getDietRecommendations(labResults: LabResults): string[] {
  const recommendations: string[] = [];
  const { hba1c, ldl } = labResults;
  
  // HbA1c >= 5.7 → Diyabet riski
  if (hba1c >= 5.7) {
    recommendations.push('Low GI Diyet');
    recommendations.push('Akdeniz Diyeti');
  }
  
  // LDL >= 160 → Yüksek kolesterol
  if (ldl >= 160) {
    // Keto önerme, Akdeniz öncelikli
    if (!recommendations.includes('Akdeniz Diyeti')) {
      recommendations.unshift('Akdeniz Diyeti'); // En başa ekle
    }
    recommendations.push('Düşük Yağ Diyeti');
  }
  
  // Diğer durumlar için Balanced ekle
  if (recommendations.length === 0) {
    recommendations.push('Balanced Diyet');
  }
  
  // IF her zaman ekstra alternatif olarak ekle
  recommendations.push('Intermittent Fasting (IF)');
  
  return recommendations;
}

/**
 * Ana hesaplama fonksiyonu
 */
export function calculateMacroPlan(
  userProfile: UserProfile,
  labResults: LabResults
): MacroPlan {
  // 1. BMR hesaplama
  const bmr = calculateBMR(userProfile);
  
  // 2. TDEE hesaplama
  const tdee = calculateTDEE(userProfile, bmr);
  
  // 3. Hedef kalori hesaplama
  const targetCalories = calculateTargetCalories(userProfile, tdee);
  
  // 4. Protein hesaplama
  const protein = calculateProtein(userProfile, targetCalories);
  
  // 5. Karbonhidrat ve yağ hesaplama
  const { carbs, fat } = calculateCarbsAndFat(targetCalories, protein.calories);
  
  // 6. Diyet önerileri
  const dietRecommendations = getDietRecommendations(labResults);
  
  return {
    bmr: Math.round(bmr),
    tdee,
    targetCalories,
    protein,
    carbs,
    fat,
    dietRecommendations,
  };
}

/**
 * Makro dağılımını kontrol et
 */
export function validateMacroDistribution(macroPlan: MacroPlan): boolean {
  const totalPercentage = macroPlan.protein.percentage + 
                         macroPlan.carbs.percentage + 
                         macroPlan.fat.percentage;
  
  // Toplam %90-100 arasında olmalı (küçük yuvarlama hataları için)
  return totalPercentage >= 90 && totalPercentage <= 100;
}

/**
 * BMI hesaplama (bonus)
 */
export function calculateBMI(profile: UserProfile): number {
  const heightInMeters = profile.height / 100;
  return Math.round((profile.weight / (heightInMeters * heightInMeters)) * 10) / 10;
}

/**
 * BMI kategorisi
 */
export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Zayıf';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Fazla Kilolu';
  return 'Obez';
}
