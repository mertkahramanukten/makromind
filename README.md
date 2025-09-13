# 🧠 MakroMind

> Kan değerlerinize göre kişiselleştirilmiş makro planı ve diyet önerileri alın

MakroMind, kullanıcıların fiziksel özelliklerini ve kan değerlerini girerek kişiselleştirilmiş makro besin planı ve diyet önerileri alabileceği modern bir web uygulamasıdır.

## ✨ Özellikler

### 🎯 Kişiselleştirilmiş Hesaplamalar
- **BMR (Bazal Metabolizma)**: Mifflin-St Jeor formülü ile
- **TDEE (Toplam Günlük Enerji)**: Aktivite seviyesine göre
- **Makro Dağılımı**: Protein, karbonhidrat ve yağ hesaplamaları
- **Hedef Kalori**: Kilo verme/koruma/alma hedeflerine göre

### 🧪 Akıllı Diyet Önerileri
- **Kan Değerleri Analizi**: HbA1c, LDL, HDL, trigliserid değerlerine göre
- **Kişiselleştirilmiş Öneriler**: Sağlık durumunuza uygun diyet türleri
- **Öncelik Sıralaması**: En uygun diyet türleri önce gösterilir

### 🎨 Modern Kullanıcı Deneyimi
- **Responsive Tasarım**: Mobil ve desktop uyumlu
- **Glassmorphism UI**: Modern ve şık arayüz
- **Pastel Renk Paleti**: Göz yormayan renkler
- **Smooth Animasyonlar**: Kullanıcı dostu etkileşimler

## 🚀 Teknoloji Stack

- **Frontend**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Storage**: Local Storage (Persistent)
- **AI/LLM**: Ollama + Llama 3.1 8B Instruct
- **Development**: ESLint, Prettier

## 📦 Kurulum

### Gereksinimler
- Node.js 18+ 
- npm veya yarn
- Ollama (Lokal LLM için)

### Adımlar

1. **Repository'yi klonlayın**
```bash
git clone https://github.com/mertkahramanukten/makromind.git
cd makromind
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Ollama'yı kurun ve modeli indirin**
```bash
# Ollama'yı indirin: https://github.com/ollama/ollama
# macOS için:
curl -fsSL https://ollama.ai/install.sh | sh

# Modeli indirin:
ollama pull llama3.1:8b-instruct

# Alternatif model (daha küçük):
# ollama pull qwen2.5:7b-instruct

# Ollama'yı başlatın (arka planda çalışır)
ollama serve
```

4. **Development server'ı başlatın**
```bash
npm run dev
```

5. **Tarayıcıda açın**
```
http://localhost:3000
```

## 📱 Kullanım

### 1. Profil Bilgilerinizi Girin
- Yaş, cinsiyet, boy, kilo
- Hedef (kilo ver/koru/al)
- Aktivite seviyesi (sedanter → atlet)

### 2. Kan Değerlerinizi Ekleyin
- Açlık Glukoz (mg/dL)
- HbA1c (mg/dL)
- LDL Kolesterol (mg/dL)
- HDL Kolesterol (mg/dL)
- Trigliserid (mg/dL)

### 3. Planınızı Alın
- Günlük kalori hedefi
- Makro besin dağılımı
- Kişiselleştirilmiş diyet önerileri

## 🧮 Hesaplama Formülleri

### BMR (Mifflin-St Jeor)
```
Erkek: BMR = 10 × kilo + 6.25 × boy - 5 × yaş + 5
Kadın: BMR = 10 × kilo + 6.25 × boy - 5 × yaş - 161
```

### TDEE
```
TDEE = BMR × Aktivite Çarpanı
```

### Aktivite Çarpanları
- **Sedanter**: 1.2 (Hareketsiz)
- **Hafif**: 1.375 (Haftada 1-3 gün egzersiz)
- **Orta**: 1.55 (Haftada 3-5 gün egzersiz)
- **Aktif**: 1.725 (Haftada 6-7 gün egzersiz)
- **Atlet**: 1.9 (Günde 2+ kez egzersiz)

### Hedef Kalori
- **Kilo Ver**: TDEE × 0.85 (%15 kalori açığı)
- **Koruma**: TDEE × 1.0 (Aynı kalori)
- **Kilo Al**: TDEE × 1.10 (%10 kalori fazlası)

### Makro Dağılımı
- **Protein**: 1.6g/kg vücut ağırlığı
- **Karbonhidrat**: Kalan kalorilerin %40'ı
- **Yağ**: Kalan kalorilerin %35'i

## 🥗 Diyet Önerileri

### Diyet Türleri

#### 🟢 Low GI Diyet
- **Koşul**: HbA1c ≥ 5.7
- **Faydalar**: Kan şekerini stabilize eder, uzun süreli tokluk sağlar

#### 🔵 Akdeniz Diyeti  
- **Koşul**: LDL ≥ 160 (öncelikli)
- **Faydalar**: Kalp sağlığını korur, kolesterolü düşürür

#### 🟠 Düşük Yağ Diyeti
- **Koşul**: LDL ≥ 160
- **Faydalar**: Kolesterol seviyelerini düşürür, kalp hastalığı riskini azaltır

#### 🟣 Balanced Diyet
- **Koşul**: Normal kan değerleri
- **Faydalar**: Tüm besin gruplarını dengeli şekilde içerir

#### 🩷 Intermittent Fasting (IF)
- **Koşul**: Her durumda (ek seçenek)
- **Faydalar**: Metabolizmayı hızlandırır, hücre yenilenmesini destekler

## 🗂️ Proje Yapısı

```
makromind/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Landing sayfası
│   │   ├── onboarding/        # Profil formu
│   │   ├── labs/              # Kan değerleri formu
│   │   ├── plan/              # Sonuçlar sayfası
│   │   └── api/               # API routes
│   │       └── llm/           # LLM endpoint
│   │           └── route.ts   # Ollama entegrasyonu
│   ├── components/            # React bileşenleri
│   │   ├── Field.tsx          # Form bileşenleri
│   │   ├── MacroCard.tsx      # Makro kartları
│   │   ├── DietCard.tsx       # Diyet kartları
│   │   ├── Navigation.tsx     # Navigasyon bileşeni
│   │   └── StepHeader.tsx     # Başlık bileşeni
│   └── lib/                   # Utility fonksiyonları
│       ├── types.ts           # TypeScript tipler
│       ├── store.ts           # Zustand store
│       ├── calc.ts            # Hesaplama motoru
│       ├── dietTypes.ts       # Diyet türleri
│       └── dietScoring.ts     # Diyet puanlama sistemi
├── public/                    # Statik dosyalar
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

## 🤖 LLM Entegrasyonu

MakroMind, yerel LLM desteği ile akıllı diyet önerileri sunar:

### Ollama Kurulumu
1. **Ollama'yı indirin**: [https://github.com/ollama/ollama](https://github.com/ollama/ollama)
2. **Model indirin**:
   ```bash
   ollama pull llama3.1:8b-instruct
   ```
3. **Ollama'yı başlatın**:
   ```bash
   ollama serve
   ```

### API Endpoint
- **POST** `/api/llm` - LLM'ye prompt gönder
- **GET** `/api/llm` - Ollama durumu kontrol et

### Örnek Kullanım
```javascript
// LLM'ye istek gönder
const response = await fetch('/api/llm', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: "Keto diyeti hakkında bilgi ver",
    temperature: 0.7
  })
});

const data = await response.json();
console.log(data.text); // LLM yanıtı
```

### Güvenlik
- Sadece server-side çalışır
- Localhost'ta çalışır (dış erişim yok)
- Stream=false (MVP için basit)

## 🧪 Test Senaryoları

### Diyet Kuralları Testi
```javascript
// Normal değerler
{ hba1c: 5.0, ldl: 100 } → ['Balanced Diyet', 'IF']

// Yüksek HbA1c  
{ hba1c: 6.0, ldl: 100 } → ['Low GI Diyet', 'Akdeniz Diyeti', 'IF']

// Yüksek LDL
{ hba1c: 5.0, ldl: 180 } → ['Akdeniz Diyeti', 'Düşük Yağ Diyeti', 'IF']

// Kombine durum
{ hba1c: 6.0, ldl: 180 } → ['Low GI Diyet', 'Akdeniz Diyeti', 'Düşük Yağ Diyeti', 'IF']
```

## 📊 Örnek Hesaplama

**Profil**: 25 yaş, erkek, 175cm, 70kg, aktif, kilo verme hedefi
**Kan Değerleri**: Normal

**Sonuçlar**:
- BMR: 1,741 kcal
- TDEE: 3,003 kcal  
- Hedef Kalori: 2,553 kcal
- Protein: 112g (448 kcal, %18)
- Karbonhidrat: 255g (1,021 kcal, %40)
- Yağ: 99g (893 kcal, %35)

## 🚀 Deployment

### Vercel (Önerilen)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# dist/ klasörünü Netlify'a yükleyin
```

### Docker
```bash
docker build -t makromind .
docker run -p 3000:3000 makromind
```

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## ⚠️ Önemli Uyarılar

- Bu uygulama genel bilgilendirme amaçlıdır
- Tıbbi tavsiye yerine geçmez
- Önemli sağlık kararları almadan önce mutlaka bir sağlık uzmanına danışın
- Kan değerlerinizi düzenli olarak kontrol ettirin

## 📞 İletişim

- **Geliştirici**: Mert Kahramanukten
- **GitHub**: [@mertkahramanukten](https://github.com/mertkahramanukten)
- **Proje Linki**: [https://github.com/mertkahramanukten/makromind](https://github.com/mertkahramanukten/makromind)

## 🙏 Teşekkürler

- Next.js ekibine harika framework için
- Tailwind CSS ekibine modern styling için
- Zustand ekibine basit state management için
- Tüm açık kaynak katkıda bulunanlara

---

**MakroMind ile sağlıklı beslenme yolculuğunuza başlayın! 🎯**