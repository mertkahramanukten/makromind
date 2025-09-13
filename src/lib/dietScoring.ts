import { UserProfile, LabResults, UserPreferences, DietRecommendation } from './types';
import { dietTypes, getAllDiets } from './dietTypes';

export interface HealthFlags {
  prediabetes: boolean;
  diabetes: boolean;
  highLDL: boolean;
  highTG: boolean;
  lowHDL: boolean;
  ckd: boolean; // Chronic Kidney Disease
  highTGHDLRatio: boolean;
  obese: boolean;
  overweight: boolean;
  lowFerritin: boolean;
  lowB12: boolean;
}

/**
 * Sağlık durumu bayraklarını hesapla
 */
export function calculateHealthFlags(
  profile: UserProfile, 
  labs: LabResults
): HealthFlags {
  const bmi = (profile.weight / Math.pow(profile.height / 100, 2));
  
  return {
    prediabetes: labs.hba1c >= 5.7 || labs.fastingGlucose >= 100,
    diabetes: labs.hba1c >= 6.5 || labs.fastingGlucose >= 126,
    highLDL: labs.ldl >= 160,
    highTG: labs.triglycerides >= 150,
    lowHDL: (profile.gender === 'male' && labs.hdl < 40) || (profile.gender === 'female' && labs.hdl < 50),
    ckd: labs.egfr !== undefined && labs.egfr < 60,
    highTGHDLRatio: labs.triglycerides / labs.hdl > 3,
    obese: bmi >= 30,
    overweight: bmi >= 25 && bmi < 30,
    lowFerritin: labs.ferritin !== undefined && labs.ferritin < 30,
    lowB12: labs.b12 !== undefined && labs.b12 < 200,
  };
}

/**
 * Diyet puanlama sistemi
 */
export function scoreDiet(
  dietKey: string,
  profile: UserProfile,
  labs: LabResults,
  preferences: UserPreferences,
  healthFlags: HealthFlags
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // Hedefe göre puanlama
  if (profile.goal === 'lose') {
    if (dietKey === 'keto') { score += 2; reasons.push('Kilo verme hedefi'); }
    if (dietKey === 'low_gi') { score += 2; reasons.push('Kilo verme hedefi'); }
    if (dietKey === 'mediterranean') { score += 1; reasons.push('Kilo verme hedefi'); }
    if (dietKey === 'if_16_8') { score += 2; reasons.push('Kilo verme hedefi'); }
    if (dietKey === 'omad') { score += 1; reasons.push('Kilo verme hedefi'); }
  } else if (profile.goal === 'maintain') {
    if (dietKey === 'mediterranean') { score += 2; reasons.push('Kilo koruma hedefi'); }
    if (dietKey === 'zone') { score += 1; reasons.push('Kilo koruma hedefi'); }
    if (dietKey === 'vegetarian') { score += 1; reasons.push('Kilo koruma hedefi'); }
  } else if (profile.goal === 'gain') {
    if (dietKey === 'zone') { score += 2; reasons.push('Kilo alma hedefi'); }
    if (dietKey === 'paleo') { score += 1; reasons.push('Kilo alma hedefi'); }
    if (dietKey === 'vegetarian') { score += 1; reasons.push('Kilo alma hedefi'); }
  }

  // Glisemik/Diyabet durumu
  if (healthFlags.prediabetes || healthFlags.diabetes) {
    if (dietKey === 'low_gi') { score += 3; reasons.push('Prediyabet/Diyabet'); }
    if (dietKey === 'diabetes_friendly') { score += 3; reasons.push('Prediyabet/Diyabet'); }
    if (dietKey === 'mediterranean') { score += 2; reasons.push('Prediyabet/Diyabet'); }
    if (dietKey === 'dash') { score += 1; reasons.push('Prediyabet/Diyabet'); }
    if (dietKey === 'keto' && !healthFlags.highLDL) { score += 1; reasons.push('Prediyabet/Diyabet'); }
  }

  // LDL yüksek
  if (healthFlags.highLDL) {
    if (dietKey === 'keto') { score -= 3; reasons.push('LDL yüksek'); }
    if (dietKey === 'atkins') { score -= 2; reasons.push('LDL yüksek'); }
    if (dietKey === 'paleo') { score -= 1; reasons.push('LDL yüksek'); }
    if (dietKey === 'mediterranean') { score += 3; reasons.push('LDL yüksek'); }
    if (dietKey === 'dash') { score += 2; reasons.push('LDL yüksek'); }
    if (dietKey === 'low_gi') { score += 1; reasons.push('LDL yüksek'); }
  }

  // Trigliserid yüksek
  if (labs.triglycerides >= 200) {
    if (dietKey === 'keto') { score -= 1; reasons.push('TG yüksek'); }
    if (dietKey === 'atkins') { score -= 1; reasons.push('TG yüksek'); }
    if (dietKey === 'low_gi') { score += 2; reasons.push('TG yüksek'); }
    if (dietKey === 'mediterranean') { score += 1; reasons.push('TG yüksek'); }
    if (dietKey === 'diabetes_friendly') { score += 1; reasons.push('TG yüksek'); }
  }

  // HDL düşük
  if (healthFlags.lowHDL) {
    if (dietKey === 'mediterranean') { score += 1; reasons.push('HDL düşük'); }
    if (dietKey === 'dash') { score += 1; reasons.push('HDL düşük'); }
    if (dietKey === 'zone') { score += 1; reasons.push('HDL düşük'); }
  }

  // Böbrek sorunu
  if (healthFlags.ckd) {
    if (dietKey === 'renal_friendly') { score += 4; reasons.push('Böbrek sorunu'); }
    if (dietKey === 'vegan') { score += 1; reasons.push('Böbrek sorunu'); }
    if (dietKey === 'mediterranean') { score += 1; reasons.push('Böbrek sorunu'); }
    if (dietKey === 'keto') { score -= 2; reasons.push('Böbrek sorunu'); }
    if (dietKey === 'atkins') { score -= 2; reasons.push('Böbrek sorunu'); }
    if (dietKey === 'paleo') { score -= 1; reasons.push('Böbrek sorunu'); }
    if (dietKey === 'omad') { score -= 1; reasons.push('Böbrek sorunu'); }
  }

  // BMI durumu
  if (healthFlags.obese) {
    if (dietKey === 'if_16_8') { score += 2; reasons.push('Obezite'); }
    if (dietKey === 'low_gi') { score += 2; reasons.push('Obezite'); }
    if (dietKey === 'mediterranean') { score += 1; reasons.push('Obezite'); }
    if (dietKey === 'zone') { score += 1; reasons.push('Obezite'); }
  } else if (healthFlags.overweight) {
    if (dietKey === 'if_16_8') { score += 1; reasons.push('Fazla kilo'); }
    if (dietKey === 'mediterranean') { score += 1; reasons.push('Fazla kilo'); }
  }

  // Vejetaryen/Vegan tercihi
  if (preferences.vegetarian === 'vegan') {
    if (['vegan', 'vegetarian', 'flexitarian'].includes(dietKey)) {
      score += 3; reasons.push('Vegan tercih');
    } else {
      score -= 10; // Çok düşük puan, gösterilmeyecek
    }
  } else if (preferences.vegetarian === 'vegetarian') {
    if (dietKey === 'vegan') { score += 1; reasons.push('Vejetaryen tercih'); }
    if (dietKey === 'vegetarian') { score += 3; reasons.push('Vejetaryen tercih'); }
    if (dietKey === 'flexitarian') { score += 2; reasons.push('Vejetaryen tercih'); }
    if (['keto', 'atkins', 'paleo'].includes(dietKey)) { score -= 1; reasons.push('Vejetaryen tercih'); }
  }

  // Oruç tercihi
  if (preferences.fastingPreference === 'if16' && dietKey === 'if_16_8') {
    score += 2; reasons.push('IF 16:8 tercih');
  } else if (preferences.fastingPreference === 'if1410' && dietKey === 'if_14_10') {
    score += 2; reasons.push('IF 14:10 tercih');
  } else if (preferences.fastingPreference === 'omad' && dietKey === 'omad') {
    score += 2; reasons.push('OMAD tercih');
  }

  return { score, reasons };
}

/**
 * Caution uyarıları oluştur
 */
export function generateCautions(healthFlags: HealthFlags, preferences: UserPreferences): string[] {
  const cautions: string[] = [];

  if (healthFlags.highLDL) {
    cautions.push('LDL yüksek; keto ve atkins önerilmez. Akdeniz ve DASH daha uygundur.');
  }

  if (healthFlags.ckd) {
    cautions.push('Böbrek fonksiyonu düşük; protein 0.8-1.0 g/kg olmalı.');
  }

  if (healthFlags.prediabetes || healthFlags.diabetes) {
    cautions.push('Diyabet/prediyabet bulguları; Düşük GI / Diyabet Dostu / Akdeniz önerilir.');
  }

  if (healthFlags.lowFerritin || healthFlags.lowB12) {
    if (preferences.vegetarian === 'vegan' || preferences.vegetarian === 'vegetarian') {
      cautions.push('Vegan/vejetaryen plan seçilecekse demir ve B12 takibi gerekebilir.');
    }
  }

  return cautions;
}

/**
 * Ana diyet önerisi fonksiyonu
 */
export function getDietRecommendations(
  profile: UserProfile,
  labs: LabResults,
  preferences: UserPreferences
): DietRecommendation[] {
  const healthFlags = calculateHealthFlags(profile, labs);
  const allDiets = getAllDiets();
  const scoredDiets: DietRecommendation[] = [];

  // Her diyet için puan hesapla
  allDiets.forEach(diet => {
    const { score, reasons } = scoreDiet(diet.key, profile, labs, preferences, healthFlags);
    
    // Negatif puanlı diyetleri filtrele
    if (score > 0) {
      scoredDiets.push({
        diet: diet.key,
        score,
        reasons,
        macros: diet.defaultMacros
      });
    }
  });

  // Puanına göre sırala ve en yüksek 3-4 tanesini al
  return scoredDiets
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
}
