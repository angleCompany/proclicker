import { useReducer, useEffect } from 'react';
import { initialGameState, getItemCost, getMilestoneMultiplier, achievementsList, calculateEquity, crewList, getGachaCost, QUEST_POOL, getKSTDateString, pickDailyQuests } from '../data/gameData';

const SAVE_KEY = 'coding_master_advanced_save_v4'; // 최적화 적용 버전

function getActiveBoostMultiplier(boosts) {
    const now = Date.now();
    const active = boosts.filter(b => b.endTime > now);
    if (active.length === 0) return 1;
    const bonus = active.reduce((acc, b) => acc + (b.multiplier - 1), 0);
    return 1 + bonus;
}

// 업적 달성 여부를 검사하고 상태를 업데이트하는 헬퍼 함수
function checkAchievements(state) {
    let newState = { ...state };
    let newAchievementsThisTurn = [];

    achievementsList.forEach(ach => {
        if (!newState.achievements.includes(ach.id) && ach.condition(newState)) {
            newState.achievements.push(ach.id);
            newAchievementsThisTurn.push(ach);
            newState = ach.applyReward(newState);
        }
    });

    if (newAchievementsThisTurn.length > 0) {
        // 기존 newAchievements 배열에 새로 달성한 업적 추가 (나중에 UI에서 소비 후 비워짐)
        newState.newAchievements = [...(newState.newAchievements || []), ...newAchievementsThisTurn];
    }
    return newState;
}

function updateQuestProgress(state) {
    if (!state.dailyQuests || state.dailyQuests.quests.length === 0) return state;
    const base = state.dailyQuests.questDeltaBase;
    const deltas = {
        clicks: state.stats.totalClicks - base.totalClicks,
        itemsBought: state.stats.totalItemsBought - base.totalItemsBought,
        gambleSuccess: state.stats.gambleSuccess - base.gambleSuccess,
        hackathonWins: state.stats.hackathonWins - base.hackathonWins,
        hackathonBugs: state.hackathon.bugsCaught,
        powerEarned: state.totalCodingPower - base.powerEarned,
    };
    const updatedQuests = state.dailyQuests.quests.map(q => {
        if (q.claimed) return q;
        const def = QUEST_POOL.find(p => p.id === q.id);
        if (!def) return q;
        const current = Math.max(0, deltas[def.type] ?? q.current);
        const completed = current >= def.target;
        return { ...q, current, completed };
    });
    const hasChanged = updatedQuests.some((q, i) => {
        const old = state.dailyQuests.quests[i];
        return q.current !== old.current || q.completed !== old.completed;
    });
    if (!hasChanged) return state;
    return { ...state, dailyQuests: { ...state.dailyQuests, quests: updatedQuests } };
}

function gameReducer(state, action) {
    switch (action.type) {
        case 'CLICK': {
            const isCrit = Math.random() < Math.min(state.critProb, 0.8);
            const boostMultiplier = getActiveBoostMultiplier(state.boosts);
            const achievementMultiplier = state.clickMultiplier || 1.0;
            const equityMultiplier = 1 + (state.equity || 0) * 0.02; // 지분 1당 2%

            const synergyBonus = state.perSecond * state.clickSynergy;
            let gainedPower = (state.perClick + synergyBonus) * boostMultiplier * achievementMultiplier * equityMultiplier;

            if (isCrit) gainedPower *= state.critMult;

            const luckyItem = state.specialItems.find(it => it.type === 'lucky_click');
            let luckyBonus = 0;
            let isLucky = false;
            if (luckyItem && luckyItem.owned > 0 && Math.random() < 0.01) {
                luckyBonus = state.perSecond * luckyItem.effect;
                isLucky = true;
            }

            const finalGained = gainedPower + luckyBonus;

            const newState = {
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

            return updateQuestProgress(checkAchievements(newState));
        }

        case 'CLEAR_OFFLINE_REWARD':
            return { ...state, offlineReward: null };

        case 'TICK': {
            const todayKST = getKSTDateString();
            if (state.dailyQuests?.date && state.dailyQuests.date !== todayKST) {
                return { ...state, _questResetNeeded: true };
            }
            const now = Date.now();
            const boostMultiplier = getActiveBoostMultiplier(state.boosts);
            const achievementMultiplier = state.autoMultiplier || 1.0;
            const equityMultiplier = 1 + (state.equity || 0) * 0.02; // 지분 1당 2%
            const gainedPower = (state.perSecond * boostMultiplier * state.autoSynergy * achievementMultiplier * equityMultiplier) / 10;
            const activeBoosts = state.boosts.filter(b => b.endTime > now);

            const newState = {
                ...state,
                codingPower: state.codingPower + gainedPower,
                totalCodingPower: state.totalCodingPower + gainedPower,
                boosts: activeBoosts,
                hackathon: {
                    ...state.hackathon,
                    timeLeft: Math.max(0, state.hackathon.timeLeft - 0.1) // 1Tick(0.1초) 차감
                }
            };

            // 해커톤 자동 종료 로직
            if (state.hackathon.isActive && newState.hackathon.timeLeft === 0) {
                const isWin = state.hackathon.bugsCaught >= 20;
                newState.hackathon.isActive = false;
                if (isWin) {
                    newState.stats.hackathonWins = (newState.stats.hackathonWins || 0) + 1;
                }
            }

            return updateQuestProgress(checkAchievements(newState));
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

            const newState = {
                ...state,
                codingPower: state.codingPower - cost,
                autoItems: newItems,
                perSecond: newPerSecond,
                stats: { ...state.stats, totalItemsBought: state.stats.totalItemsBought + 1 },
            };
            return updateQuestProgress(checkAchievements(newState));
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

            const newState = {
                ...state,
                codingPower: state.codingPower - cost,
                clickItems: newItems,
                perClick: basePerClick * legendMult,
                stats: { ...state.stats, totalItemsBought: state.stats.totalItemsBought + 1 },
            };
            return updateQuestProgress(checkAchievements(newState));
        }

        case 'BUY_SPECIAL_ITEM': {
            const { index } = action;
            const item = state.specialItems[index];

            // 도박 아이템 처리 로직
            if (item.type === 'gamble') {
                const cost = Math.floor(state.codingPower * 0.2); // 현재 파워의 20%
                if (state.codingPower < 100 || cost < 1) return state; // 최소 조건

                const isSuccess = Math.random() < 0.3; // 성공 확률 30%
                const newItems = state.specialItems.map((it, i) =>
                    i === index ? { ...it, owned: it.owned + 1 } : it
                );

                if (isSuccess) {
                    const reward = cost * 2.5; // 2.5배 획득
                    const newState = {
                        ...state,
                        codingPower: state.codingPower - cost + reward,
                        totalCodingPower: state.totalCodingPower + reward,
                        specialItems: newItems,
                        lastGambleResult: `도박 성공! +${Math.floor(reward)} 파워 획득! 🎰`,
                        stats: { ...state.stats, gambleSuccess: (state.stats.gambleSuccess || 0) + 1 }
                    };
                    return updateQuestProgress(checkAchievements(newState));
                } else {
                    return updateQuestProgress({
                        ...state,
                        codingPower: state.codingPower - cost,
                        specialItems: newItems,
                        lastGambleResult: `도박 실패... -${Math.floor(cost)} 파워 증발 💸`,
                    });
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

            return updateQuestProgress(checkAchievements(newState));
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

        case 'START_HACKATHON': {
            // 이미 진행 중이면 무시
            if (state.hackathon.isActive) return state;
            return {
                ...state,
                hackathon: {
                    isActive: true,
                    bugsCaught: 0,
                    timeLeft: 30 // 30초 시작
                }
            };
        }

        case 'CATCH_HACKATHON_BUG': {
            if (!state.hackathon.isActive) return state;

            const basePower = state.perSecond || 10;
            const rewardPower = basePower * 10; // 초당 생산량의 10배를 즉시 지급

            const newState = {
                ...state,
                codingPower: state.codingPower + rewardPower,
                totalCodingPower: state.totalCodingPower + rewardPower,
                hackathon: {
                    ...state.hackathon,
                    bugsCaught: state.hackathon.bugsCaught + 1
                }
            };
            return updateQuestProgress(checkAchievements(newState));
        }

        case 'SCOUT_CREW': {
            const { amount } = action.payload; // 뽑기 횟수 (1 or 10)
            let currentPower = state.codingPower;
            let newInventory = [...state.inventory];
            let pulledCrews = [];

            const costPerPull = getGachaCost(state); // 일단 현재 상태 기준 고정 비용

            for (let i = 0; i < amount; i++) {
                if (currentPower < costPerPull) break;
                currentPower -= costPerPull;

                const rand = Math.random() * 100;
                let cumulative = 0;
                let pickedCrew = crewList[0];
                for (const crew of crewList) {
                    cumulative += crew.prob;
                    if (rand <= cumulative) {
                        pickedCrew = crew;
                        break;
                    }
                }

                const existingIdx = newInventory.findIndex(inv => inv.id === pickedCrew.id);
                let isNew = false;
                if (existingIdx >= 0) {
                    newInventory[existingIdx] = { ...newInventory[existingIdx], level: newInventory[existingIdx].level + 1 };
                } else {
                    newInventory.push({ id: pickedCrew.id, level: 1 });
                    isNew = true;
                }

                pulledCrews.push({ ...pickedCrew, isNew });
            }

            if (pulledCrews.length === 0) return state; // 1회분 비용도 없으면 무시

            let newState = {
                ...state,
                codingPower: currentPower,
                inventory: newInventory,
                lastScoutedCrews: pulledCrews // UI 랜더링 (GachaReveal)용
            };

            // 뽑힌 크루들의 패시브 효과 즉각 반영
            pulledCrews.forEach(pull => {
                const effect = pull.baseEffect;
                if (pull.effectType === 'auto_mult') newState.autoMultiplier += effect;
                if (pull.effectType === 'click_mult') newState.clickMultiplier += effect;
                if (pull.effectType === 'discount') newState.globalDiscount = Math.min(newState.globalDiscount + effect, 0.6);
                if (pull.effectType === 'crit_mult') newState.critMult += effect;
                if (pull.effectType === 'all_mult') {
                    newState.autoMultiplier += effect;
                    newState.clickMultiplier += effect;
                }
            });

            return checkAchievements(newState);
        }

        case 'CLEAR_LAST_SCOUT': {
            return {
                ...state,
                lastScoutedCrews: null
            };
        }

        case 'REBIRTH': {
            const earnedEquity = calculateEquity(state.totalCodingPower);
            if (earnedEquity <= 0) return state;

            let rebirthState = {
                ...initialGameState,
                equity: (state.equity || 0) + earnedEquity,
                rebirthCount: (state.rebirthCount || 0) + 1,
                achievements: [...state.achievements], // 달성한 업적 유지
                inventory: [...(state.inventory || [])], // 고용한 크루 유지
                stats: {
                    ...initialGameState.stats,
                    hackathonWins: state.stats.hackathonWins || 0,
                    gambleSuccess: state.stats.gambleSuccess || 0,
                    startTime: Date.now() // 시간 초기화
                }
            };

            // 보유 중인 업적 효과(applyReward)만 초기 상태에 다시 적용
            state.achievements.forEach(achId => {
                const ach = achievementsList.find(a => a.id === achId);
                if (ach) {
                    rebirthState = ach.applyReward(rebirthState);
                }
            });

            // 보유 중인 크루 도감 효과 복구
            rebirthState.inventory.forEach(inv => {
                const crew = crewList.find(c => c.id === inv.id);
                if (crew) {
                    const effect = crew.baseEffect * inv.level;
                    if (crew.effectType === 'auto_mult') rebirthState.autoMultiplier += effect;
                    if (crew.effectType === 'click_mult') rebirthState.clickMultiplier += effect;
                    if (crew.effectType === 'discount') rebirthState.globalDiscount = Math.min(rebirthState.globalDiscount + effect, 0.6);
                    if (crew.effectType === 'crit_mult') rebirthState.critMult += effect;
                    if (crew.effectType === 'all_mult') {
                        rebirthState.autoMultiplier += effect;
                        rebirthState.clickMultiplier += effect;
                    }
                }
            });

            rebirthState.dailyQuests = {
                ...(state.dailyQuests || initialGameState.dailyQuests),
                questDeltaBase: {
                    totalClicks: 0,
                    totalItemsBought: 0,
                    gambleSuccess: rebirthState.stats.gambleSuccess,
                    hackathonWins: rebirthState.stats.hackathonWins,
                    hackathonBugs: 0,
                    powerEarned: 0,
                },
            };

            return rebirthState;
        }

        case 'INIT_DAILY_QUESTS': {
            const { todayKST, selected } = action.payload;
            return {
                ...state,
                _questResetNeeded: false,
                dailyQuests: {
                    date: todayKST,
                    quests: selected.map(def => ({ id: def.id, current: 0, completed: false, claimed: false })),
                    questDeltaBase: {
                        totalClicks: state.stats.totalClicks,
                        totalItemsBought: state.stats.totalItemsBought,
                        gambleSuccess: state.stats.gambleSuccess,
                        hackathonWins: state.stats.hackathonWins,
                        hackathonBugs: 0,
                        powerEarned: state.totalCodingPower,
                    },
                },
            };
        }

        case 'CLAIM_QUEST_REWARD': {
            const { questId } = action.payload;
            const quest = state.dailyQuests.quests.find(q => q.id === questId);
            if (!quest || !quest.completed || quest.claimed) return state;
            const def = QUEST_POOL.find(p => p.id === questId);
            if (!def) return state;
            let newState = { ...state };
            if (def.reward.type === 'production_boost') {
                const baseBoost = state.perSecond * def.reward.minutes * 60;
                const boost = baseBoost > 0 ? baseBoost : state.perClick * 100;
                newState.codingPower += boost;
                newState.totalCodingPower += boost;
            } else if (def.reward.type === 'click_mult_buff') {
                newState.clickMultiplier = (newState.clickMultiplier || 1.0) + def.reward.value;
            } else if (def.reward.type === 'auto_mult_buff') {
                newState.autoMultiplier = (newState.autoMultiplier || 1.0) + def.reward.value;
            }
            newState.dailyQuests = {
                ...state.dailyQuests,
                quests: state.dailyQuests.quests.map(q =>
                    q.id === questId ? { ...q, claimed: true } : q
                ),
            };
            return checkAchievements(newState);
        }

        case 'CLEAR_NEW_ACHIEVEMENTS': {
            return {
                ...state,
                newAchievements: []
            };
        }

        case 'APPLY_AD_REWARD': {
            const rewardBoost = {
                id: 'ad_reward_' + Date.now(),
                multiplier: 2,
                endTime: Date.now() + 5 * 60 * 1000, // 5분
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
            if (!saved) return init;
            const savedState = JSON.parse(saved);
            let loadedState = { ...init, ...savedState };

            const lastSaveTime = savedState.lastSaveTime;
            if (lastSaveTime && loadedState.perSecond > 0) {
                const elapsedMs = Date.now() - lastSaveTime;
                const cappedMs = Math.min(elapsedMs, 8 * 60 * 60 * 1000);
                const elapsedSeconds = cappedMs / 1000;
                if (elapsedSeconds > 60) {
                    const autoMultiplier = loadedState.autoMultiplier || 1.0;
                    const autoSynergy = loadedState.autoSynergy || 1.0;
                    const equityMultiplier = 1 + (loadedState.equity || 0) * 0.02;
                    const offlineEarnings = loadedState.perSecond * autoSynergy * autoMultiplier * equityMultiplier * elapsedSeconds;
                    loadedState = {
                        ...loadedState,
                        codingPower: loadedState.codingPower + offlineEarnings,
                        totalCodingPower: loadedState.totalCodingPower + offlineEarnings,
                        offlineReward: { amount: offlineEarnings, seconds: elapsedSeconds },
                    };
                }
            }
            const todayKST = getKSTDateString();
            const savedDate = loadedState.dailyQuests?.date ?? '';
            if (savedDate !== todayKST) {
                const selected = pickDailyQuests();
                loadedState = {
                    ...loadedState,
                    dailyQuests: {
                        date: todayKST,
                        quests: selected.map(def => ({ id: def.id, current: 0, completed: false, claimed: false })),
                        questDeltaBase: {
                            totalClicks: loadedState.stats.totalClicks,
                            totalItemsBought: loadedState.stats.totalItemsBought,
                            gambleSuccess: loadedState.stats.gambleSuccess,
                            hackathonWins: loadedState.stats.hackathonWins,
                            hackathonBugs: 0,
                            powerEarned: loadedState.totalCodingPower,
                        },
                    },
                };
            }
            return loadedState;
        } catch { return init; }
    });

    useEffect(() => {
        const timer = setInterval(() => dispatch({ type: 'TICK' }), 100);
        return () => clearInterval(timer);
    }, []);

    // 최적화: 2초마다 저장 (디스크 쓰기 부하 감소)
    useEffect(() => {
        const saveTimer = setInterval(() => {
            localStorage.setItem(SAVE_KEY, JSON.stringify({ ...state, lastSaveTime: Date.now() }));
        }, 2000);
        return () => clearInterval(saveTimer);
    }, [state]);

    useEffect(() => {
        if (state._questResetNeeded) {
            const todayKST = getKSTDateString();
            const selected = pickDailyQuests();
            dispatch({ type: 'INIT_DAILY_QUESTS', payload: { todayKST, selected } });
        }
    }, [state._questResetNeeded]);

    return {
        state,
        click: () => dispatch({ type: 'CLICK' }),
        buyAutoItem: (index) => dispatch({ type: 'BUY_AUTO_ITEM', index }),
        buyClickItem: (index) => dispatch({ type: 'BUY_CLICK_ITEM', index }),
        buySpecialItem: (index) => dispatch({ type: 'BUY_SPECIAL_ITEM', index }),
        triggerRandomEvent: (type) => dispatch({ type: 'TRIGGER_RANDOM_EVENT', payload: { type } }),
        applyAdReward: () => dispatch({ type: 'APPLY_AD_REWARD' }),
        startHackathon: () => dispatch({ type: 'START_HACKATHON' }),
        catchHackathonBug: () => dispatch({ type: 'CATCH_HACKATHON_BUG' }),
        scoutCrew: (amount) => dispatch({ type: 'SCOUT_CREW', payload: { amount } }),
        clearLastScout: () => dispatch({ type: 'CLEAR_LAST_SCOUT' }),
        rebirth: () => dispatch({ type: 'REBIRTH' }),
        clearNewAchievements: () => dispatch({ type: 'CLEAR_NEW_ACHIEVEMENTS' }),
        clearOfflineReward: () => dispatch({ type: 'CLEAR_OFFLINE_REWARD' }),
        claimQuestReward: (questId) => dispatch({ type: 'CLAIM_QUEST_REWARD', payload: { questId } }),
        resetGame: () => {
            localStorage.removeItem(SAVE_KEY);
            dispatch({ type: 'RESET' });
        }
    };
}
