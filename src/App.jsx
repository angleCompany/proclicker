/* eslint-disable */
import { useState } from 'react';
import { useGameState } from './hooks/useGameState';
import StatsBar from './components/StatsBar';
import CodingArea from './components/CodingArea';
import BoostBar from './components/BoostBar';
import Shop from './components/Shop';
import RandomEvent from './components/RandomEvent';
import Hackathon from './components/Hackathon';
import AchievementPopup from './components/AchievementPopup';
import AchievementModal from './components/AchievementModal';
import RebirthModal from './components/RebirthModal';
import CrewModal from './components/CrewModal';
import GachaReveal from './components/GachaReveal';
import AdModal from './components/AdModal';
import { useSound } from './hooks/useSound';
import { adService } from './services/adService';
import './index.css';

function App() {
  const [showAchievements, setShowAchievements] = useState(false);
  const [showRebirth, setShowRebirth] = useState(false);
  const [showCrew, setShowCrew] = useState(false);
  const [adConfig, setAdConfig] = useState(null);
  const { isMuted, toggleMute, playClick, playBuySound } = useSound();

  const {
    state,
    click,
    buyAutoItem,
    buyClickItem,
    buySpecialItem,
    triggerRandomEvent,
    resetGame,
    applyAdReward,
    rebirth,
    scoutCrew,
    clearLastScout,
  } = useGameState();

  // 광고 전용 이벤트 리스너
  useState(() => {
    const handleShowAd = (e) => {
      setAdConfig(e.detail);
    };
    window.addEventListener('SHOW_AD_MODAL', handleShowAd);
    return () => window.removeEventListener('SHOW_AD_MODAL', handleShowAd);
  }, []);

  const handleMainClick = () => {
    click();
    playClick();
  };

  const handleBuySpecial = (index) => {
    buySpecialItem(index);
    playBuySound();
  };

  const handleShowAd = async () => {
    const success = await adService.showRewardedAd();
    if (success) {
      applyAdReward();
    }
  };

  // -------------------------------------------------------------------
  // [개발용 치트 / 디버깅 편의] 콘솔에서 window.gameState 객체를 통해 수치 강제 조작 및 테스트 가능
  // -------------------------------------------------------------------
  if (import.meta.env.DEV) {
    window.gameState = state;
    // eslint-disable-next-line
    window.gameDispatch = {
      click,
      buyAutoItem,
      buyClickItem,
      buySpecialItem,
      triggerRandomEvent,
      resetGame,
      applyAdReward
    };
  }
  // -------------------------------------------------------------------

  if (!state) return null;

  const handleReset = () => {
    if (window.confirm('정말로 게임을 초기화하시겠습니까?\n모든 진행 상황이 삭제됩니다.')) {
      resetGame();
    }
  };

  return (
    <div className="app">
      {/* 화면 위를 떠다니는 랜덤 이벤트 (황금 쿠키) */}
      <RandomEvent onTrigger={(type) => {
        triggerRandomEvent(type);
        playBuySound(); // 획득 시 특별한 소리 재생
      }} />

      {/* 모바일: 상단 스탯 바 / 데스크탑: 좌측 패널에 내장 */}
      <StatsBar
        state={state}
        onReset={handleReset}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        onOpenAchievements={() => setShowAchievements(true)}
        onOpenRebirth={() => setShowRebirth(true)}
        onOpenCrew={() => setShowCrew(true)}
      />

      <div className="app__body">
        {/* 좌측 패널: 코딩 영역 */}
        <div className="app__left">
          <BoostBar boosts={state.boosts} />
          <CodingArea state={state} onClick={handleMainClick} />
        </div>

        {/* 우측 패널: 상점 + 광고 */}
        <div className="app__right">
          <Shop
            state={state}
            onBuyAuto={(idx) => { buyAutoItem(idx); playBuySound(); }}
            onBuyClick={(idx) => { buyClickItem(idx); playBuySound(); }}
            onBuySpecial={handleBuySpecial}
            onShowAd={handleShowAd}
            onPlaySound={playBuySound}
          />
        </div>
      </div>

      <Hackathon onPlaySound={playBuySound} />
      <AchievementPopup />
      {showAchievements && <AchievementModal onClose={() => setShowAchievements(false)} />}

      {showRebirth && (
        <RebirthModal
          state={state}
          onClose={() => setShowRebirth(false)}
          onRebirth={rebirth}
          onPlaySound={playBuySound}
        />
      )}

      {showCrew && (
        <CrewModal
          state={state}
          onClose={() => setShowCrew(false)}
          onScout={scoutCrew}
          onPlaySound={playBuySound}
        />
      )}

      {/* 가챠 연출 오버레이 (영입 발생 시 최상단 렌더링) */}
      <GachaReveal
        lastScoutedCrews={state.lastScoutedCrews}
        onClear={clearLastScout}
      />

      {adConfig && (
        <AdModal
          seconds={adConfig.seconds}
          onComplete={() => {
            adConfig.onComplete();
            setAdConfig(null);
          }}
          onCancel={() => {
            adConfig.onCancel();
            setAdConfig(null);
          }}
        />
      )}
    </div>
  );
}

export default App;
