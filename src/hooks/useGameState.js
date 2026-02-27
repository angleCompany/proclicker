import { useReducer, useEffect, useCallback, useRef } from 'react';
import { initialGameState, getItemCost } from '../data/gameData';

const SAVE_KEY = 'coding_master_advanced_save_v2'; // 밸런스 변경으로 인한 새로운 저장키

function gameReducer(state, action) {
    switch (action.type) {
        case 'CLICK': {
            const isCrit = Math.random() < Math.min(state.critProb, 0.8); // 최대 확률 80% 제한
            const boostMultiplier = getActiveBoostMultiplier(state.boosts);
            let gainedPower = state.perClick * boostMultiplier;

            if (isCrit) {
                gainedPower *= state.critMult;
            }

            return {
                ...state,
                codingPower: state.codingPower + gainedPower,
                totalCodingPower: state.totalCodingPower + gainedPower,
                stats: {
                    ...state.stats,
                    totalClicks: state.stats.totalClicks + 1,
                },
                lastClickWasCrit: isCrit,
            };
        }

        case 'TICK': {
            const now = Date.now();
            const boostMultiplier = getActiveBoostMultiplier(state.boosts);
            const gainedPower = (state.perSecond * boostMultiplier) / 10;
            const activeBoosts = state.boosts.filter(b => b.endTime > now);

            return {
                ...state,
                codingPower: state.codingPower + gainedPower,
                totalCodingPower: state.totalCodingPower + gainedPower,
                boosts: activeBoosts,
                lastClickWasCrit: false,
            };
        }

        case 'BUY_AUTO_ITEM': {
            const { index } = action;
            const item = state.autoItems[index];
            const cost = getItemCost(item);
            if (state.codingPower < cost) return state;

            const newItems = state.autoItems.map((it, i) =>
                i === index ? { ...it, owned: it.owned + 1 } : it
            );

            const newPerSecond = newItems.reduce((sum, it) => sum + it.effect * it.owned, 0);

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
            const cost = getItemCost(item);
            if (state.codingPower < cost) return state;

            const newItems = state.clickItems.map((it, i) =>
                i === index ? { ...it, owned: it.owned + 1 } : it
            );

            const basePerClick = 1 + newItems.reduce((sum, it) => sum + it.effect * it.owned, 0);
            const legendItem = state.specialItems.find(it => it.id === 'legend_kb');
            const finalMult = (legendItem && legendItem.owned > 0) ? legendItem.effect : 1;

            return {
                ...state,
                codingPower: state.codingPower - cost,
                clickItems: newItems,
                perClick: basePerClick * finalMult,
                stats: { ...state.stats, totalItemsBought: state.stats.totalItemsBought + 1 },
            };
        }

        case 'BUY_SPECIAL_ITEM': {
            const { index } = action;
            const item = state.specialItems[index];
            const cost = getItemCost(item);
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

            // 특수 효과 적용
            if (item.type === 'critical_prob') newState.critProb = Math.min(newState.critProb + item.effect, 0.8);
            if (item.type === 'critical_power') newState.critMult += item.effect;
            if (item.type === 'permanent_mult') {
                const basePerClick = 1 + state.clickItems.reduce((sum, it) => sum + it.effect * it.owned, 0);
                newState.perClick = basePerClick * item.effect;
            }
            if (item.type === 'boost') {
                newState.boosts = [...state.boosts, {
                    id: item.id + '_' + Date.now(),
                    multiplier: item.effect,
                    endTime: Date.now() + item.duration * 1000,
                    name: item.name, icon: item.icon
                }];
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
