export interface DietType {
  key: string;
  name: string;
  description: string;
  defaultMacros: {
    proteinPct: number;
    carbPct: number;
    fatPct: number;
  };
  carbCapGrams?: number;
  color: 'pink' | 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo' | 'yellow';
  icon: string;
  priority: 'high' | 'medium' | 'low';
}

export const dietTypes: Record<string, DietType> = {
  keto: {
    key: 'keto',
    name: 'Ketojenik Diyet',
    description: 'Çok düşük karbonhidrat, yüksek yağ, orta protein',
    defaultMacros: { proteinPct: 0.22, carbPct: 0.07, fatPct: 0.71 },
    carbCapGrams: 50,
    color: 'purple',
    icon: '🥑',
    priority: 'high'
  },
  atkins: {
    key: 'atkins',
    name: 'Atkins Diyeti',
    description: 'Düşük karbonhidrat, yüksek protein ve yağ',
    defaultMacros: { proteinPct: 0.30, carbPct: 0.10, fatPct: 0.60 },
    carbCapGrams: 60,
    color: 'blue',
    icon: '🥩',
    priority: 'high'
  },
  paleo: {
    key: 'paleo',
    name: 'Paleo Diyeti',
    description: 'İşlenmemiş gıdalar, et, balık, sebze ve meyve',
    defaultMacros: { proteinPct: 0.35, carbPct: 0.25, fatPct: 0.40 },
    carbCapGrams: 100,
    color: 'green',
    icon: '🌿',
    priority: 'high'
  },
  low_gi: {
    key: 'low_gi',
    name: 'Düşük Glisemik İndeks',
    description: 'Kan şekerini yavaş yükselten karbonhidratlar',
    defaultMacros: { proteinPct: 0.25, carbPct: 0.45, fatPct: 0.30 },
    carbCapGrams: 150,
    color: 'green',
    icon: '📊',
    priority: 'medium'
  },
  mediterranean: {
    key: 'mediterranean',
    name: 'Akdeniz Diyeti',
    description: 'Zeytinyağı, balık, sebze ve tahıl ağırlıklı',
    defaultMacros: { proteinPct: 0.20, carbPct: 0.50, fatPct: 0.30 },
    carbCapGrams: 200,
    color: 'blue',
    icon: '🐟',
    priority: 'high'
  },
  dash: {
    key: 'dash',
    name: 'DASH Diyeti',
    description: 'Tansiyon düşürücü, az tuzlu beslenme',
    defaultMacros: { proteinPct: 0.25, carbPct: 0.55, fatPct: 0.20 },
    carbCapGrams: 250,
    color: 'orange',
    icon: '💚',
    priority: 'medium'
  },
  zone: {
    key: 'zone',
    name: 'Zone Diyeti',
    description: '40-30-30 makro oranı ile hormon dengesi',
    defaultMacros: { proteinPct: 0.30, carbPct: 0.40, fatPct: 0.30 },
    carbCapGrams: 180,
    color: 'indigo',
    icon: '⚖️',
    priority: 'medium'
  },
  if_16_8: {
    key: 'if_16_8',
    name: 'Aralıklı Oruç 16:8',
    description: '16 saat açlık, 8 saat yeme penceresi',
    defaultMacros: { proteinPct: 0.30, carbPct: 0.40, fatPct: 0.30 },
    carbCapGrams: 200,
    color: 'purple',
    icon: '⏰',
    priority: 'high'
  },
  if_14_10: {
    key: 'if_14_10',
    name: 'Aralıklı Oruç 14:10',
    description: '14 saat açlık, 10 saat yeme penceresi',
    defaultMacros: { proteinPct: 0.25, carbPct: 0.45, fatPct: 0.30 },
    carbCapGrams: 220,
    color: 'blue',
    icon: '🕐',
    priority: 'medium'
  },
  omad: {
    key: 'omad',
    name: 'OMAD (Günde Bir Öğün)',
    description: 'Günde sadece bir büyük öğün',
    defaultMacros: { proteinPct: 0.30, carbPct: 0.35, fatPct: 0.35 },
    carbCapGrams: 150,
    color: 'red',
    icon: '🍽️',
    priority: 'low'
  },
  vegan: {
    key: 'vegan',
    name: 'Vegan Diyeti',
    description: 'Hayvansal ürün içermeyen tamamen bitkisel beslenme',
    defaultMacros: { proteinPct: 0.20, carbPct: 0.60, fatPct: 0.20 },
    carbCapGrams: 300,
    color: 'green',
    icon: '🌱',
    priority: 'medium'
  },
  vegetarian: {
    key: 'vegetarian',
    name: 'Vejetaryen Diyeti',
    description: 'Et ve balık hariç hayvansal ürünler tüketilebilir',
    defaultMacros: { proteinPct: 0.25, carbPct: 0.55, fatPct: 0.20 },
    carbCapGrams: 280,
    color: 'green',
    icon: '🥗',
    priority: 'medium'
  },
  flexitarian: {
    key: 'flexitarian',
    name: 'Flexitarian Diyeti',
    description: 'Esnek vejetaryen, ara sıra et tüketimi',
    defaultMacros: { proteinPct: 0.25, carbPct: 0.50, fatPct: 0.25 },
    carbCapGrams: 250,
    color: 'yellow',
    icon: '🥙',
    priority: 'medium'
  },
  diabetes_friendly: {
    key: 'diabetes_friendly',
    name: 'Diyabet Dostu Diyet',
    description: 'Kan şekeri kontrolü için düşük glisemik indeks',
    defaultMacros: { proteinPct: 0.30, carbPct: 0.40, fatPct: 0.30 },
    carbCapGrams: 150,
    color: 'green',
    icon: '🩺',
    priority: 'high'
  },
  renal_friendly: {
    key: 'renal_friendly',
    name: 'Böbrek Dostu Diyet',
    description: 'Protein ve fosfor kısıtlı, böbrek sağlığı odaklı',
    defaultMacros: { proteinPct: 0.15, carbPct: 0.65, fatPct: 0.20 },
    carbCapGrams: 300,
    color: 'blue',
    icon: '🫘',
    priority: 'low'
  }
};

export const getAllDiets = (): DietType[] => {
  return Object.values(dietTypes);
};

export const getDietsByPriority = (): DietType[] => {
  return getAllDiets().sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
};
