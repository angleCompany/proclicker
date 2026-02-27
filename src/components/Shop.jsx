import { useState } from 'react';
import { formatNumber, getItemCost } from '../data/gameData';

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
                    const cost = getItemCost(item);
                    const canAfford = state.codingPower >= cost;
                    const maxReached = item.maxOwned && item.owned >= item.maxOwned;
                    const disabled = !canAfford || maxReached;

                    let effectLabel = '';
                    if (activeTab === 'auto') {
                        effectLabel = `+${formatNumber(item.effect)}/초`;
                    } else if (activeTab === 'click') {
                        effectLabel = `+${formatNumber(item.effect)}/클릭`;
                    } else {
                        if (item.type === 'boost') effectLabel = `${item.effect}배 부스트`;
                        else if (item.type === 'permanent')
                            effectLabel = `${item.effect}배 영구`;
                        else effectLabel = item.description;
                    }

                    return (
                        <div
                            key={item.id}
                            className={`item-card ${disabled ? 'item-card--disabled' : ''}`}
                            onClick={() => {
                                if (!disabled) {
                                    buyHandler(index);
                                    onPlaySound();
                                }
                            }}
                        >
                            <div className="item-card__icon">{item.icon}</div>
                            <div className="item-card__info">
                                <div className="item-card__name">{item.name}</div>
                                <div className="item-card__desc">{item.description}</div>
                            </div>
                            <div className="item-card__right">
                                <div className="item-card__cost">
                                    {maxReached ? '완료' : formatNumber(cost)}
                                </div>
                                <div className="item-card__effect">{effectLabel}</div>
                                <div className="item-card__owned">보유: {item.owned}</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="ad-banner">
                <div className="ad-banner__text">실제 혜택이 쏟아지는 보상형 광고!</div>
                <button
                    className="ad-banner__button"
                    onClick={onShowAd}
                >
                    🎬 무료 10배 부스트 받기
                </button>
            </div>
        </div>
    );
}
