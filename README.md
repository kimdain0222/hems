# 🏠 HEMS (Home Energy Management System) - 가정용 에너지 관리 플랫폼

## 📋 프로젝트 개요

가정용 사용자를 위한 통합 에너지 관리 시스템으로, 실시간 에너지 모니터링, AI 기반 최적화, 정부 인센티브 연계, 커뮤니티 기능을 제공하는 모바일 퍼스트 플랫폼입니다.

### 🎯 핵심 목표
- **실시간 에너지 모니터링**: IoT 센서를 통한 실시간 전력 사용량 추적
- **AI 기반 최적화**: 머신러닝을 활용한 에너지 사용 패턴 분석 및 최적화 제안
- **정부 인센티브 연계**: 기존 스마트 에너지 플랫폼과 연동하여 자동 보상 시스템
- **커뮤니티 기능**: 게임피케이션을 통한 에너지 절약 동기 부여
- **모바일 퍼스트**: 반응형 웹 및 React Native 앱으로 언제 어디서나 접근

## 🏗️ 시스템 아키텍처

### 전체 아키텍처 다이어그램

```
┌─────────────────────────────────────────────────────────────────┐
│                        HEMS 플랫폼                              │
├─────────────────────────────────────────────────────────────────┤
│  📱 모바일 앱 (React Native)  │  🌐 웹 대시보드 (React.js)     │
├─────────────────────────────────────────────────────────────────┤
│                    🔗 API Gateway (포트 8000)                   │
├─────────────────────────────────────────────────────────────────┤
│  👤 사용자 앱    │  🤖 AI 엔진    │  📊 IoT 수집기  │  💰 인센티브  │
│   (포트 8003)    │  (포트 8004)   │   (포트 8006)   │   (포트 8005) │
├─────────────────────────────────────────────────────────────────┤
│  🏢 BEMS 연동기  │  🔗 기존 시스템 연계                         │
│   (포트 8009)    │  • 기업용 BEMS (C:\energy_sys)              │
│                  │  • 스마트 에너지 플랫폼 (C:\smart_energy_platform) │
├─────────────────────────────────────────────────────────────────┤
│  🗄️ 데이터 계층                                                │
│  PostgreSQL (메인 DB) │ InfluxDB (시계열) │ Redis (캐시)      │
└─────────────────────────────────────────────────────────────────┘
```

### 마이크로서비스 구조

| 서비스 | 포트 | 역할 | 기술 스택 |
|--------|------|------|-----------|
| **API Gateway** | 8000 | 통합 API 게이트웨이, 라우팅, 인증 | Node.js + Express |
| **User App** | 8003 | 사용자 관리, 프로필, 대시보드 | FastAPI + Python |
| **AI Optimization** | 8004 | ML 모델, 예측, 최적화 제안 | Python + TensorFlow |
| **IoT Collector** | 8006 | IoT 센서 데이터 수집 및 처리 | Python + MQTT |
| **Incentive Management** | 8005 | 보상 계산, 정부 연계 | FastAPI + Python |
| **BEMS Connector** | 8009 | 기존 BEMS 시스템 연동 | Python + HTTP Client |

## 🗄️ 데이터베이스 설계

### PostgreSQL (메인 데이터베이스)

```sql
-- 사용자 및 인증
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type VARCHAR(50) NOT NULL, -- individual, family, community
    full_name VARCHAR(100),
    phone_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 가정 정보
CREATE TABLE households (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    address TEXT NOT NULL,
    building_type VARCHAR(50), -- apartment, house, villa
    area_sqm INTEGER,
    resident_count INTEGER,
    income_level VARCHAR(20),
    energy_tariff VARCHAR(50), -- time_of_use, flat_rate
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- IoT 디바이스 정보
CREATE TABLE iot_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id UUID REFERENCES households(id) ON DELETE CASCADE,
    device_type VARCHAR(50) NOT NULL, -- smart_meter, thermostat, solar_panel, battery
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
    total_consumption FLOAT, -- kWh
    peak_consumption FLOAT,
    off_peak_consumption FLOAT,
    solar_generation FLOAT,
    grid_consumption FLOAT,
    cost FLOAT, -- 원
    carbon_emission FLOAT, -- kg CO2
    efficiency_score FLOAT, -- 0-100
    UNIQUE(household_id, date)
);

-- 인센티브 및 보상
CREATE TABLE incentives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id UUID REFERENCES households(id) ON DELETE CASCADE,
    incentive_type VARCHAR(50) NOT NULL, -- energy_savings, government_support, community_reward
    amount FLOAT NOT NULL,
    currency VARCHAR(3) DEFAULT 'KRW',
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, paid
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP,
    metadata JSONB
);

-- AI 예측 결과
CREATE TABLE ai_predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id UUID REFERENCES households(id) ON DELETE CASCADE,
    prediction_type VARCHAR(50) NOT NULL, -- hourly, daily, monthly
    predicted_consumption FLOAT,
    confidence_score FLOAT,
    predicted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    target_date DATE,
    metadata JSONB
);

-- 인덱스 최적화
CREATE INDEX idx_households_user_id ON households(user_id);
CREATE INDEX idx_iot_devices_household_id ON iot_devices(household_id);
CREATE INDEX idx_energy_usage_household_date ON energy_usage_daily(household_id, date);
CREATE INDEX idx_incentives_household_id ON incentives(household_id);
CREATE INDEX idx_ai_predictions_household_id ON ai_predictions(household_id);
```

### InfluxDB (시계열 데이터)

```sql
-- 실시간 에너지 사용량
CREATE MEASUREMENT energy_consumption (
    time TIMESTAMP,
    household_id TAG,
    device_id TAG,
    power_consumption FLOAT, -- kW
    voltage FLOAT,
    current FLOAT,
    power_factor FLOAT,
    cost FLOAT,
    carbon_emission FLOAT
);

-- 환경 센서 데이터
CREATE MEASUREMENT environmental_data (
    time TIMESTAMP,
    household_id TAG,
    temperature FLOAT,
    humidity FLOAT,
    co2_level FLOAT,
    air_quality_index FLOAT,
    weather_condition STRING
);

-- AI 예측 데이터
CREATE MEASUREMENT ai_predictions (
    time TIMESTAMP,
    household_id TAG,
    prediction_type TAG,
    predicted_value FLOAT,
    confidence_score FLOAT,
    actual_value FLOAT
);

-- 보존 정책 설정
CREATE RETENTION POLICY "energy_data" ON "hems_db"
DURATION 365d REPLICATION 1 DEFAULT;

CREATE RETENTION POLICY "environmental_data" ON "hems_db"
DURATION 90d REPLICATION 1;

CREATE RETENTION POLICY "ai_predictions" ON "hems_db"
DURATION 180d REPLICATION 1;
```

### Redis (캐시 및 세션)

```redis
# 실시간 데이터 캐시
SET household:123:current_power 2.5
EXPIRE household:123:current_power 60

# 사용자 세션
SET session:user:456 "user_data_json"
EXPIRE session:user:456 3600

# AI 예측 결과 캐시
SET prediction:household:123:next_hour "prediction_data"
EXPIRE prediction:household:123:next_hour 300

# 커뮤니티 랭킹 캐시
ZADD leaderboard:monthly 150.5 "user:123"
ZADD leaderboard:monthly 120.3 "user:456"

# 실시간 알림 큐
LPUSH notifications:user:123 "energy_spike_alert"
```

## 🔌 IoT 연동 설계

### IoT 디바이스 지원 목록

| 디바이스 타입 | 프로토콜 | 데이터 | 비고 |
|---------------|----------|--------|------|
| **스마트 미터** | DLMS/COSEM, Modbus | 전력 사용량, 전압, 전류 | 전력회사 API 연동 |
| **스마트 플러그** | WiFi, Zigbee | 개별 기기 전력 사용량 | TP-Link, Xiaomi 등 |
| **스마트 서모스탯** | WiFi, Zigbee | 온도, 난방/냉방 상태 | Nest, Ecobee 등 |
| **태양광 인버터** | Modbus TCP | 발전량, 효율 | SMA, Fronius 등 |
| **배터리 시스템** | Modbus TCP | 충전/방전 상태, SOC | Tesla Powerwall 등 |
| **환경 센서** | WiFi, LoRaWAN | 온도, 습도, CO2 | 온습도계, 공기질 센서 |

### 데이터 수집 파이프라인

```
IoT 디바이스 → MQTT Broker → IoT Collector → 데이터 검증 → InfluxDB
                                    ↓
                              Redis 캐시 → API Gateway → 모바일 앱
                                    ↓
                              AI 엔진 → 예측 모델 업데이트
```

## 📱 모바일 앱 설계

### 주요 화면 구성

#### 1. 대시보드 화면
```
┌─────────────────────────────────────┐
│  🏠 우리집 에너지 현황              │
├─────────────────────────────────────┤
│  ⚡ 현재 전력 사용량                │
│     2.5 kW                         │
│  💰 오늘 절약량                     │
│     15.2 kWh  (+₩2,280)           │
│  🌱 CO2 절감량                      │
│     6.4 kg                         │
│  📊 에너지 효율 등급                │
│     A+ (95점)                      │
├─────────────────────────────────────┤
│  📈 24시간 사용량 그래프            │
│  [실시간 차트 영역]                 │
├─────────────────────────────────────┤
│  💡 AI 추천 액션                    │
│  • 에어컨 온도 1도 높이기           │
│  • 불필요한 조명 끄기               │
└─────────────────────────────────────┘
```

#### 2. 커뮤니티 화면
```
┌─────────────────────────────────────┐
│  🏆 절약 챌린지                     │
├─────────────────────────────────────┤
│  내 순위: 15위 / 1,250명            │
│  이번 달 절약량: 45.2 kWh           │
├─────────────────────────────────────┤
│  🥇 1위 김에너지 45.2 kWh          │
│  🥈 2위 이절약   42.8 kWh          │
│  🥉 3위 박친환경 40.1 kWh          │
│  ...                               │
├─────────────────────────────────────┤
│  🎯 진행중인 챌린지                 │
│  • 주말 절약 챌린지 (156명 참여)    │
│  • 겨울철 난방 효율 챌린지 (89명)   │
└─────────────────────────────────────┘
```

#### 3. AI 추천 화면
```
┌─────────────────────────────────────┐
│  🤖 AI 에너지 어시스턴트            │
├─────────────────────────────────────┤
│  📊 다음 1시간 예측                 │
│     예상 사용량: 2.8 kW             │
│     신뢰도: 92%                     │
├─────────────────────────────────────┤
│  💡 개인화 추천                     │
│  • 에어컨 온도 1도 높이기           │
│    절약 효과: ₩800/일               │
│  • 스마트 플러그 사용               │
│    절약 효과: ₩1,200/월             │
├─────────────────────────────────────┤
│  🌤️ 날씨 기반 조언                 │
│  • 내일 흐림 예상, 조명 사용량 증가 │
│  • LED 전구 교체 권장               │
└─────────────────────────────────────┘
```

#### 4. 보상 현황 화면
```
┌─────────────────────────────────────┐
│  💰 보상 현황                       │
├─────────────────────────────────────┤
│  💳 현재 적립                       │
│     포인트: 15,200 P               │
│     현금: ₩8,500                   │
├─────────────────────────────────────┤
│  🏛️ 정부 지원 프로그램              │
│  • 전력사용량 기반 보상             │
│    신청 상태: 승인 대기             │
│  • 에너지 효율 개선 지원금          │
│    신청 상태: 검토 중               │
├─────────────────────────────────────┤
│  📋 최근 거래 내역                  │
│  • 에너지 절약 보상 +₩2,280        │
│  • 커뮤니티 챌린지 +₩1,500         │
│  • 정부 지원금 +₩5,000             │
└─────────────────────────────────────┘
```

## 🐳 Docker 환경 설정

### docker-compose.yml

```yaml
version: '3.8'

services:
  # 데이터베이스
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: hems_db
      POSTGRES_USER: hems_user
      POSTGRES_PASSWORD: hems_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U hems_user -d hems_db"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - hems_network

  influxdb:
    image: influxdb:2.7
    environment:
      DOCKER_INFLUXDB_INIT_MODE: setup
      DOCKER_INFLUXDB_INIT_USERNAME: admin
      DOCKER_INFLUXDB_INIT_PASSWORD: admin123
      DOCKER_INFLUXDB_INIT_ORG: hems
      DOCKER_INFLUXDB_INIT_BUCKET: energy_data
    volumes:
      - influxdb_data:/var/lib/influxdb2
    ports:
      - "8086:8086"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8086/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - hems_network

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - hems_network

  # MQTT Broker (IoT 데이터 수집용)
  mosquitto:
    image: eclipse-mosquitto:2.0
    volumes:
      - ./mqtt/mosquitto.conf:/mosquitto/config/mosquitto.conf
    ports:
      - "1883:1883"
      - "9001:9001"
    networks:
      - hems_network

  # HEMS 마이크로서비스
  api_gateway:
    build: ./services/api_gateway
    ports:
      - "8000:8000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://hems_user:hems_password@postgres:5432/hems_db
      - INFLUXDB_URL=http://influxdb:8086
      - REDIS_URL=redis://redis:6379
      - MQTT_BROKER=mqtt://mosquitto:1883
    depends_on:
      postgres:
        condition: service_healthy
      influxdb:
        condition: service_healthy
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - hems_network

  user_app:
    build: ./services/user_app
    ports:
      - "8003:8000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://hems_user:hems_password@postgres:5432/hems_db
      - REDIS_URL=redis://redis:6379
      - INFLUXDB_URL=http://influxdb:8086
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - hems_network

  ai_optimization:
    build: ./services/ai_optimization
    ports:
      - "8004:8000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://hems_user:hems_password@postgres:5432/hems_db
      - INFLUXDB_URL=http://influxdb:8086
      - REDIS_URL=redis://redis:6379
    depends_on:
      postgres:
        condition: service_healthy
      influxdb:
        condition: service_healthy
    networks:
      - hems_network

  iot_collector:
    build: ./services/iot_collector
    ports:
      - "8006:8000"
    environment:
      - NODE_ENV=development
      - INFLUXDB_URL=http://influxdb:8086
      - REDIS_URL=redis://redis:6379
      - MQTT_BROKER=mqtt://mosquitto:1883
    depends_on:
      influxdb:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - hems_network

  incentive_mgmt:
    build: ./services/incentive_mgmt
    ports:
      - "8005:8000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://hems_user:hems_password@postgres:5432/hems_db
      - REDIS_URL=redis://redis:6379
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - hems_network

  bems_connector:
    build: ./services/bems_connector
    ports:
      - "8009:8000"
    environment:
      - NODE_ENV=development
      - BEMS_API_URL=http://host.docker.internal:8080
      - SMART_ENERGY_API_URL=http://host.docker.internal:8000
      - DATABASE_URL=postgresql://hems_user:hems_password@postgres:5432/hems_db
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - hems_network

  # 모니터링
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
    networks:
      - hems_network

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin123
    volumes:
      - grafana_data:/var/lib/grafana
    networks:
      - hems_network

volumes:
  postgres_data:
  influxdb_data:
  redis_data:
  grafana_data:

networks:
  hems_network:
    driver: bridge
```

## 🚀 빠른 시작

### 1. 환경 설정

```bash
# 저장소 클론
git clone <repository-url>
cd hems

# 환경 변수 설정
cp .env.example .env
# .env 파일에서 필요한 설정값 수정

# Docker 컨테이너 실행
docker-compose up -d --build

# 데이터베이스 초기화
docker-compose exec postgres psql -U hems_user -d hems_db -f /docker-entrypoint-initdb.d/init.sql
```

### 2. 서비스 접속

- **API Gateway**: http://localhost:8000
- **사용자 앱**: http://localhost:8003
- **AI 최적화**: http://localhost:8004
- **IoT 수집기**: http://localhost:8006
- **인센티브 관리**: http://localhost:8005
- **BEMS 연동기**: http://localhost:8009
- **Grafana 대시보드**: http://localhost:3000 (admin/admin123)

### 3. 모바일 앱 실행

```bash
cd mobile-app
npm install
npx react-native run-android  # Android
npx react-native run-ios      # iOS
```

## 🔧 개발 가이드

### 프로젝트 구조

```
hems/
├── services/                 # 마이크로서비스
│   ├── api_gateway/         # API 게이트웨이
│   ├── user_app/           # 사용자 앱 서비스
│   ├── ai_optimization/    # AI 최적화 엔진
│   ├── iot_collector/      # IoT 데이터 수집
│   ├── incentive_mgmt/     # 인센티브 관리
│   └── bems_connector/     # 기존 시스템 연동
├── mobile-app/             # React Native 모바일 앱
├── web-dashboard/          # React.js 웹 대시보드
├── database/               # 데이터베이스 스키마
├── monitoring/             # 모니터링 설정
├── docs/                   # 문서
├── tests/                  # 테스트
├── docker-compose.yml      # Docker Compose 설정
└── README.md              # 프로젝트 문서
```

### API 문서

각 서비스의 API 문서는 다음에서 확인할 수 있습니다:

- **API Gateway**: http://localhost:8000/docs
- **사용자 앱**: http://localhost:8003/docs
- **AI 최적화**: http://localhost:8004/docs
- **IoT 수집기**: http://localhost:8006/docs
- **인센티브 관리**: http://localhost:8005/docs

## 📊 모니터링 및 로깅

### 메트릭 수집

- **Prometheus**: 시스템 메트릭 수집
- **Grafana**: 대시보드 및 시각화
- **ELK Stack**: 로그 분석 (선택사항)

### 주요 메트릭

- 에너지 사용량 추이
- AI 예측 정확도
- 시스템 성능 지표
- 사용자 활동 통계
- IoT 디바이스 상태

## 🔒 보안 고려사항

### 데이터 보호

- 사용자 개인정보 암호화
- IoT 디바이스 인증
- API 접근 제어
- 데이터 전송 암호화 (TLS)

### 개인정보 보호

- GDPR 준수
- 데이터 최소화 원칙
- 사용자 동의 관리
- 데이터 삭제 요청 처리

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 지원

문제가 있거나 질문이 있으시면 이슈를 생성해 주세요.

---

**참고**: 이 프로젝트는 기존 BEMS 시스템과 스마트 에너지 플랫폼의 문제점을 해결하고, 가정용 사용자에게 최적화된 에너지 관리 솔루션을 제공하기 위해 개발되었습니다.
