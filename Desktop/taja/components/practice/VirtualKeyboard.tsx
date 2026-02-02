'use client';

import { forwardRef } from 'react';

interface VirtualKeyboardProps {
    currentKey?: string; // 현재 눌러야 할 키
}

const KEYBOARD_LAYOUT = [
    ['ㅂ', 'ㅈ', 'ㄷ', 'ㄱ', 'ㅅ', 'ㅛ', 'ㅕ', 'ㅑ', 'ㅐ', 'ㅔ'],
    ['ㅁ', 'ㄴ', 'ㅇ', 'ㄹ', 'ㅎ', 'ㅗ', 'ㅓ', 'ㅏ', 'ㅣ'],
    ['ㅋ', 'ㅌ', 'ㅊ', 'ㅍ', 'ㅠ', 'ㅜ', 'ㅡ'],
];

export const VirtualKeyboard = forwardRef<HTMLDivElement, VirtualKeyboardProps>(
    ({ currentKey }, ref) => {
        return (
            <div className="w-full px-16 py-12" ref={ref}>
                <div className="max-w-7xl mx-auto space-y-6">
                    {KEYBOARD_LAYOUT.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex justify-center gap-6">
                            {row.map((key) => {
                                const isActive = currentKey === key;
                                return (
                                    <div
                                        key={key}
                                        data-key={key}
                                        className={`
                                            flex items-center justify-center
                                            rounded-3xl font-bold
                                            transition-all duration-200
                                            ${isActive
                                                ? 'scale-110 shadow-2xl'
                                                : 'shadow-lg hover:shadow-xl'
                                            }
                                        `}
                                        style={{
                                            width: '120px',
                                            height: '120px',
                                            fontSize: '60px',
                                            backgroundColor: isActive ? 'var(--color-primary)' : 'white',
                                            color: isActive ? 'white' : 'var(--color-text)',
                                            border: isActive ? '5px solid var(--color-primary)' : '4px solid #E0E0E0'
                                        }}
                                    >
                                        {key}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
);

VirtualKeyboard.displayName = 'VirtualKeyboard';

