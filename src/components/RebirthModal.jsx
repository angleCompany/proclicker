import React from 'react';
import { calculateEquity, formatNumber, getCurrentTitle, achievementsList } from '../data/gameData';

export default function RebirthModal({ state, onClose, onRebirth, onPlaySound }) {
    const earnedEquity = calculateEquity(state.totalCodingPower);
    const bonusPercent = earnedEquity * 2; // 지분 1당 2% 보너스

    const rebirthCount = state.rebirthCount || 0;
    
    let nextCompany = "스타트업";
    if (rebirthCount >= 1 && rebirthCount <= 2) nextCompany = "중견기업";
    else if (rebirthCount >= 3 && rebirthCount <= 4) nextCompany = "대기업";
    else if (rebirthCount === 5) nextCompany = "네카라쿠배";
    else if (rebirthCount >= 6) nextCompany = "FAANG / 나만의 스타트업 창업";

    const currentTitle = getCurrentTitle(state.totalCodingPower);

    const handleConfirm = () => {
        if (earnedEquity <= 0) {
            alert('아직 이직을 시도하기엔 포트폴리오가 부족합니다! (코딩 파워 10억 이상 필요)');
            return;
        }

        const isSure = window.confirm(
            `⚠️ 정말 ${nextCompany}(으)로 이직하시겠습니까?\n\n` +
            '그동안 모은 코딩 파워, 아이템, 칭호가 전부 초기화되며 처음부터 다시 시작합니다!\n' +
            '(단, 달성한 업적과 현재 보유한 스톡옵션(지분)은 유지됩니다.)'
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
                background: 'linear-gradient(145deg, #1e1e2f, #2a2a40)', padding: '30px 40px',
                borderRadius: '20px', minWidth: '380px', maxWidth: '500px',
                boxShadow: '0 0 50px rgba(100, 200, 255, 0.3)', border: '2px solid #64c8ff',
                color: '#fff', textAlign: 'center', animation: 'scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                maxHeight: '90vh', overflowY: 'auto'
            }}>
                <div style={{ fontSize: '50px', marginBottom: '10px' }}>🏢✉️</div>
                <h2 style={{ margin: '0 0 5px 0', color: '#64c8ff', fontSize: '26px' }}>새 오퍼가 도착했습니다!</h2>
                <h4 style={{ margin: '0 0 20px 0', color: '#a0a0b0', fontWeight: 'normal' }}>다음 목표: {nextCompany}</h4>

                <p style={{ lineHeight: '1.5', marginBottom: '20px', color: '#ddd', fontSize: '15px' }}>
                    당신의 놀라운 코딩 능력에 감탄한 헤드헌터가 연락을 주었습니다.<br />
                    하지만 이직을 하려면 <strong>지금 다니는 회사를 그만두고</strong><br />
                    새로운 환경에서 밑바닥부터 다시 시작해야 합니다.
                </p>

                {/* 이력서 요약 카드 */}
                <div style={{
                    background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px',
                    marginBottom: '20px', border: '1px solid rgba(255,255,255,0.1)',
                    textAlign: 'left'
                }}>
                    <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                        📋 이번 생의 이력서 요약
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px' }}>
                        <div style={{ color: '#aaa' }}>총 타건 횟수:</div>
                        <div style={{ fontWeight: 'bold', textAlign: 'right' }}>{formatNumber(state.stats?.totalClicks || 0)}번</div>
                        
                        <div style={{ color: '#aaa' }}>최고 달성 칭호:</div>
                        <div style={{ fontWeight: 'bold', textAlign: 'right', color: '#ffd700' }}>{currentTitle.icon} {currentTitle.title}</div>
                        
                        <div style={{ color: '#aaa' }}>달성한 업적:</div>
                        <div style={{ fontWeight: 'bold', textAlign: 'right' }}>{state.achievements?.length || 0} / {achievementsList.length}개</div>
                        
                        <div style={{ color: '#aaa' }}>해커톤 우승:</div>
                        <div style={{ fontWeight: 'bold', textAlign: 'right' }}>{state.stats?.hackathonWins || 0}회</div>
                    </div>
                </div>

                <div style={{
                    background: 'rgba(0,0,0,0.5)', padding: '15px', borderRadius: '15px',
                    marginBottom: '20px', border: '1px solid #444'
                }}>
                    <div style={{ marginBottom: '10px', fontSize: '14px' }}>
                        <span style={{ color: '#888' }}>현재 총 누적 파워: </span>
                        <strong style={{ fontSize: '16px' }}>{formatNumber(state.totalCodingPower)}</strong>
                    </div>
                    <div style={{ marginBottom: '10px', fontSize: '14px' }}>
                        <span style={{ color: '#888' }}>현재 보유 스톡옵션: </span>
                        <strong style={{ fontSize: '16px', color: '#00ccff' }}>{state.equity || 0} 주</strong>
                    </div>
                    <div style={{
                        borderTop: '1px dashed #666', paddingTop: '10px',
                        color: earnedEquity > 0 ? '#00ffcc' : '#ff4444', fontWeight: 'bold', fontSize: '15px'
                    }}>
                        이직 시 얻을 스톡옵션: +{formatNumber(earnedEquity)} 주
                        <div style={{ fontSize: '12px', marginTop: '5px', opacity: 0.8 }}>
                            (영구 보너스: 전체 효율 +{formatNumber(bonusPercent)}%)
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                    <button onClick={handleConfirm} disabled={earnedEquity <= 0} style={{
                        padding: '15px 20px', fontSize: '16px', fontWeight: 'bold',
                        background: earnedEquity > 0 ? 'linear-gradient(45deg, #0088ff, #00bbff)' : '#555',
                        color: '#fff', border: 'none', borderRadius: '10px',
                        cursor: earnedEquity > 0 ? 'pointer' : 'not-allowed',
                        boxShadow: earnedEquity > 0 ? '0 5px 15px rgba(0, 136, 255, 0.4)' : 'none',
                        transition: 'all 0.2s', flex: 1
                    }}>
                        {earnedEquity > 0 ? '🤝 오퍼 수락 (환생)' : '경험치 부족 (10억 필요)'}
                    </button>
                    <button onClick={onClose} style={{
                        padding: '15px 20px', fontSize: '16px', fontWeight: 'bold',
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
