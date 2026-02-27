import { useState, useEffect, useCallback, useRef } from 'react';

const SFX_URL = 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'; // 기계식 키보드 소리
const BGM_URL = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'; // 루핑 가능한 배경음악 (예시)

export function useSound() {
    const [isMuted, setIsMuted] = useState(() => {
        const saved = localStorage.getItem('sound_muted');
        return saved === 'true';
    });

    const bgmRef = useRef(null);
    const sfxPool = useRef([]);
    const POOL_SIZE = 10;

    useEffect(() => {
        localStorage.setItem('sound_muted', isMuted);
        if (bgmRef.current) {
            bgmRef.current.muted = isMuted;
        }
    }, [isMuted]);

    // BGM 초기화
    useEffect(() => {
        const bgm = new Audio(BGM_URL);
        bgm.loop = true;
        bgm.volume = 0.3; // 배경음악은 은은하게
        bgm.muted = isMuted;
        bgmRef.current = bgm;

        // 브라우저 정책상 첫 상호작용 후 재생 가능하므로, 
        // 일단 로드만 해두고 첫 클릭 시 재생 시도
        const startBgm = () => {
            bgm.play().catch(e => console.log('BGM 재생 대기 중...'));
            window.removeEventListener('click', startBgm);
        };
        window.addEventListener('click', startBgm);

        return () => {
            bgm.pause();
            bgmRef.current = null;
            window.removeEventListener('click', startBgm);
        };
    }, []);

    // SFX 풀 초기화 (연타 시 소리가 끊기지 않게)
    useEffect(() => {
        sfxPool.current = Array.from({ length: POOL_SIZE }, () => {
            const audio = new Audio(SFX_URL);
            audio.volume = 0.4;
            return audio;
        });
    }, []);

    const playClick = useCallback(() => {
        if (isMuted) return;

        const audio = sfxPool.current.find(a => a.paused) || sfxPool.current[0];
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(() => { });
        }
    }, [isMuted]);

    const toggleMute = useCallback(() => {
        setIsMuted(prev => !prev);
    }, []);

    return { isMuted, toggleMute, playClick };
}
