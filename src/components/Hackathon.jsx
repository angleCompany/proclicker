/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import { useGameState } from '../hooks/useGameState';

export default function Hackathon({ onPlaySound }) {
    const { state, startHackathon, catchHackathonBug } = useGameState();
    const [inviteVisible, setInviteVisible] = useState(false);
    const [bugs, setBugs] = useState([]);
    const containerRef = useRef(null);

    // 1. 일정 주기마다 초대장 등장 로직 (예: 매 3~5분마다 등장, 여기서는 테스트를 위해 2분으로 설정)
    useEffect(() => {
        if (state.hackathon.isActive) {
            setInviteVisible(false);
            return;
        }

        const triggerInvite = () => {
            if (!state.hackathon.isActive && state.totalCodingPower > 1000) { // 너무 초반에는 안 나오게
                setInviteVisible(true);
            }
        };

        // 2분 ~ 3분 사이 랜덤
        const delay = 120000 + Math.random() * 60000;
        const timer = setTimeout(triggerInvite, delay);
        return () => clearTimeout(timer);
    }, [state.hackathon.isActive, state.totalCodingPower]);

    // 2. 해커톤 진행 중: 버그 스폰 로직
    useEffect(() => {
        if (!state.hackathon.isActive) {
            setBugs([]);
            return;
        }

        const spawnBug = () => {
            if (!containerRef.current) return;
            const container = containerRef.current.getBoundingClientRect();

            const newBug = {
                id: Date.now() + Math.random(),
                x: Math.random() * (container.width - 50),
                y: Math.random() * (container.height - 50),
                size: 30 + Math.random() * 30, // 30px ~ 60px
                duration: 1500 + Math.random() * 1500 // 1.5s ~ 3s 뒤 사라짐
            };

            setBugs(prev => [...prev.slice(-10), newBug]); // 최대 10마리 동시 유지

            // 일정 시간 후 자동으로 사라지는 로직
            setTimeout(() => {
                setBugs(prev => prev.filter(b => b.id !== newBug.id));
            }, newBug.duration);
        };

        const interval = setInterval(spawnBug, 800); // 0.8초마다 마리 생성
        return () => clearInterval(interval);
    }, [state.hackathon.isActive]);

    // [테스트(치트)용] 콘솔에서 window.gameDispatch.triggerHackathonInvite() 로 강제 호출 가능하게
    useEffect(() => {
        if (import.meta.env.DEV) {
            window.gameDispatch = window.gameDispatch || {};
            // eslint-disable-next-line
            window.gameDispatch.triggerHackathonInvite = () => setInviteVisible(true);
        }
    }, []);

    const handleAccept = () => {
        setInviteVisible(false);
        startHackathon();
    };

    const handleDecline = () => {
        setInviteVisible(false);
    };

    const handleCatchBug = (bugId) => {
        onPlaySound?.();
        // UI에서 즉시 제거
        setBugs(prev => prev.filter(b => b.id !== bugId));
        catchHackathonBug();
    };


    // -----------------------------------------------------
    // 렌더링 1. 초대장 상태
    if (inviteVisible && !state.hackathon.isActive) {
        return (
            <div style={{
                position: 'fixed', right: '20px', bottom: '100px',
                background: 'rgba(20, 20, 40, 0.95)', border: '2px solid #00ffcc',
                padding: '20px', borderRadius: '12px', zIndex: 9999,
                color: '#fff', boxShadow: '0 0 20px rgba(0,255,204,0.3)',
                animation: 'slideInRight 0.5s ease-out'
            }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#00ffcc' }}>📧 해커톤 초대장</h3>
                <p style={{ margin: '0 0 15px 0', fontSize: '14px' }}>
                    상금이 걸린 해커톤이 열렸습니다!<br />30초 안에 버그 20마리를 잡아주세요.
                </p>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={handleAccept} style={{ flex: 1, padding: '8px', background: '#00ffcc', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>수락 (30초)</button>
                    <button onClick={handleDecline} style={{ flex: 1, padding: '8px', background: '#444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>거절</button>
                </div>
            </div>
        );
    }

    // -----------------------------------------------------
    // 렌더링 2. 해커톤 진행 중 상태 (오버레이 및 버그 클릭 영역)
    if (state.hackathon.isActive) {
        return (
            <div ref={containerRef} style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                pointerEvents: 'none', // 이 레이어 자체는 클릭 무시 (뒤에 있는 게임판 클릭 가능유지)
                zIndex: 9000
            }}>
                {/* 상단 진행도 UI */}
                <div style={{
                    position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)',
                    background: 'rgba(0,0,0,0.8)', border: '1px solid #ff4444',
                    padding: '15px 30px', borderRadius: '30px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
                    pointerEvents: 'auto', boxShadow: '0 0 30px rgba(255,68,68,0.4)',
                }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff4444' }}>
                        ⏱️ 남은 시간: {state.hackathon.timeLeft.toFixed(1)}초
                    </div>
                    <div style={{ color: '#fff', fontSize: '18px' }}>
                        잡은 버그 🐛 : <span style={{ color: state.hackathon.bugsCaught >= 20 ? '#00ffcc' : '#fff', fontWeight: 'bold' }}>{state.hackathon.bugsCaught}</span> / 20
                    </div>
                </div>

                {/* 화면 붉은색 테두리 효과 (디버깅 / 긴박감 연출) */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    boxShadow: 'inset 0 0 50px rgba(255,0,0,0.2)',
                    animation: 'pulseGlow 2s infinite'
                }} />

                {/* 스폰된 버그들 */}
                {bugs.map(bug => (
                    <div
                        key={bug.id}
                        onClick={() => handleCatchBug(bug.id)}
                        style={{
                            position: 'absolute',
                            left: bug.x,
                            top: bug.y,
                            fontSize: bug.size + 'px',
                            cursor: 'crosshair',
                            pointerEvents: 'auto',
                            userSelect: 'none',
                            animation: 'bugJitter 0.1s infinite alternate',
                            filter: 'drop-shadow(0 0 5px rgba(255,0,0,0.8))'
                        }}
                    >
                        🐛
                    </div>
                ))}

                <style>{`
                    @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                    @keyframes pulseGlow { 0% { box-shadow: inset 0 0 20px rgba(255,0,0,0.1); } 50% { box-shadow: inset 0 0 60px rgba(255,0,0,0.3); } 100% { box-shadow: inset 0 0 20px rgba(255,0,0,0.1); } }
                    @keyframes bugJitter { 0% { transform: translate(0, 0) rotate(0deg); } 100% { transform: translate(3px, -3px) rotate(15deg); } }
                `}</style>
            </div>
        );
    }

    return null;
}
