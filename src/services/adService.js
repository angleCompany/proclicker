/**
 * AdService - 광고 플랫폼 연동을 위한 추상화 서비스
 * 현재는 시뮬레이션 모드로 작동하며, 이후 AppLixir 또는 AdSense SDK로 교체 가능합니다.
 */

class AdService {
    constructor() {
        this.isAdLoading = false;
        this.lastAdTime = 0;
        this.adCooldown = 5 * 60 * 1000; // 5분 쿨타임
        this.rewardTimerSeconds = 15; // 15초 노출 시 보상
    }

    /**
     * 보상형 광고 호출 (Kakao AdFit 배너 기반)
     * @returns {Promise<boolean>} - 광고 시청 완료 여부
     */
    async showRewardedAd() {
        if (this.isAdLoading) return false;

        const now = Date.now();
        if (now - this.lastAdTime < this.adCooldown) {
            const remaining = Math.ceil((this.adCooldown - (now - this.lastAdTime)) / 1000);
            alert(`광고가 아직 준비되지 않았습니다. ${remaining}초 후에 다시 시도해 주세요.`);
            return false;
        }

        // 실제 연동 시나리오:
        // 1. 광고 모달을 띄운다.
        // 2. 모달 내에 AdFit 배너(ins 태그)를 렌더링한다.
        // 3. 15초 카운트다운 후 '보상 받기' 활성화.
        
        return new Promise((resolve) => {
            this.isAdLoading = true;
            
            // 전역 상대로 광고 노출 이벤트를 보냄 (UI에서 감지)
            const event = new CustomEvent('SHOW_AD_MODAL', { 
                detail: { 
                    seconds: this.rewardTimerSeconds,
                    onComplete: () => {
                        this.isAdLoading = false;
                        this.lastAdTime = Date.now();
                        resolve(true);
                    },
                    onCancel: () => {
                        this.isAdLoading = false;
                        resolve(false);
                    }
                } 
            });
            window.dispatchEvent(event);
        });
    }

    getRemainingCooldown() {
        const remaining = this.adCooldown - (Date.now() - this.lastAdTime);
        return Math.max(0, remaining);
    }
}

export const adService = new AdService();
