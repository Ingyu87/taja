'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, User } from '@/lib/auth';
import { saveGameResultToFirestore } from '@/lib/firestore';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import confetti from 'canvas-confetti';

const CORRECT_CHARS = ['가', '나', '다', '라', '마', '바', '사', '아', '자', '차', '카', '타', '파', '하'];
const BOMB_CHARS = ['💣', '💥', '⚠️'];

interface GameChar {
    id: number;
    char: string;
    isBomb: boolean;
}

export default function BombGamePage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameover'>('ready');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [level, setLevel] = useState(1);
    const [currentChars, setCurrentChars] = useState<GameChar[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [totalTyped, setTotalTyped] = useState(0);
    const [correctTyped, setCorrectTyped] = useState(0);
    const [bombHits, setBombHits] = useState(0);
    
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const nextIdRef = useRef(0);

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

    // 새 글자 생성
    const generateNewChars = () => {
        const charCount = Math.min(3 + Math.floor(level / 2), 6);
        const bombProbability = Math.min(0.3 + level * 0.05, 0.5);
        
        const newChars: GameChar[] = [];
        for (let i = 0; i < charCount; i++) {
            const isBomb = Math.random() < bombProbability;
            newChars.push({
                id: nextIdRef.current++,
                char: isBomb 
                    ? BOMB_CHARS[Math.floor(Math.random() * BOMB_CHARS.length)]
                    : CORRECT_CHARS[Math.floor(Math.random() * CORRECT_CHARS.length)],
                isBomb
            });
        }
        setCurrentChars(newChars);
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);

        if (value.length > 0) {
            setTotalTyped(t => t + 1);
            
            const matchChar = currentChars.find(char => char.char === value);
            
            if (matchChar) {
                if (matchChar.isBomb) {
                    // 폭탄을 쳤다!
                    setBombHits(b => b + 1);
                    setScore(s => Math.max(0, s - 20));
                } else {
                    // 정답!
                    setCorrectTyped(c => c + 1);
                    setScore(s => s + (15 * level));
                    
                    // 레벨업 체크
                    if ((score + 15 * level) % 150 === 0 && level < 10) {
                        setLevel(l => l + 1);
                    }
                }
                
                // 새 글자 생성
                generateNewChars();
            }
            
            setInputValue('');
        }
    };

    const startGame = () => {
        setGameState('playing');
        setScore(0);
        setTimeLeft(60);
        setLevel(1);
        setTotalTyped(0);
        setCorrectTyped(0);
        setBombHits(0);
        nextIdRef.current = 0;
        generateNewChars();
    };

    const endGame = async () => {
        if (timerRef.current) clearInterval(timerRef.current);

        const accuracy = totalTyped > 0 ? Math.round((correctTyped / totalTyped) * 100) : 0;

        if (user) {
            await saveGameResultToFirestore({
                userId: user.id,
                username: user.username,
                avatar: user.avatar,
                gameType: 'bomb',
                score,
                level,
                accuracy,
            });
        }

        if (score >= 200) {
            confetti({
                particleCount: 150,
                spread: 70,
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

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-orange-100 to-red-100 p-8">
            {/* 상단 정보 */}
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={() => router.push('/dashboard')}
                    className="px-8 py-4 text-xl font-black bg-white text-gray-600 hover:bg-gray-50 transition-all rounded-3xl shadow-md"
                    style={{ border: '3px solid #FF6B9D' }}
                >
                    ← 뒤로가기
                </button>
                
                <div className="flex gap-8 text-2xl font-black">
                    <div className="bg-white px-6 py-3 rounded-2xl shadow-md">
                        점수: <span className="text-orange-600">{score}</span>
                    </div>
                    <div className="bg-white px-6 py-3 rounded-2xl shadow-md">
                        레벨: <span className="text-purple-600">{level}</span>
                    </div>
                    <div className="bg-white px-6 py-3 rounded-2xl shadow-md">
                        시간: <span className="text-red-600">{timeLeft}초</span>
                    </div>
                </div>
            </div>

            {/* 게임 영역 */}
            <div className="flex-1 relative bg-white rounded-[40px] shadow-2xl overflow-hidden" style={{ minHeight: '600px' }}>
                {gameState === 'ready' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-orange-200 to-red-200">
                        <h1 className="text-7xl font-black text-red-600 mb-6">💣 폭탄 피하기 게임</h1>
                        <p className="text-3xl font-bold text-gray-700 mb-4">정답 글자만 치고 폭탄은 피하세요!</p>
                        <p className="text-2xl text-gray-600 mb-12">폭탄을 치면 점수가 -20점!</p>
                        <button
                            onClick={startGame}
                            className="px-20 py-6 text-4xl font-black text-white rounded-full shadow-2xl hover:scale-110 transition-transform"
                            style={{ background: 'linear-gradient(135deg, #FF6B9D 0%, #FF8FB9 100%)' }}
                        >
                            게임 시작! 🚀
                        </button>
                    </div>
                )}

                {gameState === 'playing' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
                        {/* 글자들 표시 */}
                        <div className="flex flex-wrap justify-center gap-8 mb-12">
                            {currentChars.map(char => (
                                <div
                                    key={char.id}
                                    className={`text-8xl font-black px-10 py-8 rounded-3xl shadow-2xl transform hover:scale-110 transition-transform ${
                                        char.isBomb 
                                            ? 'bg-gradient-to-br from-red-400 to-orange-400 animate-pulse' 
                                            : 'bg-gradient-to-br from-green-400 to-blue-400'
                                    }`}
                                    style={{ 
                                        color: 'white',
                                        minWidth: '160px',
                                        textAlign: 'center'
                                    }}
                                >
                                    {char.char}
                                </div>
                            ))}
                        </div>

                        {/* 폭탄 경고 */}
                        {bombHits > 0 && (
                            <div className="text-3xl font-black text-red-600 mb-6 animate-bounce">
                                폭탄 맞춤: {bombHits}회 💥
                            </div>
                        )}
                    </div>
                )}

                {gameState === 'gameover' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <h2 className="text-7xl font-black text-orange-600 mb-6">게임 종료! ⏰</h2>
                        <div className="bg-white p-12 rounded-[40px] shadow-2xl mb-8">
                            <p className="text-4xl font-black text-gray-800 mb-4">최종 점수: <span className="text-orange-600">{score}</span></p>
                            <p className="text-3xl font-bold text-gray-700 mb-2">도달 레벨: {level}</p>
                            <p className="text-3xl font-bold text-gray-700 mb-2">정확도: {totalTyped > 0 ? Math.round((correctTyped / totalTyped) * 100) : 0}%</p>
                            <p className="text-3xl font-bold text-red-600">폭탄 맞춤: {bombHits}회</p>
                        </div>
                        <div className="flex gap-6">
                            <button
                                onClick={startGame}
                                className="px-16 py-5 text-3xl font-black text-white rounded-full shadow-xl hover:scale-110 transition-transform"
                                style={{ background: 'linear-gradient(135deg, #FF6B9D 0%, #FF8FB9 100%)' }}
                            >
                                다시 하기 🔄
                            </button>
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="px-16 py-5 text-3xl font-black text-white rounded-full shadow-xl hover:scale-110 transition-transform"
                                style={{ background: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)' }}
                            >
                                홈으로 🏠
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* 입력 필드 */}
            {gameState === 'playing' && (
                <div className="mt-6 text-center">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInput}
                        className="w-96 px-8 py-6 text-5xl text-center border-8 focus:outline-none focus:ring-8 focus:ring-orange-200 font-black rounded-full"
                        style={{ borderColor: '#FF6B9D' }}
                        placeholder="여기 입력"
                        autoFocus
                    />
                </div>
            )}
        </div>
    );
}
