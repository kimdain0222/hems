import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';

// Screens
import { LoginScreen } from './src/screens/LoginScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { DeviceControlScreen } from './src/screens/DeviceControlScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

// Mock Data Service
import MockDataService from './src/data/MockDataService';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// 로딩 화면 컴포넌트
const LoadingScreen: React.FC = () => (
  <LinearGradient
    colors={['#667eea', '#764ba2']}
    style={styles.loadingContainer}
  >
    <Animatable.View
      animation="pulse"
      iterationCount="infinite"
      style={styles.loadingContent}
    >
      <Icon name="eco" size={80} color="white" />
      <Text style={styles.loadingTitle}>HEMS</Text>
      <Text style={styles.loadingSubtitle}>Home Energy Management System</Text>
      <Animatable.View
        animation="fadeIn"
        iterationCount="infinite"
        style={styles.loadingDots}
      >
        <Text style={styles.loadingText}>로딩 중...</Text>
      </Animatable.View>
    </Animatable.View>
  </LinearGradient>
);

// 메인 탭 네비게이션
const MainTabNavigator: React.FC = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: string;

        switch (route.name) {
          case 'Dashboard':
            iconName = 'dashboard';
            break;
          case 'Devices':
            iconName = 'device-hub';
            break;
          case 'Settings':
            iconName = 'settings';
            break;
          default:
            iconName = 'help';
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#667eea',
      tabBarInactiveTintColor: '#999',
      tabBarStyle: {
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        paddingBottom: 5,
        paddingTop: 5,
        height: 60,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '600',
      },
      headerStyle: {
        backgroundColor: '#667eea',
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: 'white',
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 18,
      },
    })}
  >
    <Tab.Screen 
      name="Dashboard" 
      component={DashboardScreen}
      options={{
        title: '대시보드',
        headerTitle: '우리집 에너지 현황',
      }}
    />
    <Tab.Screen 
      name="Devices" 
      component={DeviceControlScreen}
      options={{
        title: '디바이스',
        headerTitle: '스마트 디바이스 제어',
      }}
    />
    <Tab.Screen 
      name="Settings" 
      component={SettingsScreen}
      options={{
        title: '설정',
        headerTitle: '설정',
      }}
    />
  </Tab.Navigator>
);

// 메인 앱 컴포넌트
const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);

  useEffect(() => {
    // 앱 시작 시 인증 상태 확인
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // 실제 앱에서는 AsyncStorage에서 토큰 확인
      // 데모용으로는 2초 후 로딩 완료
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsLoading(false);
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = (token: string) => {
    setUserToken(token);
    setIsAuthenticated(true);
    
    // 로그인 성공 시 환영 메시지
    Alert.alert(
      '환영합니다!',
      'HEMS에 성공적으로 로그인했습니다.',
      [{ text: '확인' }]
    );
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserToken(null);
    
    // MockDataService 정리
    const mockService = MockDataService.getInstance();
    mockService.destroy();
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {isAuthenticated ? (
          <Stack.Screen name="Main">
            {() => <MainTabNavigator />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Login">
            {() => <LoginScreen onLoginSuccess={handleLoginSuccess} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
    marginBottom: 5,
  },
  loadingSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 40,
  },
  loadingDots: {
    marginTop: 20,
  },
  loadingText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
});

export default App;
