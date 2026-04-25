import { useState, useEffect } from 'react';
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
import OfflineRewardModal from './components/OfflineRewardModal';
import DailyQuestModal from './components/DailyQuestModal';
import WeeklyChallengeModal from './components/WeeklyChallengeModal';
import DailyBonusModal from './components/DailyBonusModal';
import ResetConfirmModal from './components/ResetConfirmModal';
import AdRewardChoiceModal from './components/AdRewardChoiceModal';
import ServerCrashModal from './components/ServerCrashModal';
import { useSound } from './hooks/useSound';
import { adService } from './services/adService';
import './index.css';

function App() {
  const [showAchievements, setShowAchievements] = useState(false);
  const [showRebirth, setShowRebirth] = useState(false);
  const [showCrew, setShowCrew] = useState(false);
  const [adConfig, setAdConfig] = useState(null);
  const [showDailyQuests, setShowDailyQuests] = useState(false);
  const [showWeeklyChallenge, setShowWeeklyChallenge] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showAdChoice, setShowAdChoice] = useState(false);
  const [showServerCrash, setShowServerCrash] = useState(false);
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
    clearOfflineReward,
    applyOfflineAdBonus,
    claimDailyBonus,
    loadSave,
    addGems,
    useTimeSkip,
    serverCrashResult,
    completeTutorial,
  } = useGameState();

  // 튜토리얼: 최초 접속 시 1회 지급
  useEffect(() => {
    if (state && !state.isTutorialCompleted) {
      const timer = setTimeout(() => completeTutorial(), 800);
      return () => clearTimeout(timer);
    }
  }, [state?.isTutorialCompleted]);

  const handleExportSave = async () => {
    try {
      const saveData = JSON.stringify(state);
      const base64Data = btoa(saveData);

      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(base64Data);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = base64Data;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        textArea.remove();
        if (!successful) throw new Error('Fallback copy failed');
      }
      alert("세이브 데이터가 클립보드에 복사되었습니다!\\n원하는 곳에 안전하게 붙여넣기 해두세요.");
    } catch (err) {
      console.error('Clipboard copy failed:', err);
      const base64Data = btoa(JSON.stringify(state));
      prompt("자동 복사에 실패했습니다. 아래 텍스트를 수동으로 전체 선택하여 복사해주세요:", base64Data);
    }
  };

  const handleImportSave = () => {
    const input = prompt("저장된 세이브 코드를 붙여넣어주세요:\\n(주의: 기존 데이터는 덮어씌워집니다)");
    if (!input) return;
    try {
      const decoded = atob(input);
      const parsed = JSON.parse(decoded);
      if (parsed && typeof parsed === 'object' && 'codingPower' in parsed) {
        loadSave(parsed);
        alert("세이브 데이터를 성공적으로 불러왔습니다!");
      } else {
        alert("유효하지 않은 세이브 데이터입니다.");
      }
    } catch (err) {
      alert("세이브 데이터 파싱에 실패했습니다. 올바른 코드인지 확인해주세요.");
    }
  };

  // 광고 전용 이벤트 리스너
  useEffect(() => {
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

  const handleShowAd = () => setShowAdChoice(true);

  // -------------------------------------------------------------------
  // [개발용 치트 / 디버깅 편의] 콘솔에서 window.gameState 객체를 통해 수치 강제 조작 및 테스트 가능
  // -------------------------------------------------------------------
  useEffect(() => {
    if (import.meta.env.DEV) {
      window.gameState = state;
      window.gameDispatch = {
        click,
        buyAutoItem,
        buyClickItem,
        buySpecialItem,
        triggerRandomEvent,
        resetGame,
        applyAdReward,
        addGems,
        useTimeSkip
      };
    }
  }, [state, click, buyAutoItem, buyClickItem, buySpecialItem, triggerRandomEvent, resetGame, applyAdReward, addGems, useTimeSkip]);
  // -------------------------------------------------------------------

  if (!state) return null;

  const handleReset = () => setShowResetConfirm(true);

  return (
    <div className="app">
      {/* 화면 위를 떠다니는 랜덤 이벤트 (황금 쿠키) */}
      <RandomEvent onTrigger={(type) => {
        if (type === 'server_crash') {
          setShowServerCrash(true);
        } else {
          triggerRandomEvent(type);
          playBuySound();
        }
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
        onOpenDailyQuests={() => setShowDailyQuests(true)}
        dailyQuestsHasUnclaimed={state.dailyQuests?.quests?.some(q => q.completed && !q.claimed) ?? false}
        onOpenWeeklyChallenge={() => setShowWeeklyChallenge(true)}
        weeklyHasUnclaimed={state.weeklyChallenge?.completed && !state.weeklyChallenge?.claimed}
        onExportSave={handleExportSave}
        onImportSave={handleImportSave}
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
            onUseTimeSkip={useTimeSkip}
          />
        </div>
      </div>

      <Hackathon onPlaySound={playBuySound} />
      <AchievementPopup />
      {showAchievements && <AchievementModal state={state} onClose={() => setShowAchievements(false)} />}

      {showDailyQuests && (
        <DailyQuestModal
          state={state}
          onClose={() => setShowDailyQuests(false)}
          onClaimReward={(questId) => { claimQuestReward(questId); }}
          onPlaySound={playBuySound}
        />
      )}

      {showWeeklyChallenge && (
        <WeeklyChallengeModal
          state={state}
          onClose={() => setShowWeeklyChallenge(false)}
          onClaimReward={() => { claimWeeklyReward(); }}
          onPlaySound={playBuySound}
        />
      )}

      {state._dailyBonusReady && (
        <DailyBonusModal
          state={state}
          onClaim={() => claimDailyBonus(false)}
          onWatchAd={async () => {
            const ok = await adService.showRewardedAd();
            claimDailyBonus(ok);
          }}
        />
      )}

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

      {state.offlineReward && (
        <OfflineRewardModal
          reward={state.offlineReward}
          onClose={clearOfflineReward}
          onWatchAd={async () => {
            const ok = await adService.showRewardedAd();
            if (ok) applyOfflineAdBonus();
            clearOfflineReward();
          }}
        />
      )}

      {showResetConfirm && (
        <ResetConfirmModal
          onConfirm={() => { resetGame(); setShowResetConfirm(false); }}
          onClose={() => setShowResetConfirm(false)}
        />
      )}

      {showAdChoice && (
        <AdRewardChoiceModal
          onSelect={async (rewardType) => {
            setShowAdChoice(false);
            const ok = await adService.showRewardedAd();
            if (ok) applyAdReward(rewardType);
          }}
          onClose={() => setShowAdChoice(false)}
        />
      )}

      {showServerCrash && (
        <ServerCrashModal
          onSuccess={() => {
            serverCrashResult(true);
            setShowServerCrash(false);
          }}
          onFail={() => {
            serverCrashResult(false);
            setShowServerCrash(false);
          }}
        />
      )}

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
