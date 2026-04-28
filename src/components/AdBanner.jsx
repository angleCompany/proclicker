export default function AdBanner({ adRemoved, onWatchAd }) {
    if (adRemoved) return null;

    return (
        <div className="ad-banner">
            <span className="ad-banner__text">💼 외주 미팅 30분간 진행하고 2배 획득!</span>
            <button className="ad-banner__button" onClick={onWatchAd}>
                미팅 수락
            </button>
        </div>
    );
}
