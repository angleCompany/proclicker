import { useReducer, useEffect, useCallback, useRef } from 'react';
import { initialGameState, getItemCost } from '../data/gameData';

// 저장/불러오기 키
const SAVE_KEY = 'coding_master_save';

// 리듀서 액션 처리
function gameReducer(state, action) {
    switch (action.type) {
        case 'CLICK': {
            const boostMultiplier = getActiveBoostMultiplier(state.boosts);
            const gainedPower = state.perClick * boostMultiplier;
            return {
                ...state,
                codingPower: state.codingPower + gainedPower,
                totalCodingPower: state.totalCodingPower + gainedPower,
                stats: {
                    ...state.stats,
                    totalClicks: state.stats.totalClicks + 1,
                },
            };
        }

        case 'TICK': {
            const now = Date.now();
            const boostMultiplier = getActiveBoostMultiplier(state.boosts);
            const gainedPower = (state.perSecond * boostMultiplier) / 10; // 100ms마다 호출
            const activeBoosts = state.boosts.filter(b => b.endTime > now);

            if (gainedPower === 0 && activeBoosts.length === state.boosts.length) {
                return state;
            }

            return {
                ...state,
                codingPower: state.codingPower + gainedPower,
                totalCodingPower: state.totalCodingPower + gainedPower,
                boosts: activeBoosts,
            };
        }

        case 'BUY_AUTO_ITEM': {
            const { index } = action;
            const item = state.autoItems[index];
            const cost = getItemCost(item);

            if (state.codingPower < cost) return state;

            const newItems = state.autoItems.map((it, i) => {
                if (i !== index) return it;
                return { ...it, owned: it.owned + 1 };
            });

            const newPerSecond = newItems.reduce(
                (sum, it) => sum + it.effect * it.owned,
                0
            );

            return {
                ...state,
                codingPower: state.codingPower - cost,
                autoItems: newItems,
                perSecond: newPerSecond,
                stats: {
                    ...state.stats,
                    totalItemsBought: state.stats.totalItemsBought + 1,
                },
            };
        }

        case 'BUY_CLICK_ITEM': {
            const { index } = action;
            const item = state.clickItems[index];
            const cost = getItemCost(item);

            if (state.codingPower < cost) return state;

            const newItems = state.clickItems.map((it, i) => {
                if (i !== index) return it;
                return { ...it, owned: it.owned + 1 };
            });

            // 기본 1 + 클릭 아이템 효과 합산
            const newPerClick =
                1 + newItems.reduce((sum, it) => sum + it.effect * it.owned, 0);

            // 전설의 키보드 영구 효과 적용
            const legendaryOwned =
                state.specialItems.find(it => it.id === 'legendary_keyboard')?.owned ||
                0;
            const legendaryMultiplier = legendaryOwned > 0 ? 10 : 1;

            return {
                ...state,
                codingPower: state.codingPower - cost,
                clickItems: newItems,
                perClick: newPerClick * legendaryMultiplier,
                stats: {
                    ...state.stats,
                    totalItemsBought: state.stats.totalItemsBought + 1,
                },
            };
        }

        case 'BUY_SPECIAL_ITEM': {
            const { index } = action;
            const item = state.specialItems[index];
            const cost = getItemCost(item);

            if (state.codingPower < cost) return state;
            if (item.maxOwned && item.owned >= item.maxOwned) return state;

            const newItems = state.specialItems.map((it, i) => {
                if (i !== index) return it;
                return { ...it, owned: it.owned + 1 };
            });

            let newState = {
                ...state,
                codingPower: state.codingPower - cost,
                specialItems: newItems,
                stats: {
                    ...state.stats,
                    totalItemsBought: state.stats.totalItemsBought + 1,
                },
            };

            // 부스터 활성화
            if (item.type === 'boost') {
                newState.boosts = [
                    ...state.boosts,
                    {
                        id: item.id,
                        name: item.name,
                        icon: item.icon,
                        multiplier: item.effect,
                        endTime: Date.now() + item.duration * 1000,
                    },
                ];
            }

            // 전설의 키보드 영구 효과
            if (item.id === 'legendary_keyboard') {
                const basePerClick =
                    1 +
                    state.clickItems.reduce((sum, it) => sum + it.effect * it.owned, 0);
                newState.perClick = basePerClick * 10;
            }

            // 광고 제거
            if (item.id === 'ad_remove') {
                newState.adRemoved = true;
            }

            return newState;
        }

        case 'ACTIVATE_AD_BOOST': {
            return {
                ...state,
                boosts: [
                    ...state.boosts,
                    {
                        id: 'ad_boost',
                        name: '광고 부스터',
                        icon: '📺',
                        multiplier: 2,
                        endTime: Date.now() + 1800 * 1000, // 30분
                    },
                ],
            };
        }

        case 'LOAD_SAVE': {
            return {
                ...action.savedState,
                boosts: (action.savedState.boosts || []).filter(
                    b => b.endTime > Date.now()
                ),
            };
        }

        case 'RESET': {
            return {
                ...initialGameState,
                autoItems: initialGameState.autoItems.map(it => ({ ...it })),
                clickItems: initialGameState.clickItems.map(it => ({ ...it })),
                specialItems: initialGameState.specialItems.map(it => ({ ...it })),
                stats: { ...initialGameState.stats, startTime: Date.now() },
            };
        }

        default:
            return state;
    }
}

// 활성 부스터 배율 합산
function getActiveBoostMultiplier(boosts) {
    const now = Date.now();
    const activeBoosts = boosts.filter(b => b.endTime > now);
    if (activeBoosts.length === 0) return 1;
    return activeBoosts.reduce((max, b) => Math.max(max, b.multiplier), 1);
}

export function useGameState() {
    const [state, dispatch] = useReducer(gameReducer, initialGameState, init => {
        // localStorage에서 저장된 상태 불러오기
        try {
            const saved = localStorage.getItem(SAVE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                return {
                    ...init,
                    ...parsed,
                    boosts: (parsed.boosts || []).filter(b => b.endTime > Date.now()),
                };
            }
        } catch (e) {
            console.warn('저장 데이터 로드 실패:', e);
        }
        return {
            ...init,
            autoItems: init.autoItems.map(it => ({ ...it })),
            clickItems: init.clickItems.map(it => ({ ...it })),
            specialItems: init.specialItems.map(it => ({ ...it })),
            stats: { ...init.stats, startTime: Date.now() },
        };
    });

    const tickRef = useRef(null);
    const saveRef = useRef(null);

    // 자동 코딩 틱 (100ms)
    useEffect(() => {
        tickRef.current = setInterval(() => {
            dispatch({ type: 'TICK' });
        }, 100);
        return () => clearInterval(tickRef.current);
    }, []);

    // 자동 저장 (5초마다)
    useEffect(() => {
        saveRef.current = setInterval(() => {
            try {
                localStorage.setItem(SAVE_KEY, JSON.stringify(state));
            } catch (e) {
                console.warn('저장 실패:', e);
            }
        }, 5000);
        return () => clearInterval(saveRef.current);
    }, [state]);

    const click = useCallback(() => dispatch({ type: 'CLICK' }), []);

    const buyAutoItem = useCallback(
        index => dispatch({ type: 'BUY_AUTO_ITEM', index }),
        []
    );

    const buyClickItem = useCallback(
        index => dispatch({ type: 'BUY_CLICK_ITEM', index }),
        []
    );

    const buySpecialItem = useCallback(
        index => dispatch({ type: 'BUY_SPECIAL_ITEM', index }),
        []
    );

    const activateAdBoost = useCallback(
        () => dispatch({ type: 'ACTIVATE_AD_BOOST' }),
        []
    );

    const resetGame = useCallback(() => {
        localStorage.removeItem(SAVE_KEY);
        dispatch({ type: 'RESET' });
    }, []);

    return {
        state,
        click,
        buyAutoItem,
        buyClickItem,
        buySpecialItem,
        activateAdBoost,
        resetGame,
    };
}
