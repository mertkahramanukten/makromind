# 📱 iOS Geliştirme Ortamı Kurulumu

Bu dokümanda Fourth Platform'un iOS uygulamasını geliştirmek için gerekli araçların kurulumu açıklanmıştır.

## 📋 Gereksinimler

### 1. Temel Araçlar
- **Xcode 15+**: iOS geliştirme için gerekli
- **CocoaPods**: iOS dependencies yönetimi
- **Ruby 3.1+**: CocoaPods için gerekli
- **Node.js 18+**: React Native için gerekli
- **React Native CLI**: React Native projeleri için

### 2. Kurulum Durumu

#### ✅ Tamamlanan Kurulumlar
- **Node.js 24.7.0**: ✅ Yüklendi
- **Ruby 3.4.5**: ✅ Yüklendi
- **CocoaPods 1.16.2**: ✅ Yüklendi
- **React Native Dependencies**: ✅ Yüklendi
- **iOS Proje Yapısı**: ✅ Oluşturuldu

#### ⚠️ Eksik Kurulumlar
- **Xcode**: ❌ Yüklü değil
- **iOS Simulator**: ❌ Xcode ile birlikte gelir
- **iOS Dependencies**: ⚠️ Boost hatası nedeniyle tamamlanamadı

## 🚀 Xcode Kurulumu

### Yöntem 1: App Store (Önerilen)
1. **App Store'u açın**
2. **"Xcode" arayın**
3. **"Get" veya "Install" butonuna tıklayın**
4. **Yükleme tamamlanana kadar bekleyin** (yaklaşık 10-15 GB)

### Yöntem 2: Apple Developer (Hızlı)
1. **Apple Developer hesabınızla giriş yapın**
2. **Xcode'u doğrudan indirin**
3. **Daha hızlı indirme için**

## 🔧 Xcode Sonrası Kurulum

### 1. Xcode Command Line Tools
```bash
sudo xcode-select --install
```

### 2. iOS Simulator Kontrolü
```bash
xcrun simctl list devices
```

### 3. CocoaPods Yeniden Kurulumu
```bash
cd mobile/ios
export PATH="/opt/homebrew/lib/ruby/gems/3.4.0/bin:$PATH"
pod install
```

## 📱 iOS Uygulaması Çalıştırma

### 1. Metro Bundler Başlatma
```bash
cd mobile
npm start
```

### 2. iOS Simulator'da Çalıştırma
```bash
cd mobile
npm run ios
```

### 3. Xcode ile Çalıştırma
```bash
cd mobile/ios
open Fourth.xcworkspace
```

## 🐛 Sorun Giderme

### Boost Checksum Hatası
```bash
# CocoaPods cache temizle
pod cache clean --all

# Pods klasörünü sil
rm -rf Pods Podfile.lock

# Yeniden yükle
pod install
```

### Xcode Bulunamadı Hatası
```bash
# Xcode path'ini ayarla
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer

# Kontrol et
xcode-select -p
```

### iOS Simulator Sorunları
```bash
# Simulator'ları listele
xcrun simctl list devices

# Simulator'ı sıfırla
xcrun simctl erase all
```

### React Native iOS Sorunları
```bash
# Metro cache temizle
npx react-native start --reset-cache

# iOS build temizle
cd ios
xcodebuild clean
```

## 📚 Faydalı Komutlar

### iOS Simulator Yönetimi
```bash
# Simulator'ları listele
xcrun simctl list devices

# Simulator başlat
xcrun simctl boot "iPhone 15"

# Simulator kapat
xcrun simctl shutdown "iPhone 15"

# Uygulama yükle
xcrun simctl install "iPhone 15" path/to/app.app
```

### CocoaPods Yönetimi
```bash
# Pods güncelle
pod update

# Belirli pod güncelle
pod update PodName

# Pods temizle
pod deintegrate
pod install
```

### React Native iOS
```bash
# iOS build
npx react-native run-ios

# Belirli simulator
npx react-native run-ios --simulator="iPhone 15"

# Release build
npx react-native run-ios --configuration Release
```

## 🔍 Debug ve Test

### 1. Xcode Debugger
- Xcode'da projeyi açın
- Breakpoint'ler ekleyin
- Debug modunda çalıştırın

### 2. React Native Debugger
```bash
# React Native Debugger yükle
brew install --cask react-native-debugger
```

### 3. Flipper (Facebook Debug Tool)
```bash
# Flipper yükle
brew install --cask flipper
```

## 📱 Cihaz Testi

### 1. Fiziksel Cihaz Bağlama
1. **iPhone'u USB ile bağlayın**
2. **"Trust This Computer" seçin**
3. **Developer hesabınızı ayarlayın**
4. **Uygulamayı cihaza yükleyin**

### 2. Developer Hesabı
- **Apple Developer Program** ($99/yıl)
- **Free Developer Account** (7 günlük sertifikalar)

## 🚀 Production Build

### 1. Archive Oluşturma
1. **Xcode'da projeyi açın**
2. **Product > Archive seçin**
3. **Archive tamamlanana kadar bekleyin**

### 2. App Store'a Yükleme
1. **Organizer'da "Distribute App" seçin**
2. **App Store Connect seçin**
3. **Upload seçeneklerini ayarlayın**

## 📚 Faydalı Linkler

- [Apple Developer Documentation](https://developer.apple.com/documentation/)
- [React Native iOS Guide](https://reactnative.dev/docs/running-on-device?os=ios)
- [CocoaPods Documentation](https://guides.cocoapods.org/)
- [Xcode Documentation](https://developer.apple.com/xcode/)

## 🆘 Yardım

### Yaygın Sorunlar
1. **Xcode yükleme sorunları**: App Store'dan yeniden yükleyin
2. **CocoaPods hataları**: Ruby versiyonunu kontrol edin
3. **iOS Simulator sorunları**: Xcode'u yeniden başlatın
4. **Build hataları**: Clean build yapın

### Destek
- GitHub Issues'da arama yapın
- React Native Community'ye sorun
- Apple Developer Forums'u kullanın

---

**Not**: Xcode yüklemesi büyük bir dosya olduğu için zaman alabilir. Yükleme sırasında sabırlı olun.
