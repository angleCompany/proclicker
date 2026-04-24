import { useState, useEffect } from 'react';
import { useGameState } from '../hooks/useGameState';

export default function AchievementPopup() {
    const { state, clearNewAchievements } = useGameState();
    const [queue, setQueue] = useState([]);
    const [visible, setVisible] = useState(false);

    // When new achievements arrive, push to queue and clear state
    useEffect(() => {
        if (state.newAchievements && state.newAchievements.length > 0) {
            setQueue(prev => [...prev, ...state.newAchievements]);
            clearNewAchievements();
        }
    }, [state.newAchievements]);

    // Process queue: show item, then remove after 3.2s
    useEffect(() => {
        if (queue.length === 0) {
            setVisible(false);
            return;
        }
        setVisible(true);
        const timer = setTimeout(() => {
            setQueue(prev => prev.slice(1));
        }, 3200);
        return () => clearTimeout(timer);
    }, [queue]);

    const current = queue[0];
    if (!current || !visible) return null;

    return (
        <div style={{
            position: 'fixed',
            top: '80px',
            right: '16px',
            zIndex: 9999,
            animation: 'achievementSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            maxWidth: '280px',
        }}>
            <div style={{
                background: 'linear-gradient(135deg, #1e1e2f, #2a2a40)',
                border: '1px solid rgba(99,102,241,0.5)',
                borderRadius: '12px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(99,102,241,0.2)',
                color: '#fff',
            }}>
                <div style={{ fontSize: '28px', flexShrink: 0 }}>{current.icon || '🏆'}</div>
                <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '11px', color: '#a5b4fc', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '2px' }}>
                        업적 달성!
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9' }}>{current.name}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{current.rewardDesc}</div>
                </div>
            </div>
            {queue.length > 1 && (
                <div style={{ textAlign: 'right', fontSize: '10px', color: '#64748b', marginTop: '4px', paddingRight: '4px' }}>
                    +{queue.length - 1}개 더
                </div>
            )}
            <style>{`
                @keyframes achievementSlideIn {
                    0% { transform: translateX(120%); opacity: 0; }
                    100% { transform: translateX(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
