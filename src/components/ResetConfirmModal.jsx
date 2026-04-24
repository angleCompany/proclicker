import { useState } from 'react';

export default function ResetConfirmModal({ onConfirm, onClose }) {
    const [inputValue, setInputValue] = useState('');
    const CONFIRM_TEXT = '초기화';
    const isReady = inputValue === CONFIRM_TEXT;

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.9)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 99999,
                backdropFilter: 'blur(8px)'
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    background: 'linear-gradient(145deg, #1e1e2f, #2a1a1a)',
                    borderRadius: '20px',
                    width: '90%',
                    maxWidth: '400px',
                    padding: '32px 28px',
                    boxShadow: '0 0 60px rgba(255,60,60,0.25)',
                    border: '2px solid rgba(255,60,60,0.4)',
                    color: '#fff',
                    animation: 'scaleIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    textAlign: 'center'
                }}
            >
                <div style={{ fontSize: '52px', marginBottom: '16px' }}>⚠️</div>

                <h2 style={{ margin: '0 0 12px 0', fontSize: '20px', color: '#ff6b6b' }}>
                    데이터 초기화
                </h2>

                <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#bbb', lineHeight: 1.6 }}>
                    모든 진행 상황이 <strong style={{ color: '#ff6b6b' }}>영구적으로 삭제</strong>됩니다.
                </p>
                <p style={{ margin: '0 0 24px 0', fontSize: '13px', color: '#888', lineHeight: 1.5 }}>
                    코딩력, 업적, 크루, 업그레이드 등<br />복구가 불가능합니다.
                </p>

                <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '13px', color: '#aaa', marginBottom: '8px' }}>
                        확인을 위해 <strong style={{ color: '#ff9999' }}>"{CONFIRM_TEXT}"</strong>를 입력하세요
                    </div>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        placeholder={CONFIRM_TEXT}
                        autoFocus
                        style={{
                            width: '100%',
                            padding: '10px 14px',
                            fontSize: '15px',
                            borderRadius: '8px',
                            border: isReady
                                ? '2px solid rgba(255,60,60,0.7)'
                                : '2px solid rgba(255,255,255,0.15)',
                            background: 'rgba(255,255,255,0.06)',
                            color: '#fff',
                            outline: 'none',
                            textAlign: 'center',
                            transition: 'border-color 0.2s',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={onClose}
                        style={{
                            flex: 1,
                            padding: '12px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            background: 'rgba(255,255,255,0.08)',
                            color: '#aaa',
                            border: '1px solid rgba(255,255,255,0.15)',
                            borderRadius: '10px',
                            cursor: 'pointer',
                        }}
                    >
                        취소
                    </button>
                    <button
                        onClick={() => isReady && onConfirm()}
                        disabled={!isReady}
                        style={{
                            flex: 1,
                            padding: '12px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            background: isReady
                                ? 'linear-gradient(45deg, #ff4444, #cc2222)'
                                : 'rgba(255,255,255,0.05)',
                            color: isReady ? '#fff' : '#555',
                            border: isReady
                                ? '1px solid rgba(255,60,60,0.6)'
                                : '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '10px',
                            cursor: isReady ? 'pointer' : 'not-allowed',
                            boxShadow: isReady ? '0 3px 12px rgba(255,60,60,0.4)' : 'none',
                            transition: 'all 0.2s',
                        }}
                    >
                        초기화
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes scaleIn {
                    0% { transform: scale(0.85); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
