'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MacroCard } from '@/components/MacroCard';
import { DietCard } from '@/components/DietCard';
import { StepHeader } from '@/components/StepHeader';
import { Navigation } from '@/components/Navigation';
import { useAppStore } from '@/lib/store';
import { calculateMacroPlan, calculateBMI, getBMICategory, testDietRules } from '@/lib/calc';
import { dietTypes } from '@/lib/dietTypes';
import { MacroPlan, UserProfile, LabResults, UserPreferences } from '@/lib/types';

export default function PlanPage() {
  const router = useRouter();
  const { userProfile, labResults, userPreferences, setMacroPlan } = useAppStore();
  const [macroPlan, setLocalMacroPlan] = useState<MacroPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Eğer gerekli veriler yoksa yönlendir
    if (!userProfile || !labResults) {
      router.push('/onboarding');
      return;
    }

    // Hesaplamaları yap
    try {
      const defaultPreferences: UserPreferences = { 
        vegetarian: 'none', 
        fastingPreference: 'none' 
      };
      const calculatedPlan = calculateMacroPlan(
        userProfile, 
        labResults, 
        userPreferences || defaultPreferences
      );
      setLocalMacroPlan(calculatedPlan);
      setMacroPlan(calculatedPlan); // Store'a kaydet
      
      // Diyet kurallarını test et (development için)
      if (process.env.NODE_ENV === 'development') {
        testDietRules();
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Hesaplama hatası:', error);
      setLoading(false);
    }
  }, [userProfile, labResults, userPreferences, router, setMacroPlan]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Makro planınız hazırlanıyor...</p>
        </div>
      </div>
    );
  }

  if (!macroPlan || !userProfile || !labResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Veriler yüklenirken bir hata oluştu.</p>
        </div>
      </div>
    );
  }

  const bmi = calculateBMI(userProfile);
  const bmiCategory = getBMICategory(bmi);

  // Diyet önerilerini al (artık DietRecommendation objesi olarak geliyor)
  const dietRecommendations = macroPlan.dietRecommendations;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Navigation */}
        <Navigation 
          showHome={true} 
          showBack={true} 
          backUrl="/labs"
          title="Makro Planı"
        />

        {/* Header */}
        <StepHeader
          title="Makro Planınız Hazır! 🎉"
          subtitle="Size özel hesaplanan makro değerleriniz ve diyet önerileriniz"
          icon="📊"
        />

        {/* Caution Warnings */}
        {macroPlan.cautions.length > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Önemli Uyarılar
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <ul className="list-disc list-inside space-y-1">
                    {macroPlan.cautions.map((caution, index) => (
                      <li key={index}>{caution}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BMI Info */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-green-100 mb-8">
          <div className="flex items-center justify-center space-x-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Vücut Kitle İndeksi</p>
              <p className="text-2xl font-bold text-gray-800">{bmi}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Kategori</p>
              <p className="text-lg font-semibold text-green-600">{bmiCategory}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Hedef</p>
              <p className="text-lg font-semibold text-purple-600">
                {userProfile.goal === 'lose' ? 'Kilo Ver' : 
                 userProfile.goal === 'maintain' ? 'Koruma' : 'Kilo Al'}
              </p>
            </div>
          </div>
        </div>

        {/* Macro Cards */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Günlük Makro Hedefleriniz
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MacroCard
              title="Toplam Kalori"
              value={macroPlan.targetCalories}
              unit="kcal"
              icon="🔥"
              color="orange"
            />
            <MacroCard
              title="Protein"
              value={macroPlan.protein.grams}
              unit="g"
              percentage={macroPlan.protein.percentage}
              icon="🥩"
              color="blue"
            />
            <MacroCard
              title="Karbonhidrat"
              value={macroPlan.carbs.grams}
              unit="g"
              percentage={macroPlan.carbs.percentage}
              icon="🍞"
              color="green"
            />
            <MacroCard
              title="Yağ"
              value={macroPlan.fat.grams}
              unit="g"
              percentage={macroPlan.fat.percentage}
              icon="🥑"
              color="purple"
            />
          </div>
        </div>

        {/* BMR & TDEE Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-blue-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600">
                <span className="text-xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Bazal Metabolizma</h3>
            </div>
            <p className="text-3xl font-bold text-blue-600">{macroPlan.bmr.toLocaleString()}</p>
            <p className="text-sm text-gray-600 mt-1">kcal/gün (hiçbir aktivite olmadan)</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-green-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600">
                <span className="text-xl">🏃</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Toplam Enerji</h3>
            </div>
            <p className="text-3xl font-bold text-green-600">{macroPlan.tdee.toLocaleString()}</p>
            <p className="text-sm text-gray-600 mt-1">kcal/gün (aktivite dahil)</p>
          </div>
        </div>

        {/* Diet Recommendations */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Size Özel Diyet Önerileri
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dietRecommendations.map((recommendation, index) => {
              const dietData = dietTypes[recommendation.diet];
              if (!dietData) return null;
              
              return (
                <div key={recommendation.diet} className="relative">
                  {/* Score Badge */}
                  <div className="absolute -top-2 -right-2 z-10">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                      {recommendation.score}
                    </div>
                  </div>
                  
                  <DietCard diet={dietData} />
                  
                  {/* Reasons */}
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Önerilme Sebepleri:</h4>
                    <ul className="space-y-1">
                      {recommendation.reasons.map((reason, idx) => (
                        <li key={idx} className="flex items-start space-x-2 text-xs text-gray-600">
                          <span className="text-green-500 mt-0.5">✓</span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push('/onboarding')}
            className="px-8 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-white hover:shadow-lg transition-all duration-200"
          >
            Bilgileri Güncelle
          </button>
          <button
            onClick={() => window.print()}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            Planı Yazdır
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-500 max-w-3xl mx-auto">
          <p className="mb-2">
            Bu makro planı genel bilgilendirme amaçlıdır ve kişisel sağlık durumunuza göre değişebilir.
          </p>
          <p>
            Önemli sağlık kararları almadan önce mutlaka bir sağlık uzmanına danışın.
          </p>
        </div>
      </div>
    </div>
  );
}
