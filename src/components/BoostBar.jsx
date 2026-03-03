import { useState, useEffect } from 'react';

export default function BoostBar({ boosts = [] }) {
    // 초기값을 0으로 설정하여 렌더링 중 Date.now() 호출 방지
    const [currentTime, setCurrentTime] = useState(0);

    useEffect(() => {
        // 동기적 호출을 피하기 위해 비동기 콜백으로 처리 (린트 규칙 준수)
        const frame = requestAnimationFrame(() => {
            setCurrentTime(Date.now());
        });
        
        if (boosts.length === 0) {
            return () => cancelAnimationFrame(frame);
        }
        
        const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
        return () => {
            cancelAnimationFrame(frame);
            clearInterval(interval);
        };
    }, [boosts.length]);

    // currentTime이 아직 설정되지 않았을 때는 아무것도 렌더링하지 않음
    if (currentTime === 0) return null;

    const activeBoosts = boosts.filter(b => b.endTime > currentTime);

    if (activeBoosts.length === 0) return null;

    return (
        <div className="boost-bar">
            {activeBoosts.map((boost, i) => {
                const remaining = Math.max(0, Math.ceil((boost.endTime - currentTime) / 1000));
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
