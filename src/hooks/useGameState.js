import { useReducer, useEffect } from 'react';
import { initialGameState, getItemCost, getMilestoneMultiplier } from '../data/gameData';

const SAVE_KEY = 'coding_master_advanced_save_v4'; // 최적화 적용 버전

function getActiveBoostMultiplier(boosts) {
    const now = Date.now();
    const active = boosts.filter(b => b.endTime > now);
    if (active.length === 0) return 1;
    const bonus = active.reduce((acc, b) => acc + (b.multiplier - 1), 0);
    return 1 + bonus;
}

function gameReducer(state, action) {
    switch (action.type) {
        case 'CLICK': {
            const isCrit = Math.random() < Math.min(state.critProb, 0.8);
            const boostMultiplier = getActiveBoostMultiplier(state.boosts);

            const synergyBonus = state.perSecond * state.clickSynergy;
            let gainedPower = (state.perClick + synergyBonus) * boostMultiplier;

            if (isCrit) gainedPower *= state.critMult;

            const luckyItem = state.specialItems.find(it => it.type === 'lucky_click');
            let luckyBonus = 0;
            let isLucky = false;
            if (luckyItem && luckyItem.owned > 0 && Math.random() < 0.01) {
                luckyBonus = state.perSecond * luckyItem.effect;
                isLucky = true;
            }

            const finalGained = gainedPower + luckyBonus;

            return {
                ...state,
                codingPower: state.codingPower + finalGained,
                totalCodingPower: state.totalCodingPower + finalGained,
                stats: {
                    ...state.stats,
                    totalClicks: state.stats.totalClicks + 1,
                },
                lastClickWasCrit: isCrit,
                lastClickWasLucky: isLucky,
                lastClickId: Date.now(), // 클릭 구분용 ID 추가
            };
        }

        case 'TICK': {
            const now = Date.now();
            const boostMultiplier = getActiveBoostMultiplier(state.boosts);
            const gainedPower = (state.perSecond * boostMultiplier * state.autoSynergy) / 10;
            const activeBoosts = state.boosts.filter(b => b.endTime > now);

            return {
                ...state,
                codingPower: state.codingPower + gainedPower,
                totalCodingPower: state.totalCodingPower + gainedPower,
                boosts: activeBoosts,
                // TICK에서 클릭 피드백 정보를 초기화하지 않음
            };
        }

        case 'BUY_AUTO_ITEM': {
            const { index } = action;
            const item = state.autoItems[index];
            const cost = getItemCost(item, state.globalDiscount);
            if (state.codingPower < cost) return state;

            const newItems = state.autoItems.map((it, i) =>
                i === index ? { ...it, owned: it.owned + 1 } : it
            );

            const newPerSecond = newItems.reduce((sum, it) => {
                const milestoneMult = getMilestoneMultiplier(it.owned);
                return sum + (it.effect * it.owned * milestoneMult);
            }, 0);

            return {
                ...state,
                codingPower: state.codingPower - cost,
                autoItems: newItems,
                perSecond: newPerSecond,
                stats: { ...state.stats, totalItemsBought: state.stats.totalItemsBought + 1 },
            };
        }

        case 'BUY_CLICK_ITEM': {
            const { index } = action;
            const item = state.clickItems[index];
            const cost = getItemCost(item, state.globalDiscount);
            if (state.codingPower < cost) return state;

            const newItems = state.clickItems.map((it, i) =>
                i === index ? { ...it, owned: it.owned + 1 } : it
            );

            const basePerClick = 1 + newItems.reduce((sum, it) => {
                const milestoneMult = getMilestoneMultiplier(it.owned);
                return sum + (it.effect * it.owned * milestoneMult);
            }, 0);

            const legendItems = state.specialItems.filter(it => it.type === 'permanent_mult');
            const legendMult = legendItems.reduce((acc, it) => acc * Math.pow(it.effect, it.owned), 1);

            return {
                ...state,
                codingPower: state.codingPower - cost,
                clickItems: newItems,
                perClick: basePerClick * legendMult,
                stats: { ...state.stats, totalItemsBought: state.stats.totalItemsBought + 1 },
            };
        }

        case 'BUY_SPECIAL_ITEM': {
            const { index } = action;
            const item = state.specialItems[index];

            // 도박 아이템 처리 로직
            if (item.type === 'gamble') {
                const cost = Math.floor(state.codingPower * 0.1); // 현재 파워의 10%
                if (state.codingPower < 100 || cost < 1) return state; // 최소 조건

                const isSuccess = Math.random() < 0.5;
                const newItems = state.specialItems.map((it, i) =>
                    i === index ? { ...it, owned: it.owned + 1 } : it
                );

                if (isSuccess) {
                    const reward = cost * 2.5; // 2.5배 획득
                    return {
                        ...state,
                        codingPower: state.codingPower - cost + reward,
                        totalCodingPower: state.totalCodingPower + reward,
                        specialItems: newItems,
                        lastGambleResult: `도박 성공! +${Math.floor(reward)} 파워 획득! 🎰`,
                    };
                } else {
                    return {
                        ...state,
                        codingPower: state.codingPower - cost,
                        specialItems: newItems,
                        lastGambleResult: `도박 실패... -${Math.floor(cost)} 파워 증발 💸`,
                    };
                }
            }

            const cost = getItemCost(item, state.globalDiscount);
            if (state.codingPower < cost) return state;
            if (item.maxOwned && item.owned >= item.maxOwned) return state;

            const newItems = state.specialItems.map((it, i) =>
                i === index ? { ...it, owned: it.owned + 1 } : it
            );

            let newState = {
                ...state,
                codingPower: state.codingPower - cost,
                specialItems: newItems,
                lastGambleResult: null, // 일반 아이템 구매 시 도박 결과 초기화
            };

            if (item.type === 'critical_prob') newState.critProb = Math.min(newState.critProb + item.effect, 0.8);
            if (item.type === 'critical_power') newState.critMult += item.effect;
            if (item.type === 'auto_synergy') newState.autoSynergy += item.effect;
            if (item.type === 'global_discount') newState.globalDiscount = Math.min(newState.globalDiscount + item.effect, 0.5);
            if (item.type === 'click_synergy') newState.clickSynergy += item.effect;
            if (item.type === 'permanent_mult') {
                const basePerClick = 1 + state.clickItems.reduce((sum, it) => {
                    const milestoneMult = getMilestoneMultiplier(it.owned);
                    return sum + (it.effect * it.owned * milestoneMult);
                }, 0);
                const legendMult = newState.specialItems
                    .filter(it => it.type === 'permanent_mult')
                    .reduce((acc, it) => acc * Math.pow(it.effect, it.owned), 1);
                newState.perClick = basePerClick * legendMult;
            }

            return newState;
        }

        case 'TRIGGER_RANDOM_EVENT': {
            const { type } = action.payload; // 'bug' or 'idea'
            if (type === 'idea') {
                // 초당 생산량의 5분치 (300초) 즉시 획득, 단 최소 500 보장
                const reward = Math.max(state.perSecond * 300, 500);
                return {
                    ...state,
                    codingPower: state.codingPower + reward,
                    totalCodingPower: state.totalCodingPower + reward,
                };
            } else if (type === 'bug') {
                // 30초 동안 클릭 효율 7배 상승 버프 부여
                const bugBoost = {
                    id: 'bug_boost_' + Date.now(),
                    multiplier: 7,
                    endTime: Date.now() + 30 * 1000,
                    name: '디버깅 아드레날린',
                    icon: '🐛'
                };
                return {
                    ...state,
                    boosts: [...state.boosts, bugBoost]
                };
            }
            return state;
        }

        case 'APPLY_AD_REWARD': {
            const rewardBoost = {
                id: 'ad_reward_' + Date.now(),
                multiplier: 5,
                endTime: Date.now() + 15 * 60 * 1000,
                name: '광고 시청 보상',
                icon: '🎬'
            };
            return {
                ...state,
                boosts: [...state.boosts, rewardBoost]
            };
        }

        case 'RESET': return { ...initialGameState, stats: { ...initialGameState.stats, startTime: Date.now() } };
        case 'LOAD_SAVE': return action.payload;
        default: return state;
    }
}

export function useGameState() {
    const [state, dispatch] = useReducer(gameReducer, initialGameState, (init) => {
        try {
            const saved = localStorage.getItem(SAVE_KEY);
            return saved ? { ...init, ...JSON.parse(saved) } : init;
        } catch { return init; }
    });

    useEffect(() => {
        const timer = setInterval(() => dispatch({ type: 'TICK' }), 100);
        return () => clearInterval(timer);
    }, []);

    // 최적화: 2초마다 저장 (디스크 쓰기 부하 감소)
    useEffect(() => {
        const saveTimer = setInterval(() => {
            localStorage.setItem(SAVE_KEY, JSON.stringify(state));
        }, 2000);
        return () => clearInterval(saveTimer);
    }, [state]);

    return {
        state,
        click: () => dispatch({ type: 'CLICK' }),
        buyAutoItem: (index) => dispatch({ type: 'BUY_AUTO_ITEM', index }),
        buyClickItem: (index) => dispatch({ type: 'BUY_CLICK_ITEM', index }),
        buySpecialItem: (index) => dispatch({ type: 'BUY_SPECIAL_ITEM', index }),
        triggerRandomEvent: (type) => dispatch({ type: 'TRIGGER_RANDOM_EVENT', payload: { type } }),
        applyAdReward: () => dispatch({ type: 'APPLY_AD_REWARD' }),
        resetGame: () => {
            localStorage.removeItem(SAVE_KEY);
            dispatch({ type: 'RESET' });
        }
    };
}
