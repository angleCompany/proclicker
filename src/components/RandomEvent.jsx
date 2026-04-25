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
            // 버그(40%), 영감(50%), 투자자(10%) 확률
            const rand = Math.random();
            let type = 'idea';
            if (rand < 0.4) type = 'bug';
            else if (rand > 0.9) type = 'investor';

            const icon = type === 'bug' ? '🐛' : type === 'investor' ? '💼' : '💡';
            const text = type === 'bug' ? '디버깅 찬스!' : type === 'investor' ? '엔젤 투자자!' : '번뜩이는 영감!';
            
            // 화면 내 랜덤 위치 지정 (가장자리 마진 제외)
            const x = Math.random() * 80 + 10; // 10vw ~ 90vw
            const y = Math.random() * 80 + 10; // 10vh ~ 90vh
            
            // 애니메이션 지속시간 (버그는 8초로 빠름, 영감은 15초, 투자자는 5초로 매우 빠름)
            const duration = type === 'bug' ? 8 : type === 'investor' ? 5 : 15;

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
