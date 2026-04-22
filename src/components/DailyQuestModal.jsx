import { useState, useEffect } from 'react';
import { QUEST_POOL, formatNumber, getKSTDateString } from '../data/gameData';

function getCountdown() {
    const kstDateStr = getKSTDateString();
    const nextMidnight = new Date(kstDateStr + 'T15:00:00.000Z'); // midnight KST = 15:00 UTC
    let remaining = nextMidnight - Date.now();
    if (remaining < 0) {
        // already past midnight KST today, add 1 day
        remaining += 24 * 60 * 60 * 1000;
    }
    const totalSeconds = Math.floor(remaining / 1000);
    const hh = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const mm = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const ss = String(totalSeconds % 60).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
}

export default function DailyQuestModal({ state, onClose, onClaimReward, onPlaySound }) {
    const [countdown, setCountdown] = useState(getCountdown);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(getCountdown());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const quests = state.dailyQuests?.quests ?? [];
    const dateStr = state.dailyQuests?.date ?? '';

    const getCardStyle = (q) => {
        if (q.claimed) {
            return {
                background: 'rgba(16,185,129,0.05)',
                border: '1px solid rgba(16,185,129,0.3)',
            };
        }
        if (q.completed && !q.claimed) {
            return {
                background: 'rgba(255,215,0,0.08)',
                border: '1px solid rgba(255,215,0,0.4)',
            };
        }
        return {
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
        };
    };

    const renderQuestCard = (q) => {
        const def = QUEST_POOL.find(p => p.id === q.id);
        if (!def) return null;

        const progressPct = Math.min(100, (q.current / def.target) * 100);
        const cardStyle = getCardStyle(q);

        let statusBadge;
        if (q.claimed) {
            statusBadge = (
                <span style={{
                    fontSize: '12px',
                    padding: '3px 8px',
                    borderRadius: '12px',
                    background: 'rgba(16,185,129,0.2)',
                    color: '#10b981',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap'
                }}>
                    🎁 수령완료
                </span>
            );
        } else if (q.completed) {
            statusBadge = (
                <span style={{
                    fontSize: '12px',
                    padding: '3px 8px',
                    borderRadius: '12px',
                    background: 'rgba(255,215,0,0.2)',
                    color: '#ffd700',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap'
                }}>
                    ✅ 완료!
                </span>
            );
        } else {
            statusBadge = (
                <span style={{
                    fontSize: '12px',
                    padding: '3px 8px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.07)',
                    color: '#888',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap'
                }}>
                    진행중
                </span>
            );
        }

        return (
            <div key={q.id} style={{
                ...cardStyle,
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '12px',
                transition: 'all 0.3s ease'
            }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ fontSize: '36px', lineHeight: 1 }}>{def.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '8px',
                            marginBottom: '4px'
                        }}>
                            <h3 style={{
                                margin: 0,
                                fontSize: '15px',
                                fontWeight: 'bold',
                                color: q.claimed ? '#10b981' : q.completed ? '#ffd700' : '#ddd'
                            }}>
                                {def.title}
                            </h3>
                            {statusBadge}
                        </div>

                        <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#aaa' }}>
                            {def.description}
                        </p>

                        <div style={{ fontSize: '12px', color: '#88bb88', marginBottom: '8px' }}>
                            🎁 보상: {def.rewardDesc}
                        </div>

                        <div style={{
                            background: 'rgba(0,0,0,0.3)',
                            borderRadius: '6px',
                            height: '8px',
                            overflow: 'hidden',
                            marginBottom: '4px'
                        }}>
                            <div style={{
                                height: '100%',
                                width: progressPct + '%',
                                background: q.claimed
                                    ? 'rgba(16,185,129,0.7)'
                                    : q.completed
                                        ? 'linear-gradient(90deg, #ffd700, #ffaa00)'
                                        : 'linear-gradient(90deg, #4488ff, #66aaff)',
                                borderRadius: '6px',
                                transition: 'width 0.4s ease'
                            }} />
                        </div>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <span style={{ fontSize: '12px', color: '#888' }}>
                                {formatNumber(q.current)} / {formatNumber(def.target)}
                            </span>
                            {q.completed && !q.claimed && (
                                <button
                                    onClick={() => {
                                        onPlaySound?.();
                                        onClaimReward(q.id);
                                    }}
                                    style={{
                                        padding: '5px 14px',
                                        fontSize: '13px',
                                        fontWeight: 'bold',
                                        background: 'linear-gradient(45deg, #ffd700, #ffaa00)',
                                        color: '#1a1a1a',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        boxShadow: '0 2px 8px rgba(255,215,0,0.4)',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseOver={e => {
                                        e.currentTarget.style.transform = 'translateY(-1px)';
                                        e.currentTarget.style.filter = 'brightness(1.1)';
                                    }}
                                    onMouseOut={e => {
                                        e.currentTarget.style.transform = '';
                                        e.currentTarget.style.filter = '';
                                    }}
                                >
                                    보상 받기!
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div
            className="modal-overlay"
            onClick={onClose}
            style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.85)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 10000,
                backdropFilter: 'blur(10px)'
            }}
        >
            <div
                className="modal-content"
                onClick={e => e.stopPropagation()}
                style={{
                    background: 'linear-gradient(145deg, #1e1e2f, #2a2a40)',
                    borderRadius: '20px',
                    width: '90%',
                    maxWidth: '480px',
                    maxHeight: '85vh',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 0 50px rgba(100,180,255,0.2)',
                    border: '2px solid rgba(100,180,255,0.3)',
                    color: '#fff',
                    animation: 'scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
            >
                {/* Header */}
                <div style={{
                    padding: '20px 20px 16px 20px',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start'
                }}>
                    <div>
                        <h2 style={{ margin: '0 0 4px 0', fontSize: '22px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '22px' }}>📋</span>
                            오늘의 퀘스트
                        </h2>
                        {dateStr && (
                            <div style={{ fontSize: '13px', color: '#888' }}>{dateStr}</div>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#aaa',
                            fontSize: '24px',
                            cursor: 'pointer',
                            padding: '0 0 0 10px',
                            lineHeight: 1
                        }}
                    >
                        ×
                    </button>
                </div>

                {/* Countdown */}
                <div style={{
                    padding: '12px 20px',
                    background: 'rgba(0,0,0,0.2)',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    color: '#aac'
                }}>
                    <span>⏱️</span>
                    <span>다음 초기화까지</span>
                    <span style={{
                        fontFamily: 'monospace',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        color: '#88ccff',
                        letterSpacing: '1px'
                    }}>
                        {countdown}
                    </span>
                </div>

                {/* Quest list */}
                <div style={{ padding: '16px 20px', overflowY: 'auto', flex: 1 }}>
                    {quests.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '40px 0',
                            color: '#666',
                            fontSize: '15px'
                        }}>
                            퀘스트를 불러오는 중...
                        </div>
                    ) : (
                        quests.map(renderQuestCard)
                    )}
                </div>

                {/* Footer */}
                <div style={{
                    padding: '12px 20px',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    fontSize: '12px',
                    color: '#555',
                    textAlign: 'center'
                }}>
                    * 퀘스트는 매일 자정(KST) 자동 초기화됩니다.
                </div>
            </div>

            <style>{`
                @keyframes scaleIn {
                    0% { transform: scale(0.8); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
