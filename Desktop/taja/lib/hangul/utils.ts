import Hangul from 'hangul-js';

export interface HangulChar {
    char: string;
    chosung: string;
    jungsung: string;
    jongsung: string;
}

/**
 * 한글 음절을 초성/중성/종성으로 분리합니다.
 */
export const decomposeHangul = (char: string): string[] => {
    return Hangul.disassemble(char);
};

/**
 * 입력된 텍스트와 목표 텍스트의 정확도를 계산합니다.
 * 자소 단위로 비교하여 더 정밀한 정확도를 제공합니다.
 */
export const getAccuracy = (input: string, target: string): number => {
    if (target.length === 0) return 0;
    if (input.length === 0) return 0;

    const inputJaso = Hangul.disassemble(input);
    const targetJaso = Hangul.disassemble(target);

    let correctCount = 0;
    const totalCount = targetJaso.length;

    // 입력된 길이만큼만 비교
    for (let i = 0; i < Math.min(inputJaso.length, targetJaso.length); i++) {
        if (inputJaso[i] === targetJaso[i]) {
            correctCount++;
        }
    }

    return Math.floor((correctCount / totalCount) * 100);
};

/**
 * 타자 속도 (CPM: Characters Per Minute) 계산
 */
export const measureSpeed = (startTime: number | null, input: string): number => {
    if (!startTime || input.length === 0) return 0;

    const now = Date.now();
    const elapsedSeconds = (now - startTime) / 1000;

    if (elapsedSeconds < 1) return 0;

    // 타수는 자소 단위
    const strokeCount = Hangul.disassemble(input).length;

    // (누적 타수 / 경과 시간(분))
    const cpm = Math.floor((strokeCount / elapsedSeconds) * 60);
    return cpm;
};

/**
 * 두 한글 문자열이 자소 단위로 일치하는지 확인
 */
export const isJasoMatch = (char1: string, char2: string): boolean => {
    if (char1 === char2) return true;
    const dis1 = Hangul.disassemble(char1);
    const dis2 = Hangul.disassemble(char2);

    return JSON.stringify(dis1) === JSON.stringify(dis2);
};
