'use client';

import Hangul from 'hangul-js';

interface PracticeDisplayProps {
    targetText: string;
    inputText: string;
}

export const PracticeDisplay = ({ targetText, inputText }: PracticeDisplayProps) => {
    // 자소 단위로 분리하여 비교
    const targetJaso = Hangul.disassemble(targetText);
    const inputJaso = Hangul.disassemble(inputText);

    return (
        <div className="w-full max-w-5xl mx-auto p-12">
            <div className="bg-white p-16 shadow-2xl" style={{ borderRadius: '48px' }}>
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                        아래 글자를 따라 쳐보세요
                    </h2>
                </div>

                {/* 목표 텍스트 표시 */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {targetText.split('').map((char, index) => {
                        // 현재 입력 진행 상황 확인
                        const inputChars = inputText.split('');
                        const isCompleted = index < inputChars.length && inputChars[index] === char;
                        const isCurrent = index === inputChars.length;
                        const isWrong = index < inputChars.length && inputChars[index] !== char;

                        let bgColor = 'transparent';
                        let textColor = 'var(--color-text)';
                        let borderColor = '#E0E0E0';

                        if (isCompleted) {
                            bgColor = 'var(--color-accent-2)'; // 초록
                            textColor = 'white';
                        } else if (isCurrent) {
                            bgColor = 'var(--color-accent-1)'; // 노랑
                            borderColor = 'var(--color-primary)';
                        } else if (isWrong) {
                            bgColor = '#FFB3B3'; // 빨강
                            textColor = 'white';
                        }

                        return (
                            <div
                                key={index}
                                className="w-20 h-20 flex items-center justify-center text-5xl font-bold transition-all duration-200"
                                style={{
                                    borderRadius: '24px',
                                    backgroundColor: bgColor,
                                    color: textColor,
                                    border: `3px solid ${borderColor}`,
                                    transform: isCurrent ? 'scale(1.1)' : 'scale(1)',
                                }}
                            >
                                {char}
                            </div>
                        );
                    })}
                </div>

                {/* 사용자 입력 표시 (숨김 처리, 실제로는 input에서 처리) */}
                <div className="text-center text-2xl text-gray-500">
                    {inputText.length} / {targetText.length} 글자
                </div>
            </div>
        </div>
    );
};
