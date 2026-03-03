import { useState } from 'react';
import { formatNumber, getItemCost, MILESTONES, getMilestoneMultiplier } from '../data/gameData';

const TABS = [
    { id: 'auto', label: '🔄 자동 성장', key: 'autoItems' },
    { id: 'click', label: '👆 클릭 성장', key: 'clickItems' },
    { id: 'special', label: '⭐ 스페셜', key: 'specialItems' },
];

export default function Shop({
    state,
    onBuyAuto,
    onBuyClick,
    onBuySpecial,
    onPlaySound,
    onShowAd,
}) {
    const [activeTab, setActiveTab] = useState('auto');

    const currentTab = TABS.find(t => t.id === activeTab);
    const items = state[currentTab.key];

    const buyHandler =
        activeTab === 'auto'
            ? onBuyAuto
            : activeTab === 'click'
                ? onBuyClick
                : onBuySpecial;

    return (
        <div className="shop">
            <div className="shop__tabs">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        className={`shop__tab ${activeTab === tab.id ? 'shop__tab--active' : ''
                            }`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="shop__items">
                {items.map((item, index) => {
                    const cost = getItemCost(item, state.globalDiscount);
                    const canAfford = state.codingPower >= cost;
                    const maxReached = item.maxOwned && item.owned >= item.maxOwned;
                    const disabled = !canAfford || maxReached;
                    const milestoneMult = getMilestoneMultiplier(item.owned);

                    // 다음 마일스톤 계산
                    const nextMilestone = MILESTONES.find(m => m.count > item.owned);
                    const progress = nextMilestone
                        ? (item.owned / nextMilestone.count) * 100
                        : 100;

                    return (
                        <div
                            key={item.id}
                            className={`item-card ${disabled ? 'item-card--disabled' : ''} ${milestoneMult > 1 ? 'item-card--milestone' : ''}`}
                            onClick={() => {
                                if (!disabled) {
                                    buyHandler(index);
                                    onPlaySound();
                                }
                            }}
                        >
                            <div className="item-card__icon">{item.icon}</div>
                            <div className="item-card__info">
                                <div className="item-card__name">
                                    {item.name}
                                    {item.owned > 0 && <span className="item-card__mult">x{milestoneMult}</span>}
                                </div>
                                <div className="item-card__desc">{item.description}</div>
                                {activeTab !== 'special' && (
                                    <div className="milestone-container">
                                        <div className="milestone-bar" style={{ width: `${progress}%` }}></div>
                                        <div className="milestone-text">
                                            {nextMilestone ? `${item.owned}/${nextMilestone.count}` : 'Max Tier'}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="item-card__right">
                                <div className="item-card__cost">
                                    {maxReached ? '완료' : formatNumber(cost)}
                                </div>
                                <div className="item-card__owned">보유: {item.owned}</div>
                            </div>
                        </div>
                    );
                })}

                {/* 🎲 도박(야근 디버깅) 결과 알림 */}
                {activeTab === 'special' && state.lastGambleResult && (
                    <div 
                        key={state.lastGambleResult} 
                        className={`gamble-result ${state.lastGambleResult.includes('성공') ? 'gamble-result--success' : 'gamble-result--fail'}`}
                    >
                        {state.lastGambleResult}
                    </div>
                )}
            </div>

            <div className="ad-banner">
                <div className="ad-banner__text">실제 혜택이 쏟아지는 보상형 광고!</div>
                <button
                    className="ad-banner__button"
                    onClick={onShowAd}
                >
                    🎬 무료 5배 부스트 받기
                </button>
            </div>
        </div>
    );
}
