import React, { useEffect, useState } from 'react';
import { useGameState } from '../hooks/useGameState';

export default function AchievementPopup() {
    const { state, clearNewAchievements } = useGameState();
    const [popupItem, setPopupItem] = useState(null);

    useEffect(() => {
        if (state.newAchievements && state.newAchievements.length > 0) {
            // 한 번에 하나씩 팝업을 보여주기 위해 첫 번째 항목 선택
            const item = state.newAchievements[0];
            setPopupItem(item);

            // 처리한 업적은 상태에서 비우기
            clearNewAchievements();

            // 3초 뒤 팝업 닫기
            const timer = setTimeout(() => {
                setPopupItem(null);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [state.newAchievements, clearNewAchievements]);

    if (!popupItem) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(255, 215, 0, 0.95)',
            color: '#333',
            padding: '12px 24px',
            borderRadius: '50px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            zIndex: 9999,
            animation: 'slideUp 0.5s ease-out, fadeOut 0.5s ease-in 2.5s forwards',
            fontWeight: 'bold'
        }}>
            <span style={{ fontSize: '24px' }}>{popupItem.icon}</span>
            <div>
                <div style={{ fontSize: '12px', opacity: 0.8, textTransform: 'uppercase' }}>결과 도출! 업적 달성</div>
                <div style={{ fontSize: '16px' }}>{popupItem.name}</div>
            </div>

            <style>{`
                @keyframes slideUp {
                    from { transform: translate(-50%, 100%); opacity: 0; }
                    to { transform: translate(-50%, 0); opacity: 1; }
                }
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
            `}</style>
        </div>
    );
}
