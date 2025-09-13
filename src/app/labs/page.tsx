'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Field, Input, Button } from '@/components/Field';
import { Navigation } from '@/components/Navigation';
import { useAppStore } from '@/lib/store';
import { LabResults } from '@/lib/types';

export default function LabsPage() {
  const router = useRouter();
  const { setLabResults, userProfile } = useAppStore();
  
  const [formData, setFormData] = useState<Partial<LabResults>>({
    fastingGlucose: undefined,
    hba1c: undefined,
    ldl: undefined,
    hdl: undefined,
    triglycerides: undefined,
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof LabResults, string>>>({});

  // Eğer kullanıcı profil bilgilerini girmemişse onboarding'e yönlendir
  if (!userProfile) {
    router.push('/onboarding');
    return null;
  }

  const handleInputChange = (field: keyof LabResults, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value === '' ? undefined : Number(value)
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof LabResults, string>> = {};

    if (!formData.fastingGlucose || formData.fastingGlucose < 50 || formData.fastingGlucose > 500) {
      newErrors.fastingGlucose = 'Açlık glukoz 50-500 mg/dL arasında olmalıdır';
    }

    if (!formData.hba1c || formData.hba1c < 3 || formData.hba1c > 15) {
      newErrors.hba1c = 'HbA1c 3-15 mg/dL arasında olmalıdır';
    }

    if (!formData.ldl || formData.ldl < 50 || formData.ldl > 300) {
      newErrors.ldl = 'LDL 50-300 mg/dL arasında olmalıdır';
    }

    if (!formData.hdl || formData.hdl < 10 || formData.hdl > 150) {
      newErrors.hdl = 'HDL 10-150 mg/dL arasında olmalıdır';
    }

    if (!formData.triglycerides || formData.triglycerides < 20 || formData.triglycerides > 1000) {
      newErrors.triglycerides = 'Trigliserid 20-1000 mg/dL arasında olmalıdır';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setLabResults(formData as LabResults);
      router.push('/plan');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Navigation */}
        <Navigation 
          showHome={true} 
          showBack={true} 
          backUrl="/onboarding"
          title="Kan Değerleri"
        />

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Kan Değerleriniz 🧪
          </h1>
          <p className="text-gray-600">
            Son kan tahlil sonuçlarınızı girin (mg/dL cinsinden)
          </p>
        </div>

        {/* Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-blue-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Açlık Glukoz */}
              <Field label="Açlık Glukoz" required error={errors.fastingGlucose}>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="90"
                    value={formData.fastingGlucose ?? ''}
                    onChange={(value) => handleInputChange('fastingGlucose', value)}
                    min={50}
                    max={500}
                    step="0.1"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                    mg/dL
                  </span>
                </div>
              </Field>

              {/* HbA1c */}
              <Field label="HbA1c" required error={errors.hba1c}>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="5.2"
                    value={formData.hba1c ?? ''}
                    onChange={(value) => handleInputChange('hba1c', value)}
                    min={3}
                    max={15}
                    step="0.1"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                    mg/dL
                  </span>
                </div>
              </Field>

              {/* LDL */}
              <Field label="LDL Kolesterol" required error={errors.ldl}>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="100"
                    value={formData.ldl ?? ''}
                    onChange={(value) => handleInputChange('ldl', value)}
                    min={50}
                    max={300}
                    step="0.1"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                    mg/dL
                  </span>
                </div>
              </Field>

              {/* HDL */}
              <Field label="HDL Kolesterol" required error={errors.hdl}>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="50"
                    value={formData.hdl ?? ''}
                    onChange={(value) => handleInputChange('hdl', value)}
                    min={10}
                    max={150}
                    step="0.1"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                    mg/dL
                  </span>
                </div>
              </Field>

              {/* Trigliserid */}
              <Field label="Trigliserid" required error={errors.triglycerides}>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="120"
                    value={formData.triglycerides ?? ''}
                    onChange={(value) => handleInputChange('triglycerides', value)}
                    min={20}
                    max={1000}
                    step="0.1"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                    mg/dL
                  </span>
                </div>
              </Field>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Bilgi:</p>
                  <p>
                    Kan tahlil sonuçlarınızı son 6 ay içinde yaptırdığınız en güncel değerler olarak girin. 
                    Bu değerler size özel makro planı oluşturulmasında kullanılacaktır.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <Button
                type="submit"
                className="w-full text-lg py-4"
              >
                Makro Planımı Oluştur →
              </Button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          Bu bilgiler tıbbi tavsiye yerine geçmez. Doktorunuza danışın.
        </div>
      </div>
    </div>
  );
}
