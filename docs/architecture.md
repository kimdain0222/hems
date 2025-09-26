# 🏗️ HEMS 시스템 아키텍처 설계

## 전체 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────────┐
│                        HEMS 플랫폼                              │
├─────────────────────────────────────────────────────────────────┤
│  📱 모바일 앱 (React Native)  │  🌐 웹 대시보드 (React.js)     │
│  • iOS/Android 지원           │  • 반응형 웹 디자인            │
│  • 오프라인 모드              │  • PWA 지원                   │
│  • 푸시 알림                  │  • 실시간 업데이트             │
├─────────────────────────────────────────────────────────────────┤
│                    🔗 API Gateway (포트 8000)                   │
│  • 통합 인증 및 라우팅        │  • Rate Limiting              │
│  • 요청/응답 로깅            │  • CORS 처리                   │
├─────────────────────────────────────────────────────────────────┤
│  👤 사용자 앱    │  🤖 AI 엔진    │  📊 IoT 수집기  │  💰 인센티브  │
│   (포트 8003)    │  (포트 8004)   │   (포트 8006)   │   (포트 8005) │
│  • 사용자 관리   │  • ML 예측     │  • 센서 데이터  │  • 보상 계산  │
│  • 프로필 관리   │  • 최적화 제안 │  • 실시간 처리  │  • 정부 연계  │
│  • 대시보드     │  • 패턴 분석   │  • 데이터 검증  │  • 포인트 관리 │
├─────────────────────────────────────────────────────────────────┤
│  🏢 BEMS 연동기  │  🔗 기존 시스템 연계                         │
│   (포트 8009)    │  • 기업용 BEMS (C:\energy_sys)              │
│  • 데이터 동기화 │  • 스마트 에너지 플랫폼 (C:\smart_energy_platform) │
│  • API 연동     │  • 정부 포털 연동                            │
├─────────────────────────────────────────────────────────────────┤
│  🗄️ 데이터 계층                                                │
│  PostgreSQL (메인 DB) │ InfluxDB (시계열) │ Redis (캐시)      │
│  • 사용자 정보        │  • 에너지 데이터   │  • 세션 관리       │
│  • 가정 정보         │  • 센서 데이터     │  • 실시간 캐시     │
│  • 인센티브 정보      │  • AI 예측 데이터  │  • 랭킹 캐시       │
└─────────────────────────────────────────────────────────────────┘
```

## 데이터 플로우 다이어그램

```
IoT 디바이스 → MQTT Broker → IoT Collector → 데이터 검증
     ↓              ↓              ↓
스마트 미터    실시간 스트림    이상치 탐지
스마트 플러그  데이터 큐잉     데이터 정규화
환경 센서      메시지 라우팅   타임스탬프 정렬
     ↓              ↓              ↓
              InfluxDB 저장 ← Redis 캐시
                    ↓              ↓
              AI 엔진 분석    API Gateway
                    ↓              ↓
              예측 모델 업데이트  모바일 앱
                    ↓              ↓
              최적화 제안 생성   사용자 인터페이스
```

## 마이크로서비스 상세 설계

### 1. API Gateway (포트 8000)

**역할**: 모든 클라이언트 요청의 진입점

**주요 기능**:
- 요청 라우팅 및 로드 밸런싱
- JWT 기반 인증 및 권한 관리
- Rate Limiting (사용자당 100 req/15min)
- CORS 처리
- 요청/응답 로깅
- 헬스체크 엔드포인트

**기술 스택**: Node.js + Express + TypeScript

### 2. User App Service (포트 8003)

**역할**: 사용자 관리 및 대시보드 제공

**주요 기능**:
- 사용자 등록/로그인/프로필 관리
- 가정 정보 관리
- 실시간 에너지 대시보드
- 커뮤니티 기능 (랭킹, 챌린지)
- 알림 관리

**API 엔드포인트**:
```
GET  /users/profile          # 사용자 프로필 조회
PUT  /users/profile          # 프로필 업데이트
GET  /households             # 가정 정보 조회
POST /households             # 가정 정보 등록
GET  /dashboard/energy       # 에너지 대시보드
GET  /community/leaderboard  # 커뮤니티 랭킹
GET  /notifications          # 알림 목록
```

**기술 스택**: FastAPI + Python + SQLAlchemy

### 3. AI Optimization Engine (포트 8004)

**역할**: 머신러닝 기반 에너지 최적화

**주요 기능**:
- 실시간 에너지 사용량 예측
- 사용 패턴 분석
- 최적화 제안 생성
- 이상치 탐지
- 모델 성능 모니터링

**ML 모델**:
- LSTM: 시계열 예측
- Random Forest: 사용 패턴 분류
- Isolation Forest: 이상치 탐지
- XGBoost: 에너지 효율 예측

**API 엔드포인트**:
```
POST /predict/energy         # 에너지 사용량 예측
GET  /predictions/history    # 예측 히스토리
GET  /optimization/tips      # 최적화 제안
POST /anomaly/detect         # 이상치 탐지
GET  /model/performance      # 모델 성능 지표
```

**기술 스택**: Python + TensorFlow + scikit-learn + FastAPI

### 4. IoT Data Collector (포트 8006)

**역할**: IoT 센서 데이터 수집 및 처리

**주요 기능**:
- MQTT 메시지 수신
- 데이터 검증 및 정규화
- InfluxDB 저장
- 실시간 알림 생성
- 디바이스 상태 모니터링

**지원 프로토콜**:
- MQTT (주요)
- HTTP REST API
- Modbus TCP
- WebSocket

**데이터 처리 파이프라인**:
```
MQTT 메시지 → 파싱 → 검증 → 정규화 → InfluxDB 저장
     ↓
Redis 캐시 업데이트 → 알림 생성 → API Gateway 통지
```

**기술 스택**: Python + paho-mqtt + InfluxDB Client + FastAPI

### 5. Incentive Management (포트 8005)

**역할**: 보상 및 인센티브 관리

**주요 기능**:
- 에너지 절약 보상 계산
- 정부 지원 프로그램 연계
- 포인트 적립/사용 관리
- 보상 지급 처리
- 정산 관리

**보상 계산 로직**:
```python
def calculate_energy_savings_reward(household_id, period):
    baseline = get_baseline_consumption(household_id, period)
    actual = get_actual_consumption(household_id, period)
    savings = baseline - actual
    
    if savings > 0:
        reward_rate = get_reward_rate(household_id)
        reward = savings * reward_rate * ELECTRICITY_RATE
        return reward
    return 0
```

**기술 스택**: FastAPI + Python + Celery (비동기 작업)

### 6. BEMS Connector (포트 8009)

**역할**: 기존 시스템과의 연동

**주요 기능**:
- 기업용 BEMS 시스템 연동
- 스마트 에너지 플랫폼 연동
- 데이터 동기화
- API 호환성 관리

**연동 시스템**:
- 기업용 BEMS (C:\energy_sys): Flask 기반
- 스마트 에너지 플랫폼 (C:\smart_energy_platform): FastAPI 기반

**기술 스택**: Python + HTTP Client + FastAPI

## 데이터베이스 설계

### PostgreSQL 스키마

```sql
-- 사용자 테이블
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type VARCHAR(50) NOT NULL,
    full_name VARCHAR(100),
    phone_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 가정 정보 테이블
CREATE TABLE households (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    address TEXT NOT NULL,
    building_type VARCHAR(50),
    area_sqm INTEGER,
    resident_count INTEGER,
    income_level VARCHAR(20),
    energy_tariff VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- IoT 디바이스 테이블
CREATE TABLE iot_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id UUID REFERENCES households(id) ON DELETE CASCADE,
    device_type VARCHAR(50) NOT NULL,
    device_id VARCHAR(100) UNIQUE NOT NULL,
    manufacturer VARCHAR(100),
    model VARCHAR(100),
    installation_date DATE,
    is_active BOOLEAN DEFAULT true,
    last_seen TIMESTAMP,
    metadata JSONB
);

-- 에너지 사용량 일일 집계
CREATE TABLE energy_usage_daily (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id UUID REFERENCES households(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_consumption FLOAT,
    peak_consumption FLOAT,
    off_peak_consumption FLOAT,
    solar_generation FLOAT,
    grid_consumption FLOAT,
    cost FLOAT,
    carbon_emission FLOAT,
    efficiency_score FLOAT,
    UNIQUE(household_id, date)
);

-- 인덱스 최적화
CREATE INDEX idx_households_user_id ON households(user_id);
CREATE INDEX idx_iot_devices_household_id ON iot_devices(household_id);
CREATE INDEX idx_energy_usage_household_date ON energy_usage_daily(household_id, date);
```

### InfluxDB 측정값

```sql
-- 에너지 사용량 측정값
CREATE MEASUREMENT energy_consumption (
    time TIMESTAMP,
    household_id TAG,
    device_id TAG,
    power_consumption FLOAT,
    voltage FLOAT,
    current FLOAT,
    power_factor FLOAT,
    cost FLOAT,
    carbon_emission FLOAT
);

-- 환경 데이터 측정값
CREATE MEASUREMENT environmental_data (
    time TIMESTAMP,
    household_id TAG,
    temperature FLOAT,
    humidity FLOAT,
    co2_level FLOAT,
    air_quality_index FLOAT
);

-- AI 예측 데이터 측정값
CREATE MEASUREMENT ai_predictions (
    time TIMESTAMP,
    household_id TAG,
    prediction_type TAG,
    predicted_value FLOAT,
    confidence_score FLOAT,
    actual_value FLOAT
);
```

## 보안 아키텍처

### 인증 및 권한 관리

```
클라이언트 → API Gateway → JWT 검증 → 서비스 라우팅
     ↓              ↓              ↓
모바일 앱      Rate Limiting    권한 확인
웹 대시보드    CORS 처리       리소스 접근
     ↓              ↓              ↓
JWT 토큰      로깅 및 모니터링  비즈니스 로직
```

### 데이터 암호화

- **전송 중**: TLS 1.3
- **저장 시**: AES-256 암호화
- **개인정보**: 별도 암호화 키 관리
- **IoT 데이터**: 디바이스별 인증서

## 모니터링 및 로깅

### 메트릭 수집

- **Prometheus**: 시스템 메트릭
- **Grafana**: 대시보드 시각화
- **ELK Stack**: 로그 분석

### 주요 모니터링 지표

- API 응답 시간
- 데이터베이스 성능
- IoT 디바이스 연결 상태
- AI 모델 정확도
- 사용자 활동 통계

## 확장성 고려사항

### 수평적 확장

- 마이크로서비스별 독립적 스케일링
- 데이터베이스 샤딩
- 로드 밸런서 활용

### 성능 최적화

- Redis 캐싱 전략
- 데이터베이스 인덱싱
- CDN 활용
- 비동기 처리

## 장애 대응

### 장애 복구 전략

- 서비스별 헬스체크
- 자동 장애 감지
- Circuit Breaker 패턴
- 데이터 백업 및 복구

### 모니터링 알림

- 시스템 장애 알림
- 성능 저하 감지
- 보안 이벤트 알림
- 사용자 활동 이상 탐지
