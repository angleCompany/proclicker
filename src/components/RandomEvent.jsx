import { useState, useEffect } from 'react';

export default function RandomEvent({ onTrigger }) {
    const [eventNode, setEventNode] = useState(null);

    useEffect(() => {
        // 1분 ~ 3분 사이 랜덤한 주기로 이벤트 발생
        const scheduleNextEvent = () => {
            const minTime = 60 * 1000;
            const maxTime = 180 * 1000;
            const delay = Math.random() * (maxTime - minTime) + minTime;

            return setTimeout(() => {
                spawnEvent();
            }, delay);
        };

        let timer = scheduleNextEvent();

        function spawnEvent() {
            // 버그(35%), 영감(50%), 투자자(10%), 서버 터짐(5%) 확률
            const rand = Math.random();
            let type = 'idea';
            if (rand < 0.35) type = 'bug';
            else if (rand > 0.95) type = 'server_crash';
            else if (rand > 0.85) type = 'investor';

            const iconMap = { bug: '🐛', investor: '💼', server_crash: '🔴', idea: '💡' };
            const textMap = { bug: '디버깅 찬스!', investor: '엔젤 투자자!', server_crash: '⚠️ 서버 경보!', idea: '번뜩이는 영감!' };
            const icon = iconMap[type];
            const text = textMap[type];
            
            // 화면 내 랜덤 위치 지정 (가장자리 마진 제외)
            const x = Math.random() * 80 + 10; // 10vw ~ 90vw
            const y = Math.random() * 80 + 10; // 10vh ~ 90vh
            
            // 애니메이션 지속시간 (서버 터짐은 3초로 매우 짧게)
            const durationMap = { bug: 8, investor: 5, server_crash: 3, idea: 15 };
            const duration = durationMap[type];

            setEventNode({
                id: Date.now(),
                type,
                icon,
                text,
                style: {
                    left: `${x}vw`,
                    top: `${y}vh`,
                    animationDuration: `${duration}s`
                }
            });

            // 생성된 이벤트는 duration초 뒤에 자연 소멸하고 다음 이벤트 예약
            setTimeout(() => {
                setEventNode(null);
                timer = scheduleNextEvent();
            }, duration * 1000);
        }

        return () => clearTimeout(timer);
    }, []);

    if (!eventNode) return null;

    const handleClick = () => {
        onTrigger(eventNode.type);
        setEventNode(null); // 클릭 즉시 소멸
    };

    return (
        <div 
            className={`random-event random-event--${eventNode.type}`}
            style={eventNode.style}
            onClick={handleClick}
        >
            <span className="random-event__icon">{eventNode.icon}</span>
            <span className="random-event__text">{eventNode.text}</span>
        </div>
    );
}
