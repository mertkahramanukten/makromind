'use client';

import { useState, useCallback } from 'react';
import { useCustomDiets } from '@/lib/customDietsStore';
import { normalizeAndValidateImport, createSampleCustomDiet } from '@/lib/customDiets';
import { NormalizedCustomDiet } from '@/lib/dietSchema';

export default function AdminDietsPage() {
  const { 
    customDiets, 
    addMany, 
    removeByKey, 
    clear, 
    importFromJson,
    count 
  } = useCustomDiets();

  const [previewDiets, setPreviewDiets] = useState<NormalizedCustomDiet[]>([]);
  const [importWarnings, setImportWarnings] = useState<string[]>([]);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Handle file upload
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/json') {
      alert('Lütfen sadece JSON dosyası seçin.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);
        processImportData(jsonData);
      } catch (error) {
        alert('JSON dosyası geçersiz: ' + (error as Error).message);
      }
    };
    reader.readAsText(file);
  }, []);

  // Handle URL import
  const handleUrlImport = useCallback(async () => {
    if (!urlInput.trim()) {
      alert('Lütfen bir URL girin.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(urlInput);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const jsonData = await response.json();
      processImportData(jsonData);
    } catch (error) {
      alert('URL\'den veri alınamadı: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [urlInput]);

  // Process imported data
  const processImportData = useCallback((jsonData: unknown) => {
    const result = normalizeAndValidateImport(jsonData);
    
    // Check limits
    if (result.diets.length > 30) {
      alert('Maksimum 30 diyet ekleyebilirsiniz. Lütfen dosyanızı düzenleyin.');
      return;
    }

    setPreviewDiets(result.diets);
    setImportWarnings(result.warnings);
    setImportErrors(result.errors);
    setShowPreview(true);

    if (result.errors.length > 0) {
      alert('Hatalar:\n' + result.errors.join('\n'));
    } else if (result.warnings.length > 0) {
      const warningText = 'Uyarılar:\n' + result.warnings.join('\n');
      if (confirm(warningText + '\n\nDevam etmek istiyor musunuz?')) {
        // User confirmed, proceed
      } else {
        setShowPreview(false);
        return;
      }
    }
  }, []);

  // Add previewed diets to store
  const handleAddAll = useCallback(() => {
    if (previewDiets.length === 0) return;

    addMany(previewDiets);
    setPreviewDiets([]);
    setShowPreview(false);
    setImportWarnings([]);
    setImportErrors([]);
    
    alert(`${previewDiets.length} diyet başarıyla eklendi!`);
  }, [previewDiets, addMany]);

  // Remove single diet
  const handleRemoveDiet = useCallback((key: string) => {
    if (confirm('Bu diyeti silmek istediğinizden emin misiniz?')) {
      removeByKey(key);
    }
  }, [removeByKey]);

  // Clear all custom diets
  const handleClearAll = useCallback(() => {
    if (confirm('Tüm custom diyetleri silmek istediğinizden emin misiniz?')) {
      clear();
    }
  }, [clear]);

  // Add sample diet for testing
  const handleAddSample = useCallback(() => {
    const sample = createSampleCustomDiet();
    addMany([sample]);
    alert('Test diyeti eklendi!');
  }, [addMany]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🛠️ Diyet Yönetimi
          </h1>
          <p className="text-gray-600">
            Dışarıdan custom diyet stilleri ekleyin ve yönetin
          </p>
        </div>

        {/* Import Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-pink-100 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            📥 Diyet İçe Aktarma
          </h2>

          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              JSON Dosya Yükle
            </label>
            <input
              type="file"
              accept="application/json"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Maksimum 30 diyet, JSON formatında
            </p>
          </div>

          {/* URL Import */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL'den İçe Aktar
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://raw.githubusercontent.com/.../diets.json"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              <button
                onClick={handleUrlImport}
                disabled={isLoading}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Yükleniyor...' : 'İçe Aktar'}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              GitHub raw, Gist veya herhangi bir JSON endpoint
            </p>
          </div>

          {/* Test Button */}
          <div className="mb-4">
            <button
              onClick={handleAddSample}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200"
            >
              🧪 Test Diyeti Ekle
            </button>
            <p className="text-xs text-gray-500 mt-1">
              Test amaçlı örnek diyet ekle
            </p>
          </div>
        </div>

        {/* Preview Section */}
        {showPreview && previewDiets.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-blue-100 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              👁️ Önizleme ({previewDiets.length} diyet)
            </h2>

            {/* Warnings */}
            {importWarnings.length > 0 && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded-r-lg">
                <h3 className="text-sm font-medium text-yellow-800 mb-2">Uyarılar</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  {importWarnings.map((warning, index) => (
                    <li key={index}>• {warning}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Preview Table */}
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ad
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Key
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Makrolar
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Etiketler
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {previewDiets.map((diet) => (
                    <tr key={diet.key} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {diet.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 font-mono">
                        {diet.key}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        P:{(diet.defaultMacros.proteinPct * 100).toFixed(0)}% | 
                        C:{(diet.defaultMacros.carbPct * 100).toFixed(0)}% | 
                        F:{(diet.defaultMacros.fatPct * 100).toFixed(0)}%
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {diet.tags?.join(', ') || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAddAll}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200"
              >
                ✅ Hepsini Ekle ({previewDiets.length})
              </button>
              <button
                onClick={() => setShowPreview(false)}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200"
              >
                ❌ İptal
              </button>
            </div>
          </div>
        )}

        {/* Current Custom Diets */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-purple-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              📋 Mevcut Custom Diyetler ({count})
            </h2>
            {count > 0 && (
              <button
                onClick={handleClearAll}
                className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200"
              >
                🗑️ Tümünü Sil
              </button>
            )}
          </div>

          {count === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg mb-2">Henüz custom diyet eklenmemiş</p>
              <p className="text-sm">Yukarıdaki seçenekleri kullanarak diyet ekleyin</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ad
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Key
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Makrolar
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Etiketler
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {customDiets.map((diet) => (
                    <tr key={diet.key} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {diet.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 font-mono">
                        {diet.key}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        P:{(diet.defaultMacros.proteinPct * 100).toFixed(0)}% | 
                        C:{(diet.defaultMacros.carbPct * 100).toFixed(0)}% | 
                        F:{(diet.defaultMacros.fatPct * 100).toFixed(0)}%
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {diet.tags?.join(', ') || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => handleRemoveDiet(diet.key)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          🗑️ Sil
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>
            Custom diyetler localStorage'da saklanır ve sadece bu tarayıcıda görünür.
          </p>
        </div>
      </div>
    </div>
  );
}
