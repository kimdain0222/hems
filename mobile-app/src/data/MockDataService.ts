/**
 * Mock 데이터 서비스 - 투자자 데모용
 * 실제 API와 동일한 인터페이스를 제공하여 나중에 쉽게 교체 가능
 */

export interface EnergyData {
  currentPowerUsage: number; // kW
  todaySavings: number; // kWh
  co2Reduction: number; // kg
  efficiencyGrade: string; // A+ ~ F
  estimatedBill: number; // 원
  hourlyUsage: Array<{ hour: number; usage: number }>;
  monthlyTrend: Array<{ month: string; savings: number }>;
}

export interface DeviceData {
  id: string;
  name: string;
  type: 'smart_meter' | 'thermostat' | 'smart_plug' | 'solar_panel' | 'battery';
  status: 'online' | 'offline' | 'error';
  powerConsumption: number; // kW
  isOn: boolean;
  lastUpdated: string;
  location: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  householdType: 'apartment' | 'house' | 'villa';
  address: string;
  residentCount: number;
  incomeLevel: string;
  avatar?: string;
}

export interface CommunityData {
  myRank: number;
  totalUsers: number;
  monthlySavings: number;
  leaderboard: Array<{
    rank: number;
    name: string;
    savings: number;
    avatar?: string;
  }>;
  challenges: Array<{
    id: string;
    title: string;
    description: string;
    participants: number;
    reward: number;
    endDate: string;
    status: 'active' | 'completed';
  }>;
}

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  category: 'energy_saving' | 'cost_optimization' | 'comfort';
  potentialSavings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  isApplied: boolean;
  priority: 'high' | 'medium' | 'low';
}

class MockDataService {
  private static instance: MockDataService;
  private energyData: EnergyData;
  private devices: DeviceData[];
  private userProfile: UserProfile;
  private communityData: CommunityData;
  private aiRecommendations: AIRecommendation[];
  private updateInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.initializeMockData();
    this.startRealTimeUpdates();
  }

  public static getInstance(): MockDataService {
    if (!MockDataService.instance) {
      MockDataService.instance = new MockDataService();
    }
    return MockDataService.instance;
  }

  private initializeMockData(): void {
    // 사용자 프로필 초기화
    this.userProfile = {
      id: 'user_001',
      name: '김에너지',
      email: 'kim.energy@example.com',
      householdType: 'apartment',
      address: '서울시 강남구 테헤란로 123',
      residentCount: 4,
      incomeLevel: '3분위',
      avatar: 'https://via.placeholder.com/100x100/4CAF50/FFFFFF?text=KE'
    };

    // 에너지 데이터 초기화
    this.energyData = {
      currentPowerUsage: 2.5,
      todaySavings: 15.2,
      co2Reduction: 6.4,
      efficiencyGrade: 'A+',
      estimatedBill: 125000,
      hourlyUsage: this.generateHourlyUsage(),
      monthlyTrend: this.generateMonthlyTrend()
    };

    // IoT 디바이스 초기화
    this.devices = [
      {
        id: 'device_001',
        name: '스마트 미터',
        type: 'smart_meter',
        status: 'online',
        powerConsumption: 2.5,
        isOn: true,
        lastUpdated: new Date().toISOString(),
        location: '전기실'
      },
      {
        id: 'device_002',
        name: '거실 에어컨',
        type: 'thermostat',
        status: 'online',
        powerConsumption: 1.2,
        isOn: true,
        lastUpdated: new Date().toISOString(),
        location: '거실'
      },
      {
        id: 'device_003',
        name: '주방 스마트 플러그',
        type: 'smart_plug',
        status: 'online',
        powerConsumption: 0.3,
        isOn: false,
        lastUpdated: new Date().toISOString(),
        location: '주방'
      },
      {
        id: 'device_004',
        name: '태양광 패널',
        type: 'solar_panel',
        status: 'online',
        powerConsumption: -0.8, // 음수는 발전량
        isOn: true,
        lastUpdated: new Date().toISOString(),
        location: '옥상'
      },
      {
        id: 'device_005',
        name: '배터리 시스템',
        type: 'battery',
        status: 'online',
        powerConsumption: 0.0,
        isOn: true,
        lastUpdated: new Date().toISOString(),
        location: '지하실'
      }
    ];

    // 커뮤니티 데이터 초기화
    this.communityData = {
      myRank: 15,
      totalUsers: 1250,
      monthlySavings: 45.2,
      leaderboard: [
        { rank: 1, name: '김에너지', savings: 45.2, avatar: 'https://via.placeholder.com/50x50/FFD700/FFFFFF?text=1' },
        { rank: 2, name: '이절약', savings: 42.8, avatar: 'https://via.placeholder.com/50x50/C0C0C0/FFFFFF?text=2' },
        { rank: 3, name: '박친환경', savings: 40.1, avatar: 'https://via.placeholder.com/50x50/CD7F32/FFFFFF?text=3' },
        { rank: 4, name: '최스마트', savings: 38.5, avatar: 'https://via.placeholder.com/50x50/4CAF50/FFFFFF?text=4' },
        { rank: 5, name: '정그린', savings: 36.2, avatar: 'https://via.placeholder.com/50x50/4CAF50/FFFFFF?text=5' }
      ],
      challenges: [
        {
          id: 'challenge_001',
          title: '주말 절약 챌린지',
          description: '주말 동안 20% 이상 절약하기',
          participants: 156,
          reward: 5000,
          endDate: '2024-01-15',
          status: 'active'
        },
        {
          id: 'challenge_002',
          title: '겨울철 난방 효율 챌린지',
          description: '난방비 15% 절약하기',
          participants: 89,
          reward: 3000,
          endDate: '2024-01-20',
          status: 'active'
        }
      ]
    };

    // AI 추천 초기화
    this.aiRecommendations = [
      {
        id: 'ai_001',
        title: '에어컨 온도 1도 높이기',
        description: '냉방 온도를 1도 높여 전력 소비를 5% 절약하세요',
        category: 'energy_saving',
        potentialSavings: 800,
        difficulty: 'easy',
        isApplied: false,
        priority: 'high'
      },
      {
        id: 'ai_002',
        title: '스마트 플러그 사용',
        description: '대기전력을 차단하는 스마트 플러그를 사용하세요',
        category: 'energy_saving',
        potentialSavings: 1200,
        difficulty: 'medium',
        isApplied: false,
        priority: 'medium'
      },
      {
        id: 'ai_003',
        title: 'LED 전구 교체',
        description: '기존 백열등을 LED 전구로 교체하여 전력 소비를 80% 절약하세요',
        category: 'energy_saving',
        potentialSavings: 1500,
        difficulty: 'easy',
        isApplied: false,
        priority: 'high'
      }
    ];
  }

  private generateHourlyUsage(): Array<{ hour: number; usage: number }> {
    const data = [];
    for (let i = 0; i < 24; i++) {
      // 시간대별 패턴 시뮬레이션
      let baseUsage = 1.5;
      if (i >= 6 && i <= 8) baseUsage = 2.0; // 아침
      else if (i >= 18 && i <= 22) baseUsage = 3.5; // 저녁
      else if (i >= 22 || i <= 6) baseUsage = 1.0; // 야간
      
      const variation = (Math.random() - 0.5) * 0.5;
      data.push({
        hour: i,
        usage: Math.max(0.5, baseUsage + variation)
      });
    }
    return data;
  }

  private generateMonthlyTrend(): Array<{ month: string; savings: number }> {
    const months = ['1월', '2월', '3월', '4월', '5월', '6월'];
    return months.map(month => ({
      month,
      savings: Math.random() * 20 + 10 // 10-30 kWh
    }));
  }

  private startRealTimeUpdates(): void {
    // 3초마다 데이터 업데이트
    this.updateInterval = setInterval(() => {
      this.updateRealTimeData();
    }, 3000);
  }

  private updateRealTimeData(): void {
    // 현재 전력 사용량 업데이트 (실시간 효과)
    const variation = (Math.random() - 0.5) * 0.3;
    this.energyData.currentPowerUsage = Math.max(0.5, 2.5 + variation);

    // 오늘 절약량 업데이트
    this.energyData.todaySavings += Math.random() * 0.1;

    // CO2 절감량 업데이트
    this.energyData.co2Reduction = this.energyData.todaySavings * 0.424;

    // 예상 전기요금 업데이트
    this.energyData.estimatedBill = Math.round(125000 + (Math.random() - 0.5) * 5000);

    // 디바이스 상태 업데이트
    this.devices.forEach(device => {
      if (device.status === 'online') {
        const variation = (Math.random() - 0.5) * 0.2;
        device.powerConsumption = Math.max(0, device.powerConsumption + variation);
        device.lastUpdated = new Date().toISOString();
      }
    });

    // 시간대별 사용량 업데이트 (현재 시간)
    const currentHour = new Date().getHours();
    if (this.energyData.hourlyUsage[currentHour]) {
      const variation = (Math.random() - 0.5) * 0.3;
      this.energyData.hourlyUsage[currentHour].usage = Math.max(0.5, 
        this.energyData.hourlyUsage[currentHour].usage + variation
      );
    }
  }

  // API 메서드들 (실제 API와 동일한 인터페이스)
  public async getUserProfile(): Promise<UserProfile> {
    // 시뮬레이션된 네트워크 지연
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.userProfile;
  }

  public async getEnergyData(): Promise<EnergyData> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { ...this.energyData };
  }

  public async getDevices(): Promise<DeviceData[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return [...this.devices];
  }

  public async getCommunityData(): Promise<CommunityData> {
    await new Promise(resolve => setTimeout(resolve, 600));
    return { ...this.communityData };
  }

  public async getAIRecommendations(): Promise<AIRecommendation[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...this.aiRecommendations];
  }

  public async toggleDevice(deviceId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const device = this.devices.find(d => d.id === deviceId);
    if (device) {
      device.isOn = !device.isOn;
      device.lastUpdated = new Date().toISOString();
      return true;
    }
    return false;
  }

  public async applyAIRecommendation(recommendationId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const recommendation = this.aiRecommendations.find(r => r.id === recommendationId);
    if (recommendation) {
      recommendation.isApplied = true;
      // 절약 효과 적용
      this.energyData.todaySavings += recommendation.potentialSavings / 1000;
      return true;
    }
    return false;
  }

  public async login(email: string, password: string): Promise<{ success: boolean; token?: string }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 데모용 간단한 로그인
    if (email === 'demo@hems.com' && password === 'demo123') {
      return { success: true, token: 'demo_token_12345' };
    }
    return { success: false };
  }

  public async updateUserProfile(profile: Partial<UserProfile>): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.userProfile = { ...this.userProfile, ...profile };
    return true;
  }

  // 시연용 특수 기능
  public async triggerDemoScenario(scenario: 'energy_spike' | 'savings_boost' | 'device_failure'): Promise<void> {
    switch (scenario) {
      case 'energy_spike':
        this.energyData.currentPowerUsage = 5.2;
        this.energyData.efficiencyGrade = 'C';
        break;
      case 'savings_boost':
        this.energyData.todaySavings = 25.8;
        this.energyData.co2Reduction = 10.9;
        this.energyData.efficiencyGrade = 'A+';
        break;
      case 'device_failure':
        const device = this.devices.find(d => d.type === 'smart_meter');
        if (device) {
          device.status = 'error';
        }
        break;
    }
  }

  public destroy(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }
}

export default MockDataService;
