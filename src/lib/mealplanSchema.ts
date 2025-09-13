import { z } from 'zod';
import { MealPlanRequest, MealPlanResponse, MealItem, Meal, DayPlan } from './mealplanTypes';

// Base macros schema with positive number validation
const macroSchema = z.object({
  calories: z.number().min(0, 'Kalori negatif olamaz'),
  protein: z.number().min(0, 'Protein negatif olamaz'),
  carbs: z.number().min(0, 'Karbonhidrat negatif olamaz'),
  fat: z.number().min(0, 'Yağ negatif olamaz'),
});

// Meal item schema
export const mealItemSchema = z.object({
  name: z.string().min(1, 'Yemek adı boş olamaz'),
  amountGrams: z.number().min(1, 'Gram miktarı en az 1 olmalı'),
  kcal: z.number().min(0, 'Kalori negatif olamaz'),
  protein: z.number().min(0, 'Protein negatif olamaz'),
  carbs: z.number().min(0, 'Karbonhidrat negatif olamaz'),
  fat: z.number().min(0, 'Yağ negatif olamaz'),
  tags: z.array(z.string()).optional(),
});

// Meal schema with total validation
export const mealSchema = z.object({
  title: z.string().min(1, 'Öğün başlığı boş olamaz'),
  items: z.array(mealItemSchema).min(1, 'En az bir yemek öğesi olmalı'),
  total: macroSchema,
}).refine((meal) => {
  // Calculate totals from items
  const calculatedTotals = meal.items.reduce(
    (acc, item) => ({
      kcal: acc.kcal + item.kcal,
      protein: acc.protein + item.protein,
      carbs: acc.carbs + item.carbs,
      fat: acc.fat + item.fat,
    }),
    { kcal: 0, protein: 0, carbs: 0, fat: 0 }
  );

  // Check if totals match within 5% tolerance
  const tolerance = 0.05;
  const kcalMatch = Math.abs(meal.total.kcal - calculatedTotals.kcal) / calculatedTotals.kcal <= tolerance;
  const proteinMatch = Math.abs(meal.total.protein - calculatedTotals.protein) / Math.max(calculatedTotals.protein, 1) <= tolerance;
  const carbsMatch = Math.abs(meal.total.carbs - calculatedTotals.carbs) / Math.max(calculatedTotals.carbs, 1) <= tolerance;
  const fatMatch = Math.abs(meal.total.fat - calculatedTotals.fat) / Math.max(calculatedTotals.fat, 1) <= tolerance;

  return kcalMatch && proteinMatch && carbsMatch && fatMatch;
}, {
  message: 'Öğün toplamları, yemek öğelerinin toplamıyla ±%5 tolerans içinde olmalı'
});

// Day plan schema
export const dayPlanSchema = z.object({
  day: z.string().min(1, 'Gün adı boş olamaz'),
  meals: z.array(mealSchema).min(1, 'En az bir öğün olmalı'),
  notes: z.array(z.string()).optional(),
});

// Meal plan request schema
export const mealPlanRequestSchema = z.object({
  targets: macroSchema.refine((targets) => {
    return targets.calories > 0 && targets.protein > 0 && targets.carbs > 0 && targets.fat > 0;
  }, {
    message: 'Tüm makro hedefleri 0\'dan büyük olmalı'
  }),
  dietStyleKeys: z.array(z.string()).min(1, 'En az bir diyet stili seçilmeli'),
  avoid: z.array(z.string()),
  prefer: z.array(z.string()),
  days: z.number().min(1).max(7, 'Gün sayısı 1-7 arasında olmalı'),
  mealsPerDay: z.number().min(3).max(5, 'Günlük öğün sayısı 3-5 arasında olmalı'),
});

// Meal plan response schema
export const mealPlanResponseSchema = z.object({
  days: z.array(dayPlanSchema).min(1, 'En az bir günlük plan olmalı'),
  warnings: z.array(z.string()).optional(),
  substitutions: z.record(z.string(), z.array(z.string())).optional(),
});

// Validation helper functions
export function validateMealTotals(meal: Meal): { isValid: boolean; errors: string[] } {
  const calculatedTotals = meal.items.reduce(
    (acc, item) => ({
      kcal: acc.kcal + item.kcal,
      protein: acc.protein + item.protein,
      carbs: acc.carbs + item.carbs,
      fat: acc.fat + item.fat,
    }),
    { kcal: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const tolerance = 0.05;
  const errors: string[] = [];

  if (Math.abs(meal.total.kcal - calculatedTotals.kcal) / Math.max(calculatedTotals.kcal, 1) > tolerance) {
    errors.push(`Kalori toplamı uyumsuz: beklenen ${calculatedTotals.kcal}, verilen ${meal.total.kcal}`);
  }
  if (Math.abs(meal.total.protein - calculatedTotals.protein) / Math.max(calculatedTotals.protein, 1) > tolerance) {
    errors.push(`Protein toplamı uyumsuz: beklenen ${calculatedTotals.protein.toFixed(1)}g, verilen ${meal.total.protein.toFixed(1)}g`);
  }
  if (Math.abs(meal.total.carbs - calculatedTotals.carbs) / Math.max(calculatedTotals.carbs, 1) > tolerance) {
    errors.push(`Karbonhidrat toplamı uyumsuz: beklenen ${calculatedTotals.carbs.toFixed(1)}g, verilen ${meal.total.carbs.toFixed(1)}g`);
  }
  if (Math.abs(meal.total.fat - calculatedTotals.fat) / Math.max(calculatedTotals.fat, 1) > tolerance) {
    errors.push(`Yağ toplamı uyumsuz: beklenen ${calculatedTotals.fat.toFixed(1)}g, verilen ${meal.total.fat.toFixed(1)}g`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateDailyTargets(days: DayPlan[], targets: MealPlanRequest['targets']): { isValid: boolean; warnings: string[] } {
  const warnings: string[] = [];
  const tolerance = 0.10; // 10% tolerance for daily totals

  days.forEach((day, index) => {
    const dailyTotals = day.meals.reduce(
      (acc, meal) => ({
        kcal: acc.kcal + meal.total.kcal,
        protein: acc.protein + meal.total.protein,
        carbs: acc.carbs + meal.total.carbs,
        fat: acc.fat + meal.total.fat,
      }),
      { kcal: 0, protein: 0, carbs: 0, fat: 0 }
    );

    if (Math.abs(dailyTotals.kcal - targets.calories) / targets.calories > tolerance) {
      warnings.push(`${day.day}: Kalori hedefi ±%10 dışında (${dailyTotals.kcal.toFixed(0)}/${targets.calories})`);
    }
    if (Math.abs(dailyTotals.protein - targets.protein) / targets.protein > tolerance) {
      warnings.push(`${day.day}: Protein hedefi ±%10 dışında (${dailyTotals.protein.toFixed(1)}g/${targets.protein}g)`);
    }
    if (Math.abs(dailyTotals.carbs - targets.carbs) / targets.carbs > tolerance) {
      warnings.push(`${day.day}: Karbonhidrat hedefi ±%10 dışında (${dailyTotals.carbs.toFixed(1)}g/${targets.carbs}g)`);
    }
    if (Math.abs(dailyTotals.fat - targets.fat) / targets.fat > tolerance) {
      warnings.push(`${day.day}: Yağ hedefi ±%10 dışında (${dailyTotals.fat.toFixed(1)}g/${targets.fat}g)`);
    }
  });

  return {
    isValid: warnings.length === 0,
    warnings
  };
}

// JSON repair helper
export function repairJson(jsonString: string): string {
  let repaired = jsonString.trim();
  
  // Remove any text before the first {
  const firstBrace = repaired.indexOf('{');
  if (firstBrace > 0) {
    repaired = repaired.substring(firstBrace);
  }
  
  // Remove any text after the last }
  const lastBrace = repaired.lastIndexOf('}');
  if (lastBrace !== -1 && lastBrace < repaired.length - 1) {
    repaired = repaired.substring(0, lastBrace + 1);
  }
  
  // Fix common JSON issues
  repaired = repaired
    // Fix trailing commas
    .replace(/,(\s*[}\]])/g, '$1')
    // Fix unquoted keys (basic cases)
    .replace(/(\w+):/g, '"$1":')
    // Fix single quotes to double quotes
    .replace(/'/g, '"')
    // Fix multiple consecutive quotes
    .replace(/""/g, '"');
  
  return repaired;
}

// Type exports for use in other files
export type MealPlanRequestType = z.infer<typeof mealPlanRequestSchema>;
export type MealPlanResponseType = z.infer<typeof mealPlanResponseSchema>;
export type MealItemType = z.infer<typeof mealItemSchema>;
export type MealType = z.infer<typeof mealSchema>;
export type DayPlanType = z.infer<typeof dayPlanSchema>;
