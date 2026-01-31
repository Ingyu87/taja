// 부적절한 단어 필터
const PROFANITY_LIST = [
    // 욕설
    '씨발', '시발', '개새', '병신', '새끼', '지랄', '닥쳐', '꺼져', '죽어',
    '미친', '또라이', '멍청', '바보', '등신', '찐따', '빡대가리',
    '엿먹어', '좆', '좃', '젖', '섹', 'sex', '야동', '성관계',
    
    // 비속어
    '엿같', '개같', '좆같', '존나', '졸라', '개새끼', '병신새끼',
    '썅', '씹', 'ㅅㅂ', 'ㅆㅂ', 'ㅂㅅ', 'ㄱㅅㄲ',
    
    // 음란 용어
    '섹스', 'sex', '야동', '포르노', '음란', '야한', '성인',
    '자위', '음경', '성기', '나체', '벗은',
    
    // 차별/혐오
    '장애', '똥', '오줌', '방귀', '토할',
];

// 변형된 형태도 감지 (자음/모음 분리, 띄어쓰기 등)
const PATTERN_LIST = [
    /[씨시][발빨]/, 
    /개\s*새/,
    /병\s*신/,
    /[새쇄][끼키]/,
    /[지쥐]랄/,
    /[닥다][쳐처]/,
    /꺼\s*져/,
    /죽\s*어/,
    /[섹세]\s*[스쓰]/,
];

/**
 * 텍스트에 부적절한 단어가 포함되어 있는지 검사
 */
export function containsProfanity(text: string): boolean {
    if (!text) return false;
    
    const lowerText = text.toLowerCase().trim();
    
    // 직접 매칭
    for (const word of PROFANITY_LIST) {
        if (lowerText.includes(word.toLowerCase())) {
            return true;
        }
    }
    
    // 패턴 매칭
    for (const pattern of PATTERN_LIST) {
        if (pattern.test(lowerText)) {
            return true;
        }
    }
    
    return false;
}

/**
 * 부적절한 단어를 검출하고 경고 메시지 반환
 */
export function validateText(text: string): { isValid: boolean; message?: string } {
    if (!text || text.trim().length === 0) {
        return { isValid: false, message: '내용을 입력해주세요.' };
    }
    
    if (containsProfanity(text)) {
        return { 
            isValid: false, 
            message: '부적절한 단어가 포함되어 있습니다. 올바른 단어를 사용해주세요. 😊' 
        };
    }
    
    return { isValid: true };
}
