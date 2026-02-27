// 코딩 마스터: 프로그래머 키우기 - 게임 데이터

// 숫자 포맷팅 유틸리티
export function formatNumber(num) {
    if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    if (num >= 1) return Math.floor(num).toString();
    if (num > 0) return num.toFixed(1); // 소수점 1자리 표시
    return '0';
}

// 아이템 가격 계산
export function getItemCost(item) {
    return Math.floor(item.baseCost * Math.pow(item.costMultiplier, item.owned));
}

// 자동 성장 아이템 (초당 코딩력 증가)
export const autoItems = [
    {
        id: 'mechanical_keyboard',
        name: '기계식 키보드',
        icon: '⌨️',
        description: '기계식 키보드로 타이핑 속도 UP!',
        baseCost: 15,
        costMultiplier: 1.15,
        effect: 1,
        owned: 0,
    },
    {
        id: 'dual_monitor',
        name: '듀얼 모니터',
        icon: '🖥️',
        description: '화면이 넓으면 생산성도 올라간다!',
        baseCost: 100,
        costMultiplier: 1.15,
        effect: 1,
        owned: 0,
    },
    {
        id: 'high_spec_pc',
        name: '고사양 컴퓨터',
        icon: '💻',
        description: '컴파일 시간이 획기적으로 줄어든다!',
        baseCost: 1100,
        costMultiplier: 1.15,
        effect: 8,
        owned: 0,
    },
    {
        id: 'ergo_chair',
        name: '인체공학 의자',
        icon: '🪑',
        description: '편안한 자세 = 오래 코딩 가능!',
        baseCost: 12000,
        costMultiplier: 1.15,
        effect: 47,
        owned: 0,
    },
    {
        id: 'tech_blog',
        name: '기술 블로그 구독',
        icon: '📰',
        description: '최신 기술 트렌드를 빠르게 캐치!',
        baseCost: 130000,
        costMultiplier: 1.15,
        effect: 260,
        owned: 0,
    },
    {
        id: 'open_source',
        name: '오픈소스 참여',
        icon: '🌍',
        description: '세계적인 개발자들과 함께 성장!',
        baseCost: 1400000,
        costMultiplier: 1.15,
        effect: 1400,
        owned: 0,
    },
];

// 클릭 성장 아이템 (클릭당 코딩력 증가)
export const clickItems = [
    {
        id: 'learn_python',
        name: 'Python 배우기',
        icon: '🐍',
        description: 'Python으로 생산성 극대화!',
        baseCost: 15,
        costMultiplier: 1.15,
        effect: 1,
        owned: 0,
    },
    {
        id: 'learn_java',
        name: 'Java 배우기',
        icon: '☕',
        description: '정적 타입의 안정감을 느껴보세요!',
        baseCost: 100,
        costMultiplier: 1.15,
        effect: 5,
        owned: 0,
    },
    {
        id: 'algorithm_study',
        name: '알고리즘 스터디',
        icon: '🧠',
        description: '문제 해결 능력이 향상된다!',
        baseCost: 1100,
        costMultiplier: 1.15,
        effect: 25,
        owned: 0,
    },
    {
        id: 'design_pattern',
        name: '디자인 패턴',
        icon: '🏗️',
        description: '깔끔한 코드 아키텍처의 시작!',
        baseCost: 12000,
        costMultiplier: 1.15,
        effect: 100,
        owned: 0,
    },
    {
        id: 'energy_drink',
        name: '에너지 드링크',
        icon: '🥤',
        description: '카페인 부스트로 집중력 UP!',
        baseCost: 130000,
        costMultiplier: 1.15,
        effect: 500,
        owned: 0,
    },
    {
        id: 'focus_music',
        name: '집중력 향상 음악',
        icon: '🎧',
        description: 'Lo-fi 비트로 몰입감 극대화!',
        baseCost: 1400000,
        costMultiplier: 1.15,
        effect: 2500,
        owned: 0,
    },
];

// 스페셜 아이템 (부스터 및 영구 아이템)
export const specialItems = [
    {
        id: 'overtime_coffee',
        name: '야근 커피',
        icon: '☕',
        description: '30분간 코딩력 획득 2배!',
        baseCost: 500,
        costMultiplier: 1.0,
        effect: 2,
        duration: 1800, // 30분 (초)
        type: 'boost',
        owned: 0,
    },
    {
        id: 'cto_advice',
        name: 'CTO의 조언',
        icon: '👨‍💼',
        description: '10분간 코딩력 획득 5배!',
        baseCost: 5000,
        costMultiplier: 1.0,
        effect: 5,
        duration: 600, // 10분 (초)
        type: 'boost',
        owned: 0,
    },
    {
        id: 'legendary_keyboard',
        name: '전설의 키보드',
        icon: '🌟',
        description: '영구적으로 클릭 코딩력 10배!',
        baseCost: 1000000,
        costMultiplier: 10,
        effect: 10,
        type: 'permanent',
        owned: 0,
    },
    {
        id: 'ad_remove',
        name: '광고 제거',
        icon: '🚫',
        description: '모든 배너 광고를 제거합니다!',
        baseCost: 50000,
        costMultiplier: 1.0,
        effect: 0,
        type: 'one_time',
        maxOwned: 1,
        owned: 0,
    },
];

// 레벨/칭호 시스템
export const titles = [
    { minPower: 0, title: '코딩 입문자', icon: '🐣' },
    { minPower: 100, title: '견습 개발자', icon: '🐥' },
    { minPower: 1000, title: '주니어 개발자', icon: '👨‍💻' },
    { minPower: 10000, title: '중급 개발자', icon: '💪' },
    { minPower: 100000, title: '시니어 개발자', icon: '🔥' },
    { minPower: 1000000, title: '테크 리드', icon: '⚡' },
    { minPower: 10000000, title: 'CTO', icon: '👑' },
    { minPower: 100000000, title: '전설의 개발자', icon: '🌟' },
    { minPower: 1000000000, title: '코딩의 신', icon: '🏆' },
];

export function getCurrentTitle(totalPower) {
    let current = titles[0];
    for (const t of titles) {
        if (totalPower >= t.minPower) current = t;
        else break;
    }
    return current;
}

// 초기 게임 상태
export const initialGameState = {
    codingPower: 0,
    totalCodingPower: 0,
    perClick: 1,
    perSecond: 0,
    autoItems: autoItems.map(item => ({ ...item })),
    clickItems: clickItems.map(item => ({ ...item })),
    specialItems: specialItems.map(item => ({ ...item })),
    boosts: [], // { id, multiplier, endTime }
    adRemoved: false,
    stats: {
        totalClicks: 0,
        totalItemsBought: 0,
        startTime: Date.now(),
    },
};
