import { useState, useEffect } from 'react';

export default function BoostBar({ boosts = [] }) {
    const [, forceUpdate] = useState(0);

    // 1초마다 타이머 업데이트
    useEffect(() => {
        if (boosts.length === 0) return;
        const interval = setInterval(() => forceUpdate(v => v + 1), 1000);
        return () => clearInterval(interval);
    }, [boosts.length]);

    const now = Date.now();
    const activeBoosts = boosts.filter(b => b.endTime > now);

    if (activeBoosts.length === 0) return null;

    return (
        <div className="boost-bar">
            {activeBoosts.map((boost, i) => {
                const remaining = Math.max(0, Math.ceil((boost.endTime - now) / 1000));
                const min = Math.floor(remaining / 60);
                const sec = remaining % 60;

                return (
                    <div key={`${boost.id}-${i}`} className="boost-pill">
                        <span className="boost-pill__icon">{boost.icon}</span>
                        <span className="boost-pill__text">{boost.multiplier}배</span>
                        <span className="boost-pill__timer">
                            {min}:{sec.toString().padStart(2, '0')}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
