'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getOverallRanking } from '@/lib/storage'; // 로컬 스토리지 함수는 유지 (참고용)
import { getRankingsFromFirestore } from '@/lib/firestore';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function RankingPage() {
    const router = useRouter();
    const [rankings, setRankings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRankings = async () => {
            try {
                const results = await getRankingsFromFirestore(500); // 최근 500개 기록 가져오기

                // 사용자별 통계 집계
                const userStats = new Map<string, { username: string; avatar: string; totalCpm: number; count: number }>();

                results.forEach(result => {
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

                // 평균 CPM 계산 및 정렬
                const aggregatedRankings = Array.from(userStats.entries())
                    .map(([userId, stats]) => ({
                        userId,
                        username: stats.username,
                        avatar: stats.avatar,
                        avgCpm: Math.floor(stats.totalCpm / stats.count),
                        totalPractices: stats.count,
                    }))
                    .sort((a, b) => b.avgCpm - a.avgCpm)
                    .slice(0, 10); // 상위 10명

                setRankings(aggregatedRankings);
            } catch (error) {
                console.error("Failed to fetch rankings:", error);
                // 에러 발생 시 로컬 데이터 폴백은 생략 (또는 추가 가능)
            } finally {
                setLoading(false);
            }
        };

        fetchRankings();
    }, []);

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
            </div>

            {/* 랭킹 리스트 */}
            <div className="max-w-4xl mx-auto px-8 pb-20">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    {/* 헤더 */}
                    <div className="grid grid-cols-5 gap-4 p-6 font-bold text-xl text-gray-700 border-b-2">
                        <div className="text-center">순위</div>
                        <div>이름</div>
                        <div className="text-center">평균 속도</div>
                        <div className="text-center">연습 횟수</div>
                        <div className="text-center">등급</div>
                    </div>

                    {/* 랭킹 데이터 */}
                    {loading ? (
                        <div className="p-12">
                            <LoadingSpinner />
                        </div>
                    ) : rankings.length === 0 ? (
                        <div className="p-12 text-center text-2xl text-gray-500">
                            아직 연습 기록이 없습니다 📝
                        </div>
                    ) : (
                        rankings.map((rank, index) => {
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
                                </div>
                            );
                        })
                    )}
                </div>

                {/* 하단 버튼 */}
                <div className="mt-8 text-center">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="px-12 py-4 text-xl font-medium rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-200"
                        style={{ color: '#666', border: '2px solid #E0E0E0' }}
                    >
                        ← 대시보드로 돌아가기
                    </button>
                </div>
            </div>
        </div>
    );
}
