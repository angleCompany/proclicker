import React, { useRef, useEffect, useState } from 'react';
import { formatNumber, getCurrentTitle, achievementsList } from '../data/gameData';

export default function ShareCardModal({ state, onClose }) {
    const canvasRef = useRef(null);
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        const width = 600;
        const height = 315; // standard open graph ratio
        
        // Background
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#1e1e2f');
        grad.addColorStop(1, '#2a2a40');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Border
        ctx.strokeStyle = '#64c8ff';
        ctx.lineWidth = 4;
        ctx.strokeRect(10, 10, width - 20, height - 20);

        // Text settings
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        
        // Title
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 28px sans-serif';
        ctx.fillText('💻 프로클리커 이력서', 30, 45);

        const currentTitle = getCurrentTitle(state.totalCodingPower);
        ctx.font = 'bold 36px sans-serif';
        ctx.fillStyle = '#ffd700';
        ctx.fillText(`${currentTitle.icon} ${currentTitle.title}`, 30, 100);

        // Stats
        ctx.font = '18px sans-serif';
        ctx.fillStyle = '#aaaaaa';
        ctx.fillText('총 파워:', 30, 160);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(formatNumber(state.totalCodingPower), 130, 160);

        ctx.font = '18px sans-serif';
        ctx.fillStyle = '#aaaaaa';
        ctx.fillText('초당 파워:', 30, 200);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(formatNumber(state.perSecond) + '/s', 130, 200);

        ctx.font = '18px sans-serif';
        ctx.fillStyle = '#aaaaaa';
        ctx.fillText('타건 횟수:', 320, 160);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(formatNumber(state.stats?.totalClicks || 0), 420, 160);

        ctx.font = '18px sans-serif';
        ctx.fillStyle = '#aaaaaa';
        ctx.fillText('달성 업적:', 320, 200);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(`${state.achievements?.length || 0} / ${achievementsList.length}`, 420, 200);

        // GitHub Style Grass
        ctx.font = '18px sans-serif';
        ctx.fillStyle = '#aaaaaa';
        ctx.fillText('최근 잔디:', 30, 260);
        for(let i=0; i<18; i++) {
            const intensity = Math.random();
            if(intensity < 0.2) ctx.fillStyle = '#2d333b';
            else if(intensity < 0.5) ctx.fillStyle = '#0e4429';
            else if(intensity < 0.8) ctx.fillStyle = '#006d32';
            else ctx.fillStyle = '#39d353';
            ctx.fillRect(130 + (i * 22), 245, 18, 18);
        }

        setImageUrl(canvasRef.current.toDataURL('image/png'));
    }, [state]);

    const handleDownload = () => {
        if (!imageUrl) return;
        const a = document.createElement('a');
        a.href = imageUrl;
        a.download = 'coding_master_resume.png';
        a.click();
    };

    const handleKakaoShare = () => {
        if (window.Kakao && window.Kakao.isInitialized()) {
            window.Kakao.Share.sendDefault({
                objectType: 'feed',
                content: {
                    title: `프로클리커 - ${getCurrentTitle(state.totalCodingPower).title}`,
                    description: `나의 초당 코딩력: ${formatNumber(state.perSecond)}/s. \n이력서 확인하고 도전해보세요!`,
                    imageUrl: 'https://cdn-icons-png.flaticon.com/512/1005/1005141.png', // dummy
                    link: {
                        mobileWebUrl: window.location.origin,
                        webUrl: window.location.origin,
                    },
                },
                buttons: [
                    {
                        title: '게임하러 가기',
                        link: {
                            mobileWebUrl: window.location.origin,
                            webUrl: window.location.origin,
                        },
                    },
                ],
            });
        } else {
            alert('카카오톡 공유가 초기화되지 않았습니다.\n( index.html에 Kakao SDK 스크립트와 키가 필요합니다. )');
        }
    };

    const handleNativeShare = async () => {
        if (navigator.share && imageUrl) {
            try {
                // convert base64 to blob
                const res = await fetch(imageUrl);
                const blob = await res.blob();
                const file = new File([blob], 'resume.png', { type: 'image/png' });
                
                await navigator.share({
                    title: '프로클리커 이력서',
                    text: '제 코딩 이력서를 확인해보세요!',
                    files: [file]
                });
            } catch (err) {
                console.error('Share failed', err);
            }
        } else {
            alert('이 브라우저에서는 기본 공유 기능을 지원하지 않습니다. (이미지 저장 버튼을 이용해주세요)');
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose} style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', zIndex: 10000,
            backdropFilter: 'blur(10px)'
        }}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{
                background: 'linear-gradient(145deg, #1e1e2f, #2a2a40)', padding: '30px',
                borderRadius: '20px', maxWidth: '650px', width: '90%',
                boxShadow: '0 0 50px rgba(100, 200, 255, 0.3)', border: '2px solid #64c8ff',
                color: '#fff', textAlign: 'center', animation: 'scaleIn 0.3s'
            }}>
                <h2 style={{ color: '#64c8ff', margin: '0 0 20px 0' }}>내 개발자 명함 (이력서)</h2>
                
                <div style={{ marginBottom: '25px', display: 'flex', justifyContent: 'center' }}>
                    <canvas ref={canvasRef} width={600} height={315} style={{ display: 'none' }} />
                    {imageUrl && (
                        <img src={imageUrl} alt="명함 미리보기" style={{ 
                            width: '100%', maxWidth: '600px', borderRadius: '10px',
                            border: '1px solid #444', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                        }} />
                    )}
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button onClick={handleKakaoShare} style={{
                        padding: '12px 15px', fontSize: '15px', fontWeight: 'bold',
                        background: '#FEE500', color: '#000000', border: 'none', borderRadius: '8px',
                        cursor: 'pointer'
                    }}>
                        💬 카카오톡
                    </button>
                    {navigator.share && (
                        <button onClick={handleNativeShare} style={{
                            padding: '12px 15px', fontSize: '15px', fontWeight: 'bold',
                            background: '#333', color: '#fff', border: 'none', borderRadius: '8px',
                            cursor: 'pointer'
                        }}>
                            📤 기본 공유
                        </button>
                    )}
                    <button onClick={handleDownload} style={{
                        padding: '12px 15px', fontSize: '15px', fontWeight: 'bold',
                        background: '#0088ff', color: '#ffffff', border: 'none', borderRadius: '8px',
                        cursor: 'pointer'
                    }}>
                        💾 이미지 저장
                    </button>
                    <button onClick={onClose} style={{
                        padding: '12px 20px', fontSize: '15px', fontWeight: 'bold',
                        background: 'transparent', color: '#aaa', border: '1px solid #555',
                        borderRadius: '8px', cursor: 'pointer'
                    }}>
                        닫기
                    </button>
                </div>
            </div>
            <style>{`
                @keyframes scaleIn { 0% { transform: scale(0.9); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
            `}</style>
        </div>
    );
}
