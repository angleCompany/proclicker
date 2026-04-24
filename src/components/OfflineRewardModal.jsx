import { formatNumber } from '../data/gameData';

export default function OfflineRewardModal({ reward, onClose, onWatchAd }) {
    const hours = Math.floor(reward.seconds / 3600);
    const minutes = Math.floor((reward.seconds % 3600) / 60);

    let timeText = '';
    if (hours > 0) timeText += `${hours}시간 `;
    if (minutes > 0) timeText += `${minutes}분`;
    if (!timeText) timeText = '잠시';

    return (
        <div className="modal-overlay">
            <div className="offline-reward-modal">
                <div className="offline-reward-icon">💤</div>
                <h3>오프라인 보상</h3>
                <p className="offline-reward-desc">
                    자리를 비운 <strong>{timeText}</strong> 동안<br />팀원들이 열심히 코딩했어요!
                </p>
                <div className="offline-reward-amount">
                    +{formatNumber(reward.amount)}
                    <span className="offline-reward-unit"> 코딩력</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                    <button
                        style={{
                            padding: '12px 24px',
                            fontSize: '15px',
                            fontWeight: 'bold',
                            background: 'linear-gradient(45deg, #ffd700, #ffaa00)',
                            color: '#1a1a1a',
                            border: 'none',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            boxShadow: '0 3px 12px rgba(255,215,0,0.5)',
                            width: '100%',
                        }}
                        onClick={onWatchAd}
                    >
                        📺 광고 보고 1.5배 받기!
                        <div style={{ fontSize: '12px', fontWeight: 'normal', marginTop: '2px', opacity: 0.8 }}>
                            +{formatNumber(reward.amount * 1.5)} 코딩력
                        </div>
                    </button>
                    <button className="offline-reward-btn" onClick={onClose}
                        style={{ opacity: 0.7, fontSize: '14px' }}>
                        그냥 받기
                    </button>
                </div>
            </div>
        </div>
    );
}
