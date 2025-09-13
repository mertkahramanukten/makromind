import { MealPlanRequest } from './mealplanTypes';
import { DIET_STYLE_DESCRIPTIONS, FOOD_SUBSTITUTIONS } from './mealplanTypes';

export function buildMealPlanPrompt(req: MealPlanRequest): string {
  const { targets, dietStyleKeys, avoid, prefer, days, mealsPerDay } = req;
  
  // Build diet style descriptions
  const dietDescriptions = dietStyleKeys
    .map(key => DIET_STYLE_DESCRIPTIONS[key] || key)
    .join(', ');
  
  // Build avoid list
  const avoidList = avoid.length > 0 ? avoid.join(', ') : 'Yok';
  
  // Build prefer list
  const preferList = prefer.length > 0 ? prefer.join(', ') : 'Yok';
  
  // Build meal structure
  const mealNames = ['Kahvaltı', 'Öğle Yemeği', 'Akşam Yemeği'];
  if (mealsPerDay >= 4) mealNames.push('Ara Öğün 1');
  if (mealsPerDay >= 5) mealNames.push('Ara Öğün 2');
  
  const prompt = `
Sen bir beslenme uzmanısın. Kullanıcı için detaylı yemek planı oluştur.

GÜNÜN MAKRO HEDEFLERİ:
- Kalori: ${targets.calories} kcal
- Protein: ${targets.protein} g
- Karbonhidrat: ${targets.carbs} g  
- Yağ: ${targets.fat} g

DİYET STİLİ: ${dietDescriptions}

KAÇINILACAK GIDALAR: ${avoidList}
TERCİH EDİLEN GIDALAR: ${preferList}

ÖĞÜN YAPISI: ${mealsPerDay} öğün/gün (${mealNames.join(', ')})
PLAN SÜRESİ: ${days} gün

ÖNEMLİ KURALLAR:
1. SADECE GEÇERLİ JSON ÜRET. Hiçbir açıklama yazma.
2. Her öğün için makro toplamlarını (total) doğru hesapla.
3. avoid listesindeki hiçbir gıdayı kullanma. Yerine aynı mutfak/benzer makro profilli alternatifler öner.
4. prefer listesi varsa öncelik ver.
5. dietStyleKeys ile uyumlu malzemeler ve pişirme yöntemleri seç.
6. Tuz/şeker/işlenmiş gıdaları sınırlı tut.
7. Alkol kesinlikle yok.
8. Her yemek öğesi için gram miktarı ve makro değerlerini gerçekçi ver.
9. Günlük toplamlar hedef makrolara yakın olsun (±%10 tolerans).

ÇIKTI FORMATI:
{
  "days": [
    {
      "day": "Day 1",
      "meals": [
        {
          "title": "Kahvaltı",
          "items": [
            {
              "name": "Yulaf + Yoğurt + Meyve",
              "amountGrams": 180,
              "kcal": 280,
              "protein": 18,
              "carbs": 35,
              "fat": 7,
              "tags": ["yüksek lif", "protein"]
            }
          ],
          "total": {
            "kcal": 280,
            "protein": 18,
            "carbs": 35,
            "fat": 7
          }
        }
      ],
      "notes": ["Düşük GI odaklı", "Antioksidan zengin"]
    }
  ],
  "warnings": [],
  "substitutions": {
    "domates": ["salatalık", "kırmızı biber"]
  }
}

ŞİMDİ ${days} GÜNLÜK DETAYLI YEMEK PLANI ÜRET:`;

  return prompt;
}

// Alternative prompt for single meal regeneration
export function buildSingleMealPrompt(mealTitle: string, targets: MealPlanRequest['targets'], dietStyleKeys: string[], avoid: string[], prefer: string[]): string {
  const dietDescriptions = dietStyleKeys
    .map(key => DIET_STYLE_DESCRIPTIONS[key] || key)
    .join(', ');
  
  const avoidList = avoid.length > 0 ? avoid.join(', ') : 'Yok';
  const preferList = prefer.length > 0 ? prefer.join(', ') : 'Yok';
  
  return `
${mealTitle} için tek öğün planı oluştur.

MAKRO HEDEFLER (sadece bu öğün için):
- Kalori: ${Math.round(targets.calories / 3)} kcal (±50)
- Protein: ${Math.round(targets.protein / 3)} g (±5)
- Karbonhidrat: ${Math.round(targets.carbs / 3)} g (±10)
- Yağ: ${Math.round(targets.fat / 3)} g (±5)

DİYET STİLİ: ${dietDescriptions}
KAÇINILACAK: ${avoidList}
TERCİH EDİLEN: ${preferList}

SADECE GEÇERLİ JSON ÜRET:
{
  "title": "${mealTitle}",
  "items": [
    {
      "name": "Yemek Adı",
      "amountGrams": 150,
      "kcal": 250,
      "protein": 15,
      "carbs": 30,
      "fat": 8,
      "tags": ["tag1", "tag2"]
    }
  ],
  "total": {
    "kcal": 250,
    "protein": 15,
    "carbs": 30,
    "fat": 8
  }
}`;
}

// Helper function to get substitution suggestions
export function getSubstitutionSuggestions(avoidedItem: string): string[] {
  // Check direct matches first
  for (const [key, values] of Object.entries(FOOD_SUBSTITUTIONS)) {
    if (key.toLowerCase().includes(avoidedItem.toLowerCase()) || 
        avoidedItem.toLowerCase().includes(key.toLowerCase())) {
      return values;
    }
  }
  
  // Check if any of the substitution keys contain the avoided item
  for (const [key, values] of Object.entries(FOOD_SUBSTITUTIONS)) {
    if (values.some(value => 
      value.toLowerCase().includes(avoidedItem.toLowerCase()) ||
      avoidedItem.toLowerCase().includes(value.toLowerCase())
    )) {
      return values;
    }
  }
  
  // Default generic substitutions
  return ['alternatif seçenek', 'benzer gıda', 'yerine geçen ürün'];
}

// Helper function to validate if food should be avoided
export function shouldAvoidFood(foodName: string, avoidList: string[]): boolean {
  const foodLower = foodName.toLowerCase();
  
  return avoidList.some(avoidItem => {
    const avoidLower = avoidItem.toLowerCase();
    
    // Direct match
    if (foodLower.includes(avoidLower) || avoidLower.includes(foodLower)) {
      return true;
    }
    
    // Check if food contains any of the avoided categories
    const categories = FOOD_SUBSTITUTIONS[avoidLower];
    if (categories) {
      return categories.some(category => 
        foodLower.includes(category.toLowerCase()) ||
        category.toLowerCase().includes(foodLower)
      );
    }
    
    return false;
  });
}

// Helper function to suggest better alternatives
export function suggestAlternatives(foodName: string, avoidList: string[], preferList: string[]): string {
  // First, check if we should avoid this food
  if (shouldAvoidFood(foodName, avoidList)) {
    // Find appropriate substitution
    for (const avoidItem of avoidList) {
      const substitutions = getSubstitutionSuggestions(avoidItem);
      if (substitutions.length > 0) {
        return substitutions[0]; // Return first suggestion
      }
    }
  }
  
  // If food is not avoided, but we have preferences, suggest preferred alternatives
  if (preferList.length > 0) {
    for (const preferItem of preferList) {
      if (foodName.toLowerCase().includes(preferItem.toLowerCase()) ||
          preferItem.toLowerCase().includes(foodName.toLowerCase())) {
        return foodName; // Keep the preferred food
      }
    }
  }
  
  return foodName; // No change needed
}
