import React, { useState } from 'react';
import { achievementsList } from '../data/gameData';

const CATEGORIES = [
    { key: 'all', label: '전체', icon: '🏆' },
    { key: 'click', label: '클릭', icon: '🖱️' },
    { key: 'power', label: '파워', icon: '💰' },
    { key: 'shop', label: '상점', icon: '🛒' },
    { key: 'gamble', label: '도박', icon: '🎲' },
    { key: 'hackathon', label: '해커톤', icon: '💻' },
    { key: 'rebirth', label: '각성', icon: '🔄' },
    { key: 'crew', label: '크루', icon: '👥' },
    { key: 'combo', label: '콤보', icon: '🔥' },
];

export default function AchievementModal({ state, onClose }) {
    const [activeCategory, setActiveCategory] = useState('all');

    const filteredAchievements = activeCategory === 'all'
        ? achievementsList
        : achievementsList.filter(a => a.category === activeCategory);

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
                {/* Header */}
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

                {/* Category Tabs */}
                <div style={{
                    display: 'flex',
                    gap: '6px',
                    padding: '10px 16px',
                    overflowX: 'auto',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    flexShrink: 0
                }}>
                    {CATEGORIES.map(cat => {
                        const isActive = activeCategory === cat.key;
                        const catList = cat.key === 'all'
                            ? achievementsList
                            : achievementsList.filter(a => a.category === cat.key);
                        const unlockedCount = catList.filter(a => state.achievements.includes(a.id)).length;
                        return (
                            <button
                                key={cat.key}
                                onClick={() => setActiveCategory(cat.key)}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '2px',
                                    padding: '6px 10px',
                                    borderRadius: '10px',
                                    border: isActive ? '1px solid rgba(255,215,0,0.6)' : '1px solid rgba(255,255,255,0.1)',
                                    background: isActive ? 'rgba(255,215,0,0.12)' : 'rgba(255,255,255,0.04)',
                                    color: isActive ? '#ffd700' : '#888',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    fontSize: '11px',
                                    fontWeight: isActive ? 'bold' : 'normal',
                                    transition: 'all 0.2s',
                                    flexShrink: 0
                                }}
                            >
                                <span style={{ fontSize: '16px' }}>{cat.icon}</span>
                                <span>{cat.label}</span>
                                <span style={{
                                    fontSize: '10px',
                                    color: isActive ? '#ffcc00' : '#666'
                                }}>
                                    {unlockedCount}/{catList.length}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Achievement List */}
                <div style={{
                    padding: '20px',
                    overflowY: 'auto',
                    flex: 1
                }}>
                    {filteredAchievements.length === 0 ? (
                        <div style={{ textAlign: 'center', color: '#555', padding: '30px 0', fontSize: '14px' }}>
                            이 카테고리에 업적이 없습니다.
                        </div>
                    ) : (
                        filteredAchievements.map(renderAchievement)
                    )}
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                ::-webkit-scrollbar { display: none; }
            `}</style>
        </div>
    );
}
