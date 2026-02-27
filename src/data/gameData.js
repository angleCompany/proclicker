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

export function formatNumber(num) {
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

export function getItemCost(item) {
    // 가격 배율을 보유 개수에 따라 소폭 증가시켜 후반 급가속 방지
    const dynamicMultiplier = item.costMultiplier + (item.owned * 0.01);
    return Math.floor(item.baseCost * Math.pow(dynamicMultiplier, item.owned));
}

export function getCurrentTitle(totalPower) {
    let current = titles[0];
    for (const t of titles) {
        if (totalPower >= t.minPower) current = t;
        else break;
    }
    return current;
}

// 자동 성장 아이템 (가격 배율 상향: 1.15 -> 1.35~1.5)
export const autoItems = [
    { id: 'kb', name: '기계식 키보드', icon: '⌨️', description: '생산성 +1/s', baseCost: 15, costMultiplier: 1.3, effect: 1, owned: 0 },
    { id: 'mon', name: '듀얼 모니터', icon: '🖥️', description: '생산성 +8/s', baseCost: 150, costMultiplier: 1.32, effect: 8, owned: 0 },
    { id: 'pc', name: '고사양 PC', icon: '💻', description: '생산성 +45/s', baseCost: 1500, costMultiplier: 1.35, effect: 45, owned: 0 },
    { id: 'chair', name: '인체공학 의자', icon: '🪑', description: '생산성 +250/s', baseCost: 20000, costMultiplier: 1.38, effect: 250, owned: 0 },
    { id: 'blog', name: '기술 블로그', icon: '📰', description: '생산성 +1.2k/s', baseCost: 180000, costMultiplier: 1.4, effect: 1200, owned: 0 },
    { id: 'os', name: '오픈소스 참여', icon: '🌍', description: '생산성 +6.5k/s', baseCost: 2500000, costMultiplier: 1.42, effect: 6500, owned: 0 },
    { id: 'ai', name: 'AI 페어 프로그래머', icon: '🤖', description: '생산성 +40k/s', baseCost: 40000000, costMultiplier: 1.45, effect: 40000, owned: 0 },
    { id: 'quantum', name: '양자 컴퓨터', icon: '🛸', description: '생산성 +250k/s', baseCost: 1000000000, costMultiplier: 1.5, effect: 250000, owned: 0 },
    { id: 'galaxy', name: '은하계 서버팜', icon: '🪐', description: '생산성 +2M/s', baseCost: 50000000000, costMultiplier: 1.55, effect: 2000000, owned: 0 },
];

// 클릭 성장 아이템 (가격 배율 상향)
export const clickItems = [
    { id: 'py', name: 'Python 마스터', icon: '🐍', description: '클릭 +1', baseCost: 25, costMultiplier: 1.3, effect: 1, owned: 0 },
    { id: 'js', name: 'React 딥하게', icon: '⚛️', description: '클릭 +12', baseCost: 350, costMultiplier: 1.32, effect: 12, owned: 0 },
    { id: 'algo', name: '알고리즘 정복', icon: '🧠', description: '클릭 +80', baseCost: 4000, costMultiplier: 1.35, effect: 80, owned: 0 },
    { id: 'arch', name: '클린 아키텍처', icon: '🏗️', description: '클릭 +650', baseCost: 60000, costMultiplier: 1.38, effect: 650, owned: 0 },
    { id: 'multi', name: '멀티 스레딩', icon: '🧵', description: '클릭 +4k', baseCost: 1000000, costMultiplier: 1.4, effect: 4000, owned: 0 },
    { id: 'comp', name: '컴파일러 설계', icon: '⚙️', description: '클릭 +250k', baseCost: 200000000, costMultiplier: 1.5, effect: 250000, owned: 0 },
];

// 스페셜 아이템 (초기 가격 및 배율 대폭 상향)
export const specialItems = [
    { id: 'crit_1', name: '집중의 눈', icon: '👁️', description: '크리티컬 확률 +5% (최대 80%)', baseCost: 5000, costMultiplier: 2.5, effect: 0.05, type: 'critical_prob', owned: 0 },
    { id: 'crit_2', name: '예리한 통찰', icon: '✨', description: '크리티컬 위력 +2배', baseCost: 25000, costMultiplier: 3.5, effect: 2.0, type: 'critical_power', owned: 0 },
    { id: 'legend_kb', name: '전설의 키보드', icon: '🌟', description: '클릭 효율 x10배 영구 증가 (중첩 불가)', baseCost: 1e12, costMultiplier: 100, effect: 10, type: 'permanent_mult', maxOwned: 1, owned: 0 },
    { id: 'boost_coffee', name: '무한 동력 커피', icon: '☕', description: '1분간 전체 코딩력 +2배 (가산 중첩)', baseCost: 100000, costMultiplier: 1.8, effect: 2, duration: 60, type: 'boost', owned: 0 },
];

export const initialGameState = {
    codingPower: 0,
    totalCodingPower: 0,
    perClick: 1,
    perSecond: 0,
    critProb: 0.05, // 기본 5%
    critMult: 2.0, // 기본 2배
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
