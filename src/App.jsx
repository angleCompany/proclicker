import { useGameState } from './hooks/useGameState';
import StatsBar from './components/StatsBar';
import CodingArea from './components/CodingArea';
import BoostBar from './components/BoostBar';
import Shop from './components/Shop';
import RandomEvent from './components/RandomEvent';
import { useSound } from './hooks/useSound';
import { adService } from './services/adService';
import './index.css';

function App() {
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
  } = useGameState();

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
      <StatsBar state={state} onReset={handleReset} isMuted={isMuted} onToggleMute={toggleMute} />

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
    </div>
  );
}

export default App;
