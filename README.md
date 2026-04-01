# 🎮 코딩 마스터: 프로그래머 키우기

개발의 길에 접어든 당신을 위한 방치형 클릭커 게임입니다.
마우스를 클릭하고 아이템을 구매하며 훌륭한 개발자로 성장하세요!

## 🚀 빠른 시작 (Getting Started)

### 요구 사항
* Node.js 버전에 종속적이지 않음 (Vite 호환 버전 권장)

### 설치 및 실행
```bash
# 1. 의존성 설치
npm install

# 2. 로컬 개발 서버 실행
npm run dev

# 3. 브라우저에서 접속
http://localhost:5173
```

## ✨ 주요 기능 (Features)

* **탭핑(클릭) 성장**: 화면 중앙의 귀여운 병아리(칭호 아이콘)와 "코딩하기" 버튼을 클릭하여 코딩력을 획득합니다.
* **업그레이드 상점**:
    * **자동 성장 (Auto)**: 기계식 키보드, 듀얼 모니터, 고사양 컴퓨터 등을 구매하여 1초당 획득하는 생산성을 올립니다.
    * **클릭 성장 (Click)**: 파이썬, 자바 등 특정 프로그래밍 언어나 알고리즘을 학습하여 1클릭당 획득량을 올립니다.
* **스페셜 아이템 및 부스터**:
    * **야근 커피**: 30분 동안 모든 코딩력 획득량을 2배로 증가시킵니다.
    * **CTO의 조언**: 10분 동안 획득량을 5배로 폭발시킵니다!
    * **전설의 키보드**: 1회 한정 영구 아이템으로, 기본 클릭 획득량을 10배로 만듭니다.
* **크루 영입 및 환생 시스템**:
    - **크루 영입 (가챠)**: 코딩력을 소모하여 다양한 크루(인턴~전설급)를 영입해 영구적인 버프를 얻습니다.
    - **환생 (Rebirth)**: 누적 코딩력을 지분(Equity)으로 변환하여 더 강력한 성장을 시작합니다.

* **칭호 및 업적 시스템**:
    - 누적 코딩력에 따른 칭호 진화 및 다양한 도전 과제를 통한 보상을 획득합니다.

* **자동 저장**: 2초마다 현재 진행 상황이 `localStorage`에 자동 저장됩니다.

## 🛠 기술 스택 (Tech Stack)

* **Frontend**: React (Vite)
* **상태 관리**: `useReducer`, `useEffect` (React Hooks) 기반 커스텀 상태 관리 (`useGameState.js`)
* **스타일링**: 순수 CSS3 (다크 모드, 네온 글로우 이펙트, 글래스모피즘 UI 지원)
* **배포**: Cloudflare Pages 최적화 (단일 `dist/` 빌드 호환)

## 📱 반응형 디자인

이 게임은 다양한 디바이스 환경을 지원합니다:
* **데스크탑/태블릿 (가로 폭 768px 이상)**: 쾌적한 플레이를 위한 2단 컬럼 레이아웃 (좌: 플레이 화면, 우: 상점 화면)
* **모바일 폰 (가로 폭 768px 미만)**: 엄지손가락 하나로 조작하기 쉬운 상하 단일 컬럼 레이아웃

## 📂 프로젝트 구조

```
clicker_game/
├── public/                 # 정적 에셋 (favicon 등)
├── src/
│   ├── components/         # UI 컴포넌트
│   │   ├── AchievementModal.jsx # 업적 목록 모달
│   │   ├── AchievementPopup.jsx # 업적 달성 알림
│   │   ├── AdModal.jsx     # 광고(부스터) 시청 모달
│   │   ├── BoostBar.jsx    # 활성 부스터 상태
│   │   ├── CodingArea.jsx  # 클릭 및 이펙트 처리
│   │   ├── CrewModal.jsx   # 크루 영입(가챠) 화면
│   │   ├── GachaReveal.jsx # 가챠 연출 오버레이
│   │   ├── Hackathon.jsx   # 해커톤 미니게임
│   │   ├── RebirthModal.jsx# 환생(Rebirth) 안내
│   │   ├── Shop.jsx        # 아이템 구매 및 업그레이드
│   │   └── StatsBar.jsx    # 상단 스탯 및 메뉴
│   ├── data/
│   │   └── gameData.js     # 데이터 및 유틸리티
│   ├── hooks/
│   │   ├── useGameState.js # 핵심 게임 로직 (Reducer)
│   │   └── useSound.js     # 효과음 처리
│   ├── services/
│   │   └── adService.js    # 광고(AdFit) 서비스 연동
│   ├── App.jsx             # 메인 앱 컴포넌트
│   ├── index.css           # 전역 스타일 및 디자인 시스템
│   └── main.jsx            # 엔트리 포인트
├── index.html              # HTML 템플릿
├── package.json            # npm 설정
└── vite.config.js          # Vite 설정
```

## 📜 라이선스
MIT License
