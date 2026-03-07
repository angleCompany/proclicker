import React from 'react';
import { calculateEquity, formatNumber } from '../data/gameData';

export default function RebirthModal({ state, onClose, onRebirth, onPlaySound }) {
    const earnedEquity = calculateEquity(state.totalCodingPower);
    const bonusPercent = earnedEquity * 2; // 지분 1당 2% 보너스

    const handleConfirm = () => {
        if (earnedEquity <= 0) {
            alert('아직 창업을 시도하기엔 역량이 부족합니다! (코딩 파워 10억 이상 필요)');
            return;
        }

        const isSure = window.confirm(
            '⚠️ 정말 퇴사표를 던지시겠습니까?\n\n' +
            '그동안 모은 코딩 파워, 아이템, 칭호가 전부 초기화되며 처음부터 다시 시작합니다!\n' +
            '(단, 달성한 업적과 현재 보유한 스타트업 지분은 유지됩니다.)'
        );

        if (isSure) {
            onPlaySound?.();
            onRebirth();
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose} style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', zIndex: 10000,
            backdropFilter: 'blur(10px)'
        }}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{
                background: 'linear-gradient(145deg, #1e1e2f, #2a2a40)', padding: '40px',
                borderRadius: '20px', minWidth: '350px', maxWidth: '500px',
                boxShadow: '0 0 50px rgba(255, 68, 68, 0.3)', border: '2px solid #ff4444',
                color: '#fff', textAlign: 'center', animation: 'scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}>
                <div style={{ fontSize: '60px', marginBottom: '10px' }}>🔥💼</div>
                <h2 style={{ margin: '0 0 10px 0', color: '#ff4444', fontSize: '28px' }}>퇴사 후 스타트업 창업</h2>
                <h4 style={{ margin: '0 0 30px 0', color: '#a0a0b0', fontWeight: 'normal' }}>(환생 시스템)</h4>

                <p style={{ lineHeight: '1.6', marginBottom: '30px', color: '#ddd' }}>
                    당신의 놀라운 코딩 능력에 감탄한 엔젤 투자자가 나타났습니다.<br />
                    하지만 투자를 받으려면 <strong>지금 다니는 회사를 당장 그만두고</strong><br />
                    오직 맨몸으로 스타트업 대표로서 다시 시작해야 합니다.
                </p>

                <div style={{
                    background: 'rgba(0,0,0,0.5)', padding: '20px', borderRadius: '15px',
                    marginBottom: '30px', border: '1px solid #444'
                }}>
                    <div style={{ marginBottom: '15px' }}>
                        <span style={{ color: '#888' }}>현재 총 누적 파워:</span>
                        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{formatNumber(state.totalCodingPower)}</div>
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <span style={{ color: '#888' }}>현재 보유 지분:</span>
                        <div style={{ fontSize: '20px', color: '#00ccff' }}>{state.equity || 0} 주</div>
                    </div>
                    <div style={{
                        borderTop: '1px dashed #666', paddingTop: '15px',
                        color: earnedEquity > 0 ? '#00ffcc' : '#ff4444', fontWeight: 'bold'
                    }}>
                        환생 시 얻을 지분: +{formatNumber(earnedEquity)} 주
                        <div style={{ fontSize: '14px', marginTop: '5px', opacity: 0.8 }}>
                            (영구 보너스: 전체 효율 +{formatNumber(bonusPercent)}%)
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                    <button onClick={handleConfirm} disabled={earnedEquity <= 0} style={{
                        padding: '15px 30px', fontSize: '18px', fontWeight: 'bold',
                        background: earnedEquity > 0 ? 'linear-gradient(45deg, #ff4444, #ff8888)' : '#555',
                        color: '#fff', border: 'none', borderRadius: '10px',
                        cursor: earnedEquity > 0 ? 'pointer' : 'not-allowed',
                        boxShadow: earnedEquity > 0 ? '0 5px 15px rgba(255, 68, 68, 0.4)' : 'none',
                        transition: 'all 0.2s', flex: 1
                    }}>
                        {earnedEquity > 0 ? '🔥 사직서 제출 (환생)' : '경험치 부족 (10억 필요)'}
                    </button>
                    <button onClick={onClose} style={{
                        padding: '15px 30px', fontSize: '18px', fontWeight: 'bold',
                        background: 'transparent', color: '#aaa', border: '2px solid #555',
                        borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s'
                    }}>
                        돌아가기
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes scaleIn { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
                .modal-content button:not(:disabled):hover { transform: translateY(-2px); filter: brightness(1.1); }
            `}</style>
        </div>
    );
}
