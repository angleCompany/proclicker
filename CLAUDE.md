# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # 개발 서버 실행 (localhost:5173)
npm run build    # 프로덕션 빌드 (dist/)
npm run preview  # 빌드 결과 미리보기
npm run lint     # ESLint 검사
```

테스트 프레임워크 없음. 개발 중 브라우저 콘솔에서 `window.gameState` / `window.gameDispatch`로 게임 상태 직접 조작 가능 (DEV 환경 한정).

## 아키텍처

**핵심 구조**: 모든 게임 상태는 `useGameState.js`의 단일 `useReducer`로 관리됨. 컴포넌트는 상태를 직접 변경하지 않고, 훅이 반환하는 액션 함수만 호출한다.

### 상태 흐름

```
App.jsx
  └─ useGameState() ──→ gameReducer(state, action) ──→ 새 state 반환
       │                   │
       │                   ├─ checkAchievements()  업적 자동 체크 및 보상 적용
       │                   ├─ updateQuestProgress() 일일 퀘스트 진행도 갱신
       │                   └─ updateWeeklyProgress() 주간 챌린지 진행도 갱신
       │
       └─ TICK 액션: setInterval 100ms 마다 자동 발사 (=초당 10회)
```

- `codingPower`: 현재 보유 파워 (소모됨)
- `totalCodingPower`: 누적 획득 파워 (칭호/업적 기준)
- `perSecond`: 자동 아이템 합산 초당 생산량
- `perClick`: 클릭당 획득량 (clickItems + permanent_mult 적용)

### 영구 배율 스택 구조

클릭 및 자동 효율에 여러 배율이 곱해짐:
- `boosts[]`: 시간제한 배율 부스트 (`endTime`으로 만료 관리)
- `clickMultiplier` / `autoMultiplier`: 업적·크루 영입으로 누적되는 영구 배율
- `equityMultiplier`: 환생 시 획득한 지분 1당 +2%
- `getMilestoneMultiplier(owned)`: 특정 개수(25/50/100/200/400) 도달 시 추가 배율

`boosts` 배열 내 `clickOnly: true` 항목은 자동 생산에 적용되지 않고, `critOverride` 항목은 크리티컬 확률/배율을 강제 오버라이드한다.

### 데이터 정의 (`src/data/gameData.js`)

- `autoItems`, `clickItems`, `specialItems`: 아이템 정의 및 초기 상태 (mutable 복사본 필요 없이 `initialGameState`에서 deep copy)
- `achievementsList`: 각 업적에 `condition(state)`, `applyReward(state)`, `triggerOn[]` 포함. `triggerOn`을 통해 불필요한 체크 생략.
- `crewList`: 가챠 확률(`prob`) 및 효과 타입 정의
- `QUEST_POOL` / `WEEKLY_CHALLENGE_POOL` / `DAILY_BONUS_TABLE`: 일일·주간·로그인 보너스 데이터
- `SAVE_KEY = 'coding_master_advanced_save_v4'`: localStorage 키

### 저장/로드

- 2초마다 전체 상태를 `localStorage`에 JSON 직렬화하여 저장
- 로드 시 오프라인 경과 시간 계산 (최대 8시간 캡), 일일 퀘스트·주간 챌린지·로그인 스트릭 자동 초기화
- 날짜는 KST 기준 (`getKSTDateString`, `getKSTWeekString`)

### 광고 시스템 (`src/services/adService.js`)

현재 시뮬레이션 모드. `showRewardedAd()`는 `window.dispatchEvent('SHOW_AD_MODAL')`로 UI에 광고 모달을 띄우고 Promise를 반환함. 실 연동 시 이 메서드만 교체. 쿨타임 5분.

### 환생 (Rebirth)

`REBIRTH` 액션: `initialGameState`로 초기화 후, 기존 업적 보상(`applyReward`)과 크루 효과를 모두 재적용한다. 지분(`equity`)과 업적 목록, 크루 인벤토리는 유지된다.

## 배포

Cloudflare Pages 기준. `npm run build` 후 `dist/` 디렉토리 배포.
