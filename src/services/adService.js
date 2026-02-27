/**
 * AdService - 광고 플랫폼 연동을 위한 추상화 서비스
 * 현재는 시뮬레이션 모드로 작동하며, 이후 AppLixir 또는 AdSense SDK로 교체 가능합니다.
 */

class AdService {
    constructor() {
        this.isAdLoading = false;
        this.lastAdTime = 0;
        this.adCooldown = 5 * 60 * 1000; // 5분 쿨타임
    }

    /**
     * 보상형 광고 호출
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

        this.isAdLoading = true;
        console.log("AdService: Loading Ad...");

        // 시뮬레이션 광고 팝업 (실제 환경에서는 SDK 호출로 대체)
        return new Promise((resolve) => {
            const confirmed = window.confirm(
                "🎬 [광고 시청 중...]\n\n" +
                "30초 동안 광고를 시청하고 강력한 보상(30분간 코딩력 10배)을 받으시겠습니까?\n" +
                "(현재는 개발용 시뮬레이션 모드입니다)"
            );

            // 시뮬레이션 대기 (실제로는 비디오 플레이어 종료 시점)
            setTimeout(() => {
                this.isAdLoading = false;
                if (confirmed) {
                    this.lastAdTime = Date.now();
                    console.log("AdService: Ad Completed. Rewarding User.");
                    resolve(true);
                } else {
                    console.log("AdService: Ad Cancelled.");
                    resolve(false);
                }
            }, 500); // 테스트를 위해 짧게 대기
        });
    }

    getRemainingCooldown() {
        const remaining = this.adCooldown - (Date.now() - this.lastAdTime);
        return Math.max(0, remaining);
    }
}

export const adService = new AdService();
