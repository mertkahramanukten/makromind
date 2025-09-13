'use client';

interface DietCardProps {
  name: string;
  description: string;
  benefits: string[];
  color: 'pink' | 'blue' | 'green' | 'purple' | 'orange';
  icon: string;
  priority?: 'high' | 'medium' | 'low';
}

const colorClasses = {
  pink: 'from-pink-500 to-pink-600 bg-pink-50 border-pink-200',
  blue: 'from-blue-500 to-blue-600 bg-blue-50 border-blue-200',
  green: 'from-green-500 to-green-600 bg-green-50 border-green-200',
  purple: 'from-purple-500 to-purple-600 bg-purple-50 border-purple-200',
  orange: 'from-orange-500 to-orange-600 bg-orange-50 border-orange-200',
};

const priorityClasses = {
  high: 'ring-2 ring-green-400 ring-opacity-50',
  medium: 'ring-1 ring-blue-400 ring-opacity-30',
  low: '',
};

const priorityLabels = {
  high: 'Önerilen',
  medium: 'Alternatif',
  low: 'Ek Seçenek',
};

export function DietCard({ name, description, benefits, color, icon, priority = 'low' }: DietCardProps) {
  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border ${colorClasses[color].split(' ')[2]} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${priorityClasses[priority]}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${colorClasses[color].split(' ')[0]} ${colorClasses[color].split(' ')[1]} shadow-lg`}>
          <span className="text-2xl">{icon}</span>
        </div>
        {priority !== 'low' && (
          <div className={`text-xs font-medium px-2 py-1 rounded-full ${
            priority === 'high' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
          }`}>
            {priorityLabels[priority]}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">{name}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        </div>

        {/* Benefits */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Faydaları:</h4>
          <ul className="space-y-1">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                <span className="text-green-500 mt-1">✓</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-6">
        <button className={`w-full py-2 px-4 rounded-xl text-sm font-medium transition-all duration-200 bg-gradient-to-r ${colorClasses[color].split(' ')[0]} ${colorClasses[color].split(' ')[1]} text-white hover:shadow-lg transform hover:scale-105`}>
          Detayları Gör
        </button>
      </div>
    </div>
  );
}

// Diyet türleri için önceden tanımlanmış veriler
export const dietTypes = {
  'Low GI Diyet': {
    description: 'Düşük glisemik indeksli besinlerle kan şekerini dengede tutar.',
    benefits: [
      'Kan şekerini stabilize eder',
      'Uzun süreli tokluk sağlar',
      'İnsülin direncini azaltır',
      'Kilo kontrolüne yardımcı olur'
    ],
    color: 'green' as const,
    icon: '🥗',
    priority: 'high' as const,
  },
  'Akdeniz Diyeti': {
    description: 'Zeytinyağı, balık ve sebzelerle kalp sağlığını korur.',
    benefits: [
      'Kalp sağlığını korur',
      'Kolesterolü düşürür',
      'Antioksidan açısından zengin',
      'Uzun yaşam ile ilişkili'
    ],
    color: 'blue' as const,
    icon: '🐟',
    priority: 'high' as const,
  },
  'Düşük Yağ Diyeti': {
    description: 'Yağ alımını azaltarak kalp sağlığını iyileştirir.',
    benefits: [
      'Kolesterol seviyelerini düşürür',
      'Kalp hastalığı riskini azaltır',
      'Kilo vermeye yardımcı olur',
      'Kardiyovasküler sağlığı iyileştirir'
    ],
    color: 'orange' as const,
    icon: '🥕',
    priority: 'medium' as const,
  },
  'Balanced Diyet': {
    description: 'Tüm besin gruplarını dengeli şekilde içeren beslenme planı.',
    benefits: [
      'Tüm besin öğelerini sağlar',
      'Sürdürülebilir yaşam tarzı',
      'Enerji seviyesini korur',
      'Genel sağlığı destekler'
    ],
    color: 'purple' as const,
    icon: '⚖️',
    priority: 'medium' as const,
  },
  'Intermittent Fasting (IF)': {
    description: 'Belirli zaman aralıklarında yeme ve oruç tutma döngüsü.',
    benefits: [
      'Metabolizmayı hızlandırır',
      'Hücre yenilenmesini destekler',
      'İnsülin duyarlılığını artırır',
      'Uzun ömür ile ilişkili'
    ],
    color: 'pink' as const,
    icon: '⏰',
    priority: 'low' as const,
  },
};
