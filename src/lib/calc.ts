import { UserProfile, LabResults, MacroPlan, ActivityLevel, Goal, UserPreferences } from './types';
import { getDietRecommendations, generateCautions } from './dietScoring';
import { NormalizedCustomDiet } from './dietSchema';

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
// Bu fonksiyon artık dietScoring.ts'de tanımlı

/**
 * Ana hesaplama fonksiyonu
 */
export function calculateMacroPlan(
  userProfile: UserProfile,
  labResults: LabResults,
  preferences: UserPreferences = { vegetarian: 'none', fastingPreference: 'none' },
  customDiets: NormalizedCustomDiet[] = []
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
  const dietRecommendations = getDietRecommendations(userProfile, labResults, preferences, customDiets);
  const cautions = generateCautions(
    {
      prediabetes: labResults.hba1c >= 5.7 || labResults.fastingGlucose >= 100,
      diabetes: labResults.hba1c >= 6.5 || labResults.fastingGlucose >= 126,
      highLDL: labResults.ldl >= 160,
      highTG: labResults.triglycerides >= 150,
      lowHDL: (userProfile.gender === 'male' && labResults.hdl < 40) || (userProfile.gender === 'female' && labResults.hdl < 50),
      ckd: labResults.egfr !== undefined && labResults.egfr < 60,
      highTGHDLRatio: labResults.triglycerides / labResults.hdl > 3,
      obese: (userProfile.weight / Math.pow(userProfile.height / 100, 2)) >= 30,
      overweight: (userProfile.weight / Math.pow(userProfile.height / 100, 2)) >= 25 && (userProfile.weight / Math.pow(userProfile.height / 100, 2)) < 30,
      lowFerritin: labResults.ferritin !== undefined && labResults.ferritin < 30,
      lowB12: labResults.b12 !== undefined && labResults.b12 < 200,
    },
    preferences
  );
  
  return {
    bmr: Math.round(bmr),
    tdee,
    targetCalories,
    protein,
    carbs,
    fat,
    dietRecommendations,
    cautions,
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

/**
 * Test fonksiyonu - diyet kurallarını test et
 */
export function testDietRules() {
  const testCases = [
    {
      name: 'Normal değerler',
      labResults: { fastingGlucose: 90, hba1c: 5.0, ldl: 100, hdl: 50, triglycerides: 120 },
      expected: ['Balanced Diyet', 'Intermittent Fasting (IF)']
    },
    {
      name: 'Yüksek HbA1c',
      labResults: { fastingGlucose: 110, hba1c: 6.0, ldl: 100, hdl: 50, triglycerides: 120 },
      expected: ['Low GI Diyet', 'Akdeniz Diyeti', 'Intermittent Fasting (IF)']
    },
    {
      name: 'Yüksek LDL',
      labResults: { fastingGlucose: 90, hba1c: 5.0, ldl: 180, hdl: 50, triglycerides: 120 },
      expected: ['Akdeniz Diyeti', 'Düşük Yağ Diyeti', 'Intermittent Fasting (IF)']
    },
    {
      name: 'Hem yüksek HbA1c hem LDL',
      labResults: { fastingGlucose: 110, hba1c: 6.0, ldl: 180, hdl: 50, triglycerides: 120 },
      expected: ['Low GI Diyet', 'Akdeniz Diyeti', 'Düşük Yağ Diyeti', 'Intermittent Fasting (IF)']
    }
  ];

  console.log('🧪 Diyet Kuralları Test Sonuçları:');
  testCases.forEach(testCase => {
    const result = getDietRecommendations(testCase.labResults);
    const passed = JSON.stringify(result) === JSON.stringify(testCase.expected);
    console.log(`${passed ? '✅' : '❌'} ${testCase.name}: ${passed ? 'PASS' : 'FAIL'}`);
    if (!passed) {
      console.log(`   Beklenen: ${JSON.stringify(testCase.expected)}`);
      console.log(`   Alınan: ${JSON.stringify(result)}`);
    }
  });
}
