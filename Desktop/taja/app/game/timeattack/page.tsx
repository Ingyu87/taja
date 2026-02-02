'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, User } from '@/lib/auth';
import { saveGameResultToFirestore, getGameRankingsFromFirestore } from '@/lib/firestore';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import confetti from 'canvas-confetti';

// 기본 단어 (API 실패 시 백업용)
const FALLBACK_WORDS = [
    '가방', '나무', '다리', '라면', '마음', '바다', '사과', '아이',
    '자동차', '차례', '카메라', '타자', '파도', '하늘', '강아지', '고양이',
    '토끼', '코끼리', '기린', '사자', '학교', '선생님', '친구', '공부',
    '책상', '의자', '엄마', '아빠', '동생', '가족', '집', '방',
    '봄', '여름', '가을', '겨울', '꽃', '나비', '별', '달'
];

type TimeOption = 120 | 240 | 360;

export default function TimeAttackGamePage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameover'>('ready');
    const [selectedTime, setSelectedTime] = useState<TimeOption | null>(null);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(120);
    const [currentWord, setCurrentWord] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [combo, setCombo] = useState(0);
    const [maxCombo, setMaxCombo] = useState(0);
    const [totalTyped, setTotalTyped] = useState(0);
    const [correctTyped, setCorrectTyped] = useState(0);
    const [level, setLevel] = useState(1);
    const [gameWords, setGameWords] = useState<string[]>(FALLBACK_WORDS);
    const [loadingWords, setLoadingWords] = useState(false);
    const [rankings, setRankings] = useState<any[]>([]);
    const [isComposing, setIsComposing] = useState(false);
    const [loadingRankings, setLoadingRankings] = useState(false);
    
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

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

    // AI로부터 새로운 단어 받아오기
    const fetchAIWords = async () => {
        setLoadingWords(true);
        try {
            const response = await fetch('/api/game-words', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ count: 50, difficulty: 'easy' })
            });

            const data = await response.json();

            if (response.ok && data.success && data.words.length > 0) {
                setGameWords(data.words);
            } else {
                // API 실패 시 기본 단어 사용
                setGameWords(FALLBACK_WORDS);
            }
        } catch (error) {
            console.error('단어 생성 실패:', error);
            // 에러 시 기본 단어 사용
            setGameWords(FALLBACK_WORDS);
        } finally {
            setLoadingWords(false);
        }
    };

    // 새 단어 생성
    const generateNewWord = () => {
        const newWord = gameWords[Math.floor(Math.random() * gameWords.length)];
        setCurrentWord(newWord);
    };

    const handleCompositionStart = () => {
        setIsComposing(true);
    };

    const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
        setIsComposing(false);
        const value = e.currentTarget.value;
        checkWord(value);
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);

        // 한글 조합 중이 아닐 때만 체크
        if (!isComposing) {
            checkWord(value);
        }
    };

    const checkWord = (value: string) => {
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
            if (inputRef.current) {
                inputRef.current.value = '';
            }
            generateNewWord();
        }
    };

    const startGame = async (time: TimeOption) => {
        setSelectedTime(time);
        setScore(0);
        setTimeLeft(time);
        setCombo(0);
        setMaxCombo(0);
        setLevel(1);
        setTotalTyped(0);
        setCorrectTyped(0);
        setInputValue('');
        
        // AI 단어 받아오기
        await fetchAIWords();
        
        setGameState('playing');
        generateNewWord();
    };

    const endGame = async () => {
        if (timerRef.current) clearInterval(timerRef.current);

        const accuracy = totalTyped > 0 ? Math.round((correctTyped / totalTyped) * 100) : 100;

        if (user) {
            setLoadingRankings(true);
            try {
                await saveGameResultToFirestore({
                    userId: user.id,
                    username: user.username,
                    avatar: user.avatar,
                    gameType: 'timeattack',
                    score,
                    level,
                    accuracy,
                });

                // 랭킹 가져오기 (교사 제외)
                const rankingData = await getGameRankingsFromFirestore('timeattack');
                const studentRankings = rankingData.filter(r => r.userId !== 'teacher' && !r.userId?.startsWith('teacher'));
                setRankings(studentRankings.slice(0, 10)); // 상위 10명만
            } catch (error) {
                console.error('랭킹 로드 실패:', error);
            } finally {
                setLoadingRankings(false);
            }
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
                        <p className="text-4xl font-bold text-gray-700 mb-4">시간 안에 최대한 많은 단어를 치세요!</p>
                        <p className="text-3xl text-gray-600 mb-6">연속으로 맞추면 콤보 점수 획득!</p>
                        <p className="text-2xl text-purple-600 font-black mb-6">✨ AI가 매번 새로운 단어를 준비해요!</p>
                        
                        {/* 시간 선택 */}
                        <div className="mb-10">
                            <h2 className="text-4xl font-black text-gray-800 text-center mb-6">시간을 선택하세요</h2>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => startGame(120)}
                                    disabled={loadingWords}
                                    className="px-12 py-6 font-black text-white rounded-full shadow-2xl hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{ background: 'linear-gradient(135deg, #4ADE80 0%, #16A34A 100%)', fontSize: '3.5rem' }}
                                >
                                    {loadingWords ? '⏳' : '⏱️'} 2분
                                </button>
                                <button
                                    onClick={() => startGame(240)}
                                    disabled={loadingWords}
                                    className="px-12 py-6 font-black text-white rounded-full shadow-2xl hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{ background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)', fontSize: '3.5rem' }}
                                >
                                    {loadingWords ? '⏳' : '⏱️'} 4분
                                </button>
                                <button
                                    onClick={() => startGame(360)}
                                    disabled={loadingWords}
                                    className="px-12 py-6 font-black text-white rounded-full shadow-2xl hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{ background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', fontSize: '3.5rem' }}
                                >
                                    {loadingWords ? '⏳' : '⏱️'} 6분
                                </button>
                            </div>
                            {loadingWords && (
                                <p className="text-2xl text-gray-600 text-center mt-4 font-bold">AI가 단어를 준비하는 중...</p>
                            )}
                        </div>
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
                            {/* 안내 메시지 */}
                            <div className="text-center mt-4">
                                <p className="font-bold text-white bg-black bg-opacity-30 inline-block px-6 py-2 rounded-full" style={{ fontSize: '1.8rem' }}>
                                    💡 단어를 모두 입력하면 자동으로 다음 단어로 넘어가요!
                                </p>
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
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={handleInput}
                            onCompositionStart={handleCompositionStart}
                            onCompositionEnd={handleCompositionEnd}
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
                    <div className="flex flex-col items-center justify-center p-8 overflow-y-auto max-h-full">
                        <h2 className="font-black text-green-600 mb-6" style={{ fontSize: '6rem', lineHeight: '1' }}>시간 종료! ⏰</h2>
                        
                        {/* 결과 카드 */}
                        <div className="bg-white p-10 rounded-[40px] shadow-2xl mb-8">
                            <p className="text-5xl font-black text-gray-800 mb-5">최종 점수: <span className="text-green-600">{score}</span></p>
                            <p className="text-4xl font-bold text-gray-700 mb-3">선택 시간: <span className="text-blue-600">{selectedTime ? `${selectedTime / 60}분` : '-'}</span></p>
                            <p className="text-4xl font-bold text-gray-700 mb-3">최고 콤보: {maxCombo}연속</p>
                            <p className="text-4xl font-bold text-gray-700 mb-3">도달 레벨: {level}</p>
                            <p className="text-4xl font-bold text-gray-700">정확도: {totalTyped > 0 ? Math.round((correctTyped / totalTyped) * 100) : 100}%</p>
                        </div>

                        {/* 실시간 랭킹 */}
                        <div className="bg-gradient-to-br from-green-50 to-cyan-50 p-8 rounded-[40px] shadow-2xl mb-8 w-full max-w-3xl">
                            <h3 className="text-center font-black text-green-600 mb-6" style={{ fontSize: '3rem' }}>
                                🏆 실시간 랭킹 TOP 10
                            </h3>
                            {loadingRankings ? (
                                <div className="bg-white rounded-3xl p-10 text-center">
                                    <p className="text-2xl text-gray-600 font-bold">랭킹을 불러오는 중...</p>
                                </div>
                            ) : rankings.length > 0 ? (
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
                                                    <span className={`font-bold ${isCurrentUser ? 'text-green-600' : 'text-gray-700'}`} style={{ fontSize: '1.8rem' }}>
                                                        {rank.username} {isCurrentUser && '(나)'}
                                                    </span>
                                                </div>
                                                <div className="font-black text-green-600" style={{ fontSize: '2rem' }}>
                                                    {rank.score}점
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="bg-white rounded-3xl p-10 text-center">
                                    <p className="text-2xl text-gray-600 font-bold">아직 랭킹 데이터가 없습니다</p>
                                    <p className="text-xl text-gray-500 mt-3">게임을 더 플레이하면 랭킹이 표시됩니다!</p>
                                </div>
                            )}
                        </div>

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
        </div>
    );
}
