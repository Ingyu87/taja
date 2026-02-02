'use client';

import { RefObject, useEffect, useState } from 'react';

interface HandAnimationProps {
    targetKey: string;
    keyboardRef: RefObject<HTMLDivElement | null>;
    show: boolean;
}

export const HandAnimation = ({ targetKey, keyboardRef, show }: HandAnimationProps) => {
    const [position, setPosition] = useState<{ x: number; y: number } | null>(null);

    useEffect(() => {
        if (!show || !keyboardRef.current || !targetKey) {
            setPosition(null);
            return;
        }

        // targetKey에 해당하는 키 요소 찾기
        const keyElement = keyboardRef.current.querySelector(`[data-key="${targetKey}"]`) as HTMLElement;
        
        if (keyElement) {
            const keyRect = keyElement.getBoundingClientRect();
            const containerRect = keyboardRef.current.getBoundingClientRect();
            
            // 키의 중앙 위치 계산 (컨테이너 기준)
            const x = keyRect.left - containerRect.left + keyRect.width / 2;
            const y = keyRect.top - containerRect.top + keyRect.height / 2;
            
            setPosition({ x, y });
        }
    }, [show, targetKey, keyboardRef]);

    if (!show || !position) {
        return null;
    }

    return (
        <div
            className="pointer-events-none"
            style={{
                position: 'absolute',
                left: `${position.x}px`,
                top: `${position.y}px`,
                transform: 'translate(-50%, -50%)',
                zIndex: 100,
            }}
        >
            <div className="hand-animation" style={{ fontSize: '80px', opacity: 0.6 }}>
                👆
            </div>
            <style jsx>{`
                @keyframes press-key {
                    0% {
                        transform: translateY(-40px) scale(1);
                        opacity: 0.6;
                    }
                    40% {
                        transform: translateY(0px) scale(1.1);
                        opacity: 0.8;
                    }
                    60% {
                        transform: translateY(0px) scale(1.1);
                        opacity: 0.8;
                    }
                    100% {
                        transform: translateY(-40px) scale(1);
                        opacity: 0.6;
                    }
                }
                
                .hand-animation {
                    animation: press-key 1.5s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};
