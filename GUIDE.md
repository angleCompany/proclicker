# 🚀 Antigravity IDE 작업 지침서

이 문서는 다른 컴퓨터(또는 새로운 환경)에서 본 프로젝트를 `git pull` 받아 **Antigravity IDE**로 원활하게 코딩을 이어서 하기 위한 가이드입니다.

## 1. 초기 셋업 (Git Clone & 설치)

새로운 컴퓨터에서 **Antigravity IDE**를 열고 내장된 터미널(Terminal)에서 아래 명령어들을 실행하세요.

```bash
# 1. 저장소 클론 (자신의 GitHub 계정에 맞게 URL 수정 가능)
git clone https://github.com/angleCompany/proclicker.git

# 2. 프로젝트 폴더로 이동
cd proclicker

# 3. 의존성 패키지 설치
npm install
```

## 2. 개발 서버 실행

Antigravity IDE의 터미널에서 아래 명령어로 로컬 개발 서버를 켭니다.

```bash
npm run dev
```

* 정상적으로 실행되면 터미널에 `http://localhost:5173/` (또는 5174 등) 주소가 표시됩니다.
* Antigravity IDE의 내장 브라우저 패널을 열어 해당 로컬 주소로 접속하면 실시간 프리뷰가 가능합니다. (코드 수정 시 HMR 기능으로 즉시 반영됩니다)

## 3. 핵심 파일 구조 안내 (어디를 수정해야 할까?)

Antigravity IDE의 파일 탐색기에서 다음 파일들을 주로 수정하게 됩니다.

| 주요 편집 타겟 | 파일 경로 | 설명 |
|---|---|---|
| **상태 관리** | `src/hooks/useGameState.js` | 게임의 데이터 갱신 로직, 가격 공식, 이벤트 등을 추가할 때 수정합니다. |
| **게임 데이터** | `src/data/gameData.js` | 신규 아이템, 칭호, 밸런스, 목표 수치 등을 추가/변경할 때 편집합니다. |
| **UI 및 레이아웃** | `src/App.jsx` | 새로운 컴포넌트(모달, 업적창 등)나 전체 화면 구조를 개편할 때 조립합니다. |
| **디자인 테마** | `src/index.css` | 컬러, 네온 이펙트, 여백, 애니메이션 효과를 정의합니다. |
| **개별 영역** | `src/components/*.jsx` | 상단 바, 코딩 중앙 화면, 상점, 광고 배너 컴포넌트입니다. |

## 4. 작업 완료 후 동기화 (Git Push)

작업을 마친 후 다른 컴퓨터에서도 이어서 할 수 있도록 변경 사항을 원격 저장소에 반영해야 합니다.

```bash
# 1. 변경된 모든 파일 스테이징
git add .

# 2. 변경 내용 설명과 함께 커밋
git commit -m "feat: 새로운 기능/UI 추가 설명"

# 3. GitHub 원격 저장소에 Push (Cloudflare Pages가 연결되어 있다면 자동 배포됨)
git push origin main
```

## 5. Antigravity IDE 꿀팁 💡

* **AI 보조 활용**: Antigravity Assistant에게 `"gameData.js에 'AI 페어 프로그래밍' 이라는 50만 포인트짜리 자동 아이템을 추가해줘"` 라고 요청하면 즉시 로직과 가격 공식을 계산하여 적용해 줍니다.
* **CSS 파일**: 테마를 바꾸고 싶다면 `index.css`의 최상단 `:root` 부분의 색상 변수(CSS Variables)만 바꿔도 전체적인 색감이 한 번에 일관성 있게 변경됩니다.
* **오류 복구**: 게임 상태를 너무 자주 만지다가 로컬 데이터가 꼬였다면 브라우저 화면의 **[초기화]** 버튼이나 우측 상단의 개발자 도구 활용을 추천합니다.
