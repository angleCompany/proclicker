import { useState, useEffect } from 'react';

export default function GitGraph({ activityLevel = 1 }) {
    // 렌더링 중 Math.random 호출을 피하기 위해 상태로 관리하고 useEffect에서 초기화
    const [cells, setCells] = useState([]);

    useEffect(() => {
        // 동기적 setState 호출에 따른 계단식 렌더링 경고를 피하기 위해 requestAnimationFrame 사용
        const frame = requestAnimationFrame(() => {
            const initialCells = Array.from({ length: 42 }).map((_, i) => ({
                id: i,
                level: Math.floor(Math.random() * 3),
                delay: Math.random() * 2 
            }));
            setCells(initialCells);
        });
        
        return () => cancelAnimationFrame(frame);
    }, []);

    if (cells.length === 0) return <div className="git-graph" />;

    return (
        <div className="git-graph">
            {cells.map(cell => {
                // 특정 확률로 '하이라이트' 효과 부여
                const isHighlight = (cell.id * 7) % 100 < 5 * activityLevel;
                
                return (
                    <div
                        key={cell.id}
                        className={`git-graph__cell git-graph__cell--level-${Math.min(cell.level + (activityLevel > 3 ? 1 : 0), 4)} ${isHighlight ? 'git-graph__cell--highlight' : ''}`}
                        style={{ animationDelay: `${cell.delay}s` }}
                    />
                );
            })}
        </div>
    );
}
