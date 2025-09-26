import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Card, Title, Paragraph } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import MockDataService, { DeviceData } from '../data/MockDataService';

const { width } = Dimensions.get('window');

export const DeviceControlScreen: React.FC = () => {
  const [devices, setDevices] = useState<DeviceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const mockService = MockDataService.getInstance();

  useEffect(() => {
    loadDevices();
    
    // 3초마다 디바이스 상태 업데이트
    const interval = setInterval(() => {
      loadDevices(false);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const loadDevices = async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      const deviceData = await mockService.getDevices();
      setDevices(deviceData);
    } catch (error) {
      console.error('Failed to load devices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDevice = async (deviceId: string) => {
    try {
      const success = await mockService.toggleDevice(deviceId);
      if (success) {
        await loadDevices(false);
        // 햅틱 피드백 (실제 앱에서는 react-native-haptic-feedback 사용)
        Alert.alert('디바이스 제어', '디바이스 상태가 변경되었습니다.');
      }
    } catch (error) {
      Alert.alert('오류', '디바이스 제어 중 오류가 발생했습니다.');
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'smart_meter': return 'flash-on';
      case 'thermostat': return 'ac-unit';
      case 'smart_plug': return 'power';
      case 'solar_panel': return 'wb-sunny';
      case 'battery': return 'battery-full';
      default: return 'device-hub';
    }
  };

  const getDeviceColor = (type: string, status: string) => {
    if (status === 'error') return '#F44336';
    if (status === 'offline') return '#9E9E9E';
    
    switch (type) {
      case 'smart_meter': return '#2196F3';
      case 'thermostat': return '#FF9800';
      case 'smart_plug': return '#4CAF50';
      case 'solar_panel': return '#FFC107';
      case 'battery': return '#9C27B0';
      default: return '#607D8B';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return '온라인';
      case 'offline': return '오프라인';
      case 'error': return '오류';
      default: return '알 수 없음';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#4CAF50';
      case 'offline': return '#9E9E9E';
      case 'error': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'all_off':
        Alert.alert('전체 끄기', '모든 디바이스를 끄시겠습니까?', [
          { text: '취소', style: 'cancel' },
          { text: '확인', onPress: () => {
            devices.forEach(device => {
              if (device.isOn && device.type !== 'smart_meter') {
                toggleDevice(device.id);
              }
            });
          }}
        ]);
        break;
      case 'eco_mode':
        Alert.alert('에코 모드', '에너지 절약 모드로 전환하시겠습니까?', [
          { text: '취소', style: 'cancel' },
          { text: '확인', onPress: () => {
            // 에코 모드 시뮬레이션
            Alert.alert('에코 모드', '에코 모드가 활성화되었습니다.');
          }}
        ]);
        break;
      case 'schedule':
        Alert.alert('스케줄 설정', '디바이스 스케줄 설정 기능입니다.');
        break;
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>디바이스를 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>스마트 디바이스 제어</Text>
        <Text style={styles.headerSubtitle}>연결된 {devices.length}개 디바이스</Text>
      </View>

      {/* 빠른 액션 버튼들 */}
      <Animatable.View animation="fadeInDown" duration={800}>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.quickActionButton, { backgroundColor: '#F44336' }]}
            onPress={() => handleQuickAction('all_off')}
          >
            <Icon name="power-off" size={24} color="white" />
            <Text style={styles.quickActionText}>전체 끄기</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickActionButton, { backgroundColor: '#4CAF50' }]}
            onPress={() => handleQuickAction('eco_mode')}
          >
            <Icon name="eco" size={24} color="white" />
            <Text style={styles.quickActionText}>에코 모드</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickActionButton, { backgroundColor: '#2196F3' }]}
            onPress={() => handleQuickAction('schedule')}
          >
            <Icon name="schedule" size={24} color="white" />
            <Text style={styles.quickActionText}>스케줄</Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>

      {/* 디바이스 목록 */}
      <View style={styles.devicesContainer}>
        {devices.map((device, index) => (
          <Animatable.View
            key={device.id}
            animation="fadeInUp"
            duration={800}
            delay={index * 100}
          >
            <Card style={styles.deviceCard}>
              <Card.Content>
                <View style={styles.deviceHeader}>
                  <View style={styles.deviceInfo}>
                    <View style={[
                      styles.deviceIcon,
                      { backgroundColor: getDeviceColor(device.type, device.status) }
                    ]}>
                      <Icon 
                        name={getDeviceIcon(device.type)} 
                        size={24} 
                        color="white" 
                      />
                    </View>
                    <View style={styles.deviceDetails}>
                      <Text style={styles.deviceName}>{device.name}</Text>
                      <Text style={styles.deviceLocation}>{device.location}</Text>
                      <View style={styles.deviceStatus}>
                        <View style={[
                          styles.statusDot,
                          { backgroundColor: getStatusColor(device.status) }
                        ]} />
                        <Text style={[
                          styles.statusText,
                          { color: getStatusColor(device.status) }
                        ]}>
                          {getStatusText(device.status)}
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.deviceControls}>
                    {device.type !== 'smart_meter' && (
                      <Switch
                        value={device.isOn}
                        onValueChange={() => toggleDevice(device.id)}
                        trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
                        thumbColor={device.isOn ? '#FFFFFF' : '#F4F3F4'}
                        disabled={device.status !== 'online'}
                      />
                    )}
                  </View>
                </View>

                {/* 전력 사용량 표시 */}
                <View style={styles.powerInfo}>
                  <View style={styles.powerItem}>
                    <Text style={styles.powerLabel}>전력 사용량</Text>
                    <Text style={[
                      styles.powerValue,
                      { color: device.powerConsumption < 0 ? '#4CAF50' : '#F44336' }
                    ]}>
                      {device.powerConsumption > 0 ? '+' : ''}{device.powerConsumption.toFixed(1)} kW
                    </Text>
                  </View>
                  <View style={styles.powerItem}>
                    <Text style={styles.powerLabel}>마지막 업데이트</Text>
                    <Text style={styles.powerValue}>
                      {new Date(device.lastUpdated).toLocaleTimeString()}
                    </Text>
                  </View>
                </View>

                {/* 디바이스별 추가 정보 */}
                {device.type === 'thermostat' && (
                  <View style={styles.additionalInfo}>
                    <Text style={styles.additionalLabel}>현재 온도: 23°C</Text>
                    <Text style={styles.additionalLabel}>설정 온도: 25°C</Text>
                  </View>
                )}

                {device.type === 'solar_panel' && (
                  <View style={styles.additionalInfo}>
                    <Text style={styles.additionalLabel}>일일 발전량: 12.5 kWh</Text>
                    <Text style={styles.additionalLabel}>효율: 85%</Text>
                  </View>
                )}

                {device.type === 'battery' && (
                  <View style={styles.additionalInfo}>
                    <Text style={styles.additionalLabel}>충전 상태: 78%</Text>
                    <Text style={styles.additionalLabel}>예상 사용 시간: 6시간</Text>
                  </View>
                )}
              </Card.Content>
            </Card>
          </Animatable.View>
        ))}
      </View>

      {/* 전체 전력 사용량 요약 */}
      <Animatable.View animation="fadeInUp" duration={800} delay={500}>
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Title>전체 전력 사용량 요약</Title>
            <View style={styles.summaryContent}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>총 사용량</Text>
                <Text style={styles.summaryValue}>
                  {devices
                    .filter(d => d.powerConsumption > 0)
                    .reduce((sum, d) => sum + d.powerConsumption, 0)
                    .toFixed(1)} kW
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>총 발전량</Text>
                <Text style={[styles.summaryValue, { color: '#4CAF50' }]}>
                  {Math.abs(devices
                    .filter(d => d.powerConsumption < 0)
                    .reduce((sum, d) => sum + d.powerConsumption, 0))
                    .toFixed(1)} kW
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>순 사용량</Text>
                <Text style={[
                  styles.summaryValue,
                  { 
                    color: devices.reduce((sum, d) => sum + d.powerConsumption, 0) > 0 
                      ? '#F44336' : '#4CAF50' 
                  }
                ]}>
                  {devices.reduce((sum, d) => sum + d.powerConsumption, 0).toFixed(1)} kW
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </Animatable.View>

      {/* 실시간 업데이트 표시 */}
      <View style={styles.updateIndicator}>
        <View style={styles.updateDot} />
        <Text style={styles.updateText}>실시간 업데이트 중...</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  quickActionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  devicesContainer: {
    paddingHorizontal: 16,
  },
  deviceCard: {
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  deviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  deviceIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  deviceDetails: {
    flex: 1,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  deviceLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  deviceStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  deviceControls: {
    alignItems: 'center',
  },
  powerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  powerItem: {
    flex: 1,
  },
  powerLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  powerValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  additionalInfo: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  additionalLabel: {
    fontSize: 12,
    color: '#666',
  },
  summaryCard: {
    margin: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  updateIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginBottom: 20,
  },
  updateDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 8,
  },
  updateText: {
    fontSize: 12,
    color: '#666',
  },
});
