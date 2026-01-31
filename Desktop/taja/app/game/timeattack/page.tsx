'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, User } from '@/lib/auth';
import { saveGameResultToFirestore } from '@/lib/firestore';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import confetti from 'canvas-confetti';

const GAME_WORDS = [
    '가방', '나무', '다리', '라면', '마음', '바다', '사과', '아이',
    '자동차', '차례', '카메라', '타자', '파도', '하늘', '강아지', '고양이',
    '토끼', '코끼리', '기린', '사자', '학교', '선생님', '친구', '공부',
    '책상', '의자', '엄마', '아빠', '동생', '가족', '집', '방',
    '봄', '여름', '가을', '겨울', '꽃', '나비', '별', '달'
];

export default function TimeAttackGamePage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameover'>('ready');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [currentWord, setCurrentWord] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [combo, setCombo] = useState(0);
    const [maxCombo, setMaxCombo] = useState(0);
    const [totalTyped, setTotalTyped] = useState(0);
    const [correctTyped, setCorrectTyped] = useState(0);
    const [level, setLevel] = useState(1);
    
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            router.replace('/login');
        } else {
            setUser(currentUser);
        }
    }, [router]);

    // 타이머
    useEffect(() => {
        if (gameState !== 'playing') return;

        timerRef.current = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    setGameState('gameover');
                    return 0;
                }
                return t - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [gameState]);

    // 새 단어 생성
    const generateNewWord = () => {
        const newWord = GAME_WORDS[Math.floor(Math.random() * GAME_WORDS.length)];
        setCurrentWord(newWord);
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);

        // 완성된 글자 수 체크
        if (value === currentWord) {
            setTotalTyped(t => t + currentWord.length);
            setCorrectTyped(c => c + currentWord.length);
            
            // 콤보 증가
            const newCombo = combo + 1;
            setCombo(newCombo);
            if (newCombo > maxCombo) {
                setMaxCombo(newCombo);
            }
            
            // 점수 계산 (콤보에 따라 보너스)
            const baseScore = currentWord.length * 10;
            const comboBonus = Math.min(newCombo * 5, 100);
            setScore(s => s + baseScore + comboBonus);
            
            // 레벨업 (10개마다)
            if ((correctTyped + currentWord.length) % 50 === 0 && level < 10) {
                setLevel(l => l + 1);
                setTimeLeft(t => t + 5); // 보너스 시간
            }
            
            // 입력 초기화 및 새 단어
            setInputValue('');
            generateNewWord();
        }
    };

    const startGame = () => {
        setGameState('playing');
        setScore(0);
        setTimeLeft(30);
        setCombo(0);
        setMaxCombo(0);
        setTotalTyped(0);
        setCorrectTyped(0);
        setLevel(1);
        generateNewWord();
    };

    const endGame = async () => {
        if (timerRef.current) clearInterval(timerRef.current);

        const accuracy = totalTyped > 0 ? Math.round((correctTyped / totalTyped) * 100) : 100;

        if (user) {
            await saveGameResultToFirestore({
                userId: user.id,
                username: user.username,
                avatar: user.avatar,
                gameType: 'timeattack',
                score,
                level,
                accuracy,
            });
        }

        if (score >= 300) {
            confetti({
                particleCount: 200,
                spread: 90,
                origin: { y: 0.6 }
            });
        }
    };

    useEffect(() => {
        if (gameState === 'gameover') {
            endGame();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameState]);

    // 오타 감지 (현재 입력이 목표 단어의 시작 부분과 일치하지 않으면)
    const isWrong = inputValue.length > 0 && !currentWord.startsWith(inputValue);
    
    useEffect(() => {
        if (isWrong) {
            setCombo(0);
            setTotalTyped(t => t + 1);
        }
    }, [isWrong]);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-100 to-cyan-100 p-8">
            {/* 상단 정보 */}
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={() => router.push('/dashboard')}
                    className="px-8 py-4 font-black bg-white text-gray-600 hover:bg-gray-50 transition-all rounded-3xl shadow-md"
                    style={{ border: '3px solid #4ECDC4', fontSize: '3rem' }}
                >
                    ← 뒤로가기
                </button>
                
                <div className="flex gap-6 font-black" style={{ fontSize: '4rem' }}>
                    <div className="bg-white px-6 py-3 rounded-3xl shadow-md">
                        점수: <span className="text-green-600">{score}</span>
                    </div>
                    <div className="bg-white px-6 py-3 rounded-3xl shadow-md">
                        콤보: <span className="text-orange-600">{combo}🔥</span>
                    </div>
                    <div className="bg-white px-6 py-3 rounded-3xl shadow-md">
                        시간: <span className="text-red-600">{timeLeft}초</span>
                    </div>
                </div>
            </div>

            {/* 게임 영역 */}
            <div className="flex-1 relative bg-white rounded-[40px] shadow-2xl overflow-hidden flex items-center justify-center" style={{ minHeight: '700px' }}>
                {gameState === 'ready' && (
                    <div className="flex flex-col items-center justify-center p-8">
                        <h1 className="font-black text-green-600 mb-6" style={{ fontSize: '6rem', lineHeight: '1' }}>⏰ 시간 공격 게임</h1>
                        <p className="text-4xl font-bold text-gray-700 mb-4">30초 안에 최대한 많은 단어를 치세요!</p>
                        <p className="text-3xl text-gray-600 mb-10">연속으로 맞추면 콤보 점수 획득!</p>
                        <button
                            onClick={startGame}
                            className="px-16 py-6 font-black text-white rounded-full shadow-2xl hover:scale-110 transition-transform"
                            style={{ background: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)', fontSize: '4rem' }}
                        >
                            게임 시작! 🚀
                        </button>
                    </div>
                )}

                {gameState === 'playing' && (
                    <div className="flex flex-col items-center justify-center p-10">
                        {/* 콤보 표시 */}
                        {combo >= 3 && (
                            <div className="mb-8 font-black text-orange-600 animate-pulse" style={{ fontSize: '6rem' }}>
                                {combo} COMBO! 🔥
                            </div>
                        )}

                        {/* 목표 단어 */}
                        <div className="bg-gradient-to-br from-blue-400 to-purple-400 px-16 py-10 rounded-[40px] shadow-2xl mb-12">
                            <div className="font-black text-center" style={{ letterSpacing: '0.1em', fontSize: '7rem' }}>
                                {currentWord.split('').map((char, index) => {
                                    let color = '#000000';
                                    if (index < inputValue.length) {
                                        color = inputValue[index] === char ? '#4ADE80' : '#EF4444';
                                    }
                                    return (
                                        <span key={index} style={{ color }}>
                                            {char}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 진행률 표시 */}
                        <div className="w-full max-w-3xl bg-gray-200 rounded-full h-5 mb-8">
                            <div 
                                className="bg-gradient-to-r from-green-400 to-blue-500 h-5 rounded-full transition-all duration-300"
                                style={{ width: `${(inputValue.length / currentWord.length) * 100}%` }}
                            ></div>
                        </div>

                        {/* 입력 필드 */}
                        <input
                            type="text"
                            value={inputValue}
                            onChange={handleInput}
                            className="w-full max-w-3xl px-12 py-8 text-center border-4 focus:outline-none focus:ring-4 focus:ring-green-200 font-black rounded-full"
                            style={{ 
                                borderColor: isWrong ? '#EF4444' : '#4ECDC4',
                                backgroundColor: isWrong ? '#FEE2E2' : 'white',
                                fontSize: '5rem',
                                color: '#000000'
                            }}
                            placeholder=""
                            autoFocus
                        />
                    </div>
                )}

                {gameState === 'gameover' && (
                    <div className="flex flex-col items-center justify-center p-8">
                        <h2 className="font-black text-green-600 mb-6" style={{ fontSize: '6rem', lineHeight: '1' }}>시간 종료! ⏰</h2>
                        <div className="bg-white p-10 rounded-[40px] shadow-2xl mb-8">
                            <p className="text-5xl font-black text-gray-800 mb-5">최종 점수: <span className="text-green-600">{score}</span></p>
                            <p className="text-4xl font-bold text-gray-700 mb-3">최고 콤보: {maxCombo}연속</p>
                            <p className="text-4xl font-bold text-gray-700 mb-3">도달 레벨: {level}</p>
                            <p className="text-4xl font-bold text-gray-700">정확도: {totalTyped > 0 ? Math.round((correctTyped / totalTyped) * 100) : 100}%</p>
                        </div>
                        <div className="flex gap-6">
                            <button
                                onClick={startGame}
                                className="px-14 py-5 font-black text-white rounded-full shadow-xl hover:scale-110 transition-transform"
                                style={{ background: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)', fontSize: '3.5rem' }}
                            >
                                다시 하기 🔄
                            </button>
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="px-14 py-5 font-black text-white rounded-full shadow-xl hover:scale-110 transition-transform"
                                style={{ background: 'linear-gradient(135deg, #FF6B9D 0%, #FF8FB9 100%)', fontSize: '3.5rem' }}
                            >
                                홈으로 🏠
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
