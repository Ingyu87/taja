'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, User } from '@/lib/auth';
import { saveGameResultToFirestore, getGameRankingsFromFirestore } from '@/lib/firestore';
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

type Difficulty = '하' | '중' | '상';

export default function FallingGamePage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameover'>('ready');
    const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [level, setLevel] = useState(1);
    const [fallingChars, setFallingChars] = useState<FallingChar[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [totalTyped, setTotalTyped] = useState(0);
    const [correctTyped, setCorrectTyped] = useState(0);
    const [rankings, setRankings] = useState<any[]>([]);
    
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
        if (gameState !== 'playing' || !difficulty) return;

        // 난이도별 생성 간격 설정
        const getSpawnInterval = () => {
            const baseInterval = difficulty === '하' ? 1200 : difficulty === '중' ? 800 : 600;
            return Math.max(baseInterval - level * 50, 300);
        };

        // 난이도별 속도 설정
        const getSpeed = () => {
            switch (difficulty) {
                case '하': return 0.3 + level * 0.05; // 느림
                case '중': return 0.4 + level * 0.08; // 보통
                case '상': return 0.5 + level * 0.1;  // 빠름 (기존)
                default: return 0.5 + level * 0.1;
            }
        };

        spawnTimerRef.current = setInterval(() => {
            setFallingChars(prev => {
                // 겹치지 않는 x 위치 찾기
                const findNonOverlappingX = (): number => {
                    const MIN_DISTANCE = 20; // 최소 거리 (%) - 15에서 20으로 증가
                    const topChars = prev.filter(char => char.y < 40); // 상단 40% 이내의 글자들 체크 (30에서 40으로 증가)
                    
                    for (let attempt = 0; attempt < 20; attempt++) { // 시도 횟수 10에서 20으로 증가
                        const newX = Math.random() * 70 + 15; // 생성 범위 조정 (80+10 -> 70+15)
                        
                        // 기존 글자들과의 거리 체크
                        const isTooClose = topChars.some(char => 
                            Math.abs(char.x - newX) < MIN_DISTANCE
                        );
                        
                        if (!isTooClose) {
                            return newX;
                        }
                    }
                    
                    // 적절한 위치를 못 찾으면 랜덤 위치 반환
                    return Math.random() * 70 + 15;
                };
                
                const newChar: FallingChar = {
                    id: nextIdRef.current++,
                    char: GAME_CHARS[Math.floor(Math.random() * GAME_CHARS.length)],
                    x: findNonOverlappingX(),
                    y: 0,
                    speed: getSpeed()
                };
                
                return [...prev, newChar];
            });
        }, getSpawnInterval());

        return () => {
            if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
        };
    }, [gameState, level, difficulty]);

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

    const startGame = (selectedDifficulty: Difficulty) => {
        setDifficulty(selectedDifficulty);
        setGameState('playing');
        setScore(0);
        setLives(3);
        setLevel(1);
        setFallingChars([]);
        setInputValue(''); // 입력창 초기화
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

            // 랭킹 가져오기
            const rankingData = await getGameRankingsFromFirestore('falling');
            setRankings(rankingData.slice(0, 10)); // 상위 10명만
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
                    className="px-8 py-4 font-black bg-white text-gray-600 hover:bg-gray-50 transition-all rounded-3xl shadow-md"
                    style={{ border: '3px solid #4ECDC4', fontSize: '3rem' }}
                >
                    ← 뒤로가기
                </button>
                
                <div className="flex gap-6 font-black" style={{ fontSize: '4rem' }}>
                    <div className="bg-white px-6 py-3 rounded-3xl shadow-md">
                        점수: <span className="text-blue-600">{score}</span>
                    </div>
                    <div className="bg-white px-6 py-3 rounded-3xl shadow-md">
                        레벨: <span className="text-purple-600">{level}</span>
                    </div>
                    <div className="bg-white px-6 py-3 rounded-3xl shadow-md">
                        생명: <span className="text-red-600">{'❤️'.repeat(lives)}</span>
                    </div>
                </div>
            </div>

            {/* 게임 영역 */}
            <div className="flex-1 relative bg-white rounded-[40px] shadow-2xl overflow-hidden flex items-center justify-center" style={{ minHeight: '700px' }}>
                {gameState === 'ready' && (
                    <div className="flex flex-col items-center justify-center p-8">
                        <h1 className="font-black text-purple-600 mb-6" style={{ fontSize: '6rem', lineHeight: '1' }}>⬇️ 떨어지는 글자 게임</h1>
                        <p className="text-4xl font-bold text-gray-700 mb-4">떨어지는 글자를 빨리 쳐서 없애세요!</p>
                        <p className="text-3xl text-gray-600 mb-6">바닥에 닿으면 생명이 줄어듭니다</p>
                        
                        {/* 난이도 선택 */}
                        <div className="mb-10">
                            <h2 className="text-4xl font-black text-gray-800 text-center mb-6">난이도를 선택하세요</h2>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => startGame('하')}
                                    className="px-12 py-6 font-black text-white rounded-full shadow-2xl hover:scale-110 transition-transform"
                                    style={{ background: 'linear-gradient(135deg, #4ADE80 0%, #16A34A 100%)', fontSize: '3.5rem' }}
                                >
                                    😊 하 (느림)
                                </button>
                                <button
                                    onClick={() => startGame('중')}
                                    className="px-12 py-6 font-black text-white rounded-full shadow-2xl hover:scale-110 transition-transform"
                                    style={{ background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)', fontSize: '3.5rem' }}
                                >
                                    😎 중 (보통)
                                </button>
                                <button
                                    onClick={() => startGame('상')}
                                    className="px-12 py-6 font-black text-white rounded-full shadow-2xl hover:scale-110 transition-transform"
                                    style={{ background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', fontSize: '3.5rem' }}
                                >
                                    🔥 상 (빠름)
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {gameState === 'playing' && (
                    <>
                        {/* 떨어지는 글자들 */}
                        {fallingChars.map(char => (
                            <div
                                key={char.id}
                                className="absolute font-black bg-white text-black rounded-3xl px-6 py-4 shadow-lg"
                                style={{
                                    left: `${char.x}%`,
                                    top: `${char.y}%`,
                                    transform: 'translateX(-50%)',
                                    fontSize: '6rem',
                                    border: '2px solid #4ECDC4'
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
                    <div className="flex flex-col items-center justify-center p-8 overflow-y-auto max-h-full">
                        <h2 className="font-black text-red-600 mb-6" style={{ fontSize: '6rem', lineHeight: '1' }}>게임 오버! 😢</h2>
                        
                        {/* 결과 카드 */}
                        <div className="bg-white p-10 rounded-[40px] shadow-2xl mb-8">
                            <p className="text-5xl font-black text-gray-800 mb-5">최종 점수: <span className="text-blue-600">{score}</span></p>
                            <p className="text-4xl font-bold text-gray-700 mb-3">도달 레벨: {level}</p>
                            <p className="text-4xl font-bold text-gray-700 mb-3">난이도: <span className="text-purple-600">{difficulty}</span></p>
                            <p className="text-4xl font-bold text-gray-700">정확도: {totalTyped > 0 ? Math.round((correctTyped / totalTyped) * 100) : 0}%</p>
                        </div>

                        {/* 실시간 랭킹 */}
                        {rankings.length > 0 && (
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-[40px] shadow-2xl mb-8 w-full max-w-3xl">
                                <h3 className="text-center font-black text-purple-600 mb-6" style={{ fontSize: '3rem' }}>
                                    🏆 실시간 랭킹 TOP 10
                                </h3>
                                <div className="bg-white rounded-3xl overflow-hidden">
                                    {rankings.map((rank, index) => {
                                        const isCurrentUser = rank.userId === user?.id;
                                        let rankEmoji = '';
                                        if (index === 0) rankEmoji = '🥇';
                                        else if (index === 1) rankEmoji = '🥈';
                                        else if (index === 2) rankEmoji = '🥉';

                                        return (
                                            <div
                                                key={index}
                                                className={`flex items-center justify-between px-6 py-4 border-b border-gray-100 ${
                                                    isCurrentUser ? 'bg-yellow-50' : ''
                                                }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <span className="font-black text-gray-600" style={{ fontSize: '2rem', minWidth: '3rem' }}>
                                                        {rankEmoji || (index + 1)}
                                                    </span>
                                                    <span style={{ fontSize: '2rem' }}>{rank.avatar}</span>
                                                    <span className={`font-bold ${isCurrentUser ? 'text-purple-600' : 'text-gray-700'}`} style={{ fontSize: '1.8rem' }}>
                                                        {rank.username} {isCurrentUser && '(나)'}
                                                    </span>
                                                </div>
                                                <div className="font-black text-blue-600" style={{ fontSize: '2rem' }}>
                                                    {rank.score}점
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-6">
                            <button
                                onClick={() => setGameState('ready')}
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

            {/* 입력 필드 */}
            {gameState === 'playing' && (
                <div className="mt-6 text-center">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInput}
                        className="px-10 text-center border-4 focus:outline-none focus:ring-4 focus:ring-blue-200 font-black rounded-full"
                        style={{ borderColor: '#4ECDC4', width: '225px', fontSize: '5rem', color: '#000000', paddingTop: '2rem', paddingBottom: '2rem' }}
                        placeholder=""
                        autoFocus
                    />
                </div>
            )}
        </div>
    );
}
