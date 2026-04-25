const CHOICES = [
    {
        type: 'production',
        icon: '🚀',
        name: '생산 2배 부스트',
        desc: '5분간 자동+클릭 생산량 2배',
        color: '#4488ff',
        bg: 'rgba(68,136,255,0.12)',
        border: 'rgba(68,136,255,0.4)',
    },
    {
        type: 'click_boost',
        icon: '⚡',
        name: '클릭 집중 부스트',
        desc: '10분간 클릭력 3배',
        color: '#ffd700',
        bg: 'rgba(255,215,0,0.1)',
        border: 'rgba(255,215,0,0.4)',
    },
    {
        type: 'crit_frenzy',
        icon: '🔮',
        name: '크리티컬 광란',
        desc: '5분간 크리 확률 80% + 배율 5배',
        color: '#cc88ff',
        bg: 'rgba(200,100,255,0.1)',
        border: 'rgba(200,100,255,0.4)',
    },
];

export default function AdRewardChoiceModal({ onSelect, onClose }) {
    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.88)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 10000,
                backdropFilter: 'blur(10px)'
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    background: 'linear-gradient(145deg, #1e1e2f, #2a2a40)',
                    borderRadius: '20px',
                    width: '90%',
                    maxWidth: '420px',
                    padding: '24px 20px',
                    boxShadow: '0 0 50px rgba(100,180,255,0.2)',
                    border: '2px solid rgba(100,180,255,0.3)',
                    color: '#fff',
                    animation: 'scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <div style={{ fontSize: '36px', marginBottom: '8px' }}>🎬</div>
                    <h2 style={{ margin: 0, fontSize: '18px', color: '#cce' }}>
                        광고 보상 선택
                    </h2>
                    <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#888' }}>
                        원하는 보상을 선택하고 광고를 시청하세요
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {CHOICES.map(c => (
                        <button
                            key={c.type}
                            onClick={() => onSelect(c.type)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '14px',
                                padding: '14px 16px',
                                borderRadius: '12px',
                                background: c.bg,
                                border: `1px solid ${c.border}`,
                                color: '#fff',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'all 0.15s',
                            }}
                            onMouseOver={e => { e.currentTarget.style.filter = 'brightness(1.15)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                            onMouseOut={e => { e.currentTarget.style.filter = ''; e.currentTarget.style.transform = ''; }}
                        >
                            <span style={{ fontSize: '32px', lineHeight: 1 }}>{c.icon}</span>
                            <div>
                                <div style={{ fontSize: '15px', fontWeight: 'bold', color: c.color }}>
                                    {c.name}
                                </div>
                                <div style={{ fontSize: '12px', color: '#aaa', marginTop: '2px' }}>
                                    {c.desc}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                <button
                    onClick={onClose}
                    style={{
                        width: '100%',
                        marginTop: '14px',
                        padding: '10px',
                        fontSize: '13px',
                        background: 'transparent',
                        color: '#666',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                    }}
                >
                    닫기
                </button>
            </div>
            <style>{`
                @keyframes scaleIn {
                    0% { transform: scale(0.85); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
