import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import Toast from 'react-native-toast-message';
import * as Keychain from 'react-native-keychain';

import { authService } from '../services/authService';
import { User, LoginCredentials, RegisterData } from '../types/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const credentials = await Keychain.getInternetCredentials('fourth_app');
        if (credentials && credentials.password) {
          // Verify token and get user data
          const userData = await authService.getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.log('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const loginMutation = useMutation(authService.login, {
    onSuccess: async (data) => {
      try {
        await Keychain.setInternetCredentials(
          'fourth_app',
          data.user.email,
          data.token
        );
        await Keychain.setInternetCredentials(
          'fourth_app_refresh',
          data.user.email,
          data.refreshToken
        );
        setUser(data.user);
        Toast.show({
          type: 'success',
          text1: 'Login Successful',
          text2: 'Welcome to Fourth!',
        });
      } catch (error) {
        console.error('Keychain error:', error);
        Toast.show({
          type: 'error',
          text1: 'Login Error',
          text2: 'Failed to save credentials',
        });
      }
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: error.response?.data?.message || 'Please check your credentials',
      });
    },
  });

  const registerMutation = useMutation(authService.register, {
    onSuccess: async (data) => {
      try {
        await Keychain.setInternetCredentials(
          'fourth_app',
          data.user.email,
          data.token
        );
        await Keychain.setInternetCredentials(
          'fourth_app_refresh',
          data.user.email,
          data.refreshToken
        );
        setUser(data.user);
        Toast.show({
          type: 'success',
          text1: 'Registration Successful',
          text2: 'Welcome to Fourth!',
        });
      } catch (error) {
        console.error('Keychain error:', error);
        Toast.show({
          type: 'error',
          text1: 'Registration Error',
          text2: 'Failed to save credentials',
        });
      }
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: error.response?.data?.message || 'Please try again',
      });
    },
  });

  const login = async (credentials: LoginCredentials) => {
    await loginMutation.mutateAsync(credentials);
  };

  const register = async (data: RegisterData) => {
    await registerMutation.mutateAsync(data);
  };

  const logout = async () => {
    try {
      await Keychain.resetInternetCredentials('fourth_app');
      await Keychain.resetInternetCredentials('fourth_app_refresh');
      setUser(null);
      queryClient.clear();
      Toast.show({
        type: 'success',
        text1: 'Logged Out',
        text2: 'See you next time!',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const refreshToken = async () => {
    try {
      const credentials = await Keychain.getInternetCredentials('fourth_app_refresh');
      if (!credentials || !credentials.password) {
        throw new Error('No refresh token available');
      }

      const data = await authService.refreshToken(credentials.password);
      await Keychain.setInternetCredentials(
        'fourth_app',
        user?.email || '',
        data.token
      );
      await Keychain.setInternetCredentials(
        'fourth_app_refresh',
        user?.email || '',
        data.refreshToken
      );
    } catch (error) {
      logout();
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
