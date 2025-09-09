# Fourth - Sektörel AI Destekli Uzman Platformu

**Fourth**, her sektör için özelleştirilmiş yapay zeka destekli uzman bilgi platformudur. Aynı teknolojik altyapı üzerine inşa edilmiş, fakat her sektörün ihtiyaçlarına göre özelleştirilmiş ayrı uygulamalar sunar.

## 🎯 Proje Amacı

Fourth, sektörel uzmanlık platformları ekosistemi oluşturarak aşağıdaki ihtiyaçları karşılar:

- **Sektörel Özelleştirme**: Her sektör için özel olarak eğitilmiş AI modelleri
- **Çok Dilli Destek**: Tüm uygulamalar 20+ dilde hizmet verir
- **Modüler Mimari**: Aynı backend, farklı frontend uygulamaları
- **AI Uzmanlaşması**: Her sektör için özel eğitilmiş yapay zeka asistanları
- **Sektörel İçerik**: Her alanın kendine özgü terminolojisi ve süreçleri
- **Uzman Ağı**: Sektörel uzmanlar arasında bilgi paylaşımı

## 📚 Dokümantasyon

- [🏢 Sektörel Uygulamalar](docs/sectors.md) - Her sektör için detaylı açıklamalar
- [🏗️ Proje Yapısı](docs/architecture.md) - Teknik mimari ve dosya organizasyonu
- [🌟 Platform Özellikleri](docs/features.md) - Temel özellikler ve yetenekler
- [🤖 AI Eğitim Planı](docs/ai-training.md) - Yapay zeka model eğitimi detayları
- [🔧 Teknoloji Stack](docs/tech-stack.md) - Kullanılan teknolojiler
- [📊 Sistem Mimarisi](docs/system-architecture.md) - Mermaid diagramları
- [🚀 Geliştirme Süreci](docs/development.md) - Fazlar ve zaman çizelgesi
- [💡 İş Modeli](docs/business-model.md) - Gelir kaynakları ve pazarlama
- [🔒 Güvenlik](docs/security.md) - Güvenlik önlemleri ve standartlar
- [📱 API Dokümantasyonu](docs/api.md) - API endpoint'leri ve kullanımı

## 🏢 Sektörel Uygulamalar

### Hukuk Sektörü - **Fourth Legal**
- **Hedef Kitle**: Avukatlar, hukuk öğrencileri, hukuk danışmanları
- **AI Özellikleri**: Yasal dava analizi, sözleşme inceleme, hukuki araştırma
- **Özel Modüller**: Dava takibi, müvekkil yönetimi, mahkeme takvimi

### Sağlık Sektörü - **Fourth Medical**
- **Hedef Kitle**: Doktorlar, hemşireler, sağlık çalışanları
- **AI Özellikleri**: Teşhis desteği, ilaç etkileşimleri, hasta takibi
- **Özel Modüller**: Hasta kayıtları, reçete yönetimi, randevu sistemi

### Eczacılık Sektörü - **Fourth Pharmacy**
- **Hedef Kitle**: Eczacılar, eczane teknisyenleri, ilaç danışmanları
- **AI Özellikleri**: İlaç etkileşim kontrolü, dozaj hesaplama, yan etki analizi
- **Özel Modüller**: Stok yönetimi, reçete işleme, hasta danışmanlığı

### Emlak Sektörü - **Fourth Real Estate**
- **Hedef Kitle**: Emlak danışmanları, emlak yatırımcıları, müşteriler
- **AI Özellikleri**: Fiyat tahmini, piyasa analizi, müşteri eşleştirme
- **Özel Modüller**: İlan yönetimi, müşteri takibi, sözleşme hazırlama

### Teknoloji Sektörü - **Fourth Tech**
- **Hedef Kitle**: Yazılım geliştiriciler, IT uzmanları, teknoloji danışmanları
- **AI Özellikleri**: Kod analizi, güvenlik açığı tespiti, performans optimizasyonu
- **Özel Modüller**: Proje yönetimi, kod paylaşımı, teknik dokümantasyon

### Finans Sektörü - **Fourth Finance**
- **Hedef Kitle**: Finansal danışmanlar, muhasebeciler, yatırım uzmanları
- **AI Özellikleri**: Risk analizi, yatırım önerileri, mali raporlama
- **Özel Modüller**: Portföy yönetimi, müşteri danışmanlığı, uyumluluk takibi

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Node.js 16+
- MongoDB 5+
- Redis 6+
- Python 3.8+ (AI modelleri için)

### Kurulum
```bash
# Repository'yi klonlayın
git clone https://github.com/Sandbox-lgtm/fourth.git
cd fourth

# Backend kurulumu
cd backend
npm install
cp env.example .env
# .env dosyasını düzenleyin
npm run dev

# Web frontend kurulumu
cd ../frontend-web
npm install
npm start

# Mobile app kurulumu
cd ../mobile
npm install
# iOS için: cd ios && pod install
npm run ios
# Android için: npm run android
```

## 💻 Uygulama Çalıştırma Rehberi

Bu rehber, Fourth uygulamalarını kendi bilgisayarınızda nasıl çalıştıracağınızı adım adım açıklar.

### 📋 Sistem Gereksinimleri

#### Temel Gereksinimler
1. **Node.js 16+** - [nodejs.org](https://nodejs.org) adresinden indirin
2. **MongoDB** - [mongodb.com](https://www.mongodb.com/try/download/community) adresinden indirin
3. **Git** - [git-scm.com](https://git-scm.com) adresinden indirin

#### Mobile Uygulama İçin Ek Gereksinimler
- **Android Studio** (Android için) - [developer.android.com](https://developer.android.com/studio)
- **Xcode** (iOS için - sadece Mac'te) - App Store'dan indirin

### 🔧 Detaylı Kurulum Adımları

#### 1. Projeyi İndirin
```bash
git clone https://github.com/Sandbox-lgtm/fourth.git
cd fourth
```

#### 2. Backend'i Çalıştırın

```bash
# Backend klasörüne gidin
cd backend

# Bağımlılıkları yükleyin
npm install

# Environment dosyasını oluşturun
# Windows:
copy env.example .env
# Mac/Linux:
cp env.example .env

# .env dosyasını düzenleyin (gerekli değerleri girin)
# Özellikle JWT_SECRET ve MONGODB_URI değerlerini değiştirin

# MongoDB'yi başlatın (ayrı terminal penceresinde)
# Windows: MongoDB servisini başlatın
# Mac/Linux: mongod komutunu çalıştırın

# Backend'i başlatın
npm run dev
```

Backend `http://localhost:3000` adresinde çalışacak.

#### 3. Web Frontend'i Çalıştırın

Yeni bir terminal penceresi açın:

```bash
# Frontend klasörüne gidin
cd frontend-web

# Bağımlılıkları yükleyin
npm install

# Web uygulamasını başlatın
npm start
```

Web uygulaması `http://localhost:3001` adresinde çalışacak.

#### 4. Mobile Uygulamayı Çalıştırın

Yeni bir terminal penceresi açın:

```bash
# Mobile klasörüne gidin
cd mobile

# Bağımlılıkları yükleyin
npm install

# iOS için (sadece Mac'te)
cd ios && pod install && cd ..
npm run ios

# Android için
npm run android
```

### ⚙️ Önemli Konfigürasyonlar

#### Backend (.env dosyası)
```env
# Bu değerleri mutlaka değiştirin:
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
MONGODB_URI=mongodb://localhost:27017/fourth_app

# Diğer önemli ayarlar:
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

#### MongoDB Kurulumu
- MongoDB'yi indirip kurun
- Windows'ta MongoDB servisini başlatın
- Mac/Linux'ta `mongod` komutunu çalıştırın

### 🧪 Test Etme

1. **Backend API Testi**: `http://localhost:3000/api/health` adresine gidin
2. **Web Uygulaması**: `http://localhost:3001` adresine gidin
3. **Mobile Uygulama**: Emülatör veya fiziksel cihazda çalışacak

### 🔧 Sorun Giderme

#### Yaygın Sorunlar ve Çözümleri

1. **Port çakışması**
   - Eğer 3000 veya 3001 portları kullanılıyorsa, farklı portlar kullanın
   - `.env` dosyasında `PORT` değerini değiştirin

2. **MongoDB bağlantı hatası**
   - MongoDB'nin çalıştığından emin olun
   - `MONGODB_URI` değerini kontrol edin

3. **Node modules hatası**
   - `npm install` komutunu tekrar çalıştırın
   - `node_modules` klasörünü silip tekrar yükleyin

4. **Mobile build hatası**
   - Android Studio veya Xcode'un düzgün kurulduğundan emin olun
   - Android SDK'nın yüklü olduğunu kontrol edin

### 📱 Mobile Uygulama İçin Ek Adımlar

#### Android için:
1. Android Studio'yu kurun
2. Android SDK'yı yükleyin
3. Emülatör oluşturun veya fiziksel cihaz bağlayın
4. USB Debugging'i etkinleştirin

#### iOS için (sadece Mac):
1. Xcode'u App Store'dan indirin
2. iOS Simulator'ı başlatın
3. CocoaPods'u kurun: `sudo gem install cocoapods`

### 🌐 Erişim Adresleri

- **Backend API**: http://localhost:3000
- **Web Uygulaması**: http://localhost:3001
- **API Dokümantasyonu**: http://localhost:3000/api-docs (Swagger)

### 📝 Notlar

- Tüm uygulamalar aynı anda çalışabilir
- Backend'in çalışması diğer uygulamalar için gereklidir
- Mobile uygulama için backend'in çalışır durumda olması gerekir
- Geliştirme sırasında hot-reload özelliği aktif olacaktır

## 📈 Proje Durumu

- ✅ **Proje Yapısı** - Tamamlandı
- ✅ **Backend API** - Temel yapı hazır
- ✅ **Frontend Web** - React yapısı hazır
- ✅ **Mobile App** - React Native yapısı hazır
- ✅ **Dokümantasyon** - Kapsamlı dokümantasyon hazır
- 🔄 **AI Model Eğitimi** - Planlama aşamasında
- ⏳ **İlk Sektör Uygulaması** - Geliştirme aşamasında

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Push edin (`git push origin feature/AmazingFeature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

- **Proje Sahibi**: [GitHub Profili](https://github.com/Sandbox-lgtm)
- **Repository**: https://github.com/Sandbox-lgtm/fourth
- **Issues**: [GitHub Issues](https://github.com/Sandbox-lgtm/fourth/issues)
