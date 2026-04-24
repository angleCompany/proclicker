import { achievementsList } from '../data/gameData';

export default function NextAchievements({ state }) {
    const unachieved = achievementsList.filter(a =>
        !state.achievements.includes(a.id) && a.progressFn
    );

    const withProgress = unachieved.map(a => {
        const { current, target } = a.progressFn(state);
        const pct = Math.min(99.9, (current / target) * 100);
        return { ...a, current, target, pct };
    }).filter(a => a.pct > 0).sort((a, b) => b.pct - a.pct).slice(0, 3);

    if (withProgress.length === 0) return null;

    return (
        <div style={{
            margin: '12px 0',
            padding: '12px 16px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.08)',
        }}>
            <div style={{
                fontSize: '12px',
                color: '#888',
                marginBottom: '10px',
                fontWeight: 'bold',
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
            }}>
                🎯 다음 업적까지
            </div>
            {withProgress.map(a => (
                <div key={a.id} style={{ marginBottom: '10px' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '4px'
                    }}>
                        <span style={{ fontSize: '13px', color: '#ccc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>{a.icon}</span>
                            <span>{a.name}</span>
                        </span>
                        <span style={{ fontSize: '11px', color: '#666' }}>
                            {Math.floor(a.pct)}%
                        </span>
                    </div>
                    <div style={{
                        background: 'rgba(0,0,0,0.3)',
                        borderRadius: '4px',
                        height: '6px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            height: '100%',
                            width: `${a.pct}%`,
                            background: a.pct >= 80
                                ? 'linear-gradient(90deg, #ffd700, #ffaa00)'
                                : a.pct >= 50
                                    ? 'linear-gradient(90deg, #4fc3f7, #29b6f6)'
                                    : 'linear-gradient(90deg, #4488ff, #66aaff)',
                            borderRadius: '4px',
                            transition: 'width 0.5s ease'
                        }} />
                    </div>
                </div>
            ))}
        </div>
    );
}
