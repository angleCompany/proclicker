export default function AdBanner({ adRemoved, onWatchAd }) {
    if (adRemoved) return null;

    return (
        <div className="ad-banner">
            <span className="ad-banner__text">📺 광고 보고 30분간 2배 획득!</span>
            <button className="ad-banner__button" onClick={onWatchAd}>
                광고 보기
            </button>
        </div>
    );
}
