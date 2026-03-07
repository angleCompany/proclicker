import React, { useState } from 'react';
import { crewList, getGachaCost, formatNumber } from '../data/gameData';

export default function CrewModal({ state, onClose, onScout, onPlaySound }) {
    const cost = getGachaCost(state);
    const canScout1 = state.codingPower >= cost;
    const canScout10 = state.codingPower >= cost * 10;
    const [scoutAmount, setScoutAmount] = useState(1);

    const handleScout = (amount) => {
        if (state.codingPower < cost * amount) return;
        onPlaySound && onPlaySound();
        onScout(amount);
    };

    const getGradeColor = (grade) => {
        switch (grade) {
            case 'N': return '#aaa';
            case 'R': return '#4da6ff';
            case 'SR': return '#b366ff';
            case 'SSR': return '#ffcc00';
            case 'UR': return '#ff3333';
            default: return '#fff';
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose} style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.8)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{
                background: '#1a1a24', padding: '20px', borderRadius: '15px',
                width: '90%', maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto',
                border: '1px solid #334', color: '#fff'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>📇</span> 개발팀 스카웃 센터
                    </h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
                </div>

                <div style={{
                    background: '#223', padding: '15px', borderRadius: '10px', marginBottom: '20px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #334'
                }}>
                    <div>
                        <div style={{ fontSize: '14px', color: '#88a' }}>현재 코딩 파워</div>
                        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#4da6ff' }}>{formatNumber(state.codingPower)}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '14px', color: '#88a' }}>1회 영입 비용</div>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffcc00' }}>{formatNumber(cost)}</div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
                    <button
                        onClick={() => handleScout(1)}
                        disabled={!canScout1}
                        style={{
                            flex: 1, padding: '12px', borderRadius: '8px', border: 'none',
                            background: canScout1 ? 'linear-gradient(to bottom, #4a4a6a, #2a2a4a)' : '#222',
                            color: canScout1 ? '#fff' : '#555', cursor: canScout1 ? 'pointer' : 'not-allowed',
                            fontWeight: 'bold', fontSize: '16px'
                        }}
                    >
                        1명 스카웃
                    </button>
                    <button
                        onClick={() => handleScout(10)}
                        disabled={!canScout10}
                        style={{
                            flex: 1, padding: '12px', borderRadius: '8px', border: 'none',
                            background: canScout10 ? 'linear-gradient(to bottom, #d4af37, #9b870c)' : '#222',
                            color: canScout10 ? '#fff' : '#555', cursor: canScout10 ? 'pointer' : 'not-allowed',
                            fontWeight: 'bold', fontSize: '16px'
                        }}
                    >
                        10명 연속 스카웃
                    </button>
                </div>

                <h3 style={{ borderBottom: '1px solid #334', paddingBottom: '10px', color: '#aac' }}>전체 크루 도감</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
                    {crewList.map(crew => {
                        const invData = (state.inventory || []).find(inv => inv.id === crew.id);
                        const isOwned = !!invData;
                        const level = isOwned ? invData.level : 0;
                        const gradeColor = getGradeColor(crew.grade);

                        return (
                            <div key={crew.id} style={{
                                background: isOwned ? '#2a2a35' : '#111',
                                border: `1px solid ${isOwned ? gradeColor : '#333'}`,
                                borderRadius: '8px', padding: '10px', textAlign: 'center',
                                opacity: isOwned ? 1 : 0.4,
                                position: 'relative'
                            }}>
                                <div style={{ fontSize: '30px', marginBottom: '5px' }}>{isOwned ? crew.icon : '❓'}</div>
                                <div style={{ fontSize: '12px', fontWeight: 'bold', color: gradeColor }}>[{crew.grade}]</div>
                                <div style={{ fontSize: '13px', margin: '5px 0', color: isOwned ? '#fff' : '#555' }}>
                                    {crew.name}
                                </div>
                                {isOwned && (
                                    <>
                                        <div style={{ fontSize: '11px', color: '#88a' }}>{crew.effectDesc}</div>
                                        <div style={{
                                            position: 'absolute', top: '-5px', right: '-5px',
                                            background: '#ff3333', color: '#fff', fontSize: '11px',
                                            fontWeight: 'bold', padding: '2px 6px', borderRadius: '10px'
                                        }}>
                                            Lv.{level}
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
