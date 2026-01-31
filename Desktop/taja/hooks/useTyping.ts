import { useState, useCallback, useRef, useEffect } from 'react';
import { getAccuracy, measureSpeed } from '@/lib/hangul/utils';

export type TypingStatus = 'ready' | 'playing' | 'finished';

interface UseTypingProps {
    targetText: string;
    onFinish?: (stats: { cpm: number; accuracy: number; time: number }) => void;
}

export const useTyping = ({ targetText, onFinish }: UseTypingProps) => {
    const [inputText, setInputText] = useState('');
    const [status, setStatus] = useState<TypingStatus>('ready');
    const [startTime, setStartTime] = useState<number | null>(null);
    const [cpm, setCpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);

    // 타겟 텍스트가 변경되면 상태 초기화
    useEffect(() => {
        reset();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [targetText]); // reset은 useCallback으로 메모이제이션되어 안정적이므로 의존성 제외

    // 입력 처리
    const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        // 시작하지 않았으면 시작 처리
        if (status === 'ready' && value.length > 0) {
            setStatus('playing');
            setStartTime(Date.now());
        }

        setInputText(value);

        // 정확도 갱신
        const currentAcc = getAccuracy(value, targetText);
        setAccuracy(currentAcc);

        // 속도 갱신
        if (startTime) {
            const currentCpm = measureSpeed(startTime, value);
            setCpm(currentCpm);
        }

        // 완료 체크 (정확히 일치하는지 확인)
        // 한 글자일 때는 즉시 완료 처리
        if (targetText.length === 1 && value === targetText) {
            if (status !== 'finished') {
                setStatus('finished');
                const endTime = Date.now();
                if (onFinish && startTime) {
                    onFinish({
                        cpm: measureSpeed(startTime, value),
                        accuracy: currentAcc,
                        time: (endTime - startTime) / 1000
                    });
                }
            }
        } else if (value === targetText && value.length === targetText.length && value.length > 0) {
            // 완료 상태로 변경 (한 번만 실행)
            if (status !== 'finished') {
                setStatus('finished');
                const endTime = Date.now();
                if (onFinish && startTime) {
                    // 완료 콜백 호출
                    onFinish({
                        cpm: measureSpeed(startTime, value),
                        accuracy: currentAcc,
                        time: (endTime - startTime) / 1000
                    });
                }
            }
        }
    }, [status, startTime, targetText, onFinish]);

    const reset = useCallback(() => {
        setInputText('');
        setStatus('ready');
        setStartTime(null);
        setCpm(0);
        setAccuracy(100);
    }, []);

    // Input element에 연결할 props
    const inputProps = {
        value: inputText,
        onChange: handleInput,
        autoFocus: true,
    };

    return {
        inputText,
        status,
        cpm,
        accuracy,
        inputProps,
        reset
    };
};
