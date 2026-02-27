import { useState, useCallback, useRef } from 'react';
import { formatNumber, getCurrentTitle } from '../data/gameData';

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

export default function CodingArea({ state, onClick }) {
    const [floatingNums, setFloatingNums] = useState([]);
    const idCounter = useRef(0);

    const handleClick = useCallback(
        e => {
            onClick();

            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX
                ? e.clientX - rect.left - 100 + Math.random() * 200
                : rect.width / 2 - 50 + Math.random() * 100;
            const y = e.clientY
                ? e.clientY - rect.top
                : rect.height / 2;

            const boostMult = getActiveBoostMultiplier(state.boosts);
            const val = state.perClick * boostMult;

            const id = ++idCounter.current;
            setFloatingNums(prev => [
                ...prev.slice(-8),
                { id, x, y, value: val },
            ]);

            setTimeout(() => {
                setFloatingNums(prev => prev.filter(n => n.id !== id));
            }, 1000);
        },
        [onClick, state.perClick, state.boosts]
    );

    const title = getCurrentTitle(state.totalCodingPower);

    return (
        <div className="coding-area">
            <div className="coding-area__bg">{CODE_BG_TEXT}</div>

            <div className="coding-area__character">{title.icon}</div>

            <div className="coding-area__title-badge">
                <span className="coding-area__title-icon">{title.icon}</span>
                <span className="coding-area__title-text">{title.title}</span>
            </div>

            <button className="click-button" onClick={handleClick}>
                <span className="click-button__icon">⌨️</span>
                <span className="click-button__text">코딩하기</span>
                <span className="click-button__subtext">
                    +{formatNumber(state.perClick * getActiveBoostMultiplier(state.boosts))}
                </span>
            </button>

            <div className="floating-numbers">
                {floatingNums.map(n => (
                    <span
                        key={n.id}
                        className="floating-number"
                        style={{ left: n.x, top: n.y }}
                    >
                        +{formatNumber(n.value)}
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
    return active.reduce((max, b) => Math.max(max, b.multiplier), 1);
}
