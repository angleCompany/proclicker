// 코딩 마스터: 프로그래머 키우기 - 게임 데이터 (밸런스 정밀 조정 버전)

// 칭호 임계치 대폭 상향 (최종 단계 도달을 매우 어렵게 설정)
// 칭호 및 캐릭터 진화 시스템 (21단계 세분화)
export const titles = [
    // [Tier 0: Beginner Base - 입문자 계층]
    { minPower: 0, title: '코딩 입문자', icon: '🐣', image: '/characters/beginner.png', tier: 0, hue: 0, scale: 1.0 },
    { minPower: 100, title: 'Hello World 정복자', icon: '📜', image: '/characters/beginner.png', tier: 1, hue: 45, scale: 1.02, accessory: '✨' },
    { minPower: 1000, title: '구글링 숙련자', icon: '🔍', image: '/characters/beginner.png', tier: 2, hue: 100, scale: 1.04, accessory: '📚' },
    { minPower: 5000, title: '견습 개발자', icon: '🐥', image: '/characters/beginner.png', tier: 3, hue: 160, scale: 1.06, accessory: '🛠️' },
    { minPower: 20000, title: '버그와 사투하는 자', icon: '🏹', image: '/characters/beginner.png', tier: 4, hue: 210, scale: 1.08, accessory: '🦟' },

    // [Tier 1: Junior Base - 성장기 주니어 계층]
    { minPower: 100000, title: '주니어 개발자', icon: '👨‍💻', image: '/characters/junior.png', tier: 5, hue: 0, scale: 1.1, aura: 'small' },
    { minPower: 500000, title: '스택오버플로우 우수회원', icon: '🙋', image: '/characters/junior.png', tier: 6, hue: 40, scale: 1.12, aura: 'small', accessory: '⭐' },
    { minPower: 2000000, title: '클린코드 전도사', icon: '🧹', image: '/characters/junior.png', tier: 7, hue: 110, scale: 1.14, aura: 'small', accessory: '💎' },
    { minPower: 10000000, title: '리팩토링 장인', icon: '🛠️', image: '/characters/junior.png', tier: 8, hue: 180, scale: 1.16, aura: 'medium', accessory: '⚡' },
    { minPower: 50000000, title: '중급 개발자', icon: '💪', image: '/characters/junior.png', tier: 9, hue: 260, scale: 1.18, aura: 'medium', accessory: '🔥' },

    // [Tier 2: Elite - 고수 계층]
    { minPower: 2e8, title: '아키텍처 설계자', icon: '🏗️', image: '/characters/junior.png', tier: 10, hue: 320, scale: 1.2, aura: 'medium', accessory: '📐' },
    { minPower: 1e9, title: '시니어 개발자', icon: '🔥', image: '/characters/junior.png', tier: 11, hue: 0, scale: 1.22, aura: 'large', accessory: '👔' },
    { minPower: 5e9, title: '기술 면접관', icon: '📝', image: '/characters/junior.png', tier: 12, hue: 60, scale: 1.24, aura: 'large', accessory: '🎤' },
    { minPower: 2e10, title: '테크 리드', icon: '⚡', image: '/characters/junior.png', tier: 13, hue: 130, scale: 1.26, aura: 'epic', accessory: '👑' },
    { minPower: 1e11, title: 'CTO', icon: '👑', image: '/characters/junior.png', tier: 14, hue: 200, scale: 1.28, aura: 'epic', accessory: '🌍' },

    // [Tier 3: God Base - 신화 수준 계층]
    { minPower: 1e12, title: '전설의 개발자', icon: '🌟', image: '/characters/god.png', tier: 15, hue: 0, scale: 1.35, aura: 'large', accessory: '🌌' },
    { minPower: 1e13, title: '오픈소스의 수호자', icon: '🛡️', image: '/characters/god.png', tier: 16, hue: 40, scale: 1.38, aura: 'infinite', accessory: '🦾' },
    { minPower: 1e14, title: '시스템 설계의 신', icon: '🧠', image: '/characters/god.png', tier: 17, hue: 100, scale: 1.41, aura: 'infinite', accessory: '☄️' },
    { minPower: 1e15, title: '코딩의 신', icon: '🏆', image: '/characters/god.png', tier: 18, hue: 180, scale: 1.44, aura: 'infinite', accessory: '🛸' },
    { minPower: 1e18, title: '우주 웹 아키텍트', icon: '🌌', image: '/characters/god.png', tier: 19, hue: 280, scale: 1.47, aura: 'infinite', accessory: '🪐' },
    { minPower: 1e21, title: '디지털 창조주', icon: '✨', image: '/characters/god.png', tier: 20, hue: 340, scale: 1.5, aura: 'infinite', accessory: '☀️' },
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

// 스페셜 아이템 (2세대 강화)
export const specialItems = [
    { id: 'crit_1', name: '집중의 눈', icon: '👁️', description: '크리티컬 확률 +5% (최대 80%)', baseCost: 5000, costMultiplier: 2.5, effect: 0.05, type: 'critical_prob', owned: 0 },
    { id: 'crit_2', name: '예리한 통찰', icon: '✨', description: '크리티컬 위력 +2배', baseCost: 25000, costMultiplier: 3.5, effect: 2.0, type: 'critical_power', owned: 0 },
    { id: 'cicd', name: 'CI/CD 파이프라인', icon: '🔄', description: '모든 자동 성장 효율 +20%', baseCost: 100000, costMultiplier: 5.0, effect: 0.2, type: 'auto_synergy', owned: 0 },
    { id: 'refactor', name: '레거시 리팩토링', icon: '🧹', description: '모든 아이템 가격 -5% 영구 할인', baseCost: 500000, costMultiplier: 10.0, effect: 0.05, type: 'global_discount', owned: 0 },
    { id: 'deep_learn', name: '딥러닝 엔진', icon: '🧠', description: '클릭 당 초당 생산량의 1% 만큼 추가 획득', baseCost: 2e9, costMultiplier: 50.0, effect: 0.01, type: 'click_synergy', owned: 0 },
    { id: 'bug_bounty', name: '버그 바운티', icon: '💰', description: '클릭 시 1% 확률로 10초치 생산량 즉시 획득', baseCost: 50e9, costMultiplier: 100.0, effect: 10, type: 'lucky_click', owned: 0 },
    { id: 'legend_kb', name: '전설의 키보드', icon: '🌟', description: '클릭 효율 x10배 영구 증가 (중첩 가능)', baseCost: 1e12, costMultiplier: 100, effect: 10, type: 'permanent_mult', owned: 0 },
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
        startTime: Date.now(),
    },
};
