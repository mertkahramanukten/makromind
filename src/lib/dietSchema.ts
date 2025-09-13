import { z } from 'zod';

// Custom diet style schema for external imports
export const customDietSchema = z.object({
  key: z.string().min(1, 'Diet key boş olamaz'),
  name: z.string().min(1, 'Diet adı boş olamaz'),
  description: z.string().min(1, 'Diet açıklaması boş olamaz'),
  defaultMacros: z.object({
    proteinPct: z.number().min(0, 'Protein yüzdesi negatif olamaz').max(1, 'Protein yüzdesi 1\'den büyük olamaz'),
    carbPct: z.number().min(0, 'Karbonhidrat yüzdesi negatif olamaz').max(1, 'Karbonhidrat yüzdesi 1\'den büyük olamaz'),
    fatPct: z.number().min(0, 'Yağ yüzdesi negatif olamaz').max(1, 'Yağ yüzdesi 1\'den büyük olamaz'),
  }),
  carbCapGrams: z.number().min(0, 'Karbonhidrat limiti negatif olamaz').optional(),
  tags: z.array(z.string()).optional(),
  scoringAdjust: z.object({
    plus: z.record(z.string(), z.number()).optional(),
    minus: z.record(z.string(), z.number()).optional(),
  }).optional(),
});

// Schema for bulk import
export const customDietsImportSchema = z.object({
  diets: z.array(customDietSchema).min(1, 'En az bir diyet olmalı'),
});

// Normalized custom diet with validated percentages
export const normalizedCustomDietSchema = z.object({
  key: z.string().startsWith('custom:', 'Custom diet key "custom:" ile başlamalı'),
  name: z.string().min(1, 'Diet adı boş olamaz'),
  description: z.string().min(1, 'Diet açıklaması boş olamaz'),
  defaultMacros: z.object({
    proteinPct: z.number().min(0).max(1),
    carbPct: z.number().min(0).max(1),
    fatPct: z.number().min(0).max(1),
  }),
  carbCapGrams: z.number().min(0).optional(),
  tags: z.array(z.string()).optional(),
  scoringAdjust: z.object({
    plus: z.record(z.string(), z.number()).optional(),
    minus: z.record(z.string(), z.number()).optional(),
  }).optional(),
  // Metadata
  normalized: z.boolean().optional(),
  originalPercentages: z.object({
    proteinPct: z.number(),
    carbPct: z.number(),
    fatPct: z.number(),
  }).optional(),
});

// Type exports
export type CustomDiet = z.infer<typeof customDietSchema>;
export type CustomDietsImport = z.infer<typeof customDietsImportSchema>;
export type NormalizedCustomDiet = z.infer<typeof normalizedCustomDietSchema>;

// Validation result with warnings
export interface DietValidationResult {
  diets: NormalizedCustomDiet[];
  warnings: string[];
  errors: string[];
}

// Helper function to validate macro percentages sum
export function validateMacroPercentages(macros: { proteinPct: number; carbPct: number; fatPct: number }): {
  isValid: boolean;
  total: number;
  normalized?: { proteinPct: number; carbPct: number; fatPct: number };
} {
  const total = macros.proteinPct + macros.carbPct + macros.fatPct;
  const tolerance = 0.05; // 5% tolerance
  
  if (Math.abs(total - 1.0) <= tolerance) {
    return { isValid: true, total };
  }
  
  // Normalize if total is not close to 1
  const normalized = {
    proteinPct: macros.proteinPct / total,
    carbPct: macros.carbPct / total,
    fatPct: macros.fatPct / total,
  };
  
  return { isValid: false, total, normalized };
}

// Helper function to create custom diet key
export function createCustomDietKey(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
  
  return `custom:${slug}`;
}

// Helper function to normalize a single diet
export function normalizeCustomDiet(diet: CustomDiet): NormalizedCustomDiet {
  const key = diet.key.startsWith('custom:') ? diet.key : createCustomDietKey(diet.name);
  
  // Validate and normalize macro percentages
  const macroValidation = validateMacroPercentages(diet.defaultMacros);
  const macros = macroValidation.isValid 
    ? diet.defaultMacros 
    : macroValidation.normalized!;
  
  return {
    ...diet,
    key,
    defaultMacros: macros,
    normalized: !macroValidation.isValid,
    originalPercentages: !macroValidation.isValid ? diet.defaultMacros : undefined,
  };
}

// Validation function for import
export function validateCustomDietsImport(data: unknown): DietValidationResult {
  const result: DietValidationResult = {
    diets: [],
    warnings: [],
    errors: []
  };
  
  try {
    // Parse the input
    const parsed = customDietsImportSchema.parse(data);
    
    // Process each diet
    for (const diet of parsed.diets) {
      try {
        const normalized = normalizeCustomDiet(diet);
        result.diets.push(normalized);
        
        // Add warnings for normalized percentages
        if (normalized.normalized) {
          result.warnings.push(
            `${diet.name}: Makro yüzdeleri normalize edildi (${normalized.originalPercentages?.proteinPct.toFixed(2)}/${normalized.originalPercentages?.carbPct.toFixed(2)}/${normalized.originalPercentages?.fatPct.toFixed(2)} → ${normalized.defaultMacros.proteinPct.toFixed(2)}/${normalized.defaultMacros.carbPct.toFixed(2)}/${normalized.defaultMacros.fatPct.toFixed(2)})`
          );
        }
        
        // Add warning if key was changed
        if (diet.key !== normalized.key) {
          result.warnings.push(
            `${diet.name}: Key değiştirildi (${diet.key} → ${normalized.key})`
          );
        }
        
      } catch (error) {
        result.errors.push(`${diet.name}: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
      }
    }
    
  } catch (error) {
    result.errors.push(error instanceof Error ? error.message : 'JSON formatı geçersiz');
  }
  
  return result;
}
