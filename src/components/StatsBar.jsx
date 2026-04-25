import { formatNumber } from '../data/gameData';
import ShareButton from './ShareButton';

export default function StatsBar({
  state,
  onReset,
  isMuted,
  onToggleMute,
  onOpenAchievements,
  onOpenRebirth,
  onOpenCrew,
  onOpenDailyQuests,
  dailyQuestsHasUnclaimed,
  onOpenWeeklyChallenge,
  weeklyHasUnclaimed,
  onExportSave,
  onImportSave,
}) {
  const boostMultiplier = getActiveBoostMultiplier(state.boosts);
  const showRebirthBtn =
    state.totalCodingPower >= 1_000_000_000 || state.rebirthCount > 0;

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
              className="nav-btn nav-btn--rebirth"
              onClick={onOpenRebirth}
              aria-label="퇴사표 던지기"
            >
              <span className="nav-btn__icon">🔥</span>
              <span className="nav-btn__label">퇴사표 던지기</span>
            </button>
          )}

          <div className="nav-cluster nav-cluster--main">
            <button
              className="nav-btn nav-btn--scout"
              onClick={onOpenCrew}
              aria-label="스카웃"
            >
              <span className="nav-btn__icon">📇</span>
              <span className="nav-btn__label">스카웃</span>
            </button>

            <button
              className="nav-btn nav-btn--weekly"
              onClick={onOpenWeeklyChallenge}
              aria-label="주간챌린지"
            >
              <span className="nav-btn__icon">🗓️</span>
              <span className="nav-btn__label">주간챌린지</span>
              {weeklyHasUnclaimed && (
                <span className="nav-btn__badge" aria-label="주간 챌린지 보상 있음" />
              )}
            </button>

            <button
              className="nav-btn nav-btn--quests"
              onClick={onOpenDailyQuests}
              aria-label="일일퀘스트"
            >
              <span className="nav-btn__icon">📋</span>
              <span className="nav-btn__label">일일퀘스트</span>
              {dailyQuestsHasUnclaimed && (
                <span className="nav-btn__badge" aria-label="미수령 보상 있음" />
              )}
            </button>

            <button
              className="nav-btn nav-btn--achievements"
              onClick={onOpenAchievements}
              aria-label="업적"
            >
              <span className="nav-btn__icon">🏆</span>
              <span className="nav-btn__label">업적</span>
            </button>
          </div>

          <ShareButton state={state} />

          <div className="nav-cluster nav-cluster--utility">
            <button
              className="nav-btn nav-btn--export"
              onClick={onExportSave}
              aria-label="저장"
              title="데이터 백업"
            >
              <span className="nav-btn__icon">💾</span>
              <span className="nav-btn__label">저장</span>
            </button>
            <button
              className="nav-btn nav-btn--import"
              onClick={onImportSave}
              aria-label="불러오기"
              title="데이터 복구"
            >
              <span className="nav-btn__icon">📂</span>
              <span className="nav-btn__label">복구</span>
            </button>
            <button
              className="nav-btn nav-btn--mute"
              onClick={onToggleMute}
              aria-label={isMuted ? '소리 켜기' : '소리 끄기'}
              title={isMuted ? '소리 켜기' : '소리 끄기'}
            >
              <span className="nav-btn__icon">{isMuted ? '🔇' : '🔊'}</span>
              <span className="nav-btn__label">{isMuted ? '소리 끔' : '소리 켬'}</span>
            </button>

            <button
              className="nav-btn nav-btn--reset"
              onClick={onReset}
              aria-label="초기화"
              title="게임 초기화"
            >
              <span className="nav-btn__icon">🔄</span>
              <span className="nav-btn__label">초기화</span>
            </button>
          </div>
        </div>
      </div>

      <div className="stats-bar__power">
        <div className="stats-bar__power-label">코딩력</div>
        <div className="stats-bar__power-value">
          {formatNumber(state.codingPower)}
        </div>
        {(state.gems > 0 || import.meta.env.DEV) && (
          <div className="stats-bar__gems" style={{ marginTop: '4px', fontSize: '14px', color: '#60a5fa', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }} onClick={() => window.gameDispatch?.addGems && window.gameDispatch.addGems(100)} title="보석 (개발 환경 클릭 시 100 획득)">
            <span style={{ fontSize: '16px' }}>💎</span>
            <span style={{ fontWeight: 700 }}>{state.gems || 0}</span>
          </div>
        )}
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
  const active = boosts.filter((b) => b.endTime > now);
  if (active.length === 0) return 1;
  return active.reduce((max, b) => Math.max(max, b.multiplier), 1);
}
