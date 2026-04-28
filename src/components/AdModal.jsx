import { useState, useEffect, useRef } from 'react';

export default function AdModal({ seconds, onComplete, onCancel }) {
    const [timeLeft, setTimeLeft] = useState(seconds);
    const [isFinished, setIsFinished] = useState(false);
    const adRef = useRef(null);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else {
            setIsFinished(true);
        }
    }, [timeLeft]);

    useEffect(() => {
        let attempts = 0;
        const tryRender = () => {
            if (window.adfit) {
                try {
                    window.adfit.render();
                } catch (e) {
                    console.error('Adfit render error:', e);
                }
            } else if (attempts < 15) {
                attempts++;
                setTimeout(tryRender, 300);
            }
        };
        setTimeout(tryRender, 100);
    }, []);

    const handleCollect = () => {
        if (isFinished) {
            onComplete();
        }
    };

    return (
        <div className="modal-overlay">
            <div className="ad-modal">
                <div className="ad-modal-header">
                    <h3>💼 외주 미팅 수락 (15초)</h3>
                    {!isFinished && <div className="ad-modal-timer">{timeLeft}초 남음</div>}
                </div>
                
                <div className="ad-modal-content">
                    {/* Kakao AdFit 배너 영역 */}
                    <ins className="kakao_ad_area"
                         style={{ display: 'block' }}
                         data-ad-unit="DAN-T18xef69SG84Vb4Q"
                         data-ad-width="320"
                         data-ad-height="100"></ins>
                </div>

                <div className="ad-modal-footer">
                    <button 
                        className="ad-modal-btn ad-modal-btn--cancel" 
                        onClick={onCancel}
                        disabled={isFinished}
                    >
                        닫기
                    </button>
                    <button 
                        className={`ad-modal-btn ad-modal-btn--collect ${isFinished ? 'pulse' : ''}`}
                        onClick={handleCollect}
                        disabled={!isFinished}
                    >
                        {isFinished ? '외주 계약 완료!' : '미팅 진행 중...'}
                    </button>
                </div>
            </div>
        </div>
    );
}
