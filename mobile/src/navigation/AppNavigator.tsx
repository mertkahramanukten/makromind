import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

// Main Screens
import HomeScreen from '../screens/main/HomeScreen';
import ExpertsScreen from '../screens/main/ExpertsScreen';
import QuestionsScreen from '../screens/main/QuestionsScreen';
import ArticlesScreen from '../screens/main/ArticlesScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import ChatScreen from '../screens/main/ChatScreen';
import SettingsScreen from '../screens/main/SettingsScreen';

// Detail Screens
import ExpertDetailScreen from '../screens/detail/ExpertDetailScreen';
import ArticleDetailScreen from '../screens/detail/ArticleDetailScreen';
import QuestionDetailScreen from '../screens/detail/QuestionDetailScreen';

// Loading Screen
import LoadingScreen from '../screens/common/LoadingScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </Stack.Navigator>
);

const MainTabs = () => {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Experts':
              iconName = 'people';
              break;
            case 'Questions':
              iconName = 'help';
              break;
            case 'Articles':
              iconName = 'article';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            default:
              iconName = 'home';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1976d2',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: t('navigation.home') }}
      />
      <Tab.Screen 
        name="Experts" 
        component={ExpertsScreen}
        options={{ title: t('navigation.experts') }}
      />
      <Tab.Screen 
        name="Questions" 
        component={QuestionsScreen}
        options={{ title: t('navigation.questions') }}
      />
      <Tab.Screen 
        name="Articles" 
        component={ArticlesScreen}
        options={{ title: t('navigation.articles') }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: t('navigation.profile') }}
      />
    </Tab.Navigator>
  );
};

const MainStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="MainTabs" 
      component={MainTabs}
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="ExpertDetail" 
      component={ExpertDetailScreen}
      options={{ title: 'Expert Details' }}
    />
    <Stack.Screen 
      name="ArticleDetail" 
      component={ArticleDetailScreen}
      options={{ title: 'Article Details' }}
    />
    <Stack.Screen 
      name="QuestionDetail" 
      component={QuestionDetailScreen}
      options={{ title: 'Question Details' }}
    />
    <Stack.Screen 
      name="Chat" 
      component={ChatScreen}
      options={{ title: 'Chat' }}
    />
    <Stack.Screen 
      name="Settings" 
      component={SettingsScreen}
      options={{ title: 'Settings' }}
    />
  </Stack.Navigator>
);

const AppNavigator: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="Main" component={MainStack} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
