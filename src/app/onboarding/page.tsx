'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Field, Input, Select, Button } from '@/components/Field';
import { Navigation } from '@/components/Navigation';
import { useAppStore } from '@/lib/store';
import { UserProfile, Gender, Goal, ActivityLevel } from '@/lib/types';

export default function OnboardingPage() {
  const router = useRouter();
  const { setUserProfile } = useAppStore();
  
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    age: undefined,
    gender: '',
    height: undefined,
    weight: undefined,
    goal: '',
    activityLevel: '',
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof UserProfile, string>>>({});

  const genderOptions = [
    { value: 'male', label: 'Erkek' },
    { value: 'female', label: 'Kadın' },
  ];

  const goalOptions = [
    { value: 'lose', label: 'Kilo Ver' },
    { value: 'maintain', label: 'Kilo Korumak' },
    { value: 'gain', label: 'Kilo Al' },
  ];

  const activityOptions = [
    { value: 'sedentary', label: 'Sedanter (Hareketsiz)' },
    { value: 'light', label: 'Hafif Aktif (Haftada 1-3 gün egzersiz)' },
    { value: 'moderate', label: 'Orta Aktif (Haftada 3-5 gün egzersiz)' },
    { value: 'active', label: 'Aktif (Haftada 6-7 gün egzersiz)' },
    { value: 'athlete', label: 'Atlet (Günde 2+ kez egzersiz)' },
  ];

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'age' || field === 'height' || field === 'weight' 
        ? (value === '' ? undefined : Number(value)) 
        : value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UserProfile, string>> = {};

    if (!formData.age || formData.age < 1 || formData.age > 120) {
      newErrors.age = 'Yaş 1-120 arasında olmalıdır';
    }

    if (!formData.gender) {
      newErrors.gender = 'Cinsiyet seçimi zorunludur';
    }

    if (!formData.height || formData.height < 50 || formData.height > 250) {
      newErrors.height = 'Boy 50-250 cm arasında olmalıdır';
    }

    if (!formData.weight || formData.weight < 20 || formData.weight > 300) {
      newErrors.weight = 'Kilo 20-300 kg arasında olmalıdır';
    }

    if (!formData.goal) {
      newErrors.goal = 'Hedef seçimi zorunludur';
    }

    if (!formData.activityLevel) {
      newErrors.activityLevel = 'Aktivite seviyesi zorunludur';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setUserProfile(formData as UserProfile);
      router.push('/labs');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Navigation */}
        <Navigation 
          showHome={true} 
          showBack={false} 
          title="Profil Bilgileri"
        />

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Hoş Geldiniz! 👋
          </h1>
          <p className="text-gray-600">
            Size özel makro planı oluşturmak için birkaç bilgiye ihtiyacımız var
          </p>
        </div>

        {/* Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-pink-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Yaş */}
              <Field label="Yaş" required error={errors.age}>
                <Input
                  type="number"
                  placeholder="25"
                  value={formData.age ?? ''}
                  onChange={(value) => handleInputChange('age', value)}
                  min={1}
                  max={120}
                />
              </Field>

              {/* Cinsiyet */}
              <Field label="Cinsiyet" required error={errors.gender}>
                <Select
                  value={formData.gender || ''}
                  onChange={(value) => handleInputChange('gender', value)}
                  options={genderOptions}
                  placeholder="Cinsiyet seçin"
                />
              </Field>

              {/* Boy */}
              <Field label="Boy (cm)" required error={errors.height}>
                <Input
                  type="number"
                  placeholder="175"
                  value={formData.height ?? ''}
                  onChange={(value) => handleInputChange('height', value)}
                  min={50}
                  max={250}
                />
              </Field>

              {/* Kilo */}
              <Field label="Kilo (kg)" required error={errors.weight}>
                <Input
                  type="number"
                  placeholder="70"
                  value={formData.weight ?? ''}
                  onChange={(value) => handleInputChange('weight', value)}
                  min={20}
                  max={300}
                  step="0.1"
                />
              </Field>

              {/* Hedef */}
              <Field label="Hedef" required error={errors.goal}>
                <Select
                  value={formData.goal || ''}
                  onChange={(value) => handleInputChange('goal', value)}
                  options={goalOptions}
                  placeholder="Hedef seçin"
                />
              </Field>

              {/* Aktivite Seviyesi */}
              <Field label="Aktivite Seviyesi" required error={errors.activityLevel}>
                <Select
                  value={formData.activityLevel || ''}
                  onChange={(value) => handleInputChange('activityLevel', value)}
                  options={activityOptions}
                  placeholder="Aktivite seviyesi seçin"
                />
              </Field>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <Button
                type="submit"
                className="w-full text-lg py-4"
              >
                Devam Et →
              </Button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          Bu bilgiler sadece size özel makro planı oluşturmak için kullanılır
        </div>
      </div>
    </div>
  );
}
