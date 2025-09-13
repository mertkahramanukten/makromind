import { NextRequest, NextResponse } from 'next/server';
import { 
  mealPlanRequestSchema, 
  mealPlanResponseSchema,
  validateMealTotals,
  validateDailyTargets,
  repairJson
} from '@/lib/mealplanSchema';
import { buildMealPlanPrompt, shouldAvoidFood, suggestAlternatives } from '@/lib/prompts';
import { MealPlanRequest, MealPlanResponse, MealItem } from '@/lib/mealplanTypes';

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validationResult = mealPlanRequestSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid request data',
          details: validationResult.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
        },
        { status: 400 }
      );
    }
    
    const req: MealPlanRequest = validationResult.data;
    
    // Build prompt for LLM
    const prompt = buildMealPlanPrompt(req);
    
    // Call LLM API
    const llmResponse = await fetch(`${request.nextUrl.origin}/api/llm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        temperature: 0.7,
      }),
    });
    
    if (!llmResponse.ok) {
      const errorData = await llmResponse.json();
      return NextResponse.json(
        { 
          error: 'LLM service unavailable',
          details: errorData.error || 'Failed to generate meal plan'
        },
        { status: 503 }
      );
    }
    
    const llmData = await llmResponse.json();
    let responseText = llmData.text;
    
    // Try to parse JSON response
    let parsedResponse: any;
    try {
      parsedResponse = JSON.parse(responseText);
    } catch (parseError) {
      // Try to repair JSON
      try {
        const repairedJson = repairJson(responseText);
        parsedResponse = JSON.parse(repairedJson);
      } catch (repairError) {
        return NextResponse.json(
          { 
            error: 'Invalid LLM response format',
            details: 'LLM did not return valid JSON. Please try again.'
          },
          { status: 500 }
        );
      }
    }
    
    // Validate response structure
    const responseValidation = mealPlanResponseSchema.safeParse(parsedResponse);
    if (!responseValidation.success) {
      return NextResponse.json(
        { 
          error: 'Invalid meal plan structure',
          details: responseValidation.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
        },
        { status: 500 }
      );
    }
    
    let mealPlan: MealPlanResponse = responseValidation.data;
    
    // Post-validation and corrections
    const warnings: string[] = [];
    const substitutions: Record<string, string[]> = {};
    
    // Validate and fix meal totals
    mealPlan.days.forEach((day, dayIndex) => {
      day.meals.forEach((meal, mealIndex) => {
        const validation = validateMealTotals(meal);
        if (!validation.isValid) {
          // Recalculate totals
          const correctedTotals = meal.items.reduce(
            (acc, item) => ({
              kcal: acc.kcal + item.kcal,
              protein: acc.protein + item.protein,
              carbs: acc.carbs + item.carbs,
              fat: acc.fat + item.fat,
            }),
            { kcal: 0, protein: 0, carbs: 0, fat: 0 }
          );
          
          mealPlan.days[dayIndex].meals[mealIndex].total = correctedTotals;
          warnings.push(`${day.day} - ${meal.title}: Makro toplamları düzeltildi`);
        }
      });
    });
    
    // Check for avoided foods and make substitutions
    mealPlan.days.forEach((day, dayIndex) => {
      day.meals.forEach((meal, mealIndex) => {
        meal.items.forEach((item, itemIndex) => {
          if (shouldAvoidFood(item.name, req.avoid)) {
            const alternative = suggestAlternatives(item.name, req.avoid, req.prefer);
            
            // Add to substitutions
            if (!substitutions[item.name]) {
              substitutions[item.name] = [];
            }
            if (!substitutions[item.name].includes(alternative)) {
              substitutions[item.name].push(alternative);
            }
            
            // Replace the item
            mealPlan.days[dayIndex].meals[mealIndex].items[itemIndex] = {
              ...item,
              name: alternative,
              // Keep same macros for now, could be improved with food database
            };
            
            warnings.push(`${item.name} → ${alternative} (kaçınılan gıda değiştirildi)`);
          }
        });
      });
    });
    
    // Validate daily targets
    const targetValidation = validateDailyTargets(mealPlan.days, req.targets);
    if (!targetValidation.isValid) {
      warnings.push(...targetValidation.warnings);
    }
    
    // Add warnings and substitutions to response
    mealPlan.warnings = warnings;
    mealPlan.substitutions = Object.keys(substitutions).length > 0 ? substitutions : undefined;
    
    // Final validation of the corrected response
    const finalValidation = mealPlanResponseSchema.safeParse(mealPlan);
    if (!finalValidation.success) {
      return NextResponse.json(
        { 
          error: 'Failed to generate valid meal plan',
          details: 'Please try again with different parameters'
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(mealPlan);
    
  } catch (error) {
    console.error('Meal plan API error:', error);
    return NextResponse.json(
      { error: 'Internal server error while generating meal plan' },
      { status: 500 }
    );
  }
}

// GET endpoint for meal plan options/help
export async function GET() {
  return NextResponse.json({
    message: 'Meal Plan Generator API',
    endpoints: {
      'POST /api/mealplan': 'Generate meal plan',
    },
    requiredFields: {
      targets: {
        calories: 'number (kcal)',
        protein: 'number (grams)',
        carbs: 'number (grams)',
        fat: 'number (grams)'
      },
      dietStyleKeys: 'array of diet style keys',
      avoid: 'array of foods to avoid',
      prefer: 'array of preferred foods',
      days: 'number (1-7)',
      mealsPerDay: 'number (3-5)'
    },
    example: {
      targets: {
        calories: 2000,
        protein: 150,
        carbs: 200,
        fat: 80
      },
      dietStyleKeys: ['mediterranean', 'low_gi'],
      avoid: ['gluten', 'domates'],
      prefer: ['zeytinyağı', 'balık'],
      days: 3,
      mealsPerDay: 3
    }
  });
}
