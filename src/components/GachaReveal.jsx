import React, { useEffect, useState } from 'react';

export default function GachaReveal({ lastScoutedCrews, onClear }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showSummary, setShowSummary] = useState(false);

    useEffect(() => {
        if (!lastScoutedCrews || lastScoutedCrews.length === 0) {
            setShowSummary(false);
            setCurrentIndex(0);
        }
    }, [lastScoutedCrews]);

    if (!lastScoutedCrews || lastScoutedCrews.length === 0) return null;

    const handleNext = () => {
        if (currentIndex < lastScoutedCrews.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setShowSummary(true);
        }
    };

    const getGradeColor = (grade) => {
        switch (grade) {
            case 'N': return '#aaa';
            case 'R': return '#4da6ff';
            case 'SR': return '#b366ff';
            case 'SSR': return '#ffcc00';
            case 'UR': return '#ff3333';
            default: return '#fff';
        }
    };

    if (showSummary) {
        return (
            <div className="modal-overlay" onClick={onClear} style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.9)', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', zIndex: 11000,
                backdropFilter: 'blur(5px)'
            }}>
                <h2 style={{ color: '#fff', marginBottom: '20px', animation: 'fadeIn 0.5s' }}>영입 결과 정리</h2>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '600px' }}>
                    {lastScoutedCrews.map((crew, idx) => (
                        <div key={idx} style={{
                            background: '#223', border: `1px solid ${getGradeColor(crew.grade)}`,
                            borderRadius: '8px', padding: '10px', textAlign: 'center',
                            minWidth: '100px', animation: `zoomIn 0.3s ${idx * 0.1}s both`
                        }}>
                            <div style={{ fontSize: '24px' }}>{crew.icon}</div>
                            <div style={{ fontSize: '12px', color: getGradeColor(crew.grade), fontWeight: 'bold' }}>{crew.grade}</div>
                            {crew.isNew && <div style={{ fontSize: '10px', color: '#ff4444', fontWeight: 'bold' }}>NEW!</div>}
                        </div>
                    ))}
                </div>
                <button onClick={onClear} style={{
                    marginTop: '30px', padding: '10px 30px', background: '#4da6ff', border: 'none',
                    borderRadius: '8px', color: '#fff', fontSize: '16px', cursor: 'pointer',
                    fontWeight: 'bold', animation: 'fadeIn 1s'
                }}>확인</button>

                <style>{`
                    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                    @keyframes zoomIn { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                `}</style>
            </div>
        );
    }

    const currentCrew = lastScoutedCrews[currentIndex];
    const gradeColor = getGradeColor(currentCrew.grade);
    const isRare = ['SR', 'SSR', 'UR'].includes(currentCrew.grade);

    return (
        <div className="modal-overlay" onClick={handleNext} style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.95)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', zIndex: 11000,
            cursor: 'pointer'
        }}>
            <div key={currentIndex} style={{
                background: `radial-gradient(circle, ${gradeColor}33 0%, transparent 70%)`,
                padding: '50px', textAlign: 'center',
                animation: isRare ? 'shakeReveal 0.5s cubic-bezier(.36,.07,.19,.97) both' : 'popReveal 0.4s both'
            }}>
                <div style={{ fontSize: '80px', marginBottom: '20px', textShadow: `0 0 20px ${gradeColor}` }}>
                    {currentCrew.icon}
                </div>
                <h1 style={{ color: gradeColor, margin: '0 0 10px 0', fontSize: '40px', letterSpacing: '2px' }}>
                    {currentCrew.grade}
                </h1>
                <h2 style={{ color: '#fff', margin: '0 0 10px 0' }}>{currentCrew.name}</h2>
                <div style={{ color: '#aaa', fontSize: '16px' }}>
                    {currentCrew.effectDesc}
                </div>
                {currentCrew.isNew && (
                    <div style={{
                        marginTop: '15px', display: 'inline-block', background: '#ff4444',
                        padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold', color: '#fff',
                        animation: 'pulse 1s infinite alternate'
                    }}>
                        신규 영입!
                    </div>
                )}
            </div>

            <div style={{ position: 'absolute', bottom: '20px', color: '#666', fontSize: '14px' }}>
                화면을 클릭하여 계속 ({currentIndex + 1} / {lastScoutedCrews.length})
            </div>

            <style>{`
                @keyframes popReveal {
                    0% { transform: scale(0.8) translateY(50px); opacity: 0; }
                    80% { transform: scale(1.1) translateY(-10px); opacity: 1; }
                    100% { transform: scale(1) translateY(0); opacity: 1; }
                }
                @keyframes shakeReveal {
                    0% { transform: scale(0.5); opacity: 0; }
                    20% { transform: scale(1.2) rotate(-5deg); opacity: 1; }
                    40% { transform: scale(1.1) rotate(5deg); }
                    60% { transform: scale(1.1) rotate(-5deg); }
                    80% { transform: scale(1.05) rotate(2deg); }
                    100% { transform: scale(1) rotate(0); }
                }
            `}</style>
        </div>
    );
}
