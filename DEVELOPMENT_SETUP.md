# 🚀 Fourth Platform - Geliştirme Ortamı Kurulumu

Bu dokümanda Fourth Platform'un geliştirme ortamını nasıl kuracağınız adım adım açıklanmıştır.

## 📋 Gereksinimler

### 1. Temel Araçlar
- **Node.js 18+**: JavaScript runtime
- **npm**: Node.js paket yöneticisi
- **Docker Desktop**: Containerization için
- **Git**: Versiyon kontrolü

### 2. macOS Kurulumu

#### Homebrew (Paket Yöneticisi)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### Node.js ve npm
```bash
brew install node
```

#### Docker Desktop
```bash
brew install --cask docker
```

## 🛠️ Otomatik Kurulum

### Tek Komutla Kurulum
```bash
# Proje dizinine gidin
cd /path/to/fourth

# Setup script'ini çalıştırın
./scripts/setup.sh
```

Bu script otomatik olarak:
- Gereksinimleri kontrol eder
- Tüm dependencies'leri yükler
- Environment dosyalarını oluşturur
- Shared types'ı build eder
- MongoDB'yi başlatır

## 🔧 Manuel Kurulum

### 1. Dependencies Yükleme
```bash
# Backend
cd backend
npm install

# Frontend Web
cd ../frontend-web
npm install

# Mobile
cd ../mobile
npm install

# Shared Types
cd ../shared-types
npm install
npm run build
```

### 2. Environment Dosyaları
```bash
# Backend environment
cp backend/env.example backend/.env

# Frontend environment
echo "REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_APP_NAME=Fourth Platform
REACT_APP_VERSION=1.0.0" > frontend-web/.env
```

### 3. Database Kurulumu
```bash
# MongoDB'yi Docker ile başlat
docker-compose -f docker-compose.dev.yml up -d mongodb
```

## 🚀 Development Serverları

### Backend (Port 3000)
```bash
cd backend
npm run dev
```

### Frontend Web (Port 3001)
```bash
cd frontend-web
npm start
```

### Mobile (Metro Bundler)
```bash
cd mobile
npm start
```

## 📱 Mobil Geliştirme

### iOS Simulator
```bash
cd mobile
npm run ios
```

### Android Emulator
```bash
cd mobile
npm run android
```

## 🔍 Kontrol ve Test

### Server Durumu
```bash
# Backend health check
curl http://localhost:3000/health

# Frontend erişimi
open http://localhost:3001
```

### Database Bağlantısı
```bash
# MongoDB container durumu
docker ps | grep mongodb

# MongoDB logs
docker logs fourth_mongodb_dev
```

## 🐳 Docker Kullanımı

### Tüm Servisleri Başlat
```bash
docker-compose -f docker-compose.dev.yml up
```

### Sadece Database
```bash
docker-compose -f docker-compose.dev.yml up -d mongodb
```

### Servisleri Durdur
```bash
docker-compose -f docker-compose.dev.yml down
```

## 📁 Proje Yapısı

```
fourth/
├── backend/                 # Node.js API server
├── frontend-web/           # React web application
├── mobile/                 # React Native mobile app
├── shared-types/           # Shared TypeScript types
├── scripts/                # Setup and deployment scripts
├── docs/                   # Documentation
└── docker-compose.dev.yml  # Development Docker setup
```

## 🔧 Geliştirme Komutları

### Backend
```bash
cd backend
npm run dev          # Development server
npm start            # Production server
npm test             # Run tests
npm run lint         # ESLint
```

### Frontend Web
```bash
cd frontend-web
npm start            # Development server
npm run build        # Production build
npm test             # Run tests
npm run lint         # ESLint
```

### Mobile
```bash
cd mobile
npm start            # Metro bundler
npm run android      # Android build
npm run ios          # iOS build
npm test             # Run tests
```

## 🐛 Sorun Giderme

### Port Çakışması
```bash
# Kullanılan portları kontrol et
lsof -i :3000
lsof -i :3001

# Process'i sonlandır
kill -9 <PID>
```

### Node Modules Sorunları
```bash
# Cache temizle
npm cache clean --force

# Node modules'ı sil ve yeniden yükle
rm -rf node_modules package-lock.json
npm install
```

### Docker Sorunları
```bash
# Docker'ı yeniden başlat
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up -d
```

### MongoDB Bağlantı Sorunu
```bash
# MongoDB container'ını kontrol et
docker ps | grep mongodb

# Container'ı yeniden başlat
docker restart fourth_mongodb_dev
```

## 📚 Faydalı Linkler

- [Node.js Documentation](https://nodejs.org/docs/)
- [React Documentation](https://reactjs.org/docs/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Docker Documentation](https://docs.docker.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)

## 🆘 Yardım

Sorun yaşıyorsanız:
1. Bu dokümantasyonu tekrar okuyun
2. GitHub Issues'da arama yapın
3. Yeni bir issue oluşturun

---

**Not**: Bu kurulum macOS için hazırlanmıştır. Windows veya Linux için bazı komutlar farklı olabilir.
