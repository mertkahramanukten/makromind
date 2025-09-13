'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
            MakroMind 🧠
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Kan değerlerinize göre kişiselleştirilmiş makro planı ve diyet önerileri alın
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/onboarding')}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              Başlayın →
            </button>
            <button
              onClick={() => router.push('/plan')}
              className="px-8 py-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-700 font-semibold text-lg hover:bg-white hover:shadow-lg transition-all duration-200"
            >
              Örnek Plan Görün
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-pink-100 text-center">
            <div className="text-4xl mb-4">👤</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Kişisel Profil</h3>
            <p className="text-gray-600">
              Yaş, cinsiyet, boy, kilo ve aktivite seviyenizi girerek size özel hesaplamalar yapın
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-blue-100 text-center">
            <div className="text-4xl mb-4">🧪</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Kan Değerleri</h3>
            <p className="text-gray-600">
              Son kan tahlil sonuçlarınızı girin ve sağlık durumunuza göre öneriler alın
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-green-100 text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Akıllı Plan</h3>
            <p className="text-gray-600">
              BMR, TDEE ve makro dağılımınızı hesaplayıp en uygun diyet önerilerini sunun
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-purple-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Nasıl Çalışır?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">1</div>
              <h3 className="font-semibold text-gray-800 mb-2">Profil Bilgilerinizi Girin</h3>
              <p className="text-gray-600 text-sm">Yaş, cinsiyet, boy, kilo, hedef ve aktivite seviyenizi belirtin</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">2</div>
              <h3 className="font-semibold text-gray-800 mb-2">Kan Değerlerinizi Ekleyin</h3>
              <p className="text-gray-600 text-sm">Son kan tahlil sonuçlarınızı girin (glukoz, HbA1c, kolesterol)</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">3</div>
              <h3 className="font-semibold text-gray-800 mb-2">Planınızı Alın</h3>
              <p className="text-gray-600 text-sm">Kişiselleştirilmiş makro planı ve diyet önerilerinizi görün</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}