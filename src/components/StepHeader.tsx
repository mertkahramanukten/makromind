'use client';

interface StepHeaderProps {
  title: string;
  subtitle?: string;
  step?: number;
  totalSteps?: number;
  icon?: string;
}

export function StepHeader({ title, subtitle, step, totalSteps, icon }: StepHeaderProps) {
  return (
    <div className="text-center mb-8">
      {/* Step Indicator */}
      {step && totalSteps && (
        <div className="flex justify-center mb-4">
          <div className="flex items-center space-x-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i + 1 <= step
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Icon */}
      {icon && (
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg">
            <span className="text-3xl">{icon}</span>
          </div>
        </div>
      )}

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
        {title}
      </h1>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
