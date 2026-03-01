import { useReducer, useEffect, useCallback, useRef } from 'react';
import { initialGameState, getItemCost, getMilestoneMultiplier } from '../data/gameData';

const SAVE_KEY = 'coding_master_advanced_save_v3'; // 밸런스 대개편으로 인한 새로운 저장키

function gameReducer(state, action) {
    switch (action.type) {
        case 'CLICK': {
            const isCrit = Math.random() < Math.min(state.critProb, 0.8);
            const boostMultiplier = getActiveBoostMultiplier(state.boosts);

            // 시너지 1: 딥러닝 엔진 (초당 생산량의 일정 %를 클릭 당 추가)
            const synergyBonus = state.perSecond * state.clickSynergy;
            let gainedPower = (state.perClick + synergyBonus) * boostMultiplier;

            if (isCrit) gainedPower *= state.critMult;

            // 시너지 2: 버그 바운티 (1% 확률로 10초 생산량 획득)
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
                lastClickWasCrit: false,
                lastClickWasLucky: false,
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

            // 마일스톤 반영 perSecond 계산
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

            // 마일스톤 반영 perClick 계산
            const basePerClick = 1 + newItems.reduce((sum, it) => {
                const milestoneMult = getMilestoneMultiplier(it.owned);
                return sum + (it.effect * it.owned * milestoneMult);
            }, 0);

            // 전설의 키보드 중첩 반영
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
            };

            // 특수 효과 즉시 갱신
            if (item.type === 'critical_prob') newState.critProb = Math.min(newState.critProb + item.effect, 0.8);
            if (item.type === 'critical_power') newState.critMult += item.effect;
            if (item.type === 'auto_synergy') newState.autoSynergy += item.effect;
            if (item.type === 'global_discount') newState.globalDiscount = Math.min(newState.globalDiscount + item.effect, 0.5); // 최대 50% 할인
            if (item.type === 'click_synergy') newState.clickSynergy += item.effect;
            if (item.type === 'permanent_mult') {
                // 이미 위에서 계산 로직에 포함됨 (re-sync)
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

        case 'APPLY_AD_REWARD': {
            const rewardBoost = {
                id: 'ad_reward_' + Date.now(),
                multiplier: 5, // 광고 보상도 10배 -> 5배로 현실화
                endTime: Date.now() + 15 * 60 * 1000, // 30분 -> 15분
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

function getActiveBoostMultiplier(boosts) {
    const now = Date.now();
    const active = boosts.filter(b => b.endTime > now);
    // 곱연산(x*x) 대신 가산 방식(1 + (m1-1) + (m2-1)...)으로 변경하여 무한 폭주 방지
    if (active.length === 0) return 1;
    const bonus = active.reduce((acc, b) => acc + (b.multiplier - 1), 0);
    return 1 + bonus;
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

    useEffect(() => {
        localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    }, [state]);

    return {
        state,
        click: () => dispatch({ type: 'CLICK' }),
        buyAutoItem: (index) => dispatch({ type: 'BUY_AUTO_ITEM', index }),
        buyClickItem: (index) => dispatch({ type: 'BUY_CLICK_ITEM', index }),
        buySpecialItem: (index) => dispatch({ type: 'BUY_SPECIAL_ITEM', index }),
        applyAdReward: () => dispatch({ type: 'APPLY_AD_REWARD' }),
        resetGame: () => {
            localStorage.removeItem(SAVE_KEY);
            dispatch({ type: 'RESET' });
        }
    };
}
