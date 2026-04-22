import { formatNumber } from '../data/gameData';

export default function OfflineRewardModal({ reward, onClose }) {
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
                <button className="offline-reward-btn" onClick={onClose}>
                    받기!
                </button>
            </div>
        </div>
    );
}
