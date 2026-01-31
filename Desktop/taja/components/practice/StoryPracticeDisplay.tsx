'use client';

interface StoryPracticeDisplayProps {
    targetText: string;
    inputText: string;
}

export const StoryPracticeDisplay = ({ targetText, inputText }: StoryPracticeDisplayProps) => {
    // 문장 단위로 분리 (마침표, 느낌표, 물음표 기준)
    const sentences = targetText.split(/([.!?]\s*)/g).filter(s => s.trim().length > 0);
    
    // 현재 입력 진행률 계산
    const progress = Math.round((inputText.length / targetText.length) * 100);
    
    // 현재 어느 문장을 치고 있는지 계산
    let currentSentenceIndex = 0;
    let accumulatedLength = 0;
    
    for (let i = 0; i < sentences.length; i++) {
        accumulatedLength += sentences[i].length;
        if (inputText.length < accumulatedLength) {
            currentSentenceIndex = i;
            break;
        }
        if (i === sentences.length - 1) {
            currentSentenceIndex = i;
        }
    }
    
    // 현재 문장 시작 위치
    let sentenceStartPos = 0;
    for (let i = 0; i < currentSentenceIndex; i++) {
        sentenceStartPos += sentences[i].length;
    }
    
    const currentSentence = sentences[currentSentenceIndex] || '';
    const relativeInputPos = inputText.length - sentenceStartPos;

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* 진행률 표시 */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-gray-700" style={{ fontSize: '1.5rem' }}>
                        진행률
                    </span>
                    <span className="font-black text-purple-600" style={{ fontSize: '1.8rem' }}>
                        {progress}%
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            {/* 현재 문장 표시 */}
            <div className="bg-white p-10 shadow-2xl mb-6" style={{ borderRadius: '30px' }}>
                <div className="text-center mb-6">
                    <h2 className="font-bold text-gray-800" style={{ fontSize: '2.5rem' }}>
                        아래 문장을 따라 쳐보세요
                    </h2>
                </div>

                {/* 현재 문장을 글자별로 표시 */}
                <div className="flex flex-wrap justify-center gap-3">
                    {currentSentence.split('').map((char, index) => {
                        const isCompleted = index < relativeInputPos && inputText[sentenceStartPos + index] === char;
                        const isCurrent = index === relativeInputPos;
                        const isWrong = index < relativeInputPos && inputText[sentenceStartPos + index] !== char;

                        let bgColor = 'transparent';
                        let textColor = '#000000';
                        let borderColor = '#E0E0E0';

                        if (isCompleted) {
                            bgColor = '#4ADE80'; // 초록
                            textColor = 'white';
                            borderColor = '#4ADE80';
                        } else if (isCurrent) {
                            bgColor = '#FCD34D'; // 노랑
                            borderColor = '#9B59B6';
                            textColor = '#000000';
                        } else if (isWrong) {
                            bgColor = '#EF4444'; // 빨강
                            textColor = 'white';
                            borderColor = '#EF4444';
                        }

                        return (
                            <div
                                key={index}
                                className="flex items-center justify-center font-black transition-all duration-200"
                                style={{
                                    width: char === ' ' ? '3rem' : '5rem',
                                    height: '5rem',
                                    borderRadius: '12px',
                                    backgroundColor: bgColor,
                                    color: textColor,
                                    border: `3px solid ${borderColor}`,
                                    transform: isCurrent ? 'scale(1.15)' : 'scale(1)',
                                    fontSize: char === ' ' ? '2rem' : '3.5rem',
                                    boxShadow: isCurrent ? '0 4px 20px rgba(155, 89, 182, 0.4)' : 'none'
                                }}
                            >
                                {char === ' ' ? '␣' : char}
                            </div>
                        );
                    })}
                </div>

                {/* 진행 상황 */}
                <div className="text-center mt-6 font-bold" style={{ fontSize: '1.8rem', color: '#666' }}>
                    {inputText.length} / {targetText.length} 글자
                </div>
            </div>

            {/* 전체 텍스트 미리보기 (작게) */}
            <div className="bg-gray-50 p-6 rounded-2xl">
                <h3 className="font-bold text-gray-600 mb-3" style={{ fontSize: '1.5rem' }}>
                    📖 전체 이야기 미리보기
                </h3>
                <p className="text-gray-700 leading-relaxed" style={{ fontSize: '1.2rem' }}>
                    {targetText}
                </p>
            </div>
        </div>
    );
};
