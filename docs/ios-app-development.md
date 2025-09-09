# 📱 iOS App Store Geliştirme Rehberi

## Genel Bakış

Fourth platformu için iOS uygulamalarının App Store'a yüklenmesi sürecinin detaylı rehberi. Bu dokümanda geliştirme süreci, App Store gereksinimleri, optimizasyon teknikleri ve yayınlama adımları detaylandırılmıştır.

## 🛠️ Geliştirme Ortamı Kurulumu

### Gereksinimler

#### Donanım Gereksinimleri
- **Mac**: macOS 12.0 (Monterey) veya üzeri
- **RAM**: Minimum 8GB, önerilen 16GB
- **Depolama**: Minimum 50GB boş alan
- **İnternet**: Stabil internet bağlantısı

#### Yazılım Gereksinimleri
- **Xcode**: 14.0 veya üzeri
- **iOS SDK**: 16.0 veya üzeri
- **Swift**: 5.7 veya üzeri
- **CocoaPods**: 1.11 veya üzeri
- **Git**: 2.30 veya üzeri

### Kurulum Adımları

#### 1. Xcode Kurulumu
```bash
# App Store'dan Xcode'u indir ve kur
# Alternatif olarak Apple Developer sayfasından indir
# https://developer.apple.com/xcode/

# Xcode Command Line Tools kurulumu
xcode-select --install
```

#### 2. CocoaPods Kurulumu
```bash
# CocoaPods kurulumu
sudo gem install cocoapods

# CocoaPods repo güncelleme
pod setup
```

#### 3. React Native CLI Kurulumu
```bash
# React Native CLI kurulumu
npm install -g @react-native-community/cli

# iOS bağımlılıklarını kur
npx react-native doctor
```

## 📱 Proje Yapısı

### React Native Proje Oluşturma

#### 1. Proje Başlatma
```bash
# Yeni React Native projesi oluştur
npx react-native init FourthLegal --template react-native-template-typescript

# Proje dizinine git
cd FourthLegal

# iOS bağımlılıklarını kur
cd ios && pod install && cd ..
```

#### 2. Proje Yapısı
```
FourthLegal/
├── android/                 # Android platform dosyaları
├── ios/                     # iOS platform dosyaları
│   ├── FourthLegal/         # Ana iOS proje dosyaları
│   ├── FourthLegal.xcodeproj # Xcode proje dosyası
│   ├── FourthLegal.xcworkspace # CocoaPods workspace
│   └── Podfile             # CocoaPods bağımlılıkları
├── src/                     # Kaynak kod dosyaları
│   ├── components/          # React Native bileşenleri
│   ├── screens/            # Ekran bileşenleri
│   ├── services/           # API servisleri
│   ├── utils/              # Yardımcı fonksiyonlar
│   └── types/              # TypeScript tip tanımları
├── assets/                  # Statik dosyalar
│   ├── images/             # Görsel dosyalar
│   ├── fonts/              # Font dosyaları
│   └── icons/              # İkon dosyaları
├── package.json            # NPM bağımlılıkları
├── tsconfig.json           # TypeScript konfigürasyonu
└── metro.config.js         # Metro bundler konfigürasyonu
```

## 🔧 iOS Geliştirme Konfigürasyonu

### Xcode Proje Ayarları

#### 1. Bundle Identifier
```xml
<!-- ios/FourthLegal/Info.plist -->
<key>CFBundleIdentifier</key>
<string>com.fourth.legal</string>
```

#### 2. App Display Name
```xml
<!-- ios/FourthLegal/Info.plist -->
<key>CFBundleDisplayName</key>
<string>Fourth Legal</string>
```

#### 3. Version ve Build Number
```xml
<!-- ios/FourthLegal/Info.plist -->
<key>CFBundleShortVersionString</key>
<string>1.0.0</string>
<key>CFBundleVersion</key>
<string>1</string>
```

#### 4. Minimum iOS Version
```xml
<!-- ios/FourthLegal/Info.plist -->
<key>LSMinimumSystemVersion</key>
<string>16.0</string>
```

### Podfile Konfigürasyonu

#### 1. Temel Podfile
```ruby
# ios/Podfile
require_relative '../node_modules/react-native/scripts/react_native_pods'
require_relative '../node_modules/@react-native-community/cli-platform-ios/native_modules'

platform :ios, '16.0'
install! 'cocoapods', :deterministic_uuids => false

target 'FourthLegal' do
  config = use_native_modules!

  # React Native
  use_react_native!(
    :path => config[:reactNativePath],
    :hermes_enabled => true,
    :fabric_enabled => true,
    :flipper_configuration => FlipperConfiguration.enabled,
    :app_clip_configurations => []
  )

  # Native modules
  pod 'RNVectorIcons', :path => '../node_modules/react-native-vector-icons'
  pod 'RNAsyncStorage', :path => '../node_modules/@react-native-async-storage/async-storage'
  pod 'RNReanimated', :path => '../node_modules/react-native-reanimated'
  pod 'RNGestureHandler', :path => '../node_modules/react-native-gesture-handler'
  pod 'RNScreens', :path => '../node_modules/react-native-screens'
  pod 'RNNavigation', :path => '../node_modules/@react-navigation/native'
  pod 'RNBottomTabs', :path => '../node_modules/@react-navigation/bottom-tabs'
  pod 'RNStack', :path => '../node_modules/@react-navigation/stack'

  target 'FourthLegalTests' do
    inherit! :complete
  end

  post_install do |installer|
    react_native_post_install(installer)
    
    # iOS 16+ compatibility
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '16.0'
      end
    end
  end
end
```

#### 2. Pod Kurulumu
```bash
# Pod bağımlılıklarını kur
cd ios
pod install
cd ..
```

## 🎨 UI/UX Geliştirme

### React Native Bileşenleri

#### 1. Ana Ekran Bileşeni
```typescript
// src/screens/HomeScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentConversations, setRecentConversations] = useState([]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigation.navigate('Chat', { 
        initialMessage: searchQuery,
        sector: 'legal' 
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Fourth Legal</Text>
          <Text style={styles.subtitle}>AI-Powered Legal Assistant</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Ask a legal question..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Chat', { sector: 'legal' })}
          >
            <Text style={styles.actionButtonText}>Start New Chat</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Documents')}
          >
            <Text style={styles.actionButtonText}>Upload Document</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Conversations */}
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Conversations</Text>
          {recentConversations.map((conversation, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.conversationItem}
              onPress={() => navigation.navigate('Chat', { 
                conversationId: conversation.id 
              })}
            >
              <Text style={styles.conversationTitle}>{conversation.title}</Text>
              <Text style={styles.conversationDate}>{conversation.date}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchButton: {
    backgroundColor: '#3498db',
    borderRadius: 25,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  actionButton: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    flex: 0.48,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    color: '#2c3e50',
    fontWeight: 'bold',
    fontSize: 16,
  },
  recentSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  conversationItem: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  conversationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  conversationDate: {
    fontSize: 14,
    color: '#7f8c8d',
  },
});

export default HomeScreen;
```

#### 2. Chat Ekranı Bileşeni
```typescript
// src/screens/ChatScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Message, AIResponse } from '../types/chat';

interface ChatScreenProps {
  route: any;
  navigation: any;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ route, navigation }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const { conversationId, initialMessage, sector } = route.params;

  useEffect(() => {
    if (initialMessage) {
      handleSendMessage(initialMessage);
    }
  }, [initialMessage]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // API çağrısı
      const response = await fetch('https://api.fourth.com/v1/chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          conversation_id: conversationId,
          message: text.trim(),
          sector: sector || 'legal',
        }),
      });

      const data = await response.json();

      if (data.success) {
        const aiMessage: Message = {
          id: data.data.message_id,
          text: data.data.ai_response.message,
          isUser: false,
          timestamp: new Date(),
          confidence: data.data.ai_response.confidence_score,
          sources: data.data.ai_response.sources,
        };

        setMessages(prev => [...prev, aiMessage]);
      } else {
        Alert.alert('Error', data.error.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.isUser ? styles.userMessage : styles.aiMessage
    ]}>
      <Text style={[
        styles.messageText,
        item.isUser ? styles.userMessageText : styles.aiMessageText
      ]}>
        {item.text}
      </Text>
      {!item.isUser && item.confidence && (
        <Text style={styles.confidenceText}>
          Confidence: {(item.confidence * 100).toFixed(1)}%
        </Text>
      )}
      {!item.isUser && item.sources && item.sources.length > 0 && (
        <View style={styles.sourcesContainer}>
          <Text style={styles.sourcesTitle}>Sources:</Text>
          {item.sources.map((source, index) => (
            <TouchableOpacity key={index} style={styles.sourceItem}>
              <Text style={styles.sourceText}>{source.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />
      
      {isLoading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>AI is thinking...</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message..."
          multiline
          maxLength={1000}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={() => handleSendMessage(inputText)}
          disabled={!inputText.trim() || isLoading}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
  },
  messageContainer: {
    marginBottom: 15,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#3498db',
    borderRadius: 20,
    padding: 15,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: 'white',
  },
  aiMessageText: {
    color: '#2c3e50',
  },
  confidenceText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 5,
    fontStyle: 'italic',
  },
  sourcesContainer: {
    marginTop: 10,
  },
  sourcesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  sourceItem: {
    backgroundColor: '#ecf0f1',
    borderRadius: 10,
    padding: 10,
    marginBottom: 5,
  },
  sourceText: {
    fontSize: 12,
    color: '#3498db',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: 'white',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#3498db',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ChatScreen;
```

## 🔧 Native iOS Özellikleri

### Push Notifications

#### 1. Push Notification Kurulumu
```swift
// ios/FourthLegal/AppDelegate.swift
import UIKit
import UserNotifications
import Firebase

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate, UNUserNotificationCenterDelegate {
    
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        
        // Firebase konfigürasyonu
        FirebaseApp.configure()
        
        // Push notification izni iste
        UNUserNotificationCenter.current().delegate = self
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .badge, .sound]) { granted, error in
            if granted {
                DispatchQueue.main.async {
                    application.registerForRemoteNotifications()
                }
            }
        }
        
        return true
    }
    
    // Push notification token al
    func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        let token = deviceToken.map { String(format: "%02.2hhx", $0) }.joined()
        print("Device Token: \(token)")
        
        // Token'ı backend'e gönder
        sendTokenToBackend(token)
    }
    
    // Push notification alındığında
    func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse, withCompletionHandler completionHandler: @escaping () -> Void) {
        let userInfo = response.notification.request.content.userInfo
        
        // Notification'a göre uygun ekrana yönlendir
        if let conversationId = userInfo["conversation_id"] as? String {
            // Chat ekranına yönlendir
            NotificationCenter.default.post(name: NSNotification.Name("OpenConversation"), object: nil, userInfo: ["conversationId": conversationId])
        }
        
        completionHandler()
    }
    
    private func sendTokenToBackend(_ token: String) {
        // Backend'e token gönder
        guard let url = URL(string: "https://api.fourth.com/v1/notifications/register") else { return }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let body = [
            "device_token": token,
            "platform": "ios",
            "user_id": getCurrentUserId()
        ]
        
        request.httpBody = try? JSONSerialization.data(withJSONObject: body)
        
        URLSession.shared.dataTask(with: request).resume()
    }
}
```

#### 2. React Native Push Notification Entegrasyonu
```typescript
// src/services/notificationService.ts
import PushNotification from 'react-native-push-notification';
import { Platform } from 'react-native';

class NotificationService {
  constructor() {
    this.configure();
  }

  configure() {
    PushNotification.configure({
      onRegister: (token) => {
        console.log('Push Notification Token:', token);
        this.sendTokenToBackend(token.token);
      },
      onNotification: (notification) => {
        console.log('Push Notification Received:', notification);
        
        if (notification.userInteraction) {
          // Kullanıcı notification'a tıkladı
          this.handleNotificationTap(notification);
        }
      },
      onAction: (notification) => {
        console.log('Push Notification Action:', notification);
      },
      onRegistrationError: (error) => {
        console.log('Push Notification Registration Error:', error);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });
  }

  private async sendTokenToBackend(token: string) {
    try {
      const response = await fetch('https://api.fourth.com/v1/notifications/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify({
          device_token: token,
          platform: 'ios',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to register device token');
      }
    } catch (error) {
      console.error('Error sending token to backend:', error);
    }
  }

  private handleNotificationTap(notification: any) {
    // Notification'a göre uygun ekrana yönlendir
    if (notification.conversation_id) {
      // Chat ekranına yönlendir
      // Navigation logic here
    }
  }

  private async getAuthToken(): Promise<string> {
    // Auth token'ı al
    return 'your-auth-token';
  }
}

export default new NotificationService();
```

### Biometric Authentication

#### 1. Touch ID / Face ID Kurulumu
```swift
// ios/FourthLegal/BiometricAuth.swift
import LocalAuthentication
import UIKit

class BiometricAuth {
    static let shared = BiometricAuth()
    
    private init() {}
    
    func authenticate(completion: @escaping (Bool, String?) -> Void) {
        let context = LAContext()
        var error: NSError?
        
        // Biometric authentication mevcut mu kontrol et
        if context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) {
            let reason = "Authenticate to access Fourth Legal"
            
            context.evaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, localizedReason: reason) { success, authenticationError in
                DispatchQueue.main.async {
                    if success {
                        completion(true, nil)
                    } else {
                        completion(false, authenticationError?.localizedDescription)
                    }
                }
            }
        } else {
            completion(false, "Biometric authentication not available")
        }
    }
    
    func getBiometricType() -> String {
        let context = LAContext()
        var error: NSError?
        
        if context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) {
            switch context.biometryType {
            case .faceID:
                return "Face ID"
            case .touchID:
                return "Touch ID"
            case .none:
                return "None"
            @unknown default:
                return "Unknown"
            }
        }
        
        return "None"
    }
}
```

#### 2. React Native Biometric Entegrasyonu
```typescript
// src/services/biometricService.ts
import { NativeModules, Platform } from 'react-native';

interface BiometricAuthResult {
  success: boolean;
  error?: string;
}

class BiometricService {
  async authenticate(): Promise<BiometricAuthResult> {
    try {
      if (Platform.OS === 'ios') {
        const result = await NativeModules.BiometricAuth.authenticate();
        return result;
      }
      return { success: false, error: 'Platform not supported' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      if (Platform.OS === 'ios') {
        return await NativeModules.BiometricAuth.isAvailable();
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  async getBiometricType(): Promise<string> {
    try {
      if (Platform.OS === 'ios') {
        return await NativeModules.BiometricAuth.getBiometricType();
      }
      return 'None';
    } catch (error) {
      return 'None';
    }
  }
}

export default new BiometricService();
```

## 📱 App Store Optimizasyonu

### App Store Metadata

#### 1. App Store Connect Ayarları
```json
{
  "app_name": "Fourth Legal - AI Legal Assistant",
  "subtitle": "Get instant legal advice with AI",
  "description": "Fourth Legal is your AI-powered legal assistant that provides instant, accurate legal advice and document analysis. Get expert-level legal guidance 24/7 with our advanced artificial intelligence technology.",
  "keywords": "legal,lawyer,legal advice,AI,artificial intelligence,legal assistant,contract,law,legal help",
  "category": "Productivity",
  "secondary_category": "Business",
  "age_rating": "4+",
  "price": "4.99",
  "currency": "USD"
}
```

#### 2. App Store Screenshots
- **iPhone 6.7" (iPhone 14 Pro Max)**: 1290 x 2796 pixels
- **iPhone 6.5" (iPhone 11 Pro Max)**: 1242 x 2688 pixels
- **iPhone 5.5" (iPhone 8 Plus)**: 1242 x 2208 pixels
- **iPad Pro 12.9"**: 2048 x 2732 pixels
- **iPad Pro 11"**: 1668 x 2388 pixels

#### 3. App Store Preview Video
- **Duration**: 15-30 seconds
- **Resolution**: 1080p minimum
- **Format**: MP4 or MOV
- **Content**: App functionality demonstration

### ASO (App Store Optimization)

#### 1. Keyword Optimization
```typescript
// App Store keywords stratejisi
const keywords = [
  "legal advice",      // Primary keyword
  "AI lawyer",         // Secondary keyword
  "legal assistant",   // Long-tail keyword
  "contract review",   // Feature keyword
  "legal help",        // Problem-solving keyword
  "law AI",           // Brand + category
  "legal consultation", // Professional keyword
  "document analysis", // Feature keyword
  "legal questions",   // User intent keyword
  "AI legal"          // Brand keyword
];
```

#### 2. A/B Testing Stratejisi
```typescript
// A/B test variations
const appStoreVariations = {
  title: [
    "Fourth Legal - AI Legal Assistant",
    "Fourth Legal: AI Lawyer in Your Pocket",
    "Fourth Legal - Instant Legal Advice"
  ],
  subtitle: [
    "Get instant legal advice with AI",
    "AI-powered legal assistance 24/7",
    "Smart legal advice at your fingertips"
  ],
  description: [
    "Long form description focusing on AI technology",
    "Short form description focusing on benefits",
    "Feature-focused description with bullet points"
  ]
};
```

## 🚀 Build ve Deployment

### Xcode Build Konfigürasyonu

#### 1. Build Settings
```xml
<!-- ios/FourthLegal.xcodeproj/project.pbxproj -->
buildSettings = {
    ASSETCATALOG_COMPILER_APPICON_NAME = AppIcon;
    CODE_SIGN_ENTITLEMENTS = FourthLegal/FourthLegal.entitlements;
    CODE_SIGN_IDENTITY = "iPhone Developer";
    CODE_SIGN_STYLE = Automatic;
    CURRENT_PROJECT_VERSION = 1;
    DEVELOPMENT_TEAM = YOUR_TEAM_ID;
    ENABLE_BITCODE = NO;
    INFOPLIST_FILE = FourthLegal/Info.plist;
    IPHONEOS_DEPLOYMENT_TARGET = 16.0;
    LD_RUNPATH_SEARCH_PATHS = (
        "$(inherited)",
        "@executable_path/Frameworks",
    );
    MARKETING_VERSION = 1.0.0;
    PRODUCT_BUNDLE_IDENTIFIER = com.fourth.legal;
    PRODUCT_NAME = "$(TARGET_NAME)";
    SWIFT_VERSION = 5.0;
    TARGETED_DEVICE_FAMILY = "1,2";
};
```

#### 2. Entitlements
```xml
<!-- ios/FourthLegal/FourthLegal.entitlements -->
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.developer.team-identifier</key>
    <string>YOUR_TEAM_ID</string>
    <key>keychain-access-groups</key>
    <array>
        <string>$(AppIdentifierPrefix)com.fourth.legal</string>
    </array>
    <key>com.apple.developer.usernotifications.time-sensitive</key>
    <true/>
    <key>com.apple.developer.usernotifications.communication</key>
    <true/>
</dict>
</plist>
```

### CI/CD Pipeline

#### 1. GitHub Actions Workflow
```yaml
# .github/workflows/ios-build.yml
name: iOS Build and Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: macos-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: |
        npm install
        cd ios && pod install && cd ..
    
    - name: Setup Xcode
      uses: maxim-lobanov/setup-xcode@v1
      with:
        xcode-version: '14.0'
    
    - name: Build iOS app
      run: |
        cd ios
        xcodebuild -workspace FourthLegal.xcworkspace \
          -scheme FourthLegal \
          -configuration Release \
          -destination 'generic/platform=iOS' \
          -archivePath FourthLegal.xcarchive \
          archive
    
    - name: Export IPA
      run: |
        xcodebuild -exportArchive \
          -archivePath ios/FourthLegal.xcarchive \
          -exportPath ios/build \
          -exportOptionsPlist ios/ExportOptions.plist
    
    - name: Upload to App Store Connect
      uses: apple-actions/upload-app-store@v1
      with:
        app-path: ios/build/FourthLegal.ipa
        issuer-id: ${{ secrets.APPSTORE_ISSUER_ID }}
        api-key-id: ${{ secrets.APPSTORE_API_KEY_ID }}
        api-private-key: ${{ secrets.APPSTORE_API_PRIVATE_KEY }}
```

#### 2. Export Options
```xml
<!-- ios/ExportOptions.plist -->
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>app-store</string>
    <key>teamID</key>
    <string>YOUR_TEAM_ID</string>
    <key>uploadBitcode</key>
    <false/>
    <key>uploadSymbols</key>
    <true/>
    <key>compileBitcode</key>
    <false/>
    <key>destination</key>
    <string>upload</string>
    <key>signingStyle</key>
    <string>automatic</string>
    <key>stripSwiftSymbols</key>
    <true/>
</dict>
</plist>
```

## 📊 Analytics ve Monitoring

### Firebase Analytics

#### 1. Firebase Konfigürasyonu
```swift
// ios/FourthLegal/AppDelegate.swift
import Firebase
import FirebaseAnalytics

func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    FirebaseApp.configure()
    
    // Analytics konfigürasyonu
    Analytics.setAnalyticsCollectionEnabled(true)
    
    return true
}
```

#### 2. Custom Events
```typescript
// src/services/analyticsService.ts
import analytics from '@react-native-firebase/analytics';

class AnalyticsService {
  async trackEvent(eventName: string, parameters?: any) {
    try {
      await analytics().logEvent(eventName, parameters);
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }

  async trackScreenView(screenName: string) {
    try {
      await analytics().logScreenView({
        screen_name: screenName,
        screen_class: screenName,
      });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }

  async trackUserProperty(property: string, value: string) {
    try {
      await analytics().setUserProperty(property, value);
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }
}

export default new AnalyticsService();
```

### Crash Reporting

#### 1. Crashlytics Kurulumu
```swift
// ios/FourthLegal/AppDelegate.swift
import Firebase
import FirebaseCrashlytics

func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    FirebaseApp.configure()
    
    // Crashlytics konfigürasyonu
    Crashlytics.crashlytics().setCrashlyticsCollectionEnabled(true)
    
    return true
}
```

#### 2. Custom Crash Reporting
```typescript
// src/services/crashReportingService.ts
import crashlytics from '@react-native-firebase/crashlytics';

class CrashReportingService {
  async recordError(error: Error, context?: string) {
    try {
      await crashlytics().recordError(error);
      if (context) {
        await crashlytics().setAttribute('error_context', context);
      }
    } catch (err) {
      console.error('Crash reporting error:', err);
    }
  }

  async setUserId(userId: string) {
    try {
      await crashlytics().setUserId(userId);
    } catch (error) {
      console.error('Crash reporting error:', error);
    }
  }

  async setCustomKey(key: string, value: string) {
    try {
      await crashlytics().setAttribute(key, value);
    } catch (error) {
      console.error('Crash reporting error:', error);
    }
  }
}

export default new CrashReportingService();
```

## 🎯 Sonuç

Fourth iOS uygulaması, modern React Native teknolojisi ve native iOS özellikleri kullanılarak geliştirilmiştir. Bu geliştirme rehberi:

### Temel Özellikler
- **Modern UI/UX**: Kullanıcı dostu arayüz tasarımı
- **Native Performance**: iOS platformuna özel optimizasyonlar
- **Real-time Communication**: WebSocket tabanlı gerçek zamanlı iletişim
- **Biometric Security**: Touch ID/Face ID entegrasyonu
- **Push Notifications**: Kullanıcı etkileşimi için bildirimler

### Geliştirme Avantajları
- **Cross-platform**: React Native ile iOS ve Android paylaşımı
- **Native Features**: Platform özel özellikler
- **Easy Maintenance**: Kolay bakım ve güncelleme
- **Scalable Architecture**: Ölçeklenebilir mimari
- **Modern Tools**: En güncel geliştirme araçları

Bu rehber, Fourth iOS uygulamasının başarılı bir şekilde App Store'a yüklenmesini ve kullanıcılar tarafından benimsenmesini sağlayacak tüm gerekli bilgileri içermektedir.
