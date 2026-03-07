import React from 'react';
import { useGameState } from '../hooks/useGameState';
import { achievementsList } from '../data/gameData';

export default function AchievementModal({ onClose }) {
    const { state } = useGameState();

    const renderAchievement = (ach) => {
        const isUnlocked = state.achievements.includes(ach.id);

        return (
            <div key={ach.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                padding: '15px',
                marginBottom: '10px',
                borderRadius: '8px',
                backgroundColor: isUnlocked ? 'rgba(255, 215, 0, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                border: isUnlocked ? '1px solid rgba(255, 215, 0, 0.5)' : '1px solid transparent',
                opacity: isUnlocked ? 1 : 0.5,
                transition: 'all 0.3s ease'
            }}>
                <div style={{
                    fontSize: '40px',
                    filter: isUnlocked ? 'none' : 'grayscale(100%)',
                    textShadow: isUnlocked ? '0 0 10px rgba(255,215,0,0.5)' : 'none'
                }}>
                    {ach.icon}
                </div>
                <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 5px 0', color: isUnlocked ? '#ffd700' : '#ddd' }}>
                        {ach.name}
                    </h3>
                    <p style={{ margin: '0', fontSize: '14px', color: '#aaa' }}>
                        {ach.description}
                    </p>
                    <div style={{
                        marginTop: '8px',
                        fontSize: '12px',
                        color: isUnlocked ? '#8f8' : '#666',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                    }}>
                        {isUnlocked ? '✅' : '🔒'} {ach.rewardDesc}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10000,
            animation: 'fadeIn 0.2s ease-out'
        }}>
            <div style={{
                backgroundColor: '#1E1E2E',
                borderRadius: '16px',
                width: '90%',
                maxWidth: '500px',
                maxHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                border: '1px solid #333'
            }}>
                <div style={{
                    padding: '20px',
                    borderBottom: '1px solid #333',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '24px' }}>🏆</span>
                        나의 업적 ( {state.achievements.length} / {achievementsList.length} )
                    </h2>
                    <button onClick={onClose} style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#aaa',
                        fontSize: '24px',
                        cursor: 'pointer',
                        padding: '0 10px'
                    }}>×</button>
                </div>

                <div style={{
                    padding: '20px',
                    overflowY: 'auto',
                    flex: 1
                }}>
                    {achievementsList.map(renderAchievement)}
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
}
