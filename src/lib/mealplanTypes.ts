export interface MealItem {
  name: string;
  amountGrams: number;
  kcal: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  tags?: string[]; // ["gluten-free", "dairy-free", "high-protein", etc.]
}

export interface Meal {
  title: string;
  items: MealItem[];
  total: {
    kcal: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface DayPlan {
  day: string;
  meals: Meal[];
  notes?: string[];
}

export interface MealPlanRequest {
  targets: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  dietStyleKeys: string[]; // ["mediterranean", "low_gi", "if_16_8"]
  avoid: string[]; // ["gluten", "domates", "fındık", "süt ürünleri", "domuz", "alkol"]
  prefer: string[]; // ["zeytinyağı", "balık", "yoğurt"]
  days: number; // 1..7, default 1
  mealsPerDay: number; // 3..5, default 3
}

export interface MealPlanResponse {
  days: DayPlan[];
  warnings?: string[];
  substitutions?: Record<string, string[]>; // { "domates": ["salatalık", "kırmızı biber"] }
}

// Helper types for validation
export interface MacroTotals {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  correctedTotals?: MacroTotals;
}

// Diet style mapping for better prompts
export const DIET_STYLE_DESCRIPTIONS: Record<string, string> = {
  keto: "Ketojenik diyet: çok düşük karbonhidrat (<50g/gün), yüksek yağ, orta protein",
  atkins: "Atkins diyeti: düşük karbonhidrat, yüksek protein ve yağ",
  paleo: "Paleo diyeti: işlenmemiş gıdalar, tahıl yok, şeker yok",
  low_gi: "Düşük glisemik indeks: yavaş sindirilen karbonhidratlar, kan şekerini stabilize eden",
  mediterranean: "Akdeniz diyeti: zeytinyağı, balık, sebze, meyve, tahıl, sınırlı kırmızı et",
  dash: "DASH diyeti: sodyum düşük, potasyum yüksek, kalp sağlığı odaklı",
  zone: "Zone diyeti: %40 karbonhidrat, %30 protein, %30 yağ",
  if_16_8: "16:8 Aralıklı oruç: 16 saat açlık, 8 saat yeme penceresi",
  if_14_10: "14:10 Aralıklı oruç: 14 saat açlık, 10 saat yeme penceresi",
  omad: "OMAD (One Meal A Day): günde tek öğün",
  vegan: "Vegan: hayvansal ürün yok, bitkisel beslenme",
  vegetarian: "Vejetaryen: et yok, süt ürünleri ve yumurta var",
  flexitarian: "Esnek vejetaryen: çoğunlukla bitkisel, ara sıra et",
  diabetes_friendly: "Diyabet dostu: düşük GI, kontrollü karbonhidrat, lif yüksek",
  renal_friendly: "Böbrek dostu: protein sınırlı, sodyum düşük, fosfor kontrollü"
};

// Common food substitutions
export const FOOD_SUBSTITUTIONS: Record<string, string[]> = {
  "domates": ["salatalık", "kırmızı biber", "havuç", "kabak"],
  "gluten": ["glütensiz ekmek", "quinoa", "pirinç", "mısır"],
  "süt ürünleri": ["laktozsuz süt", "badem sütü", "soya sütü", "hindistan cevizi sütü"],
  "fındık": ["badem", "ceviz", "kaju", "ay çekirdeği"],
  "yer fıstığı": ["badem", "ceviz", "kaju", "pumpkin seeds"],
  "domuz": ["tavuk", "hindi", "balık", "kuzu"],
  "alkol": ["su", "bitki çayı", "meyve suyu", "kombucha"],
  "şeker": ["stevia", "eritritol", "bal", "hurma"],
  "tuz": ["baharat", "limon suyu", "sirke", "soğan"],
  "beyaz ekmek": ["tam buğday ekmeği", "çavdar ekmeği", "quinoa", "yulaf"],
  "pirinç": ["quinoa", "bulgur", "kinoa", "kahverengi pirinç"],
  "makarna": ["tam buğday makarna", "quinoa makarna", "spiral kabak", "spiral havuç"]
};

// Common preferred foods by category
export const PREFERRED_FOODS: Record<string, string[]> = {
  "zeytinyağı": ["extra virgin zeytinyağı", "zeytin", "avokado yağı"],
  "balık": ["somon", "ton balığı", "sardalya", "uskumru"],
  "yoğurt": ["doğal yoğurt", "kefir", "yunan yoğurdu"],
  "sebze": ["brokoli", "ıspanak", "kabak", "havuç", "biber"],
  "meyve": ["elma", "armut", "çilek", "yaban mersini", "avokado"],
  "tahıl": ["quinoa", "yulaf", "kahverengi pirinç", "bulgur"],
  "protein": ["yumurta", "tavuk göğsü", "balık", "baklagiller"]
};
