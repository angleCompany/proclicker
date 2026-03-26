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
        // Kakao AdFit 렌더링 호출
        if (window.adfit) {
            try {
                window.adfit.render();
            } catch (e) {
                console.error("Adfit render error:", e);
            }
        }
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
                    <h3>🎬 후원 광고 시청</h3>
                    {!isFinished && <div className="ad-modal-timer">{timeLeft}초 남음</div>}
                </div>
                
                <div className="ad-modal-content">
                    {/* Kakao AdFit 배너 영역 */}
                    <ins className="kakao_ad_area" 
                         style={{ display: 'none' }}
                         data-ad-unit="DAN-placeholder" 
                         data-ad-width="320" 
                         data-ad-height="100"></ins>
                    
                    <div className="ad-modal-placeholder">
                        <p>광고가 로딩 중이거나 표시되지 않을 수 있습니다.</p>
                        <p className="smallText">(실제 AdUnit ID 설정 시 광고가 노출됩니다)</p>
                    </div>
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
                        {isFinished ? '보상 받기!' : '기다리는 중...'}
                    </button>
                </div>
            </div>
        </div>
    );
}
