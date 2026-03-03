import { useState, useEffect, useCallback, useRef } from 'react';

const SFX_URL = 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'; // 기계식 키보드 소리

export function useSound() {
    const [isMuted, setIsMuted] = useState(() => {
        const saved = localStorage.getItem('sound_muted');
        return saved === 'true';
    });

    const sfxPool = useRef([]);
    const POOL_SIZE = 10;

    // SFX 풀 초기화
    useEffect(() => {
        sfxPool.current = Array.from({ length: POOL_SIZE }, () => {
            const audio = new Audio(SFX_URL);
            audio.volume = 0.4;
            return audio;
        });
        
        return () => {
            sfxPool.current.forEach(audio => {
                audio.pause();
                audio.src = '';
            });
            sfxPool.current = [];
        };
    }, []);

    useEffect(() => {
        localStorage.setItem('sound_muted', isMuted);
    }, [isMuted]);

    const playClick = useCallback(() => {
        if (isMuted) return;
        if (sfxPool.current.length === 0) return;

        const audio = sfxPool.current.find(a => a.paused) || sfxPool.current[0];
        if (audio) {
            // ESLint의 immutability 체크를 우회하기 위해 Audio 객체의 속성 수정을 안전하게 처리
            // 실제로는 ref 내부의 객체 속성을 변경하는 것이므로 렌더링에 영향이 없음
            try {
                audio.currentTime = 0; // eslint-disable-line react-hooks/immutability
                audio.play().catch(() => { });
            } catch {
                // 오디오 관련 예외 처리
            }
        }
    }, [isMuted]);

    const playBuySound = useCallback(() => {
        playClick();
    }, [playClick]);

    const toggleMute = useCallback(() => {
        setIsMuted(prev => !prev);
    }, []);

    return { isMuted, toggleMute, playClick, playBuySound };
}
