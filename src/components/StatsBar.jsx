import { formatNumber } from '../data/gameData';
import ShareButton from './ShareButton';

export default function StatsBar({ state, onReset, isMuted, onToggleMute, onOpenAchievements, onOpenRebirth, onOpenCrew }) {
    const boostMultiplier = getActiveBoostMultiplier(state.boosts);
    const showRebirthBtn = state.totalCodingPower >= 1000000000 || state.rebirthCount > 0;

    return (
        <div className="stats-bar">
            <div className="stats-bar__title-row">
                <div className="stats-bar__title">
                    <span className="stats-bar__title-icon">💻</span>
                    <span className="stats-bar__title-text">코딩 마스터</span>
                </div>
                <div className="stats-bar__actions">
                    {showRebirthBtn && (
                        <button
                            className="stats-bar__rebirth"
                            style={{
                                background: 'linear-gradient(45deg, #ff4444, #ff8888)',
                                color: 'white', border: 'none', borderRadius: '4px',
                                padding: '5px 10px', marginRight: '5px', fontWeight: 'bold',
                                cursor: 'pointer', animation: 'pulse 1s infinite alternate'
                            }}
                            onClick={onOpenRebirth}
                        >
                            🔥 퇴사표 던지기
                        </button>
                    )}
                    <button className="stats-bar__crew" onClick={onOpenCrew} style={{ background: '#2a2a40', color: '#fff', border: '1px solid #4da6ff' }}>
                        📇 스카웃
                    </button>
                    <button className="stats-bar__achievements" onClick={onOpenAchievements}>
                        🏆 업적
                    </button>
                    <ShareButton state={state} />
                    <button className="stats-bar__mute" onClick={onToggleMute}>
                        {isMuted ? '🔇 소리 끔' : '🔊 소리 켬'}
                    </button>
                    <button className="stats-bar__reset" onClick={onReset}>
                        🔄 초기화
                    </button>
                </div>
            </div>

            <div className="stats-bar__power">
                <div className="stats-bar__power-label">코딩력</div>
                <div className="stats-bar__power-value">
                    {formatNumber(state.codingPower)}
                </div>
            </div>

            <div className="stats-bar__metrics">
                <div className="stats-bar__metric">
                    <span className="stats-bar__metric-icon">⚡</span>
                    <span className="stats-bar__metric-value">
                        {formatNumber(state.perClick * boostMultiplier)}
                    </span>
                    <span className="stats-bar__metric-label">/클릭</span>
                </div>
                <div className="stats-bar__metric">
                    <span className="stats-bar__metric-icon">🔄</span>
                    <span className="stats-bar__metric-value">
                        {formatNumber(state.perSecond * boostMultiplier)}
                    </span>
                    <span className="stats-bar__metric-label">/초</span>
                </div>
            </div>
        </div>
    );
}

function getActiveBoostMultiplier(boosts = []) {
    const now = Date.now();
    const active = boosts.filter(b => b.endTime > now);
    if (active.length === 0) return 1;
    return active.reduce((max, b) => Math.max(max, b.multiplier), 1);
}
