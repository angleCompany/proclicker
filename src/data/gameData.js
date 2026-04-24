// 코딩 마스터: 프로그래머 키우기 - 게임 데이터 (밸런스 정밀 조정 버전)

// 칭호 임계치 대폭 상향 (최종 단계 도달을 매우 어렵게 설정)
// 칭호 및 캐릭터 진화 시스템 (21단계 세분화)
export const titles = [
    // [Tier 0: Beginner Base - 입문자 계층 (1~10단계)] (픽셀 아트 스타일)
    { minPower: 0, title: '타자 치는 원숭이', icon: '🐵', image: 'https://api.dicebear.com/8.x/pixel-art/svg?seed=b1&backgroundColor=fcd5ce', tier: 0, hue: 0, scale: 1.0 },
    { minPower: 50, title: '코딩 입문자', icon: '🐣', image: 'https://api.dicebear.com/8.x/pixel-art/svg?seed=b2&backgroundColor=b6e3f4', tier: 1, hue: 0, scale: 1.01 },
    { minPower: 200, title: 'Hello World 정복자', icon: '📜', image: 'https://api.dicebear.com/8.x/pixel-art/svg?seed=b3&backgroundColor=c0aede', tier: 2, hue: 0, scale: 1.02, accessory: '✨' },
    { minPower: 500, title: '세미콜론(;) 판별사', icon: '👀', image: 'https://api.dicebear.com/8.x/pixel-art/svg?seed=b4&backgroundColor=d1d4f9', tier: 3, hue: 0, scale: 1.03 },
    { minPower: 1500, title: '구글링 숙련자', icon: '🔍', image: 'https://api.dicebear.com/8.x/pixel-art/svg?seed=b5&backgroundColor=b6e3f4', tier: 4, hue: 0, scale: 1.04, accessory: '📚' },
    { minPower: 3000, title: '스택오버플로우 눈팅족', icon: '👀', image: 'https://api.dicebear.com/8.x/pixel-art/svg?seed=b6&backgroundColor=ffd5dc', tier: 5, hue: 0, scale: 1.05 },
    { minPower: 7000, title: '견습 개발자', icon: '🐥', image: 'https://api.dicebear.com/8.x/pixel-art/svg?seed=b7&backgroundColor=ffdfbf', tier: 6, hue: 0, scale: 1.06, accessory: '🛠️' },
    { minPower: 15000, title: '에러 메시지 번역기', icon: '🗣️', image: 'https://api.dicebear.com/8.x/pixel-art/svg?seed=b8&backgroundColor=d1d4f9', tier: 7, hue: 0, scale: 1.07 },
    { minPower: 35000, title: '무한 루프 탈출자', icon: '🏃', image: 'https://api.dicebear.com/8.x/pixel-art/svg?seed=b9&backgroundColor=c0aede', tier: 8, hue: 0, scale: 1.08 },
    { minPower: 80000, title: '버그와 사투하는 자', icon: '🏹', image: 'https://api.dicebear.com/8.x/pixel-art/svg?seed=b10&backgroundColor=fcd5ce', tier: 9, hue: 0, scale: 1.09, accessory: '🦟' },

    // [Tier 1: Junior Base - 성장기 주니어 계층 (11~20단계)] (사람 아바타 스타일)
    { minPower: 150000, title: '주니어 개발자', icon: '👨‍💻', image: 'https://api.dicebear.com/8.x/avataaars/svg?seed=j1&backgroundColor=c0aede', tier: 10, hue: 0, scale: 1.1, aura: 'small' },
    { minPower: 300000, title: 'ChatGPT 의존자', icon: '🤖', image: 'https://api.dicebear.com/8.x/avataaars/svg?seed=j2&backgroundColor=b6e3f4', tier: 11, hue: 0, scale: 1.11, aura: 'small' },
    { minPower: 700000, title: '코드 복붙러(Ctrl+V)', icon: '📋', image: 'https://api.dicebear.com/8.x/avataaars/svg?seed=j3&backgroundColor=ffd5dc', tier: 12, hue: 0, scale: 1.12, aura: 'small' },
    { minPower: 1500000, title: '스택오버플로우 답변자', icon: '🙋', image: 'https://api.dicebear.com/8.x/avataaars/svg?seed=j4&backgroundColor=ffdfbf', tier: 13, hue: 0, scale: 1.13, aura: 'small', accessory: '⭐' },
    { minPower: 3000000, title: '주석 성애자', icon: '📝', image: 'https://api.dicebear.com/8.x/avataaars/svg?seed=j5&backgroundColor=d1d4f9', tier: 14, hue: 0, scale: 1.14, aura: 'small' },
    { minPower: 7000000, title: '클린코드 전도사', icon: '🧹', image: 'https://api.dicebear.com/8.x/avataaars/svg?seed=j6&backgroundColor=c0aede', tier: 15, hue: 0, scale: 1.15, aura: 'small', accessory: '💎' },
    { minPower: 15000000, title: '리팩토링 장인', icon: '🛠️', image: 'https://api.dicebear.com/8.x/avataaars/svg?seed=j7&backgroundColor=fcd5ce', tier: 16, hue: 0, scale: 1.16, aura: 'medium', accessory: '⚡' },
    { minPower: 35000000, title: '밤샘 코더', icon: '☕', image: 'https://api.dicebear.com/8.x/avataaars/svg?seed=j8&backgroundColor=b6e3f4', tier: 17, hue: 0, scale: 1.17, aura: 'medium' },
    { minPower: 80000000, title: '중급 개발자', icon: '💪', image: 'https://api.dicebear.com/8.x/avataaars/svg?seed=j9&backgroundColor=ffd5dc', tier: 18, hue: 0, scale: 1.18, aura: 'medium', accessory: '🔥' },
    { minPower: 180000000, title: '깃허브 잔디농부', icon: '🌱', image: 'https://api.dicebear.com/8.x/avataaars/svg?seed=j10&backgroundColor=d1d4f9', tier: 19, hue: 0, scale: 1.19, aura: 'medium' },

    // [Tier 2: Elite - 고수 계층 (21~28단계)] (로봇/사이보그 스타일)
    { minPower: 400000000, title: '풀스택 마스터', icon: '🥞', image: 'https://api.dicebear.com/8.x/bottts/svg?seed=e1&backgroundColor=b6e3f4', tier: 20, hue: 0, scale: 1.2, aura: 'medium' },
    { minPower: 1e9, title: '아키텍처 설계자', icon: '🏗️', image: 'https://api.dicebear.com/8.x/bottts/svg?seed=e2&backgroundColor=c0aede', tier: 21, hue: 0, scale: 1.22, aura: 'medium', accessory: '📐' },
    { minPower: 2.5e9, title: '시니어 개발자', icon: '🔥', image: 'https://api.dicebear.com/8.x/bottts/svg?seed=e3&backgroundColor=ffdfbf', tier: 22, hue: 0, scale: 1.24, aura: 'large', accessory: '👔' },
    { minPower: 6e9, title: '기술 면접관', icon: '📝', image: 'https://api.dicebear.com/8.x/bottts/svg?seed=e4&backgroundColor=ffd5dc', tier: 23, hue: 0, scale: 1.26, aura: 'large', accessory: '🎤' },
    { minPower: 1.5e10, title: '성능 최적화 깎는 노인', icon: '⏱️', image: 'https://api.dicebear.com/8.x/bottts/svg?seed=e5&backgroundColor=d1d4f9', tier: 24, hue: 0, scale: 1.27, aura: 'large' },
    { minPower: 4e10, title: '테크 리드', icon: '⚡', image: 'https://api.dicebear.com/8.x/bottts/svg?seed=e6&backgroundColor=fcd5ce', tier: 25, hue: 0, scale: 1.28, aura: 'epic', accessory: '👑' },
    { minPower: 1e11, title: '데브옵스 사령관', icon: '🚀', image: 'https://api.dicebear.com/8.x/bottts/svg?seed=e7&backgroundColor=b6e3f4', tier: 26, hue: 0, scale: 1.29, aura: 'epic' },
    { minPower: 3e11, title: 'CTO', icon: '👑', image: 'https://api.dicebear.com/8.x/bottts/svg?seed=e8&backgroundColor=c0aede', tier: 27, hue: 0, scale: 1.3, aura: 'epic', accessory: '🌍' },

    // [Tier 3: God Base - 신화 수준 계층 (29~35단계)] (신비로운 기하학적 형태/링)
    { minPower: 1e12, title: '전설의 개발자', icon: '🌟', image: 'https://api.dicebear.com/8.x/rings/svg?seed=g1&backgroundColor=000000', tier: 28, hue: 0, scale: 1.35, aura: 'large', accessory: '🌌' },
    { minPower: 5e12, title: '오픈소스의 수호자', icon: '🛡️', image: 'https://api.dicebear.com/8.x/rings/svg?seed=g2&backgroundColor=1a1a2e', tier: 29, hue: 40, scale: 1.38, aura: 'infinite', accessory: '🦾' },
    { minPower: 2.5e13, title: 'AI를 가르치는 자', icon: '🧠', image: 'https://api.dicebear.com/8.x/rings/svg?seed=g3&backgroundColor=16213e', tier: 30, hue: 100, scale: 1.41, aura: 'infinite', accessory: '☄️' },
    { minPower: 1e14, title: '시스템 설계의 신', icon: '📐', image: 'https://api.dicebear.com/8.x/rings/svg?seed=g4&backgroundColor=0f3460', tier: 31, hue: 140, scale: 1.43, aura: 'infinite' },
    { minPower: 1e15, title: '코딩의 신', icon: '🏆', image: 'https://api.dicebear.com/8.x/rings/svg?seed=g5&backgroundColor=e94560', tier: 32, hue: 180, scale: 1.45, aura: 'infinite', accessory: '🛸' },
    { minPower: 1e18, title: '우주 웹 아키텍트', icon: '🌌', image: 'https://api.dicebear.com/8.x/rings/svg?seed=g6&backgroundColor=533483', tier: 33, hue: 280, scale: 1.47, aura: 'infinite', accessory: '🪐' },
    { minPower: 1e21, title: '디지털 창조주', icon: '✨', image: 'https://api.dicebear.com/8.x/rings/svg?seed=g7&backgroundColor=ff0055', tier: 34, hue: 340, scale: 1.5, aura: 'infinite', accessory: '☀️' },
];

// [마일스톤 설정] 특정 보유 개수 달성 시 부여되는 효율 배율
export const MILESTONES = [
    { count: 25, multiplier: 2 },
    { count: 50, multiplier: 4 },
    { count: 100, multiplier: 10 },
    { count: 200, multiplier: 25 },
    { count: 400, multiplier: 100 },
];

export function getMilestoneMultiplier(owned) {
    let mult = 1;
    for (const m of MILESTONES) {
        if (owned >= m.count) mult = m.multiplier;
        else break;
    }
    return mult;
}

export function formatNumber(num) {
    if (num >= 1e33) return (num / 1e33).toFixed(1) + 'Dc';
    if (num >= 1e30) return (num / 1e30).toFixed(1) + 'No';
    if (num >= 1e27) return (num / 1e27).toFixed(1) + 'Oc';
    if (num >= 1e24) return (num / 1e24).toFixed(1) + 'Sp';
    if (num >= 1e21) return (num / 1e21).toFixed(1) + 'Sx';
    if (num >= 1e18) return (num / 1e18).toFixed(1) + 'Qi';
    if (num >= 1e15) return (num / 1e15).toFixed(1) + 'Q';
    if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    if (num >= 1) return Math.floor(num).toString();
    return "0";
}

export function getItemCost(item, globalDiscount = 0) {
    // 가격 배율을 보유 개수에 따라 소폭 증가시켜 후반 급가속 방지
    const dynamicMultiplier = item.costMultiplier + (item.owned * 0.005);
    const baseCost = Math.floor(item.baseCost * Math.pow(dynamicMultiplier, item.owned));
    return Math.floor(baseCost * (1 - globalDiscount));
}

export function getCurrentTitle(totalPower) {
    let current = titles[0];
    for (const t of titles) {
        if (totalPower >= t.minPower) current = t;
        else break;
    }
    return current;
}

// 자동 성장 아이템 (15단계 확장)
export const autoItems = [
    { id: 'kb', name: '기계식 키보드', icon: '⌨️', description: '생산성 +1/s', baseCost: 15, costMultiplier: 1.25, effect: 1, owned: 0 },
    { id: 'mon', name: '듀얼 모니터', icon: '🖥️', description: '생산성 +8/s', baseCost: 150, costMultiplier: 1.26, effect: 8, owned: 0 },
    { id: 'pc', name: '고사양 PC', icon: '💻', description: '생산성 +45/s', baseCost: 1500, costMultiplier: 1.27, effect: 45, owned: 0 },
    { id: 'chair', name: '인체공학 의자', icon: '🪑', description: '생산성 +250/s', baseCost: 20000, costMultiplier: 1.28, effect: 250, owned: 0 },
    { id: 'blog', name: '기술 블로그', icon: '📰', description: '생산성 +1.2k/s', baseCost: 180000, costMultiplier: 1.3, effect: 1200, owned: 0 },
    { id: 'os', name: '오픈소스 참여', icon: '🌍', description: '생산성 +6.5k/s', baseCost: 2500000, costMultiplier: 1.32, effect: 6500, owned: 0 },
    { id: 'ai', name: 'AI 페어 프로그래머', icon: '🤖', description: '생산성 +40k/s', baseCost: 40000000, costMultiplier: 1.34, effect: 40000, owned: 0 },
    { id: 'quantum', name: '양자 컴퓨터', icon: '🛸', description: '생산성 +250k/s', baseCost: 1000000000, costMultiplier: 1.36, effect: 250000, owned: 0 },
    { id: 'galaxy', name: '은하계 서버팜', icon: '🪐', description: '생산성 +2.2M/s', baseCost: 50000000000, costMultiplier: 1.38, effect: 2200000, owned: 0 },
    { id: 'multiverse', name: '다중우주 연산 망', icon: '🌌', description: '생산성 +15M/s', baseCost: 1e12, costMultiplier: 1.4, effect: 15000000, owned: 0 },
    { id: 'brain', name: '양자 뇌 인터페이스', icon: '🧠', description: '생산성 +120M/s', baseCost: 25e12, costMultiplier: 1.42, effect: 120000000, owned: 0 },
    { id: 'atomic', name: '원자 단위 기계어', icon: '⚛️', description: '생산성 +850M/s', baseCost: 500e12, costMultiplier: 1.44, effect: 850000000, owned: 0 },
    { id: 'time', name: '시간 왜곡 최적화', icon: '⏳', description: '생산성 +6.2B/s', baseCost: 10e15, costMultiplier: 1.46, effect: 6200000000, owned: 0 },
    { id: 'bio', name: '생체 데이터 센터', icon: '🧬', description: '생산성 +45B/s', baseCost: 250e15, costMultiplier: 1.48, effect: 45000000000, owned: 0 },
    { id: 'trans', name: '초월적 알고리즘', icon: '💎', description: '생산성 +1T/s', baseCost: 1e21, costMultiplier: 1.5, effect: 1000000000000, owned: 0 },
];

// 클릭 성장 아이템 (10단계 확장)
export const clickItems = [
    { id: 'py', name: 'Python 마스터', icon: '🐍', description: '클릭 +1', baseCost: 25, costMultiplier: 1.25, effect: 1, owned: 0 },
    { id: 'js', name: 'React 딥하게', icon: '⚛️', description: '클릭 +12', baseCost: 350, costMultiplier: 1.26, effect: 12, owned: 0 },
    { id: 'algo', name: '알고리즘 정복', icon: '🧠', description: '클릭 +80', baseCost: 4000, costMultiplier: 1.28, effect: 80, owned: 0 },
    { id: 'arch', name: '클린 아키텍처', icon: '🏗️', description: '클릭 +650', baseCost: 60000, costMultiplier: 1.3, effect: 650, owned: 0 },
    { id: 'multi', name: '멀티 스레딩', icon: '🧵', description: '클릭 +4k', baseCost: 1000000, costMultiplier: 1.32, effect: 4000, owned: 0 },
    { id: 'comp', name: '컴파일러 설계', icon: '⚙️', description: '클릭 +25k', baseCost: 200000000, costMultiplier: 1.35, effect: 25000, owned: 0 },
    { id: 'contract', name: '스마트 계약', icon: '🔗', description: '클릭 +180k', baseCost: 1.5e10, costMultiplier: 1.38, effect: 180000, owned: 0 },
    { id: 'serverless', name: '서버리스 아키텍처', icon: '☁️', description: '클릭 +1.2M', baseCost: 500e9, costMultiplier: 1.4, effect: 1200000, owned: 0 },
    { id: 'genetic', name: '유전자 프로그래밍', icon: '🧬', description: '클릭 +15M', baseCost: 10e12, costMultiplier: 1.45, effect: 15000000, owned: 0 },
    { id: 'inter', name: '차원간 전송', icon: '🌌', description: '클릭 +250M', baseCost: 1e18, costMultiplier: 1.5, effect: 250000000, owned: 0 },
];

// 스페셜 아이템 (미니게임 및 강화)
export const specialItems = [
    { id: 'crit_1', name: '집중의 눈', icon: '👁️', description: '크리티컬 확률 +5% (최대 80%)', baseCost: 5000, costMultiplier: 2.5, effect: 0.05, type: 'critical_prob', owned: 0 },
    { id: 'crit_2', name: '예리한 통찰', icon: '✨', description: '크리티컬 위력 +2배', baseCost: 25000, costMultiplier: 3.5, effect: 2.0, type: 'critical_power', owned: 0 },
    { id: 'cicd', name: 'CI/CD 파이프라인', icon: '🔄', description: '모든 자동 성장 효율 +20%', baseCost: 100000, costMultiplier: 5.0, effect: 0.2, type: 'auto_synergy', owned: 0 },
    { id: 'refactor', name: '레거시 리팩토링', icon: '🧹', description: '모든 아이템 가격 -5% 영구 할인', baseCost: 500000, costMultiplier: 10.0, effect: 0.05, type: 'global_discount', owned: 0 },
    { id: 'deep_learn', name: '딥러닝 엔진', icon: '🧠', description: '클릭 당 초당 생산량의 1% 만큼 추가 획득', baseCost: 2e9, costMultiplier: 50.0, effect: 0.01, type: 'click_synergy', owned: 0 },
    { id: 'bug_bounty', name: '버그 바운티', icon: '💰', description: '클릭 시 1% 확률로 10초치 생산량 즉시 획득', baseCost: 50e9, costMultiplier: 100.0, effect: 10, type: 'lucky_click', owned: 0 },
    { id: 'legend_kb', name: '전설의 키보드', icon: '🌟', description: '클릭 효율 x10배 영구 증가 (중첩 가능)', baseCost: 1e12, costMultiplier: 100, effect: 10, type: 'permanent_mult', owned: 0 },
    { id: 'gamble', name: '야근 디버깅 (도박)', icon: '🎲', description: '현재 파워의 20%를 걸고 30% 확률로 2.5배 획득 (실패 시 날림)', baseCost: 100, costMultiplier: 1.0, effect: 0, type: 'gamble', maxOwned: 9999, owned: 0 },
];

// 업적 시스템 데이터 (새로 추가)
export const achievementsList = [
  // ── CLICK (5) ──
  {
    id: 'click_master', name: '클릭 마스터', icon: '🖱️', category: 'click', triggerOn: ['CLICK'],
    description: '코드를 100번 클릭하세요',
    condition: s => s.stats.totalClicks >= 100,
    progressFn: s => ({ current: s.stats.totalClicks, target: 100 }),
    rewardDesc: '클릭 효율 +5%',
    applyReward: s => ({ ...s, clickMultiplier: (s.clickMultiplier || 1) + 0.05 })
  },
  {
    id: 'click_addict', name: '클릭 중독자', icon: '⌨️', category: 'click', triggerOn: ['CLICK'],
    description: '코드를 1,000번 클릭하세요',
    condition: s => s.stats.totalClicks >= 1000,
    progressFn: s => ({ current: s.stats.totalClicks, target: 1000 }),
    rewardDesc: '클릭 효율 +10%',
    applyReward: s => ({ ...s, clickMultiplier: (s.clickMultiplier || 1) + 0.10 })
  },
  {
    id: 'click_pro', name: '프로 클리커', icon: '⚡', category: 'click', triggerOn: ['CLICK'],
    description: '코드를 10,000번 클릭하세요',
    condition: s => s.stats.totalClicks >= 10000,
    progressFn: s => ({ current: s.stats.totalClicks, target: 10000 }),
    rewardDesc: '크리티컬 확률 +5%',
    applyReward: s => ({ ...s, critProb: Math.min((s.critProb || 0.05) + 0.05, 0.8) })
  },
  {
    id: 'click_legend', name: '클릭의 전설', icon: '🌟', category: 'click', triggerOn: ['CLICK'],
    description: '코드를 100,000번 클릭하세요',
    condition: s => s.stats.totalClicks >= 100000,
    progressFn: s => ({ current: s.stats.totalClicks, target: 100000 }),
    rewardDesc: '크리티컬 데미지 +50%',
    applyReward: s => ({ ...s, critMult: (s.critMult || 2) + 0.5 })
  },
  {
    id: 'click_god', name: '클릭의 신', icon: '🌌', category: 'click', triggerOn: ['CLICK'],
    description: '코드를 1,000,000번 클릭하세요',
    condition: s => s.stats.totalClicks >= 1000000,
    progressFn: s => ({ current: s.stats.totalClicks, target: 1000000 }),
    rewardDesc: '클릭 효율 +50%',
    applyReward: s => ({ ...s, clickMultiplier: (s.clickMultiplier || 1) + 0.5 })
  },

  // ── POWER (6) ──
  {
    id: 'millionaire', name: '백만장자', icon: '💰', category: 'power', triggerOn: ['CLICK', 'TICK'],
    description: '누적 코딩력 100만 달성',
    condition: s => s.totalCodingPower >= 1e6,
    progressFn: s => ({ current: s.totalCodingPower, target: 1000000 }),
    rewardDesc: '자동 효율 +10%',
    applyReward: s => ({ ...s, autoMultiplier: (s.autoMultiplier || 1) + 0.10 })
  },
  {
    id: 'billionaire', name: '억만장자', icon: '💎', category: 'power', triggerOn: ['CLICK', 'TICK'],
    description: '누적 코딩력 10억 달성',
    condition: s => s.totalCodingPower >= 1e9,
    progressFn: s => ({ current: s.totalCodingPower, target: 1000000000 }),
    rewardDesc: '자동 효율 +20%',
    applyReward: s => ({ ...s, autoMultiplier: (s.autoMultiplier || 1) + 0.2 })
  },
  {
    id: 'trillionaire', name: '조만장자', icon: '🚀', category: 'power', triggerOn: ['CLICK', 'TICK'],
    description: '누적 코딩력 1조 달성',
    condition: s => s.totalCodingPower >= 1e12,
    progressFn: s => ({ current: s.totalCodingPower, target: 1000000000000 }),
    rewardDesc: '자동 효율 +30%',
    applyReward: s => ({ ...s, autoMultiplier: (s.autoMultiplier || 1) + 0.3 })
  },
  {
    id: 'quadrillionaire', name: '경만장자', icon: '👑', category: 'power', triggerOn: ['CLICK', 'TICK'],
    description: '누적 코딩력 1경 달성',
    condition: s => s.totalCodingPower >= 1e15,
    progressFn: s => ({ current: s.totalCodingPower, target: 1e15 }),
    rewardDesc: '크리티컬 확률 +5%',
    applyReward: s => ({ ...s, critProb: Math.min((s.critProb || 0.05) + 0.05, 0.8) })
  },
  {
    id: 'quintillionaire', name: '해 단위 코더', icon: '✨', category: 'power', triggerOn: ['CLICK', 'TICK'],
    description: '누적 코딩력 1해 달성',
    condition: s => s.totalCodingPower >= 1e18,
    progressFn: s => ({ current: s.totalCodingPower, target: 1e18 }),
    rewardDesc: '클릭 효율 +50%',
    applyReward: s => ({ ...s, clickMultiplier: (s.clickMultiplier || 1) + 0.5 })
  },
  {
    id: 'power_right_now', name: '지금 이 순간', icon: '💡', category: 'power', triggerOn: ['CLICK', 'TICK'],
    description: '현재 코딩력 10억 보유',
    condition: s => s.codingPower >= 1e9,
    progressFn: s => ({ current: s.codingPower, target: 1e9 }),
    rewardDesc: '자동 효율 +15%',
    applyReward: s => ({ ...s, autoMultiplier: (s.autoMultiplier || 1) + 0.15 })
  },

  // ── SHOP (4) ──
  {
    id: 'shopaholic', name: '쇼핑홀릭', icon: '🛒', category: 'shop', triggerOn: ['BUY'],
    description: '아이템을 50개 구매하세요',
    condition: s => s.stats.totalItemsBought >= 50,
    progressFn: s => ({ current: s.stats.totalItemsBought, target: 50 }),
    rewardDesc: '자동 효율 +15%',
    applyReward: s => ({ ...s, autoMultiplier: (s.autoMultiplier || 1) + 0.15 })
  },
  {
    id: 'shop_addict', name: '쇼핑 중독', icon: '📦', category: 'shop', triggerOn: ['BUY'],
    description: '아이템을 총 100개 구매하세요',
    condition: s => s.stats.totalItemsBought >= 100,
    progressFn: s => ({ current: s.stats.totalItemsBought, target: 100 }),
    rewardDesc: '가격 할인 +3%',
    applyReward: s => ({ ...s, globalDiscount: Math.min((s.globalDiscount || 0) + 0.03, 0.5) })
  },
  {
    id: 'shop_king', name: '쇼핑의 왕', icon: '🏪', category: 'shop', triggerOn: ['BUY'],
    description: '아이템을 총 200개 구매하세요',
    condition: s => s.stats.totalItemsBought >= 200,
    progressFn: s => ({ current: s.stats.totalItemsBought, target: 200 }),
    rewardDesc: '가격 할인 +3%',
    applyReward: s => ({ ...s, globalDiscount: Math.min((s.globalDiscount || 0) + 0.03, 0.5) })
  },
  {
    id: 'shop_god', name: '소비의 신', icon: '💸', category: 'shop', triggerOn: ['BUY'],
    description: '아이템을 총 500개 구매하세요',
    condition: s => s.stats.totalItemsBought >= 500,
    progressFn: s => ({ current: s.stats.totalItemsBought, target: 500 }),
    rewardDesc: '자동 시너지 +10%',
    applyReward: s => ({ ...s, autoSynergy: (s.autoSynergy || 1) + 0.1 })
  },

  // ── GAMBLE (4) ──
  {
    id: 'gambler', name: '타짜', icon: '🎲', category: 'gamble', triggerOn: ['BUY'],
    description: '도박에서 10번 승리하세요',
    condition: s => s.stats.gambleSuccess >= 10,
    progressFn: s => ({ current: s.stats.gambleSuccess || 0, target: 10 }),
    rewardDesc: '클릭 효율 +10%',
    applyReward: s => ({ ...s, clickMultiplier: (s.clickMultiplier || 1) + 0.10 })
  },
  {
    id: 'gambler_pro', name: '타짜 프로', icon: '🃏', category: 'gamble', triggerOn: ['BUY'],
    description: '도박에서 50번 승리하세요',
    condition: s => s.stats.gambleSuccess >= 50,
    progressFn: s => ({ current: s.stats.gambleSuccess || 0, target: 50 }),
    rewardDesc: '크리티컬 확률 +5%',
    applyReward: s => ({ ...s, critProb: Math.min((s.critProb || 0.05) + 0.05, 0.8) })
  },
  {
    id: 'gambler_legend', name: '타짜 전설', icon: '🎰', category: 'gamble', triggerOn: ['BUY'],
    description: '도박에서 100번 승리하세요',
    condition: s => s.stats.gambleSuccess >= 100,
    progressFn: s => ({ current: s.stats.gambleSuccess || 0, target: 100 }),
    rewardDesc: '크리티컬 데미지 +100%',
    applyReward: s => ({ ...s, critMult: (s.critMult || 2) + 1.0 })
  },
  {
    id: 'gambler_god', name: '운의 신', icon: '🌠', category: 'gamble', triggerOn: ['BUY'],
    description: '도박에서 200번 승리하세요',
    condition: s => s.stats.gambleSuccess >= 200,
    progressFn: s => ({ current: s.stats.gambleSuccess || 0, target: 200 }),
    rewardDesc: '자동 효율 +30%',
    applyReward: s => ({ ...s, autoMultiplier: (s.autoMultiplier || 1) + 0.3 })
  },

  // ── HACKATHON (4) ──
  {
    id: 'hackathon_winner', name: '해커톤 우승자', icon: '🏆', category: 'hackathon', triggerOn: ['TICK'],
    description: '해커톤에서 버그 20마리 이상 포획',
    condition: s => (s.stats.hackathonWins || 0) >= 1,
    progressFn: s => ({ current: s.stats.hackathonWins || 0, target: 1 }),
    rewardDesc: '클릭 +5%, 자동 +5%',
    applyReward: s => ({ ...s, clickMultiplier: (s.clickMultiplier || 1) + 0.05, autoMultiplier: (s.autoMultiplier || 1) + 0.05 })
  },
  {
    id: 'hackathon_pro', name: '해커톤 프로', icon: '🥇', category: 'hackathon', triggerOn: ['TICK'],
    description: '해커톤에서 5번 우승하세요',
    condition: s => (s.stats.hackathonWins || 0) >= 5,
    progressFn: s => ({ current: s.stats.hackathonWins || 0, target: 5 }),
    rewardDesc: '자동 효율 +20%',
    applyReward: s => ({ ...s, autoMultiplier: (s.autoMultiplier || 1) + 0.2 })
  },
  {
    id: 'hackathon_legend', name: '해커톤 전설', icon: '👾', category: 'hackathon', triggerOn: ['TICK'],
    description: '해커톤에서 20번 우승하세요',
    condition: s => (s.stats.hackathonWins || 0) >= 20,
    progressFn: s => ({ current: s.stats.hackathonWins || 0, target: 20 }),
    rewardDesc: '크리티컬 데미지 +100%',
    applyReward: s => ({ ...s, critMult: (s.critMult || 2) + 1.0 })
  },
  {
    id: 'bug_hunter', name: '버그 헌터', icon: '🐛', category: 'hackathon', triggerOn: ['HACKATHON'],
    description: '해커톤에서 버그를 누적 100마리 이상 잡으세요',
    condition: s => (s.stats.totalHackathonBugs || 0) >= 100,
    progressFn: s => ({ current: s.stats.totalHackathonBugs || 0, target: 100 }),
    rewardDesc: '크리티컬 확률 +5%',
    applyReward: s => ({ ...s, critProb: Math.min((s.critProb || 0.05) + 0.05, 0.8) })
  },

  // ── REBIRTH (3) ──
  {
    id: 'rebirth_1', name: '첫 번째 각성', icon: '🔄', category: 'rebirth', triggerOn: ['REBIRTH'],
    description: '첫 번째 환생을 완료하세요',
    condition: s => (s.rebirthCount || 0) >= 1,
    progressFn: s => ({ current: s.rebirthCount || 0, target: 1 }),
    rewardDesc: '자동 효율 +30%',
    applyReward: s => ({ ...s, autoMultiplier: (s.autoMultiplier || 1) + 0.3 })
  },
  {
    id: 'rebirth_3', name: '연속 각성자', icon: '♾️', category: 'rebirth', triggerOn: ['REBIRTH'],
    description: '3번 환생하세요',
    condition: s => (s.rebirthCount || 0) >= 3,
    progressFn: s => ({ current: s.rebirthCount || 0, target: 3 }),
    rewardDesc: '가격 할인 +5%',
    applyReward: s => ({ ...s, globalDiscount: Math.min((s.globalDiscount || 0) + 0.05, 0.5) })
  },
  {
    id: 'rebirth_5', name: '불멸의 코더', icon: '💫', category: 'rebirth', triggerOn: ['REBIRTH'],
    description: '5번 환생하세요',
    condition: s => (s.rebirthCount || 0) >= 5,
    progressFn: s => ({ current: s.rebirthCount || 0, target: 5 }),
    rewardDesc: '클릭 효율 +50%',
    applyReward: s => ({ ...s, clickMultiplier: (s.clickMultiplier || 1) + 0.5 })
  },

  // ── CREW (2) ──
  {
    id: 'crew_first', name: '첫 동료', icon: '👤', category: 'crew', triggerOn: ['SCOUT'],
    description: '크루를 처음 영입하세요',
    condition: s => (s.inventory || []).length >= 1,
    progressFn: s => ({ current: s.inventory?.length || 0, target: 1 }),
    rewardDesc: '클릭 효율 +10%',
    applyReward: s => ({ ...s, clickMultiplier: (s.clickMultiplier || 1) + 0.1 })
  },
  {
    id: 'crew_team', name: '드림팀 결성', icon: '👥', category: 'crew', triggerOn: ['SCOUT'],
    description: '크루를 5명 이상 보유하세요',
    condition: s => (s.inventory || []).length >= 5,
    progressFn: s => ({ current: s.inventory?.length || 0, target: 5 }),
    rewardDesc: '자동 효율 +20%',
    applyReward: s => ({ ...s, autoMultiplier: (s.autoMultiplier || 1) + 0.2 })
  },

  // ── COMBO (3) ──
  {
    id: 'combo_20', name: '콤보 초보', icon: '💥', category: 'combo', triggerOn: ['CLICK'],
    description: '20 콤보를 달성하세요',
    condition: s => (s.maxCombo || 0) >= 20,
    progressFn: s => ({ current: s.maxCombo || 0, target: 20 }),
    rewardDesc: '클릭 효율 +20%',
    applyReward: s => ({ ...s, clickMultiplier: (s.clickMultiplier || 1) + 0.2 })
  },
  {
    id: 'combo_50', name: '콤보 마스터', icon: '🔥', category: 'combo', triggerOn: ['CLICK'],
    description: '50 콤보를 달성하세요',
    condition: s => (s.maxCombo || 0) >= 50,
    progressFn: s => ({ current: s.maxCombo || 0, target: 50 }),
    rewardDesc: '크리티컬 확률 +5%',
    applyReward: s => ({ ...s, critProb: Math.min((s.critProb || 0.05) + 0.05, 0.8) })
  },
  {
    id: 'combo_100', name: '콤보의 신', icon: '🌊', category: 'combo', triggerOn: ['CLICK'],
    description: '100 콤보를 달성하세요',
    condition: s => (s.maxCombo || 0) >= 100,
    progressFn: s => ({ current: s.maxCombo || 0, target: 100 }),
    rewardDesc: '크리티컬 데미지 +50%',
    applyReward: s => ({ ...s, critMult: (s.critMult || 2) + 0.5 })
  },
];

export const QUEST_POOL = [
  { id: 'q_clicks_50', title: '손가락 운동', description: '오늘 코드를 50번 클릭하세요', type: 'clicks', target: 50, reward: { type: 'production_boost', minutes: 30 }, rewardDesc: '30분치 초당 생산량 즉시 획득', icon: '🖱️' },
  { id: 'q_clicks_200', title: '클릭 장인', description: '오늘 코드를 200번 클릭하세요', type: 'clicks', target: 200, reward: { type: 'production_boost', minutes: 30 }, rewardDesc: '30분치 초당 생산량 즉시 획득', icon: '⚡' },
  { id: 'q_items_5', title: '장비 구매', description: '오늘 아이템을 5개 구매하세요', type: 'itemsBought', target: 5, reward: { type: 'production_boost', minutes: 30 }, rewardDesc: '30분치 초당 생산량 즉시 획득', icon: '🛍️' },
  { id: 'q_items_20', title: '쇼핑 중독', description: '오늘 아이템을 20개 구매하세요', type: 'itemsBought', target: 20, reward: { type: 'click_mult_buff', value: 0.05 }, rewardDesc: '영구 클릭 효율 +5%', icon: '🛒' },
  { id: 'q_gamble_3', title: '오늘의 운', description: '야근 디버깅(도박)을 3번 성공하세요', type: 'gambleSuccess', target: 3, reward: { type: 'production_boost', minutes: 30 }, rewardDesc: '30분치 초당 생산량 즉시 획득', icon: '🎲' },
  { id: 'q_gamble_10', title: '타짜의 하루', description: '야근 디버깅(도박)을 10번 성공하세요', type: 'gambleSuccess', target: 10, reward: { type: 'auto_mult_buff', value: 0.05 }, rewardDesc: '영구 자동 생산 효율 +5%', icon: '🃏' },
  { id: 'q_hackathon_bugs', title: '해커톤 참가', description: '해커톤에서 버그를 1마리 이상 잡으세요', type: 'hackathonBugs', target: 1, reward: { type: 'production_boost', minutes: 30 }, rewardDesc: '30분치 초당 생산량 즉시 획득', icon: '🐛' },
  { id: 'q_hackathon_win', title: '해커톤 챔피언', description: '해커톤에서 20마리 이상 잡아 우승하세요', type: 'hackathonWins', target: 1, reward: { type: 'click_mult_buff', value: 0.05 }, rewardDesc: '영구 클릭 효율 +5%', icon: '🏆' },
  { id: 'q_power_earn', title: '열심히 코딩', description: '오늘 코딩력을 10,000 이상 획득하세요', type: 'powerEarned', target: 10000, reward: { type: 'production_boost', minutes: 30 }, rewardDesc: '30분치 초당 생산량 즉시 획득', icon: '💪' },
  { id: 'q_power_earn_big', title: '코딩 마라톤', description: '오늘 코딩력을 1,000,000 이상 획득하세요', type: 'powerEarned', target: 1000000, reward: { type: 'auto_mult_buff', value: 0.05 }, rewardDesc: '영구 자동 생산 효율 +5%', icon: '🚀' },
];

export function getKSTDateString() {
  const now = new Date(Date.now() + 9 * 60 * 60 * 1000);
  return now.toISOString().slice(0, 10);
}

export function getKSTWeekString() {
    const now = new Date(Date.now() + 9 * 60 * 60 * 1000);
    const day = now.getUTCDay(); // 0=일, 1=월
    const mondayOffset = (day === 0 ? -6 : 1 - day);
    const monday = new Date(now);
    monday.setUTCDate(now.getUTCDate() + mondayOffset);
    return monday.toISOString().slice(0, 10);
}

export function pickWeeklyChallenge() {
    const weekStr = getKSTWeekString();
    const seed = parseInt(weekStr.replace(/-/g, ''), 10);
    let s = seed;
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const idx = (s >>> 0) % WEEKLY_CHALLENGE_POOL.length;
    return WEEKLY_CHALLENGE_POOL[idx];
}

function seededRandom(seed) {
  let s = seed;
  return function () {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

export function pickDailyQuests() {
  const todayStr = getKSTDateString();
  const daySeed = parseInt(todayStr.replace(/-/g, ''), 10);
  const rng = seededRandom(daySeed);
  const pool = [...QUEST_POOL];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, 3);
}

// 획득 가능한 스타트업 지분(Equity) 계산 (예: 10억 코딩력 당 1 지분 기준, 기하급수적으로 이폭이 커짐)
export function calculateEquity(totalCodingPower) {
    if (totalCodingPower < 1e9) return 0; // 10억 미만은 지분 없음
    // 10억으로 나눈 값의 제곱근 (성장 곡선 완화) + 10억 달성 기본 지분
    return Math.floor(Math.sqrt(totalCodingPower / 1e9));
}

// -------------------------------------------------------------
// 가챠(뽑기) 시스템: 크루(팀원) 데이터
export const crewList = [
    { id: 'crew_n1', name: '열정페이 인턴', grade: 'N', prob: 60, icon: '🧑‍🎓', effectDesc: '자동 생산 효율 +1%', effectType: 'auto_mult', baseEffect: 0.01 },
    { id: 'crew_r1', name: '마감일의 대리', grade: 'R', prob: 25, icon: '👨‍💼', effectDesc: '클릭 효율 +2%', effectType: 'click_mult', baseEffect: 0.02 },
    { id: 'crew_sr1', name: '고독한 팀장', grade: 'SR', prob: 10, icon: '🕵️', effectDesc: '상점 할인 +1%', effectType: 'discount', baseEffect: 0.01 },
    { id: 'crew_ssr1', name: '전설의 화이트해커', grade: 'SSR', prob: 4, icon: '🥷', effectDesc: '크리티컬 위력 +0.5배', effectType: 'crit_mult', baseEffect: 0.5 },
    { id: 'crew_ur1', name: '스티브 잡것', grade: 'UR', prob: 1, icon: '👑', effectDesc: '모든 생산량 +10%', effectType: 'all_mult', baseEffect: 0.1 }
];

// 가챠 비용 산정: 초반에는 고정비용, 후반에는 초당 생산량의 60초(1분)치로 스케일링
export function getGachaCost(state) {
    const baseCost = 10000; // 최소 1만 파워
    const scalingCost = Math.floor(state.perSecond * 60);
    return Math.max(baseCost, scalingCost);
}
// -------------------------------------------------------------

export const WEEKLY_CHALLENGE_POOL = [
    {
        id: 'wc_clicks',
        title: '클릭왕의 주간',
        description: '이번 주에 코드를 10,000번 클릭하세요',
        type: 'clicks',
        target: 10000,
        reward: { type: 'production_boost', minutes: 120 },
        rewardDesc: '120분치 초당 생산량 즉시 획득',
        icon: '⚡'
    },
    {
        id: 'wc_hackathon',
        title: '해커톤 챔피언 위크',
        description: '이번 주에 해커톤을 5번 우승하세요',
        type: 'hackathonWins',
        target: 5,
        reward: { type: 'auto_mult_buff', value: 0.1 },
        rewardDesc: '영구 자동 생산 효율 +10%',
        icon: '🏆'
    },
    {
        id: 'wc_gamble',
        title: '타짜의 주간',
        description: '이번 주에 도박을 50번 성공하세요',
        type: 'gambleSuccess',
        target: 50,
        reward: { type: 'click_mult_buff', value: 0.1 },
        rewardDesc: '영구 클릭 효율 +10%',
        icon: '🎰'
    },
    {
        id: 'wc_shop',
        title: '쇼핑 마니아 위크',
        description: '이번 주에 아이템을 100개 구매하세요',
        type: 'itemsBought',
        target: 100,
        reward: { type: 'production_boost', minutes: 120 },
        rewardDesc: '120분치 초당 생산량 즉시 획득',
        icon: '🛒'
    },
    {
        id: 'wc_power',
        title: '코딩 마라톤 위크',
        description: '이번 주에 코딩력을 1억 이상 획득하세요',
        type: 'powerEarned',
        target: 100000000,
        reward: { type: 'auto_mult_buff', value: 0.1 },
        rewardDesc: '영구 자동 생산 효율 +10%',
        icon: '💪'
    },
    {
        id: 'wc_combo',
        title: '콤보 전문가 위크',
        description: '이번 주에 최대 콤보 50 이상을 달성하세요',
        type: 'maxCombo',
        target: 50,
        reward: { type: 'click_mult_buff', value: 0.1 },
        rewardDesc: '영구 클릭 효율 +10%',
        icon: '🔥'
    },
];

export const initialGameState = {
    codingPower: 0,
    totalCodingPower: 0,
    perClick: 1,
    perSecond: 0,
    critProb: 0.05,
    critMult: 2.0,
    globalDiscount: 0,
    autoSynergy: 1.0,
    clickSynergy: 0,
    autoItems: autoItems.map(it => ({ ...it })),
    clickItems: clickItems.map(it => ({ ...it })),
    specialItems: specialItems.map(it => ({ ...it })),
    boosts: [],
    adRemoved: false,
    stats: {
        totalClicks: 0,
        totalItemsBought: 0,
        gambleSuccess: 0, // 도박 성공 횟수 추적
        hackathonWins: 0, // 해커톤 우승 횟수
        totalHackathonBugs: 0,
        startTime: Date.now(),
    },
    // 해커톤 전용 상태 필드
    hackathon: {
        isActive: false,       // 현재 진행 여부
        bugsCaught: 0,         // 잡은 버그 수
        timeLeft: 0,           // 남은 시간 (초)
    },
    comboCount: 0,
    comboEndTime: 0,
    maxCombo: 0,
    achievements: [], // 달성한 업적 ID 목록
    clickMultiplier: 1.0, // 업적용 클릭 보상 배율
    autoMultiplier: 1.0,  // 업적용 자동 보상 배율
    newAchievements: [], // 방금 달성한 업적(알림 팝업용, 랜더링 후 비워짐)
    // 환생(Prestige) 시스템 전용 필드
    equity: 0,           // 보유 지분량 (영구 패시브 보상에 사용)
    rebirthCount: 0,     // 환생 횟수
    // 가챠 시스템 전용 필드
    inventory: [],       // 영입한 크루 목록 [{ id, level }]
    dailyQuests: {
        date: '',
        quests: [],
        questDeltaBase: {
            totalClicks: 0,
            totalItemsBought: 0,
            gambleSuccess: 0,
            hackathonWins: 0,
            hackathonBugs: 0,
            powerEarned: 0,
        },
    },
    weeklyChallenge: {
        weekStr: '',
        challenge: null,
        current: 0,
        completed: false,
        claimed: false,
        challengeDeltaBase: {
            totalClicks: 0,
            totalItemsBought: 0,
            gambleSuccess: 0,
            hackathonWins: 0,
            maxCombo: 0,
            powerEarned: 0,
        },
    },
    _questResetNeeded: false,
};
