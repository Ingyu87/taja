'use client';

import { useTyping } from '@/hooks/useTyping';
import { PracticeDisplay } from '@/components/practice/PracticeDisplay';
import { VirtualKeyboard } from '@/components/practice/VirtualKeyboard';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { useParams, useRouter } from 'next/navigation';
import { getCurrentUser, User } from '@/lib/auth';
import { savePracticeResult } from '@/lib/storage';
import { saveResultToFirestore } from '@/lib/firestore';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/contexts/ToastContext';
import confetti from 'canvas-confetti';
import StoryGenerator from '@/components/story/StoryGenerator';

// 연습 데이터
const PRACTICE_DATA: Record<string, string[]> = {
    vowel: ['ㅏ', 'ㅓ', 'ㅗ', 'ㅜ', 'ㅡ', 'ㅣ', 'ㅐ', 'ㅔ'],
    consonant: ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅎ'],
    word: ['가나', '다라', '마바', '사자', '하늘', '바다', '산', '강'],
    sentence: ['안녕하세요', '반갑습니다', '좋은 아침입니다', '타자 연습 재미있어요'],
};

export default function PracticePage() {
    const router = useRouter();
    const params = useParams();
    const rawMode = params?.mode;
    const mode = (Array.isArray(rawMode) ? rawMode[0] : rawMode) || 'vowel';
    const practiceTexts = PRACTICE_DATA[mode] || PRACTICE_DATA.vowel;

    const [user, setUser] = useState<User | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [finalStats, setFinalStats] = useState({ cpm: 0, accuracy: 0, time: 0 });

    useEffect(() => {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            router.push('/login');
        } else {
            setUser(currentUser);
        }
    }, [router]);

    const { showToast } = useToast();
    const currentText = practiceTexts[currentIndex];

    const { inputText, status, cpm, accuracy, inputProps, reset } = useTyping({
        targetText: currentText,
        onFinish: (stats) => {
            setFinalStats(stats);

            // 사용자 정보가 있으면 결과 저장
            if (user) {
                // 1. Local Storage에 저장 (백업 및 개인 기록용)
                savePracticeResult({
                    userId: user.id,
                    username: user.username,
                    avatar: user.avatar,
                    mode: mode as 'vowel' | 'consonant' | 'word' | 'sentence',
                    cpm: stats.cpm,
                    accuracy: stats.accuracy,
                    time: stats.time,
                });

                // 2. Firestore에 저장 (실시간 랭킹용)
                saveResultToFirestore({
                    userId: user.id,
                    username: user.username,
                    avatar: user.avatar,
                    mode: mode as 'vowel' | 'consonant' | 'word' | 'sentence',
                    cpm: stats.cpm,
                    accuracy: stats.accuracy,
                    time: stats.time,
                });

                // 연습 완료 시 토스트 알림 및 축하 효과 (마지막 문제일 때만)
                if (currentIndex >= practiceTexts.length - 1) {
                    showToast('🎉 연습을 완료했습니다! 결과가 저장되었습니다.', 'success');
                    confetti({
                        particleCount: 150,
                        spread: 70,
                        origin: { y: 0.6 }
                    });
                }
            }

            // 다음 문제로 이동 또는 결과 표시
            if (currentIndex < practiceTexts.length - 1) {
                setTimeout(() => {
                    setCurrentIndex(currentIndex + 1);
                    reset();
                }, 1000);
            } else {
                setShowResult(true);
            }
        },
    });

    const handleRestart = () => {
        setCurrentIndex(0);
        setShowResult(false);
        reset();
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
                <LoadingSpinner />
            </div>
        );
    }

    // 결과 화면
    if (showResult) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: 'var(--color-bg)' }}>
                <div className="w-full max-w-2xl">
                    <div className="bg-white rounded-3xl p-16 shadow-2xl text-center">
                        <div className="text-8xl mb-8">🎉</div>
                        <h1 className="text-6xl font-bold mb-8" style={{ color: 'var(--color-primary)' }}>
                            완료!
                        </h1>
                        <div className="space-y-6 mb-12">
                            <div className="text-3xl">
                                <span className="font-bold">타자 속도:</span> {finalStats.cpm} CPM
                            </div>
                            <div className="text-3xl">
                                <span className="font-bold">정확도:</span> {finalStats.accuracy}%
                            </div>
                            <div className="text-3xl">
                                <span className="font-bold">소요 시간:</span> {finalStats.time.toFixed(1)}초
                            </div>
                        </div>

                        {/* AI 스토리 생성기 (단어/문장 모드일 때만 표시) */}
                        {(mode === 'word' || mode === 'sentence') && (
                            <StoryGenerator keywords={practiceTexts} />
                        )}

                        <div className="flex gap-4 justify-center mt-8">
                            <Button variant="primary" size="lg" onClick={handleRestart} className="text-2xl px-12 py-6">
                                다시 하기 🔄
                            </Button>
                            <Button variant="secondary" size="lg" onClick={() => router.push('/')} className="text-2xl px-12 py-6">
                                홈으로 🏠
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 연습 화면
    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
            {/* 상단 헤더 */}
            <div className="p-8">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Button variant="secondary" onClick={() => router.push('/')}>
                        ← 뒤로가기
                    </Button>
                    <div className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
                        {currentIndex + 1} / {practiceTexts.length}
                    </div>
                    <div className="flex gap-6 text-xl">
                        <div><span className="font-bold">속도:</span> {cpm} CPM</div>
                        <div><span className="font-bold">정확도:</span> {accuracy}%</div>
                    </div>
                </div>
            </div>

            {/* 중앙 연습 영역 */}
            <div className="flex-1 flex flex-col justify-center">
                <PracticeDisplay targetText={currentText} inputText={inputText} />

                {/* 숨겨진 입력 필드 */}
                <div className="text-center mt-8">
                    <input
                        {...inputProps}
                        className="w-96 px-8 py-6 text-3xl text-center rounded-2xl border-4 focus:outline-none focus:ring-4 focus:ring-pink-200"
                        style={{ borderColor: 'var(--color-primary)' }}
                        placeholder="여기에 입력하세요"
                        autoFocus
                    />
                </div>
            </div>

            {/* 하단 가상 키보드 */}
            <div className="pb-8">
                <VirtualKeyboard currentKey={currentText[inputText.length]} />
            </div>
        </div>
    );
}
