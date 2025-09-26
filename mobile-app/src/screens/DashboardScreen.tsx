import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Card, Title, Paragraph } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import CircularProgress from 'react-native-circular-progress';
import MockDataService, { EnergyData } from '../data/MockDataService';

const { width } = Dimensions.get('window');

export const DashboardScreen: React.FC = () => {
  const [energyData, setEnergyData] = useState<EnergyData | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const mockService = useRef(MockDataService.getInstance());

  useEffect(() => {
    loadEnergyData();
    
    // 3초마다 자동 업데이트
    const interval = setInterval(() => {
      loadEnergyData(false);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const loadEnergyData = async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      const data = await mockService.current.getEnergyData();
      setEnergyData(data);
    } catch (error) {
      console.error('Failed to load energy data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEnergyData();
    setRefreshing(false);
  };

  const getEfficiencyColor = (grade: string) => {
    switch (grade) {
      case 'A+': return '#4CAF50';
      case 'A': return '#8BC34A';
      case 'B': return '#CDDC39';
      case 'C': return '#FFEB3B';
      case 'D': return '#FF9800';
      case 'F': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const getEfficiencyScore = (grade: string) => {
    switch (grade) {
      case 'A+': return 95;
      case 'A': return 85;
      case 'B': return 75;
      case 'C': return 65;
      case 'D': return 55;
      case 'F': return 35;
      default: return 50;
    }
  };

  const handleDemoScenario = async (scenario: 'energy_spike' | 'savings_boost' | 'device_failure') => {
    await mockService.current.triggerDemoScenario(scenario);
    await loadEnergyData(false);
    
    switch (scenario) {
      case 'energy_spike':
        Alert.alert('데모 시나리오', '에너지 사용량 급증 상황을 시뮬레이션했습니다.');
        break;
      case 'savings_boost':
        Alert.alert('데모 시나리오', '절약 효과가 크게 향상된 상황을 시뮬레이션했습니다.');
        break;
      case 'device_failure':
        Alert.alert('데모 시나리오', '디바이스 오류 상황을 시뮬레이션했습니다.');
        break;
    }
  };

  if (isLoading || !energyData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>데이터를 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>우리집 에너지 현황</Text>
        <TouchableOpacity 
          style={styles.demoButton}
          onPress={() => Alert.alert(
            '데모 시나리오',
            '시연용 시나리오를 선택하세요',
            [
              { text: '에너지 급증', onPress: () => handleDemoScenario('energy_spike') },
              { text: '절약 효과', onPress: () => handleDemoScenario('savings_boost') },
              { text: '디바이스 오류', onPress: () => handleDemoScenario('device_failure') },
              { text: '취소', style: 'cancel' }
            ]
          )}
        >
          <Icon name="play-arrow" size={20} color="white" />
          <Text style={styles.demoButtonText}>데모</Text>
        </TouchableOpacity>
      </View>

      {/* 실시간 전력 사용량 */}
      <Animatable.View animation="fadeInDown" duration={800}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.mainCard}
        >
          <View style={styles.mainMetric}>
            <Text style={styles.mainValue}>{energyData.currentPowerUsage.toFixed(1)}</Text>
            <Text style={styles.mainUnit}>kW</Text>
          </View>
          <Text style={styles.mainLabel}>현재 전력 사용량</Text>
          <View style={styles.statusIndicator}>
            <View style={[styles.statusDot, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.statusText}>정상</Text>
          </View>
        </LinearGradient>
      </Animatable.View>

      {/* 메트릭 카드들 */}
      <Animatable.View animation="fadeInUp" duration={800} delay={200}>
        <View style={styles.metricsRow}>
          <Card style={[styles.metricCard, { backgroundColor: '#4CAF50' }]}>
            <Card.Content style={styles.metricContent}>
              <Icon name="trending-down" size={24} color="white" />
              <Text style={styles.metricValue}>{energyData.todaySavings.toFixed(1)}</Text>
              <Text style={styles.metricUnit}>kWh</Text>
              <Text style={styles.metricLabel}>오늘 절약량</Text>
            </Card.Content>
          </Card>

          <Card style={[styles.metricCard, { backgroundColor: '#2196F3' }]}>
            <Card.Content style={styles.metricContent}>
              <Icon name="eco" size={24} color="white" />
              <Text style={styles.metricValue}>{energyData.co2Reduction.toFixed(1)}</Text>
              <Text style={styles.metricUnit}>kg</Text>
              <Text style={styles.metricLabel}>CO2 절감량</Text>
            </Card.Content>
          </Card>
        </View>
      </Animatable.View>

      {/* 에너지 효율 등급 */}
      <Animatable.View animation="fadeInUp" duration={800} delay={400}>
        <Card style={styles.gradeCard}>
          <Card.Content>
            <Title>에너지 효율 등급</Title>
            <View style={styles.gradeContainer}>
              <CircularProgress
                size={80}
                width={8}
                fill={getEfficiencyScore(energyData.efficiencyGrade)}
                tintColor={getEfficiencyColor(energyData.efficiencyGrade)}
                backgroundColor="#f0f0f0"
                rotation={0}
                lineCap="round"
              >
                {() => (
                  <Text style={[styles.gradeText, { color: getEfficiencyColor(energyData.efficiencyGrade) }]}>
                    {energyData.efficiencyGrade}
                  </Text>
                )}
              </CircularProgress>
              <View style={styles.gradeInfo}>
                <Text style={styles.gradeDescription}>
                  {energyData.efficiencyGrade === 'A+' ? '매우 우수' :
                   energyData.efficiencyGrade === 'A' ? '우수' :
                   energyData.efficiencyGrade === 'B' ? '양호' :
                   energyData.efficiencyGrade === 'C' ? '보통' :
                   energyData.efficiencyGrade === 'D' ? '개선 필요' : '매우 개선 필요'}
                </Text>
                <Text style={styles.gradeScore}>{getEfficiencyScore(energyData.efficiencyGrade)}점</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </Animatable.View>

      {/* 시간대별 사용량 그래프 */}
      <Animatable.View animation="fadeInUp" duration={800} delay={600}>
        <Card style={styles.chartCard}>
          <Card.Content>
            <Title>24시간 사용량</Title>
            <LineChart
              data={{
                labels: energyData.hourlyUsage.map(item => `${item.hour}시`).filter((_, index) => index % 4 === 0),
                datasets: [{
                  data: energyData.hourlyUsage.map(item => item.usage).filter((_, index) => index % 4 === 0),
                  color: (opacity = 1) => `rgba(102, 126, 234, ${opacity})`,
                  strokeWidth: 3
                }]
              }}
              width={width - 40}
              height={220}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(102, 126, 234, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16
                },
                propsForDots: {
                  r: '4',
                  strokeWidth: '2',
                  stroke: '#667eea'
                }
              }}
              bezier
              style={styles.chart}
            />
          </Card.Content>
        </Card>
      </Animatable.View>

      {/* 월별 절약 추이 */}
      <Animatable.View animation="fadeInUp" duration={800} delay={800}>
        <Card style={styles.chartCard}>
          <Card.Content>
            <Title>월별 절약 추이</Title>
            <BarChart
              data={{
                labels: energyData.monthlyTrend.map(item => item.month),
                datasets: [{
                  data: energyData.monthlyTrend.map(item => item.savings)
                }]
              }}
              width={width - 40}
              height={220}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16
                }
              }}
              style={styles.chart}
            />
          </Card.Content>
        </Card>
      </Animatable.View>

      {/* 예상 전기요금 */}
      <Animatable.View animation="fadeInUp" duration={800} delay={1000}>
        <Card style={styles.billCard}>
          <Card.Content>
            <View style={styles.billContainer}>
              <Icon name="receipt" size={32} color="#FF9800" />
              <View style={styles.billInfo}>
                <Text style={styles.billLabel}>예상 전기요금</Text>
                <Text style={styles.billValue}>{energyData.estimatedBill.toLocaleString()}원</Text>
              </View>
              <View style={styles.billTrend}>
                <Icon name="trending-down" size={20} color="#4CAF50" />
                <Text style={styles.billTrendText}>-5.2%</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#667eea',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  demoButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  mainCard: {
    margin: 16,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  mainMetric: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  mainValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
  },
  mainUnit: {
    fontSize: 24,
    color: 'white',
    marginLeft: 8,
  },
  mainLabel: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
    marginBottom: 8,
  },
  statusIndicator: {
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
    color: 'white',
    fontSize: 12,
    opacity: 0.9,
  },
  metricsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  metricCard: {
    flex: 1,
    marginHorizontal: 4,
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
  metricContent: {
    alignItems: 'center',
    padding: 16,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
  },
  metricUnit: {
    fontSize: 14,
    color: 'white',
    opacity: 0.8,
  },
  metricLabel: {
    fontSize: 12,
    color: 'white',
    opacity: 0.8,
    marginTop: 4,
    textAlign: 'center',
  },
  gradeCard: {
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
  gradeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  gradeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  gradeInfo: {
    flex: 1,
    marginLeft: 20,
  },
  gradeDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  gradeScore: {
    fontSize: 14,
    color: '#999',
  },
  chartCard: {
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
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  billCard: {
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
  billContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  billInfo: {
    marginLeft: 16,
    flex: 1,
  },
  billLabel: {
    fontSize: 16,
    color: '#666',
  },
  billValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF9800',
    marginTop: 4,
  },
  billTrend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  billTrendText: {
    fontSize: 14,
    color: '#4CAF50',
    marginLeft: 4,
    fontWeight: '600',
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
