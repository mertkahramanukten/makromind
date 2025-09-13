'use client';

interface MacroCardProps {
  title: string;
  value: number;
  unit: string;
  percentage?: number;
  color: 'blue' | 'green' | 'purple' | 'orange';
  icon: string;
}

const colorClasses = {
  blue: 'from-blue-500 to-blue-600 bg-blue-50 border-blue-200',
  green: 'from-green-500 to-green-600 bg-green-50 border-green-200',
  purple: 'from-purple-500 to-purple-600 bg-purple-50 border-purple-200',
  orange: 'from-orange-500 to-orange-600 bg-orange-50 border-orange-200',
};

const iconClasses = {
  blue: 'text-blue-600',
  green: 'text-green-600',
  purple: 'text-purple-600',
  orange: 'text-orange-600',
};

export function MacroCard({ title, value, unit, percentage, color, icon }: MacroCardProps) {
  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border ${colorClasses[color].split(' ')[2]} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${colorClasses[color].split(' ')[0]} ${colorClasses[color].split(' ')[1]} shadow-lg`}>
          <span className="text-2xl">{icon}</span>
        </div>
        {percentage && (
          <div className={`text-sm font-medium ${iconClasses[color]} bg-white/60 px-3 py-1 rounded-full`}>
            %{percentage}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold text-gray-900">
            {value.toLocaleString()}
          </span>
          <span className="text-sm text-gray-600 font-medium">
            {unit}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      {percentage && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full bg-gradient-to-r ${colorClasses[color].split(' ')[0]} ${colorClasses[color].split(' ')[1]}`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
