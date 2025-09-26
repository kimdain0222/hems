# 🏠 HEMS Mobile App - 투자자 데모용 프로토타입

## 📱 프로젝트 개요

가정용 에너지 관리 시스템(HEMS)의 모바일 앱 프로토타입으로, 투자자 데모 시연을 위해 개발되었습니다. 백엔드 연결 없이 Mock 데이터를 사용하여 실시간 효과를 구현했습니다.

## 🎯 주요 특징

### ✅ 구현된 기능
- **실시간 데이터 시뮬레이션**: 3초마다 자동 데이터 갱신
- **Mock 데이터 서비스**: 실제 API와 동일한 인터페이스 제공
- **핵심 화면 구현**: 로그인, 대시보드, 디바이스 제어, 설정
- **시연용 특수 기능**: 데모 시나리오 트리거
- **반응형 UI**: 모바일 퍼스트 디자인
- **애니메이션**: 부드러운 사용자 경험

### 🔄 실시간 효과
- 전력 사용량 실시간 변동
- 디바이스 상태 자동 업데이트
- 에너지 효율 등급 동적 계산
- CO2 절감량 실시간 계산

## 🚀 빠른 시작

### 1. 환경 설정

```bash
# 프로젝트 디렉토리로 이동
cd mobile-app

# 의존성 설치
npm install

# iOS 시뮬레이션 실행 (macOS만)
npx react-native run-ios

# Android 에뮬레이터 실행
npx react-native run-android
```

### 2. 데모 계정

```
이메일: demo@hems.com
비밀번호: demo123
```

### 3. 시연 시나리오

앱 내 "데모" 버튼을 통해 다음 시나리오를 시연할 수 있습니다:

- **에너지 급증**: 전력 사용량이 급증하는 상황
- **절약 효과**: 에너지 절약 효과가 크게 향상된 상황
- **디바이스 오류**: IoT 디바이스 오류 상황

## 📱 화면 구성

### 1. 로그인 화면
- 깔끔한 그라데이션 디자인
- 데모 계정 자동 입력 기능
- 로딩 애니메이션

### 2. 대시보드 화면
- 실시간 전력 사용량 표시
- 에너지 효율 등급 (A+ ~ F)
- 24시간 사용량 그래프
- 월별 절약 추이 차트
- 예상 전기요금
- 시연용 데모 버튼

### 3. 디바이스 제어 화면
- 연결된 IoT 디바이스 목록
- 실시간 전력 사용량 표시
- 디바이스 ON/OFF 제어
- 빠른 액션 버튼 (전체 끄기, 에코 모드, 스케줄)
- 전체 전력 사용량 요약

### 4. 설정 화면
- 사용자 프로필 편집
- 알림 설정
- 개인정보 보호 설정
- 앱 정보
- 데모 전용 설정 (데이터 리셋)

## 🛠️ 기술 스택

### 프론트엔드
- **React Native**: 0.72.6
- **TypeScript**: 타입 안전성
- **React Navigation**: 네비게이션
- **React Native Paper**: UI 컴포넌트
- **React Native Vector Icons**: 아이콘
- **React Native Chart Kit**: 차트
- **React Native Linear Gradient**: 그라데이션
- **React Native Animatable**: 애니메이션

### 상태 관리
- **Mock Data Service**: 중앙화된 데이터 관리
- **React Hooks**: 상태 관리
- **Context API**: 전역 상태 (필요시)

## 📊 Mock 데이터 구조

### 에너지 데이터
```typescript
interface EnergyData {
  currentPowerUsage: number; // kW
  todaySavings: number; // kWh
  co2Reduction: number; // kg
  efficiencyGrade: string; // A+ ~ F
  estimatedBill: number; // 원
  hourlyUsage: Array<{ hour: number; usage: number }>;
  monthlyTrend: Array<{ month: string; savings: number }>;
}
```

### 디바이스 데이터
```typescript
interface DeviceData {
  id: string;
  name: string;
  type: 'smart_meter' | 'thermostat' | 'smart_plug' | 'solar_panel' | 'battery';
  status: 'online' | 'offline' | 'error';
  powerConsumption: number; // kW
  isOn: boolean;
  lastUpdated: string;
  location: string;
}
```

## 🔧 개발 가이드

### 프로젝트 구조
```
mobile-app/
├── src/
│   ├── screens/           # 화면 컴포넌트
│   │   ├── LoginScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── DeviceControlScreen.tsx
│   │   └── SettingsScreen.tsx
│   └── data/             # 데이터 서비스
│       └── MockDataService.ts
├── App.tsx               # 메인 앱 컴포넌트
├── index.js              # 앱 진입점
└── package.json          # 의존성 관리
```

### Mock 데이터 서비스

`MockDataService`는 실제 API와 동일한 인터페이스를 제공하여 나중에 쉽게 교체할 수 있습니다:

```typescript
// 사용 예시
const mockService = MockDataService.getInstance();
const energyData = await mockService.getEnergyData();
const devices = await mockService.getDevices();
```

### 실시간 업데이트

3초마다 자동으로 데이터가 업데이트되어 실시간 효과를 제공합니다:

```typescript
useEffect(() => {
  const interval = setInterval(() => {
    loadData(false); // 자동 업데이트
  }, 3000);
  
  return () => clearInterval(interval);
}, []);
```

## 🎨 UI/UX 특징

### 디자인 시스템
- **색상**: 그라데이션 기반 모던한 디자인
- **타이포그래피**: 명확한 정보 계층 구조
- **아이콘**: Material Icons 일관성
- **애니메이션**: 부드러운 전환 효과

### 반응형 디자인
- 다양한 화면 크기 지원
- 터치 친화적 인터페이스
- 직관적인 네비게이션

## 📈 성능 최적화

### 메모리 관리
- 컴포넌트 언마운트 시 타이머 정리
- 불필요한 리렌더링 방지
- 이미지 최적화

### 사용자 경험
- 로딩 상태 표시
- 오류 처리
- 오프라인 대응 (Mock 데이터)

## 🔮 향후 개발 계획

### Phase 1: 백엔드 연동
- 실제 API 서버 연결
- 인증 시스템 구현
- 실시간 WebSocket 연결

### Phase 2: 고급 기능
- 푸시 알림
- 오프라인 모드
- 데이터 동기화

### Phase 3: 확장 기능
- 커뮤니티 기능
- AI 추천 시스템
- 정부 인센티브 연동

## 🐛 알려진 이슈

- iOS 시뮬레이터에서 일부 애니메이션 지연
- Android 에뮬레이터에서 차트 렌더링 이슈 (실제 기기에서는 정상)
- Mock 데이터 초기화 시 간헐적 지연

## 📞 지원

프로젝트 관련 문의사항이나 버그 리포트는 이슈를 생성해 주세요.

---

**참고**: 이 프로젝트는 투자자 데모용 프로토타입으로, 실제 서비스와 다를 수 있습니다.
