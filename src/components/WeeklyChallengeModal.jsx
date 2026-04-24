import { useState, useEffect } from 'react';
import { formatNumber, getKSTWeekString } from '../data/gameData';

function getWeekCountdown() {
    const now = new Date(Date.now() + 9 * 60 * 60 * 1000);
    const day = now.getUTCDay();
    const daysUntilMonday = day === 0 ? 1 : 8 - day;
    const nextMonday = new Date(now);
    nextMonday.setUTCDate(now.getUTCDate() + daysUntilMonday);
    nextMonday.setUTCHours(0, 0, 0, 0);
    const remaining = nextMonday - new Date(Date.now() + 9 * 60 * 60 * 1000);
    const totalSeconds = Math.max(0, Math.floor(remaining / 1000));
    const dd = String(Math.floor(totalSeconds / 86400)).padStart(2, '0');
    const hh = String(Math.floor((totalSeconds % 86400) / 3600)).padStart(2, '0');
    const mm = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const ss = String(totalSeconds % 60).padStart(2, '0');
    return `${dd}일 ${hh}:${mm}:${ss}`;
}

export default function WeeklyChallengeModal({ state, onClose, onClaimReward, onPlaySound }) {
    const [countdown, setCountdown] = useState(getWeekCountdown);

    useEffect(() => {
        const timer = setInterval(() => setCountdown(getWeekCountdown()), 1000);
        return () => clearInterval(timer);
    }, []);

    const wc = state.weeklyChallenge;
    if (!wc?.challenge) return null;

    const def = wc.challenge;
    const progressPct = Math.max(0, Math.min(100, ((wc.current || 0) / def.target) * 100));

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
                onClick={e => e.stopPropagation()}
                style={{
                    background: 'linear-gradient(145deg, #1a1a2e, #16213e)',
                    borderRadius: '20px',
                    width: '90%',
                    maxWidth: '440px',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 0 50px rgba(255,180,0,0.2)',
                    border: '2px solid rgba(255,180,0,0.4)',
                    color: '#fff',
                    animation: 'scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    overflow: 'hidden'
                }}
            >
                {/* Header */}
                <div style={{
                    padding: '20px 20px 16px 20px',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    background: 'linear-gradient(135deg, rgba(255,180,0,0.1), transparent)'
                }}>
                    <div>
                        <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>🗓️</span> 이번 주 챌린지
                        </h2>
                        <div style={{ fontSize: '12px', color: '#888' }}>{getKSTWeekString()} 주간</div>
                    </div>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#aaa', fontSize: '24px', cursor: 'pointer', padding: '0 0 0 10px', lineHeight: 1 }}>×</button>
                </div>

                {/* Countdown */}
                <div style={{
                    padding: '10px 20px',
                    background: 'rgba(0,0,0,0.2)',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex', alignItems: 'center', gap: '8px',
                    fontSize: '13px', color: '#bbaa88'
                }}>
                    <span>⏱️</span>
                    <span>초기화까지</span>
                    <span style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '15px', color: '#ffcc66', letterSpacing: '1px' }}>
                        {countdown}
                    </span>
                </div>

                {/* Challenge Card */}
                <div style={{ padding: '20px' }}>
                    <div style={{
                        background: wc.claimed
                            ? 'rgba(16,185,129,0.08)'
                            : wc.completed
                                ? 'rgba(255,180,0,0.1)'
                                : 'rgba(255,255,255,0.04)',
                        border: wc.claimed
                            ? '1px solid rgba(16,185,129,0.4)'
                            : wc.completed
                                ? '1px solid rgba(255,180,0,0.5)'
                                : '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '14px',
                        padding: '20px',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                            <div style={{ fontSize: '44px', lineHeight: 1 }}>{def.icon}</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: wc.claimed ? '#10b981' : wc.completed ? '#ffcc44' : '#ddd' }}>
                                        {def.title}
                                    </h3>
                                    {wc.claimed && <span style={{ fontSize: '12px', padding: '3px 8px', borderRadius: '12px', background: 'rgba(16,185,129,0.2)', color: '#10b981', fontWeight: 'bold' }}>🎁 수령완료</span>}
                                    {wc.completed && !wc.claimed && <span style={{ fontSize: '12px', padding: '3px 8px', borderRadius: '12px', background: 'rgba(255,180,0,0.2)', color: '#ffcc44', fontWeight: 'bold' }}>✅ 완료!</span>}
                                    {!wc.completed && <span style={{ fontSize: '12px', padding: '3px 8px', borderRadius: '12px', background: 'rgba(255,255,255,0.07)', color: '#888', fontWeight: 'bold' }}>진행중</span>}
                                </div>
                                <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#aaa' }}>{def.description}</p>
                                <div style={{ fontSize: '12px', color: '#aacc88', marginBottom: '10px' }}>🎁 보상: {def.rewardDesc}</div>

                                <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '6px', height: '10px', overflow: 'hidden', marginBottom: '6px' }}>
                                    <div style={{
                                        height: '100%',
                                        width: progressPct + '%',
                                        background: wc.claimed
                                            ? 'rgba(16,185,129,0.7)'
                                            : wc.completed
                                                ? 'linear-gradient(90deg, #ffcc00, #ff8800)'
                                                : 'linear-gradient(90deg, #4488ff, #66aaff)',
                                        borderRadius: '6px',
                                        transition: 'width 0.4s ease'
                                    }} />
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '12px', color: '#888' }}>
                                        {formatNumber(wc.current)} / {formatNumber(def.target)}
                                    </span>
                                    {wc.completed && !wc.claimed && (
                                        <button
                                            onClick={() => { onPlaySound?.(); onClaimReward(); }}
                                            style={{
                                                padding: '7px 18px',
                                                fontSize: '14px',
                                                fontWeight: 'bold',
                                                background: 'linear-gradient(45deg, #ffcc00, #ff8800)',
                                                color: '#1a1a1a',
                                                border: 'none',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                boxShadow: '0 2px 10px rgba(255,180,0,0.5)',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.filter = 'brightness(1.1)'; }}
                                            onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.filter = ''; }}
                                        >
                                            보상 받기!
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '12px', color: '#555', textAlign: 'center' }}>
                    * 챌린지는 매주 월요일 자정(KST) 자동 초기화됩니다.
                </div>
            </div>
            <style>{`
                @keyframes scaleIn {
                    0% { transform: scale(0.85); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
