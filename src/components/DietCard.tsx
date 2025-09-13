'use client';

import { DietType } from '@/lib/dietTypes';
import { NormalizedCustomDiet } from '@/lib/dietSchema';

interface DietCardProps {
  diet: DietType | NormalizedCustomDiet;
  score?: number;
  reasons?: string[];
}

const colorClasses = {
  pink: 'from-pink-500 to-pink-600 bg-pink-50 border-pink-200',
  blue: 'from-blue-500 to-blue-600 bg-blue-50 border-blue-200',
  green: 'from-green-500 to-green-600 bg-green-50 border-green-200',
  purple: 'from-purple-500 to-purple-600 bg-purple-50 border-purple-200',
  orange: 'from-orange-500 to-orange-600 bg-orange-50 border-orange-200',
  red: 'from-red-500 to-red-600 bg-red-50 border-red-200',
  indigo: 'from-indigo-500 to-indigo-600 bg-indigo-50 border-indigo-200',
  yellow: 'from-yellow-500 to-yellow-600 bg-yellow-50 border-yellow-200',
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

export function DietCard({ diet, score, reasons }: DietCardProps) {
  // Custom diyet mi kontrol et
  const isCustom = diet.key.startsWith('custom:');
  
  // Built-in diyet için varsayılan değerler
  const color = 'color' in diet ? diet.color : 'purple';
  const icon = 'icon' in diet ? diet.icon : '🍽️';
  const priority = 'priority' in diet ? diet.priority : 'medium';
  
  const { name, description, defaultMacros, carbCapGrams } = diet;

  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border ${colorClasses[color].split(' ')[2]} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${priorityClasses[priority]}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${colorClasses[color].split(' ')[0]} ${colorClasses[color].split(' ')[1]} shadow-lg`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Custom rozeti */}
          {isCustom && (
            <div className="text-xs font-medium px-2 py-1 rounded-full bg-purple-100 text-purple-700">
              Custom
            </div>
          )}
          {/* Score rozeti */}
          {score !== undefined && (
            <div className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">
              {score} puan
            </div>
          )}
          {/* Priority rozeti */}
          {priority !== 'low' && (
            <div className={`text-xs font-medium px-2 py-1 rounded-full ${
              priority === 'high' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
            }`}>
              {priorityLabels[priority]}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">{name}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        </div>

        {/* Macro Information */}
        <div className="bg-gray-50 rounded-lg p-3">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Varsayılan Makrolar:</h4>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="font-medium text-blue-600">Protein</div>
              <div className="text-gray-600">{(defaultMacros.proteinPct * 100).toFixed(0)}%</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-green-600">Karbonhidrat</div>
              <div className="text-gray-600">{(defaultMacros.carbPct * 100).toFixed(0)}%</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-purple-600">Yağ</div>
              <div className="text-gray-600">{(defaultMacros.fatPct * 100).toFixed(0)}%</div>
            </div>
          </div>
          {carbCapGrams && (
            <div className="mt-2 text-xs text-gray-500 text-center">
              Günlük karbonhidrat limiti: {carbCapGrams}g
            </div>
          )}
        </div>

        {/* Önerilme Sebepleri */}
        {reasons && reasons.length > 0 && (
          <div className="bg-blue-50 rounded-lg p-3">
            <h4 className="text-sm font-semibold text-blue-700 mb-2">Önerilme Sebepleri:</h4>
            <ul className="text-xs text-blue-600 space-y-1">
              {reasons.map((reason, index) => (
                <li key={index} className="flex items-center">
                  <span className="mr-2">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
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