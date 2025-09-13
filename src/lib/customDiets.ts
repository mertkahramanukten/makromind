import { DietType } from './dietTypes';
import { NormalizedCustomDiet } from './dietSchema';

// Helper functions for custom diets integration

/**
 * Normalize and validate imported JSON data
 * @param json - Raw JSON data to validate
 * @returns Validation result with normalized diets and warnings
 */
export function normalizeAndValidateImport(json: unknown): {
  diets: NormalizedCustomDiet[];
  warnings: string[];
  errors: string[];
} {
  try {
    // Parse JSON if it's a string
    let data = json;
    if (typeof json === 'string') {
      data = JSON.parse(json);
    }
    
    // Validate the structure
    const { diets, warnings, errors } = validateCustomDietsImport(data);
    
    return {
      diets,
      warnings: warnings || [],
      errors: errors || [],
    };
  } catch (error) {
    return {
      diets: [],
      warnings: [],
      errors: [error instanceof Error ? error.message : 'JSON parse hatası'],
    };
  }
}

/**
 * Merge custom diets with built-in diets
 * @param builtins - Built-in diet types
 * @param customs - Custom diet types
 * @returns Combined list with warnings about conflicts
 */
export function mergeWithBuiltins(
  builtins: DietType[], 
  customs: NormalizedCustomDiet[]
): {
  allDiets: Array<DietType | NormalizedCustomDiet>;
  warnings: string[];
  conflicts: Array<{ name: string; builtinKey: string; customKey: string }>;
} {
  const warnings: string[] = [];
  const conflicts: Array<{ name: string; builtinKey: string; customKey: string }> = [];
  const allDiets: Array<DietType | NormalizedCustomDiet> = [...builtins];
  
  // Check for name conflicts
  const builtinNames = new Set(builtins.map(d => d.name.toLowerCase()));
  const builtinKeys = new Set(builtins.map(d => d.key));
  
  for (const custom of customs) {
    // Check for key conflicts (should not happen due to custom: prefix)
    if (builtinKeys.has(custom.key)) {
      warnings.push(`Key çakışması: "${custom.key}" hem built-in hem custom diyetlerde mevcut`);
      continue;
    }
    
    // Check for name conflicts
    if (builtinNames.has(custom.name.toLowerCase())) {
      const builtin = builtins.find(d => d.name.toLowerCase() === custom.name.toLowerCase());
      if (builtin) {
        conflicts.push({
          name: custom.name,
          builtinKey: builtin.key,
          customKey: custom.key,
        });
        warnings.push(`İsim çakışması: "${custom.name}" hem built-in (${builtin.key}) hem custom (${custom.key}) diyetlerde mevcut`);
      }
    }
    
    // Add custom diet (don't overwrite built-in)
    allDiets.push(custom);
  }
  
  return {
    allDiets,
    warnings,
    conflicts,
  };
}

/**
 * Convert custom diet to display format compatible with built-in diets
 * @param customDiet - Custom diet to convert
 * @returns DietType compatible object
 */
export function customDietToDisplayFormat(customDiet: NormalizedCustomDiet): DietType {
  return {
    key: customDiet.key,
    name: customDiet.name,
    description: customDiet.description,
    benefits: [], // Custom diets don't have predefined benefits
    color: 'indigo', // Default color for custom diets
    icon: '🔧', // Default icon for custom diets
    priority: 'low', // Custom diets have low priority by default
    defaultMacros: customDiet.defaultMacros,
    carbCapGrams: customDiet.carbCapGrams,
    // Note: Custom diets don't have proteinPerKg defined
  };
}

/**
 * Get all diets for display (built-in + custom)
 * @param builtins - Built-in diet types
 * @param customs - Custom diet types
 * @returns Combined diet list for UI display
 */
export function getAllDietsForDisplay(
  builtins: DietType[], 
  customs: NormalizedCustomDiet[]
): {
  diets: DietType[];
  customDiets: DietType[];
  total: number;
  warnings: string[];
} {
  const customDisplayDiets = customs.map(customDietToDisplayFormat);
  const { warnings } = mergeWithBuiltins(builtins, customs);
  
  return {
    diets: builtins,
    customDiets: customDisplayDiets,
    total: builtins.length + customDisplayDiets.length,
    warnings,
  };
}

/**
 * Filter diets by tags
 * @param diets - Diet list to filter
 * @param tags - Tags to filter by
 * @returns Filtered diet list
 */
export function filterDietsByTags(
  diets: Array<DietType | NormalizedCustomDiet>, 
  tags: string[]
): Array<DietType | NormalizedCustomDiet> {
  if (tags.length === 0) return diets;
  
  return diets.filter(diet => {
    const dietTags = 'tags' in diet ? diet.tags || [] : [];
    return tags.some(tag => dietTags.includes(tag));
  });
}

/**
 * Search diets by name or description
 * @param diets - Diet list to search
 * @param query - Search query
 * @returns Filtered diet list
 */
export function searchDiets(
  diets: Array<DietType | NormalizedCustomDiet>, 
  query: string
): Array<DietType | NormalizedCustomDiet> {
  if (!query.trim()) return diets;
  
  const lowerQuery = query.toLowerCase();
  
  return diets.filter(diet => 
    diet.name.toLowerCase().includes(lowerQuery) ||
    diet.description.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Sort diets by priority and name
 * @param diets - Diet list to sort
 * @returns Sorted diet list
 */
export function sortDietsByPriority(
  diets: Array<DietType | NormalizedCustomDiet>
): Array<DietType | NormalizedCustomDiet> {
  const priorityOrder = { high: 3, medium: 2, low: 1 };
  
  return [...diets].sort((a, b) => {
    // First sort by priority
    const aPriority = 'priority' in a ? priorityOrder[a.priority] : 1;
    const bPriority = 'priority' in b ? priorityOrder[b.priority] : 1;
    
    if (aPriority !== bPriority) {
      return bPriority - aPriority; // High to low
    }
    
    // Then sort by name
    return a.name.localeCompare(b.name);
  });
}

/**
 * Validate custom diet data before adding
 * @param diet - Custom diet to validate
 * @returns Validation result
 */
export function validateCustomDiet(diet: Partial<NormalizedCustomDiet>): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Required fields
  if (!diet.name?.trim()) {
    errors.push('Diet adı gerekli');
  }
  
  if (!diet.description?.trim()) {
    errors.push('Diet açıklaması gerekli');
  }
  
  if (!diet.defaultMacros) {
    errors.push('Makro yüzdeleri gerekli');
  } else {
    const { proteinPct, carbPct, fatPct } = diet.defaultMacros;
    
    if (proteinPct < 0 || proteinPct > 1) {
      errors.push('Protein yüzdesi 0-1 arasında olmalı');
    }
    
    if (carbPct < 0 || carbPct > 1) {
      errors.push('Karbonhidrat yüzdesi 0-1 arasında olmalı');
    }
    
    if (fatPct < 0 || fatPct > 1) {
      errors.push('Yağ yüzdesi 0-1 arasında olmalı');
    }
    
    // Check if percentages sum to approximately 1
    const total = proteinPct + carbPct + fatPct;
    if (Math.abs(total - 1.0) > 0.1) {
      warnings.push(`Makro yüzdeleri toplamı ${total.toFixed(2)} (1.0 olmalı)`);
    }
  }
  
  // Optional field validations
  if (diet.carbCapGrams !== undefined && diet.carbCapGrams < 0) {
    errors.push('Karbonhidrat limiti negatif olamaz');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Create a sample custom diet for testing
 * @returns Sample custom diet
 */
export function createSampleCustomDiet(): NormalizedCustomDiet {
  return {
    key: 'custom:test-diet',
    name: 'Test Diyet',
    description: 'Test amaçlı örnek diyet',
    defaultMacros: {
      proteinPct: 0.25,
      carbPct: 0.45,
      fatPct: 0.30,
    },
    carbCapGrams: 100,
    tags: ['test', 'sample'],
    scoringAdjust: {
      plus: { goal_lose: 1 },
      minus: { highLDL: -1 },
    },
  };
}

// Import the validation function from schema
import { validateCustomDietsImport } from './dietSchema';
