import { useState, useEffect, useRef } from 'react';

const REQUIRED_CLICKS = 30;
const TIME_LIMIT = 15;

export default function ServerCrashModal({ onSuccess, onFail }) {
    const [clickCount, setClickCount] = useState(0);
    const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
    const [phase, setPhase] = useState('active'); // 'active' | 'success' | 'fail'
    const intervalRef = useRef(null);
    const resolvedRef = useRef(false);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 0.1) {
                    clearInterval(intervalRef.current);
                    if (!resolvedRef.current) {
                        resolvedRef.current = true;
                        setPhase('fail');
                    }
                    return 0;
                }
                return parseFloat((prev - 0.1).toFixed(1));
            });
        }, 100);
        return () => clearInterval(intervalRef.current);
    }, []);

    const handleRepairClick = () => {
        if (phase !== 'active') return;
        setClickCount(prev => {
            const next = prev + 1;
            if (next >= REQUIRED_CLICKS && !resolvedRef.current) {
                resolvedRef.current = true;
                clearInterval(intervalRef.current);
                setPhase('success');
            }
            return next;
        });
    };

    // 성공/실패 결과 처리 (2초 후 콜백 실행)
    useEffect(() => {
        if (phase === 'success') {
            const t = setTimeout(() => onSuccess(), 2000);
            return () => clearTimeout(t);
        }
        if (phase === 'fail') {
            const t = setTimeout(() => onFail(), 2000);
            return () => clearTimeout(t);
        }
    }, [phase, onSuccess, onFail]);

    const progress = Math.min(clickCount / REQUIRED_CLICKS, 1);
    const timeProgress = timeLeft / TIME_LIMIT;
    const timeColor = timeLeft > 8 ? '#22c55e' : timeLeft > 4 ? '#f59e0b' : '#ef4444';

    return (
        <div style={{
            position: 'fixed', inset: 0,
            background: phase === 'success'
                ? 'rgba(0,30,0,0.93)'
                : phase === 'fail'
                    ? 'rgba(30,0,0,0.93)'
                    : 'rgba(0,0,0,0.9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 99999,
            animation: phase === 'active' ? 'crashPulse 0.5s ease-in-out infinite alternate' : 'none',
        }}>
            <style>{`
                @keyframes crashPulse {
                    0%  { background: rgba(20,0,0,0.92); }
                    100% { background: rgba(60,0,0,0.95); }
                }
                @keyframes shakeBtn {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(0.95); }
                }
                @keyframes successPop {
                    0% { transform: scale(0.8); opacity: 0; }
                    60% { transform: scale(1.08); }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>

            <div style={{
                background: 'linear-gradient(145deg, #1a0000, #0a0a0a)',
                border: `2px solid ${phase === 'success' ? '#22c55e' : phase === 'fail' ? '#ef4444' : '#ff3333'}`,
                borderRadius: '20px',
                padding: '28px 24px',
                width: '92%',
                maxWidth: '400px',
                boxShadow: `0 0 60px ${phase === 'success' ? 'rgba(34,197,94,0.5)' : 'rgba(255,50,50,0.5)'}`,
                animation: phase !== 'active' ? 'successPop 0.4s ease-out' : 'none',
            }}>
                {phase === 'active' && (
                    <>
                        {/* 경고 헤더 */}
                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <div style={{ fontSize: '44px', marginBottom: '8px' }}>🔴</div>
                            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ff4444', letterSpacing: '2px' }}>
                                ⚠️ 서버 다운 경보!
                            </div>
                            <div style={{ fontSize: '13px', color: '#aaa', marginTop: '6px' }}>
                                서버가 터졌어요! 빠르게 재부팅하세요!
                            </div>
                        </div>

                        {/* 타이머 바 */}
                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                <span style={{ fontSize: '12px', color: '#888' }}>남은 시간</span>
                                <span style={{ fontSize: '14px', fontWeight: 'bold', color: timeColor }}>
                                    {timeLeft.toFixed(1)}s
                                </span>
                            </div>
                            <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{
                                    height: '100%',
                                    width: `${timeProgress * 100}%`,
                                    background: `linear-gradient(90deg, ${timeColor}, ${timeColor}88)`,
                                    borderRadius: '4px',
                                    transition: 'width 0.1s linear, background 0.3s',
                                }} />
                            </div>
                        </div>

                        {/* 재부팅 진행 바 */}
                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                <span style={{ fontSize: '12px', color: '#888' }}>재부팅 진행도</span>
                                <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#60a5fa' }}>
                                    {clickCount} / {REQUIRED_CLICKS}
                                </span>
                            </div>
                            <div style={{ height: '12px', background: 'rgba(255,255,255,0.08)', borderRadius: '6px', overflow: 'hidden' }}>
                                <div style={{
                                    height: '100%',
                                    width: `${progress * 100}%`,
                                    background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                                    borderRadius: '6px',
                                    transition: 'width 0.05s',
                                    boxShadow: '0 0 8px rgba(96,165,250,0.6)',
                                }} />
                            </div>
                        </div>

                        {/* 광클 버튼 */}
                        <button
                            onClick={handleRepairClick}
                            style={{
                                width: '100%',
                                padding: '18px',
                                fontSize: '18px',
                                fontWeight: 'bold',
                                background: 'linear-gradient(45deg, #ff2222, #ff5500)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                boxShadow: '0 4px 20px rgba(255,50,50,0.5)',
                                userSelect: 'none',
                                WebkitUserSelect: 'none',
                            }}
                        >
                            🔄 서버 재부팅!
                            <div style={{ fontSize: '12px', fontWeight: 'normal', opacity: 0.8, marginTop: '3px' }}>
                                {REQUIRED_CLICKS - clickCount}번 더 클릭하세요!
                            </div>
                        </button>

                        {/* 성공 시 보상 안내 */}
                        <div style={{
                            marginTop: '14px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '12px',
                            color: '#666',
                        }}>
                            <span>✅ 성공: 생산량 <strong style={{ color: '#22c55e' }}>2배</strong> (1분)</span>
                            <span>❌ 실패: 생산량 <strong style={{ color: '#ef4444' }}>절반</strong> (1분)</span>
                        </div>
                    </>
                )}

                {phase === 'success' && (
                    <div style={{ textAlign: 'center', padding: '10px 0' }}>
                        <div style={{ fontSize: '56px', marginBottom: '12px' }}>🎉</div>
                        <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#22c55e' }}>서버 복구 성공!</div>
                        <div style={{ fontSize: '14px', color: '#aaa', marginTop: '8px' }}>
                            위기 극복 보상: <strong style={{ color: '#22c55e' }}>생산량 2배 (1분)</strong>
                        </div>
                    </div>
                )}

                {phase === 'fail' && (
                    <div style={{ textAlign: 'center', padding: '10px 0' }}>
                        <div style={{ fontSize: '56px', marginBottom: '12px' }}>💥</div>
                        <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#ef4444' }}>서버 다운!</div>
                        <div style={{ fontSize: '14px', color: '#aaa', marginTop: '8px' }}>
                            패널티: <strong style={{ color: '#ef4444' }}>생산량 절반 (1분)</strong>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
