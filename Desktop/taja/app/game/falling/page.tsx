'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, User } from '@/lib/auth';
import { saveGameResultToFirestore } from '@/lib/firestore';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import confetti from 'canvas-confetti';

interface FallingChar {
    id: number;
    char: string;
    x: number;
    y: number;
    speed: number;
}

const GAME_CHARS = [
    'ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
    'ㅏ', 'ㅓ', 'ㅗ', 'ㅜ', 'ㅡ', 'ㅣ', 'ㅐ', 'ㅔ'
];

export default function FallingGamePage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameover'>('ready');
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [level, setLevel] = useState(1);
    const [fallingChars, setFallingChars] = useState<FallingChar[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [totalTyped, setTotalTyped] = useState(0);
    const [correctTyped, setCorrectTyped] = useState(0);
    
    const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
    const spawnTimerRef = useRef<NodeJS.Timeout | null>(null);
    const nextIdRef = useRef(0);

    useEffect(() => {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            router.replace('/login');
        } else {
            setUser(currentUser);
        }
    }, [router]);

    // 게임 루프
    useEffect(() => {
        if (gameState !== 'playing') return;

        gameLoopRef.current = setInterval(() => {
            setFallingChars(prev => {
                const updated = prev.map(char => ({
                    ...char,
                    y: char.y + char.speed
                }));

                // 바닥에 닿은 글자 체크
                const touchedGround = updated.filter(char => char.y >= 85);
                if (touchedGround.length > 0) {
                    setLives(l => {
                        const newLives = l - touchedGround.length;
                        if (newLives <= 0) {
                            setGameState('gameover');
                            return 0;
                        }
                        return newLives;
                    });
                }

                return updated.filter(char => char.y < 85);
            });
        }, 50);

        return () => {
            if (gameLoopRef.current) clearInterval(gameLoopRef.current);
        };
    }, [gameState]);

    // 글자 생성
    useEffect(() => {
        if (gameState !== 'playing') return;

        const spawnInterval = Math.max(800 - level * 50, 300);

        spawnTimerRef.current = setInterval(() => {
            const newChar: FallingChar = {
                id: nextIdRef.current++,
                char: GAME_CHARS[Math.floor(Math.random() * GAME_CHARS.length)],
                x: Math.random() * 80 + 10,
                y: 0,
                speed: 0.5 + level * 0.1
            };
            setFallingChars(prev => [...prev, newChar]);
        }, spawnInterval);

        return () => {
            if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
        };
    }, [gameState, level]);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);

        if (value.length > 0) {
            setTotalTyped(t => t + 1);
            
            // 입력한 글자가 떨어지는 글자 중 하나와 일치하는지 확인
            const matchIndex = fallingChars.findIndex(char => char.char === value);
            
            if (matchIndex !== -1) {
                // 맞춤!
                setCorrectTyped(c => c + 1);
                setScore(s => s + (10 * level));
                setFallingChars(prev => prev.filter((_, i) => i !== matchIndex));
                
                // 레벨업 체크
                if ((score + 10 * level) % 100 === 0 && level < 10) {
                    setLevel(l => l + 1);
                }
            }
            
            setInputValue('');
        }
    };

    const startGame = () => {
        setGameState('playing');
        setScore(0);
        setLives(3);
        setLevel(1);
        setFallingChars([]);
        setTotalTyped(0);
        setCorrectTyped(0);
        nextIdRef.current = 0;
    };

    const endGame = async () => {
        if (gameLoopRef.current) clearInterval(gameLoopRef.current);
        if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);

        const accuracy = totalTyped > 0 ? Math.round((correctTyped / totalTyped) * 100) : 0;

        if (user) {
            await saveGameResultToFirestore({
                userId: user.id,
                username: user.username,
                avatar: user.avatar,
                gameType: 'falling',
                score,
                level,
                accuracy,
            });
        }

        if (score >= 100) {
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
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-100 to-purple-100 p-8">
            {/* 상단 정보 */}
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={() => router.push('/dashboard')}
                    className="px-16 py-8 font-black bg-white text-gray-600 hover:bg-gray-50 transition-all rounded-3xl shadow-md"
                    style={{ border: '6px solid #4ECDC4', fontSize: '6rem' }}
                >
                    ← 뒤로가기
                </button>
                
                <div className="flex gap-12 font-black" style={{ fontSize: '8rem' }}>
                    <div className="bg-white px-12 py-6 rounded-3xl shadow-md">
                        점수: <span className="text-blue-600">{score}</span>
                    </div>
                    <div className="bg-white px-12 py-6 rounded-3xl shadow-md">
                        레벨: <span className="text-purple-600">{level}</span>
                    </div>
                    <div className="bg-white px-12 py-6 rounded-3xl shadow-md">
                        생명: <span className="text-red-600">{'❤️'.repeat(lives)}</span>
                    </div>
                </div>
            </div>

            {/* 게임 영역 */}
            <div className="flex-1 relative bg-white rounded-[40px] shadow-2xl overflow-hidden flex items-center justify-center" style={{ minHeight: '700px' }}>
                {gameState === 'ready' && (
                    <div className="flex flex-col items-center justify-center p-16">
                        <h1 className="font-black text-purple-600 mb-12" style={{ fontSize: '12rem', lineHeight: '1' }}>⬇️ 떨어지는 글자 게임</h1>
                        <p className="text-8xl font-bold text-gray-700 mb-8">떨어지는 글자를 빨리 쳐서 없애세요!</p>
                        <p className="text-6xl text-gray-600 mb-20">바닥에 닿으면 생명이 줄어듭니다</p>
                        <button
                            onClick={startGame}
                            className="px-32 py-12 font-black text-white rounded-full shadow-2xl hover:scale-110 transition-transform"
                            style={{ background: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)', fontSize: '8rem' }}
                        >
                            게임 시작! 🚀
                        </button>
                    </div>
                )}

                {gameState === 'playing' && (
                    <>
                        {/* 떨어지는 글자들 */}
                        {fallingChars.map(char => (
                            <div
                                key={char.id}
                                className="absolute font-black bg-gradient-to-br from-pink-400 to-purple-400 text-white rounded-3xl px-12 py-8 shadow-lg"
                                style={{
                                    left: `${char.x}%`,
                                    top: `${char.y}%`,
                                    transform: 'translateX(-50%)',
                                    fontSize: '12rem'
                                }}
                            >
                                {char.char}
                            </div>
                        ))}

                        {/* 바닥 라인 */}
                        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-r from-red-500 to-orange-500"></div>
                    </>
                )}

                {gameState === 'gameover' && (
                    <div className="flex flex-col items-center justify-center p-16">
                        <h2 className="font-black text-red-600 mb-12" style={{ fontSize: '12rem', lineHeight: '1' }}>게임 오버! 😢</h2>
                        <div className="bg-white p-20 rounded-[40px] shadow-2xl mb-16">
                            <p className="text-9xl font-black text-gray-800 mb-10">최종 점수: <span className="text-blue-600">{score}</span></p>
                            <p className="text-7xl font-bold text-gray-700 mb-6">도달 레벨: {level}</p>
                            <p className="text-7xl font-bold text-gray-700">정확도: {totalTyped > 0 ? Math.round((correctTyped / totalTyped) * 100) : 0}%</p>
                        </div>
                        <div className="flex gap-12">
                            <button
                                onClick={startGame}
                                className="px-28 py-10 font-black text-white rounded-full shadow-xl hover:scale-110 transition-transform"
                                style={{ background: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)', fontSize: '7rem' }}
                            >
                                다시 하기 🔄
                            </button>
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="px-28 py-10 font-black text-white rounded-full shadow-xl hover:scale-110 transition-transform"
                                style={{ background: 'linear-gradient(135deg, #FF6B9D 0%, #FF8FB9 100%)', fontSize: '7rem' }}
                            >
                                홈으로 🏠
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* 입력 필드 */}
            {gameState === 'playing' && (
                <div className="mt-12 text-center">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInput}
                        className="px-20 py-12 text-center border-8 focus:outline-none focus:ring-8 focus:ring-blue-200 font-black rounded-full"
                        style={{ borderColor: '#4ECDC4', width: '900px', fontSize: '10rem' }}
                        placeholder="여기 입력"
                        autoFocus
                    />
                </div>
            )}
        </div>
    );
}
