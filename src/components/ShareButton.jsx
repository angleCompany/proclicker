import { useState } from 'react';
import { getCurrentTitle, formatNumber } from '../data/gameData';
import ShareCardModal from './ShareCardModal';

export default function ShareButton({ state }) {
    const [copied, setCopied] = useState(false);
    const [showCardModal, setShowCardModal] = useState(false);
    const gameUrl = window.location.origin;

    const generateShareText = () => {
        const title = getCurrentTitle(state.totalCodingPower);
        return `💻 코딩 마스터: 프로그래머 키우기 💻\n\n` +
               `🏆 현재 칭호: [${title.title}] ${title.icon}\n` +
               `⚡ 초당 코딩력: ${formatNumber(state.perSecond)}/s\n` +
               `⌨️ 타건 횟수: ${formatNumber(state.stats?.totalClicks || 0)}번\n\n` +
               `나의 잉여력을 뛰어넘을 수 있을까?\n` +
               `👉 도전하기: ${gameUrl}`;
    };

    const handleCopy = async () => {
        const text = generateShareText();
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
            } else {
                const textArea = document.createElement("textarea");
                textArea.value = text;
                textArea.style.position = "fixed";
                textArea.style.left = "-999999px";
                textArea.style.top = "-999999px";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                const successful = document.execCommand('copy');
                textArea.remove();
                if (!successful) throw new Error('Fallback copy failed');
            }
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            prompt("자동 복사에 실패했습니다. 아래 텍스트를 수동으로 복사해주세요:", text);
        }
    };

    const handleTwitterShare = () => {
        const text = generateShareText();
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        window.open(twitterUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="share-container">
            <div className="share-buttons">
                <button 
                    className="share-btn"
                    onClick={() => setShowCardModal(true)}
                    title="명함 카드로 공유하기"
                    style={{ background: 'linear-gradient(45deg, #0088ff, #00bbff)', color: '#fff' }}
                >
                    💌 명함으로 자랑하기
                </button>
                <button 
                    className={`share-btn share-btn--copy ${copied ? 'copied' : ''}`}
                    onClick={handleCopy}
                    title="클립보드에 복사하기"
                >
                    {copied ? '✅ 복사됨!' : '📋 스탯 복사'}
                </button>
                <button 
                    className="share-btn share-btn--twitter"
                    onClick={handleTwitterShare}
                    title="X(Twitter)에 공유하기"
                >
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    <span>자랑하기</span>
                </button>
            </div>
            
            {showCardModal && (
                <ShareCardModal state={state} onClose={() => setShowCardModal(false)} />
            )}
        </div>
    );
}
