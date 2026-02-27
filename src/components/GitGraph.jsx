import React, { useMemo } from 'react';

/**
 * GitGraph - 프로그래머의 활동량을 보여주는 잔디 배경 컴포넌트
 * 클릭 시나 자동 성장 시 시각적 피드백을 강화합니다.
 */
const GitGraph = ({ activityLevel = 0 }) => {
    // 15x7 그리드 생성 (약 100개의 셀)
    const cells = useMemo(() => {
        return Array.from({ length: 105 }).map((_, i) => ({
            id: i,
            // 기본 활동량은 랜덤하게 배치 (프로그래머의 정체성)
            level: Math.floor(Math.random() * 3),
            delay: Math.random() * 2 // 애니메이션 딜레이
        }));
    }, []);

    return (
        <div className="git-graph">
            {cells.map(cell => {
                // 특정 확률로 '하이라이트' 효과 부여 (생동감)
                const isHighlight = Math.random() < 0.05 * activityLevel;
                return (
                    <div
                        key={cell.id}
                        className={`git-cell git-cell--level-${cell.level} ${isHighlight ? 'git-cell--highlight' : ''}`}
                        style={{
                            animationDelay: `${cell.delay}s`
                        }}
                    />
                );
            })}
        </div>
    );
};

export default GitGraph;
