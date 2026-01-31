'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getRankingsFromFirestore, getGameRankingsFromFirestore } from '@/lib/firestore';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

type ViewMode = 'practice' | 'game';
type GameType = 'falling' | 'timeattack' | 'all';

export default function RankingPage() {
    const router = useRouter();
    const [viewMode, setViewMode] = useState<ViewMode>('practice');
    const [gameType, setGameType] = useState<GameType>('all');
    const [rankings, setRankings] = useState<any[]>([]);
    const [gameRankings, setGameRankings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRankings = async () => {
            try {
                // 연습 랭킹
                const results = await getRankingsFromFirestore(500);
                const userStats = new Map<string, { username: string; avatar: string; totalCpm: number; count: number }>();

                results.forEach(result => {
                    // 교사 계정 제외
                    if (result.userId === 'teacher' || result.userId?.startsWith('teacher')) {
                        return;
                    }
                    
                    const existing = userStats.get(result.userId);
                    if (existing) {
                        existing.totalCpm += result.cpm;
                        existing.count += 1;
                    } else {
                        userStats.set(result.userId, {
                            username: result.username,
                            avatar: result.avatar,
                            totalCpm: result.cpm,
                            count: 1,
                        });
                    }
                });

                const aggregatedRankings = Array.from(userStats.entries())
                    .map(([userId, stats]) => ({
                        userId,
                        username: stats.username,
                        avatar: stats.avatar,
                        avgCpm: Math.floor(stats.totalCpm / stats.count),
                        totalPractices: stats.count,
                    }))
                    .sort((a, b) => b.avgCpm - a.avgCpm)
                    .slice(0, 10);

                setRankings(aggregatedRankings);

                // 게임 랭킹
                const gameResults = await getGameRankingsFromFirestore(undefined, 200);
                const gameUserStats = new Map<string, { username: string; avatar: string; totalScore: number; count: number; maxScore: number }>();

                gameResults.forEach(result => {
                    // 교사 계정 제외
                    if (result.userId === 'teacher' || result.userId?.startsWith('teacher')) {
                        return;
                    }
                    
                    const existing = gameUserStats.get(result.userId);
                    if (existing) {
                        existing.totalScore += result.score;
                        existing.count += 1;
                        existing.maxScore = Math.max(existing.maxScore, result.score);
                    } else {
                        gameUserStats.set(result.userId, {
                            username: result.username,
                            avatar: result.avatar,
                            totalScore: result.score,
                            count: 1,
                            maxScore: result.score,
                        });
                    }
                });

                const aggregatedGameRankings = Array.from(gameUserStats.entries())
                    .map(([userId, stats]) => ({
                        userId,
                        username: stats.username,
                        avatar: stats.avatar,
                        maxScore: stats.maxScore,
                        totalGames: stats.count,
                    }))
                    .sort((a, b) => b.maxScore - a.maxScore)
                    .slice(0, 10);

                setGameRankings(aggregatedGameRankings);
            } catch (error) {
                console.error("Failed to fetch rankings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRankings();
    }, []);

    const currentRankings = viewMode === 'practice' ? rankings : gameRankings;

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#FAF9F6' }}>
            {/* 헤더 */}
            <div className="text-center pt-12 pb-8">
                <h1 className="text-6xl font-bold mb-2" style={{
                    background: 'linear-gradient(135deg, #FF6B9D 0%, #4ECDC4 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    🏆 타자왕 랭킹
                </h1>
                <p className="text-2xl text-gray-600">
                    최고의 타자 실력자들
                </p>

                {/* 탭 전환 */}
                <div className="flex justify-center gap-4 mt-8">
                    <button
                        onClick={() => setViewMode('practice')}
                        className={`px-10 py-4 text-2xl font-black rounded-full transition-all shadow-md ${
                            viewMode === 'practice'
                                ? 'text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                        style={
                            viewMode === 'practice'
                                ? { background: 'linear-gradient(135deg, #FF6B9D 0%, #FF8FB9 100%)' }
                                : {}
                        }
                    >
                        📚 연습 랭킹
                    </button>
                    <button
                        onClick={() => setViewMode('game')}
                        className={`px-10 py-4 text-2xl font-black rounded-full transition-all shadow-md ${
                            viewMode === 'game'
                                ? 'text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                        style={
                            viewMode === 'game'
                                ? { background: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)' }
                                : {}
                        }
                    >
                        🎮 게임 랭킹
                    </button>
                </div>
            </div>

            {/* 랭킹 리스트 */}
            <div className="max-w-4xl mx-auto px-8 pb-20">
                <div className="bg-white shadow-xl overflow-hidden" style={{ borderRadius: '48px' }}>
                    {/* 헤더 */}
                    {viewMode === 'practice' ? (
                        <div className="grid grid-cols-5 gap-4 p-6 font-bold text-xl text-gray-700 border-b-2">
                            <div className="text-center">순위</div>
                            <div>이름</div>
                            <div className="text-center">평균 속도</div>
                            <div className="text-center">연습 횟수</div>
                            <div className="text-center">등급</div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-5 gap-4 p-6 font-bold text-xl text-gray-700 border-b-2">
                            <div className="text-center">순위</div>
                            <div>이름</div>
                            <div className="text-center">최고 점수</div>
                            <div className="text-center">게임 횟수</div>
                            <div className="text-center">등급</div>
                        </div>
                    )}

                    {/* 랭킹 데이터 */}
                    {loading ? (
                        <div className="p-12">
                            <LoadingSpinner />
                        </div>
                    ) : currentRankings.length === 0 ? (
                        <div className="p-12 text-center text-2xl text-gray-500">
                            {viewMode === 'practice' ? '아직 연습 기록이 없습니다 📝' : '아직 게임 기록이 없습니다 🎮'}
                        </div>
                    ) : (
                        currentRankings.map((rank, index) => {
                            let medal = '';
                            let bgColor = '';

                            if (index === 0) {
                                medal = '🥇';
                                bgColor = '#FFF9C4';
                            } else if (index === 1) {
                                medal = '🥈';
                                bgColor = '#E0E0E0';
                            } else if (index === 2) {
                                medal = '🥉';
                                bgColor = '#FFCCBC';
                            }

                            return (
                                <div
                                    key={rank.userId}
                                    className="grid grid-cols-5 gap-4 p-6 items-center border-b hover:bg-gray-50 transition-colors"
                                    style={{ backgroundColor: bgColor }}
                                >
                                    <div className="text-center text-3xl font-bold">
                                        {medal || `${index + 1}위`}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-4xl">{rank.avatar}</span>
                                        <span className="text-xl font-bold">{rank.username}</span>
                                    </div>
                                    {viewMode === 'practice' ? (
                                        <>
                                            <div className="text-center text-2xl font-bold" style={{ color: '#FF6B9D' }}>
                                                {rank.avgCpm} CPM
                                            </div>
                                            <div className="text-center text-xl text-gray-600">
                                                {rank.totalPractices}회
                                            </div>
                                            <div className="text-center text-2xl">
                                                {rank.avgCpm >= 200 ? '👑 마스터' :
                                                    rank.avgCpm >= 150 ? '⭐ 고수' :
                                                        rank.avgCpm >= 100 ? '💪 중수' :
                                                            '🌱 초보'}
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="text-center text-2xl font-bold" style={{ color: '#4ECDC4' }}>
                                                {rank.maxScore}점
                                            </div>
                                            <div className="text-center text-xl text-gray-600">
                                                {rank.totalGames}회
                                            </div>
                                            <div className="text-center text-2xl">
                                                {rank.maxScore >= 500 ? '👑 전설' :
                                                    rank.maxScore >= 300 ? '⭐ 고수' :
                                                        rank.maxScore >= 150 ? '💪 숙련' :
                                                            '🌱 초보'}
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                {/* 하단 버튼 */}
                <div className="mt-8 text-center">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="px-12 py-4 text-xl font-medium bg-white shadow-md hover:shadow-lg transition-all duration-200"
                        style={{ 
                            borderRadius: '32px',
                            color: '#666', 
                            border: '2px solid #E0E0E0' 
                        }}
                    >
                        ← 대시보드로 돌아가기
                    </button>
                </div>
            </div>
        </div>
    );
}
