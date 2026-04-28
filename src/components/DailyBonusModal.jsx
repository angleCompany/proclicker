import { DAILY_BONUS_TABLE } from '../data/gameData';

export default function DailyBonusModal({ state, onClaim, onWatchAd }) {
    const streak = state.loginStreak || 1;
    const dayIndex = (streak - 1) % 7;
    const today = DAILY_BONUS_TABLE[dayIndex];

    return (
        <div
            style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.88)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 10000,
                backdropFilter: 'blur(10px)'
            }}
        >
            <div style={{
                background: 'linear-gradient(145deg, #1e1e2f, #1a2a1a)',
                borderRadius: '20px',
                width: '90%',
                maxWidth: '420px',
                padding: '0 0 24px 0',
                boxShadow: '0 0 50px rgba(80,220,80,0.2)',
                border: '2px solid rgba(80,220,80,0.3)',
                color: '#fff',
                animation: 'scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                overflow: 'hidden'
            }}>
                {/* Header */}
                <div style={{
                    padding: '20px 20px 16px',
                    background: 'linear-gradient(135deg, rgba(80,220,80,0.12), transparent)',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '40px', marginBottom: '8px' }}>📅</div>
                    <h2 style={{ margin: 0, fontSize: '20px', color: '#88ee88' }}>출석 체크!</h2>
                    <div style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>
                        {streak}일 연속 출석 중 🔥
                    </div>
                </div>

                {/* 7-day calendar */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '16px 16px 0',
                    flexWrap: 'wrap'
                }}>
                    {DAILY_BONUS_TABLE.map((d, i) => {
                        const isPast = i < dayIndex;
                        const isToday = i === dayIndex;
                        return (
                            <div key={d.day} style={{
                                width: '48px',
                                padding: '8px 4px',
                                borderRadius: '10px',
                                textAlign: 'center',
                                background: isToday
                                    ? 'rgba(80,220,80,0.2)'
                                    : isPast
                                        ? 'rgba(255,255,255,0.04)'
                                        : 'rgba(255,255,255,0.03)',
                                border: isToday
                                    ? '2px solid rgba(80,220,80,0.6)'
                                    : '1px solid rgba(255,255,255,0.08)',
                                opacity: isPast ? 0.5 : 1,
                            }}>
                                <div style={{ fontSize: '18px' }}>{isPast ? '✅' : d.icon}</div>
                                <div style={{ fontSize: '10px', color: '#888', marginTop: '3px' }}>
                                    {d.day}일
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Today's reward */}
                <div style={{
                    margin: '16px 20px',
                    padding: '14px',
                    background: 'rgba(80,220,80,0.08)',
                    borderRadius: '12px',
                    border: '1px solid rgba(80,220,80,0.3)',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '13px', color: '#aaa', marginBottom: '6px' }}>오늘의 보상</div>
                    <div style={{ fontSize: '28px' }}>{today.icon}</div>
                    <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#88ee88', marginTop: '4px' }}>
                        {today.label}
                    </div>
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '0 20px' }}>
                    <button
                        onClick={onWatchAd}
                        style={{
                            padding: '13px',
                            fontSize: '15px',
                            fontWeight: 'bold',
                            background: 'linear-gradient(45deg, #ffd700, #ffaa00)',
                            color: '#1a1a1a',
                            border: 'none',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            boxShadow: '0 3px 12px rgba(255,215,0,0.4)',
                        }}
                    >
                        💼 클라이언트 미팅하고 2배 받기!
                        <div style={{ fontSize: '11px', fontWeight: 'normal', opacity: 0.8, marginTop: '2px' }}>
                            {today.label} × 2
                        </div>
                    </button>
                    <button
                        onClick={onClaim}
                        style={{
                            padding: '11px',
                            fontSize: '14px',
                            background: 'rgba(80,220,80,0.12)',
                            color: '#88ee88',
                            border: '1px solid rgba(80,220,80,0.3)',
                            borderRadius: '10px',
                            cursor: 'pointer',
                        }}
                    >
                        그냥 받기
                    </button>
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
