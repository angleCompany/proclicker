import { useState, useCallback, useRef } from 'react';
import { formatNumber, getCurrentTitle } from '../data/gameData';
import GitGraph from './GitGraph';

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

export default function CodingArea({ state, onClick, playClickSound }) {
    const [floatingNums, setFloatingNums] = useState([]);
    const [particles, setParticles] = useState([]);
    const [isShaking, setIsShaking] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const idCounter = useRef(0);
    const shakeTimeout = useRef(null);
    const containerRef = useRef(null);

    const handleClick = useCallback(
        e => {
            onClick();

            const containerRect = containerRef.current.getBoundingClientRect();

            // 컨테이너 기준 상대 좌표 계산 (0인 경우 고려)
            const x = (e.clientX !== undefined)
                ? e.clientX - containerRect.left
                : containerRect.width / 2;
            const y = (e.clientY !== undefined)
                ? e.clientY - containerRect.top
                : containerRect.height / 2;

            const isCrit = state.lastClickWasCrit;
            const isLucky = state.lastClickWasLucky;
            const boostMult = getActiveBoostMultiplier(state.boosts);
            const val = state.perClick * boostMult * (isCrit ? state.critMult : 1);

            // 캐릭터 애니메이션 트리거
            setIsTyping(true);
            setTimeout(() => setIsTyping(false), 100);

            const id = ++idCounter.current;
            setFloatingNums(prev => [
                ...prev.slice(-8),
                { id, x, y, value: val, isCrit, isLucky },
            ]);

            // 파티클 종류 확장 (숫자, 기호 + 손, 키보드 + 별빛 추가)
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

            // 화면 흔들림 (크리티컬 시 더 강하게)
            setIsShaking(true);
            if (shakeTimeout.current) clearTimeout(shakeTimeout.current);
            shakeTimeout.current = setTimeout(() => setIsShaking(false), isCrit ? 300 : 150);

            setTimeout(() => {
                setFloatingNums(prev => prev.filter(n => n.id !== id));
                setParticles(prev => prev.filter(p => !p.id.startsWith(`${id}-`)));
            }, 1000);
        },
        [onClick, state.perClick, state.boosts, state.critMult, state.lastClickWasCrit]
    );

    const title = getCurrentTitle(state.totalCodingPower);
    const charImage = title.image;

    return (
        <div ref={containerRef} className={`coding-area ${isShaking ? 'shake-effect' : ''}`}>
            {/* 배경 영역: Git 잔디 및 코드 텍스트 */}
            <div className="coding-area__bg-container">
                <GitGraph activityLevel={isTyping ? 5 : 1} />
                <div className="coding-area__bg-overlay"></div>
                <div className="coding-area__bg-text">{CODE_BG_TEXT}</div>
            </div>

            <div className="coding-area__main-content">
                {/* 상단: 캐릭터 영역 */}
                <div className="coding-area__character-section">
                    <div className="character-frame">
                        {/* 오라 효과 레이어 */}
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

                        {/* 액세서리 (이모지) 레이어 - 캐릭터 머리 위 */}
                        {title.accessory && (
                            <div className="character-accessory">
                                {title.accessory}
                            </div>
                        )}
                        {/* 광원 효과를 캐릭터 바로 뒤/아래로 밀착 */}
                        <div className={`character-glow ${isTyping ? 'character-glow--active' : ''}`}></div>
                    </div>

                    <div className="title-badge">
                        <span className="title-badge__icon">{title.icon}</span>
                        <span className="title-badge__text">{title.title}</span>
                    </div>
                </div>

                {/* 하단: 클릭 버튼 영역 */}
                <div className="coding-area__button-section">
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

function getActiveBoostMultiplier(boosts = []) {
    const now = Date.now();
    const active = boosts.filter(b => b.endTime > now);
    if (active.length === 0) return 1;
    // 가산 방식 적용
    const bonus = active.reduce((acc, b) => acc + (b.multiplier - 1), 0);
    return 1 + bonus;
}
