import { useState, useCallback, useRef } from 'react';
import { formatNumber, getCurrentTitle } from '../data/gameData';
import GitGraph from './GitGraph';
import NextAchievements from './NextAchievements';

const CODE_BG_TEXT = `function solve(problem) {
  const skills = learn();
  while (!solved) {
    debug(code);
    refactor(design);
    if (eureka) break;
  }
  return solution;
}

class Developer {
  constructor(name) {
    this.skills = [];
    this.passion = Infinity;
  }
  code() {
    return this.skills
      .map(s => s.apply())
      .reduce((a, b) => a + b);
  }
}

const api = async () => {
  const data = await fetch();
  return transform(data);
};`;

function getActiveBoostMultiplier(boosts = []) {
    const now = Date.now();
    const active = boosts.filter(b => b.endTime > now);
    if (active.length === 0) return 1;
    const bonus = active.reduce((acc, b) => acc + (b.multiplier - 1), 0);
    return 1 + bonus;
}

const getComboColor = (count) => {
    if (count >= 100) return '#ef4444'; // red
    if (count >= 50) return '#f59e0b';  // orange
    if (count >= 20) return '#eab308';  // yellow
    return '#10b981';                    // green
};

const MEME_TEXTS = [
    "왜 되지?", "내 컴퓨터에선 되는데", "오타 발견!", "Ctrl+S",
    "이게 되네?", "리팩토링 마렵다", "버그 아님. 기능임.",
    "주석 달기 귀찮다", "StackOverflow 최고", "복붙 완료!"
];

export default function CodingArea({ state, onClick }) {
    const [floatingNums, setFloatingNums] = useState([]);
    const [particles, setParticles] = useState([]);
    const [isShaking, setIsShaking] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const idCounter = useRef(0);
    const shakeTimeout = useRef(null);
    const containerRef = useRef(null);

    const handleClick = useCallback(
        e => {
            // 클릭 로직 실행 전 현재 상태를 기반으로 확률적 피드백 미리 결정
            // (reducer 내부 로직과 동기화하기 위함)
            const isCrit = Math.random() < Math.min(state.critProb, 0.8);
            const luckyItem = state.specialItems.find(it => it.type === 'lucky_click');
            const isLucky = luckyItem && luckyItem.owned > 0 && Math.random() < 0.01;
            
            onClick(); // 실제 점수 증가 dispatch

            const containerRect = containerRef.current.getBoundingClientRect();
            const x = (e.clientX !== undefined)
                ? e.clientX - containerRect.left
                : containerRect.width / 2;
            const y = (e.clientY !== undefined)
                ? e.clientY - containerRect.top
                : containerRect.height / 2;

            const boostMult = getActiveBoostMultiplier(state.boosts);
            const synergyBonus = state.perSecond * state.clickSynergy;
            const luckyBonus = isLucky ? (state.perSecond * (luckyItem?.effect || 0)) : 0;
            const val = ((state.perClick + synergyBonus) * boostMult * (isCrit ? state.critMult : 1)) + luckyBonus;

            setIsTyping(true);
            setTimeout(() => setIsTyping(false), 100);

            const id = ++idCounter.current;
            const spawnMeme = Math.random() < 0.15; // 15% chance to spawn meme text
            const memeText = spawnMeme ? MEME_TEXTS[Math.floor(Math.random() * MEME_TEXTS.length)] : null;

            setFloatingNums(prev => [
                ...prev.slice(-8),
                { id, x, y, value: val, isCrit, isLucky, memeText },
            ]);

            const particlePool = isCrit || isLucky
                ? ['⭐', '🌟', '✨', '🌠', '✨', '🔥', '⚡', '💎', '💰']
                : ['0', '1', ';', '{', '}', '⌨️', '🙌', '🖱️'];

            const newParticles = Array.from({ length: isCrit ? 20 : 6 }, (_, i) => {
                const char = particlePool[Math.floor(Math.random() * particlePool.length)];
                const isStar = ['⭐', '🌟', '✨', '🌠'].includes(char);

                return {
                    id: `${id}-p${i}`,
                    x: x + (Math.random() - 0.5) * 20,
                    y: y + (Math.random() - 0.5) * 20,
                    char,
                    vx: (Math.random() - 0.5) * (isCrit ? 30 : 10),
                    vy: (Math.random() - 0.5) * (isCrit ? 30 : 10) - (isCrit ? 15 : 5),
                    isCrit,
                    isStar
                };
            });
            setParticles(prev => [...prev.slice(-40), ...newParticles]);

            setIsShaking(true);
            if (shakeTimeout.current) clearTimeout(shakeTimeout.current);
            shakeTimeout.current = setTimeout(() => setIsShaking(false), isCrit ? 300 : 150);

            setTimeout(() => {
                setFloatingNums(prev => prev.filter(n => n.id !== id));
                setParticles(prev => prev.filter(p => !p.id.startsWith(`${id}-`)));
            }, 1000);
        },
        [onClick, state.perClick, state.perSecond, state.boosts, state.critMult, state.critProb, state.clickSynergy, state.specialItems]
    );

    const title = getCurrentTitle(state.totalCodingPower);
    const charImage = title.image;

    return (
        <div ref={containerRef} className={`coding-area ${isShaking ? 'shake-effect' : ''}`}>
            <div className="coding-area__bg-container">
                <GitGraph activityLevel={isTyping ? 5 : 1} />
                <div className="coding-area__bg-overlay"></div>
                <div className="coding-area__bg-text">{CODE_BG_TEXT}</div>
            </div>

            <div className="coding-area__main-content">
                <div className="coding-area__character-section">
                    <div className="character-frame">
                        {title.aura && <div className={`aura aura--${title.aura}`}></div>}
                        <img
                            src={charImage}
                            alt={title.title}
                            className={`character-img ${isTyping ? 'character-action' : ''} character-tier-${title.tier}`}
                            style={{
                                filter: `hue-rotate(${title.hue || 0}deg) drop-shadow(0 0 25px rgba(99, 102, 241, 0.4))`,
                                transformOrigin: 'bottom center',
                                width: `${(title.scale || 1) * 100}%`,
                                height: `${(title.scale || 1) * 100}%`
                            }}
                        />
                        {title.accessory && <div className="character-accessory">{title.accessory}</div>}
                        <div className={`character-glow ${isTyping ? 'character-glow--active' : ''}`}></div>
                    </div>
                    <div className="title-badge">
                        <span className="title-badge__icon">{title.icon}</span>
                        <span className="title-badge__text">{title.title}</span>
                    </div>
                </div>

                <NextAchievements state={state} />

                <div className="coding-area__button-section" style={{ position: 'relative' }}>
                    <style>{`@keyframes comboPop { 0% { transform: scale(1.3); } 100% { transform: scale(1); } }`}</style>
                    {state.comboCount >= 3 && (
                        <div style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            background: 'rgba(0,0,0,0.6)',
                            border: `1px solid ${getComboColor(state.comboCount)}`,
                            borderRadius: '20px',
                            padding: '4px 10px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            animation: 'comboPop 0.15s ease-out',
                            zIndex: 10,
                        }}>
                            <span style={{ fontSize: '14px' }}>🔥</span>
                            <span style={{
                                fontFamily: 'monospace',
                                fontWeight: 900,
                                fontSize: '16px',
                                color: getComboColor(state.comboCount),
                                textShadow: `0 0 8px ${getComboColor(state.comboCount)}`,
                            }}>
                                {state.comboCount}
                            </span>
                            <span style={{ fontSize: '10px', color: '#94a3b8' }}>COMBO</span>
                        </div>
                    )}
                    <button className="main-click-button" onClick={handleClick}>
                        <div className="main-click-button__content">
                            <span className="main-click-button__icon">⌨️</span>
                            <span className="main-click-button__text">코딩하기</span>
                        </div>
                        <div className="main-click-button__reward">
                            +{formatNumber(state.perClick * getActiveBoostMultiplier(state.boosts))}
                        </div>
                    </button>
                </div>
            </div>

            <div className="visual-feedback-layer">
                {floatingNums.map(n => (
                    <span
                        key={n.id}
                        className={`floating-val ${n.isCrit ? 'floating-val--crit' : ''} ${n.isLucky ? 'floating-val--lucky' : ''}`}
                        style={{ left: `${n.x}px`, top: `${n.y}px` }}
                    >
                        {n.isLucky ? 'BUG BOUNTY! 💰 ' : n.isCrit ? 'CRITICAL! ' : ''}+{formatNumber(n.value)}
                        {n.memeText && <div className="floating-meme">{n.memeText}</div>}
                    </span>
                ))}
                {particles.map(p => (
                    <span
                        key={p.id}
                        className={`custom-particle ${p.isCrit ? 'custom-particle--crit' : ''} ${p.isStar ? 'custom-particle--star' : ''}`}
                        style={{
                            left: `${p.x}px`,
                            top: `${p.y}px`,
                            '--tx': `${p.vx * 20}px`,
                            '--ty': `${p.vy * 20}px`,
                            fontSize: p.isStar ? '22px' : p.isCrit ? '24px' : '16px',
                            animationDuration: p.isStar ? '1.2s' : '0.8s'
                        }}
                    >
                        {p.char}
                    </span>
                ))}
            </div>
        </div>
    );
}
