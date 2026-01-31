'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getCurrentUser, logout, User } from '@/lib/auth';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const PRACTICE_MODES = [
    {
        id: 'vowel',
        title: '모음 연습',
        emoji: '🎨',
        description: '모음을 배워요!',
        color: '#FFB3D9',
        bgGradient: 'linear-gradient(135deg, #FFE5F0 0%, #FFF0F5 100%)',
    },
    {
        id: 'consonant',
        title: '자음 연습',
        emoji: '📚',
        description: '자음을 배워요!',
        color: '#4ECDC4',
        bgGradient: 'linear-gradient(135deg, #E0F7FA 0%, #E8F5E9 100%)',
    },
    {
        id: 'word',
        title: '단어 연습',
        emoji: '🎁',
        description: '단어를 배워요!',
        color: '#FFB347',
        bgGradient: 'linear-gradient(135deg, #FFF9E6 0%, #FFECB3 100%)',
    },
    {
        id: 'sentence',
        title: '문장 연습',
        emoji: '📖',
        description: '문장을 배워요!',
        color: '#9B59B6',
        bgGradient: 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)',
    },
];

const GAME_MODES = [
    {
        id: 'falling',
        title: '떨어지는 글자',
        emoji: '⬇️',
        description: '빨리 쳐서 없애요!',
        color: '#4ECDC4',
        bgGradient: 'linear-gradient(135deg, #D4F1F4 0%, #B8E3E6 100%)',
    },
    {
        id: 'timeattack',
        title: '시간 공격',
        emoji: '⏰',
        description: '빠르게 쳐요!',
        color: '#4CAF50',
        bgGradient: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
    },
];

// 학생용에서는 네비게이션 탭 불필요

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            router.replace('/login');
        } else {
            setUser(currentUser);
        }
    }, [router]);

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
                <LoadingSpinner />
            </div>
        );
    }

    if (user.role === 'teacher') {
        return <TeacherDashboard user={user} onLogout={handleLogout} />;
    }

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAF9F6' }}>
            {/* 상단 간단한 헤더 */}
            <div className="bg-white shadow-md py-4 px-8">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="text-4xl">👤</span>
                        <span className="text-2xl font-black text-gray-800">{user.username}</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-16 py-8 font-black text-white hover:opacity-90 transition-all rounded-full shadow-lg hover:shadow-xl transform hover:scale-105"
                        style={{ 
                            background: 'linear-gradient(135deg, #FF6B9D 0%, #FF8FB9 100%)',
                            fontSize: '3.6rem',
                        }}
                    >
                        👋 로그아웃
                    </button>
                </div>
            </div>

            {/* 메인 콘텐츠 */}
            <div className="flex-1 w-full px-8 py-12 overflow-y-auto">
                {/* 연습 모드 섹션 */}
                <div className="mb-24 w-full">
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center gap-8 mb-6">
                            <span style={{ fontSize: '4.5rem' }}>📚</span>
                            <h2 style={{ fontSize: '4.05rem' }} className="font-black text-pink-500 drop-shadow-lg leading-none">
                                타자 연습
                            </h2>
                            <span style={{ fontSize: '4.5rem' }}>📚</span>
                        </div>
                        <p style={{ fontSize: '2.25rem' }} className="font-black text-gray-700">
                            기본부터 차근차근 배워요!
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-10 w-full max-w-[95%] mx-auto">
                        {PRACTICE_MODES.map((mode) => (
                            <div
                                key={mode.id}
                                onClick={() => router.push(`/practice/${mode.id}`)}
                                className="p-10 shadow-2xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105"
                                style={{
                                    background: mode.bgGradient,
                                    borderRadius: '40px',
                                    border: '6px solid',
                                    borderColor: mode.color,
                                    minHeight: '250px',
                                }}
                            >
                                <div className="flex flex-col h-full justify-between">
                                    {/* 상단: 아이콘 + 텍스트 */}
                                    <div className="flex items-center gap-10">
                                        {/* 아이콘 왼쪽 */}
                                        <div className="flex-shrink-0 p-10 rounded-3xl bg-white shadow-lg">
                                            <div style={{ fontSize: '5.4rem', lineHeight: '1' }}>{mode.emoji}</div>
                                        </div>
                                        {/* 텍스트 오른쪽 */}
                                        <div className="flex-1 text-left">
                                            <h3 className="font-black mb-4 drop-shadow-md leading-tight" style={{ fontSize: '3.15rem', color: mode.color }}>
                                                {mode.title}
                                            </h3>
                                            <p style={{ fontSize: '2.25rem' }} className="font-black text-gray-800 leading-snug">
                                                {mode.description}
                                            </p>
                                        </div>
                                    </div>
                                    {/* 하단: 시작 버튼 */}
                                    <div className="mt-10">
                                        <div
                                            className="px-12 py-6 font-black text-white text-center rounded-full shadow-xl hover:shadow-2xl transition-all"
                                            style={{
                                                background: `linear-gradient(135deg, ${mode.color} 0%, ${mode.color}DD 100%)`,
                                                fontSize: '2.25rem',
                                            }}
                                        >
                                            시작! ✨
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI 스토리 섹션 */}
                <div className="mb-24 w-full">
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center gap-8 mb-6">
                            <span style={{ fontSize: '4.5rem' }}>✨</span>
                            <h2 style={{ fontSize: '4.05rem' }} className="font-black text-yellow-500 drop-shadow-lg leading-none">
                                AI 이야기
                            </h2>
                            <span style={{ fontSize: '4.5rem' }}>✨</span>
                        </div>
                        <p style={{ fontSize: '2.25rem' }} className="font-black text-gray-700">
                            AI가 만들어주는 신기한 이야기!
                        </p>
                    </div>

                    <div className="w-full max-w-[95%] mx-auto">
                        <div
                            onClick={() => router.push('/story')}
                            className="p-10 shadow-2xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105"
                            style={{
                                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                                borderRadius: '40px',
                                border: '6px solid #FFD700',
                                minHeight: '200px',
                            }}
                        >
                            <div className="flex items-center justify-center gap-10 h-full">
                                <div className="flex-shrink-0 p-10 rounded-3xl bg-white shadow-lg">
                                    <div style={{ fontSize: '5.4rem', lineHeight: '1' }}>🤖</div>
                                </div>
                                <div className="flex-1 text-center">
                                    <h3 className="font-black mb-4 drop-shadow-md leading-tight" style={{ fontSize: '3.15rem', color: '#FF8C00' }}>
                                        마법의 이야기 만들기
                                    </h3>
                                    <p style={{ fontSize: '2.25rem' }} className="font-black text-white leading-snug">
                                        좋아하는 단어로 AI가 이야기를 만들어줘요!
                                    </p>
                                </div>
                                <div className="flex-shrink-0">
                                    <div
                                        className="px-12 py-6 font-black text-white text-center rounded-full shadow-xl hover:shadow-2xl transition-all"
                                        style={{
                                            background: 'linear-gradient(135deg, #FF8C00 0%, #FF6347 100%)',
                                            fontSize: '2.25rem',
                                        }}
                                    >
                                        시작! 🚀
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 게임 모드 섹션 */}
                <div className="mb-12 w-full">
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center gap-8 mb-6">
                            <span style={{ fontSize: '4.5rem' }}>🎮</span>
                            <h2 style={{ fontSize: '4.05rem' }} className="font-black text-purple-500 drop-shadow-lg leading-none">
                                재미있는 게임
                            </h2>
                            <span style={{ fontSize: '4.5rem' }}>🎮</span>
                        </div>
                        <p style={{ fontSize: '2.25rem' }} className="font-black text-gray-700">
                            신나는 타자 게임에 도전하세요!
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-10 w-full max-w-[95%] mx-auto">
                        {GAME_MODES.map((game) => (
                            <div
                                key={game.id}
                                onClick={() => router.push(`/game/${game.id}`)}
                                className="p-10 shadow-2xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105"
                                style={{
                                    background: game.bgGradient,
                                    borderRadius: '40px',
                                    border: '6px solid',
                                    borderColor: game.color,
                                    minHeight: '320px',
                                }}
                            >
                                <div className="flex flex-col h-full justify-between">
                                    {/* 상단: 아이콘 + 텍스트 */}
                                    <div className="flex flex-col items-center text-center">
                                        {/* 아이콘 */}
                                        <div className="mb-8 p-10 rounded-3xl bg-white shadow-lg">
                                            <div style={{ fontSize: '5.4rem', lineHeight: '1' }}>{game.emoji}</div>
                                        </div>
                                        {/* 텍스트 */}
                                        <div>
                                            <h3 className="font-black mb-4 drop-shadow-md leading-tight" style={{ fontSize: '2.7rem', color: game.color }}>
                                                {game.title}
                                            </h3>
                                            <p style={{ fontSize: '1.8rem' }} className="font-black text-gray-800 leading-snug">
                                                {game.description}
                                            </p>
                                        </div>
                                    </div>
                                    {/* 하단: 게임하기 버튼 */}
                                    <div className="mt-10">
                                        <div
                                            className="px-10 py-5 font-black text-white text-center rounded-full shadow-xl hover:shadow-2xl transition-all"
                                            style={{
                                                background: `linear-gradient(135deg, ${game.color} 0%, ${game.color}DD 100%)`,
                                                fontSize: '1.8rem',
                                            }}
                                        >
                                            게임하기! 🚀
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function TeacherDashboard({ user, onLogout }: { user: User, onLogout: () => void }) {
    const router = useRouter();
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'all' | 'practice' | 'game' | 'story'>('all');

    useEffect(() => {
        const fetchData = async () => {
            const { getAllResultsFromFirestore } = await import('@/lib/firestore');
            const data = await getAllResultsFromFirestore();
            setResults(data);
            setLoading(false);
        };
        fetchData();
    }, []);

    const studentStats = Array.from({ length: 30 }, (_, i) => `a${i + 1}`)
        .map(studentId => {
            const studentLogs = results.filter(r => r.userId === studentId);
            const lastLog = studentLogs.length > 0 ? studentLogs[0] : null;
            const totalTime = studentLogs.reduce((acc, curr) => acc + (curr.time || 0), 0);
            const avgCpm = studentLogs.length > 0
                ? Math.round(studentLogs.reduce((acc, curr) => acc + (curr.cpm || 0), 0) / studentLogs.length)
                : 0;

            return {
                id: studentId,
                name: lastLog?.username || studentId,
                avatar: lastLog?.avatar || '👤',
                playCount: studentLogs.length,
                lastLogin: lastLog ? new Date(lastLog.createdAt).toLocaleString() : '-',
                totalTime: Math.round(totalTime),
                avgCpm,
            };
        })
        .sort((a, b) => {
            // 평균 CPM으로 내림차순 정렬 (높은 순)
            if (b.avgCpm !== a.avgCpm) return b.avgCpm - a.avgCpm;
            // CPM이 같으면 연습 횟수로 정렬
            return b.playCount - a.playCount;
        });

    // 탭별 필터링
    const filteredResults = results.filter(r => {
        if (activeTab === 'all') return true;
        if (activeTab === 'practice') return ['vowel', 'consonant', 'word', 'sentence'].includes(r.mode);
        if (activeTab === 'game') return ['falling', 'timeattack'].includes(r.mode);
        if (activeTab === 'story') return r.mode === 'story';
        return true;
    });

    const totalPracticeCount = filteredResults.length;
    const avgCpm = filteredResults.length > 0
        ? Math.round(filteredResults.reduce((acc, curr) => acc + curr.cpm, 0) / filteredResults.length)
        : 0;
    const participatingStudents = studentStats.filter(s => s.playCount > 0).length;
    const participationRate = Math.round((participatingStudents / 30) * 100);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#FAF9F6' }}>
            {/* 상단 헤더 - 로그아웃 버튼만 */}
            <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-full mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="font-black" style={{ fontSize: '3rem', color: '#000000' }}>
                            👨‍🏫 교사 대시보드
                        </h1>
                        <button
                            onClick={onLogout}
                            className="font-black text-white hover:opacity-90 transition-all rounded-3xl shadow-lg hover:shadow-xl transform hover:scale-105"
                            style={{ 
                                background: 'linear-gradient(135deg, #FF6B9D 0%, #FF8FB9 100%)',
                                padding: '1rem 1.5rem',
                                fontSize: '2rem'
                            }}
                        >
                            👋 로그아웃
                        </button>
                    </div>
                </div>
            </div>

            <main className="max-w-full mx-auto px-6 py-8">
                {/* 탭 메뉴 - 선택 상태 명확하게 */}
                <div className="bg-white shadow-lg mb-8 p-3" style={{ borderRadius: '25px' }}>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`flex-1 py-6 px-6 font-black rounded-2xl transition-all transform ${
                                activeTab === 'all' 
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-2xl scale-105 border-4 border-purple-300' 
                                    : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600 bg-gray-100'
                            }`}
                            style={{ fontSize: activeTab === 'all' ? '2.5rem' : '2rem' }}
                        >
                            📊 전체
                        </button>
                        <button
                            onClick={() => setActiveTab('practice')}
                            className={`flex-1 py-6 px-6 font-black rounded-2xl transition-all transform ${
                                activeTab === 'practice' 
                                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-2xl scale-105 border-4 border-blue-300' 
                                    : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600 bg-gray-100'
                            }`}
                            style={{ fontSize: activeTab === 'practice' ? '2.5rem' : '2rem' }}
                        >
                            📝 연습모드
                        </button>
                        <button
                            onClick={() => setActiveTab('game')}
                            className={`flex-1 py-6 px-6 font-black rounded-2xl transition-all transform ${
                                activeTab === 'game' 
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-2xl scale-105 border-4 border-green-300' 
                                    : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600 bg-gray-100'
                            }`}
                            style={{ fontSize: activeTab === 'game' ? '2.5rem' : '2rem' }}
                        >
                            🎮 게임모드
                        </button>
                        <button
                            onClick={() => setActiveTab('story')}
                            className={`flex-1 py-6 px-6 font-black rounded-2xl transition-all transform ${
                                activeTab === 'story' 
                                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-2xl scale-105 border-4 border-orange-300' 
                                    : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600 bg-gray-100'
                            }`}
                            style={{ fontSize: activeTab === 'story' ? '2.5rem' : '2rem' }}
                        >
                            🤖 AI 스토리
                        </button>
                    </div>
                </div>

                {/* 통계 카드 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
                    <div className="bg-white shadow-lg" style={{ borderRadius: '20px', padding: '1.5rem' }}>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-gray-600 font-bold" style={{ fontSize: '1.5rem' }}>총 연습 횟수</h3>
                            <span style={{ fontSize: '3rem' }}>📊</span>
                        </div>
                        <p className="font-bold text-blue-600" style={{ fontSize: '3rem' }}>{totalPracticeCount}회</p>
                    </div>
                    <div className="bg-white shadow-lg" style={{ borderRadius: '20px', padding: '1.5rem' }}>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-gray-600 font-bold" style={{ fontSize: '1.5rem' }}>참여율</h3>
                            <span style={{ fontSize: '3rem' }}>✅</span>
                        </div>
                        <p className="font-bold text-green-600" style={{ fontSize: '3rem' }}>{participationRate}%</p>
                    </div>
                    <div className="bg-white shadow-lg" style={{ borderRadius: '20px', padding: '1.5rem' }}>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-gray-600 font-bold" style={{ fontSize: '1.5rem' }}>평균 타자 속도</h3>
                            <span style={{ fontSize: '3rem' }}>⚡</span>
                        </div>
                        <p className="font-bold text-purple-600" style={{ fontSize: '3rem' }}>{avgCpm} CPM</p>
                    </div>
                    <div className="bg-white shadow-lg" style={{ borderRadius: '20px', padding: '1.5rem' }}>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-gray-600 font-bold" style={{ fontSize: '1.5rem' }}>참여 학생 수</h3>
                            <span style={{ fontSize: '3rem' }}>👥</span>
                        </div>
                        <p className="font-bold text-orange-600" style={{ fontSize: '3rem' }}>{participatingStudents} / 30명</p>
                    </div>
                </div>

                {/* 학생 현황 테이블 */}
                <div className="bg-white shadow-lg overflow-hidden" style={{ borderRadius: '20px' }}>
                    <div className="border-b border-gray-100" style={{ padding: '1.5rem' }}>
                        <h2 className="font-bold text-gray-800" style={{ fontSize: '2.5rem' }}>학생 랭킹 TOP 15</h2>
                        <p className="text-gray-500 mt-1" style={{ fontSize: '1.25rem' }}>평균 타자 속도 기준 상위 15명</p>
                    </div>
                    <table className="w-full text-left">
                        <thead>
                            <tr style={{
                                background: 'linear-gradient(135deg, #9B59B6 0%, #FF6B9D 100%)'
                            }}>
                                <th className="text-white font-bold text-center" style={{ padding: '1.5rem', fontSize: '2rem' }}>순위</th>
                                <th className="text-white font-bold" style={{ padding: '1.5rem', fontSize: '2rem' }}>학생</th>
                                <th className="text-white font-bold text-center" style={{ padding: '1.5rem', fontSize: '2rem' }}>평균 CPM</th>
                                <th className="text-white font-bold text-center" style={{ padding: '1.5rem', fontSize: '2rem' }}>연습 횟수</th>
                                <th className="text-white font-bold text-center" style={{ padding: '1.5rem', fontSize: '2rem' }}>상태</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {studentStats.slice(0, 15).map((student, index) => {
                                let rankBg = '';
                                let rankText = '';
                                if (index === 0 && student.avgCpm > 0) {
                                    rankBg = 'bg-yellow-100';
                                    rankText = '🥇';
                                } else if (index === 1 && student.avgCpm > 0) {
                                    rankBg = 'bg-gray-100';
                                    rankText = '🥈';
                                } else if (index === 2 && student.avgCpm > 0) {
                                    rankBg = 'bg-orange-100';
                                    rankText = '🥉';
                                }
                                
                                return (
                                    <tr key={student.id} className={`hover:bg-purple-50 transition-colors ${rankBg}`}>
                                        <td className="font-black text-center" style={{ padding: '1.5rem', fontSize: '2.5rem' }}>
                                            {rankText || (index + 1)}
                                        </td>
                                        <td className="font-bold text-gray-700 flex items-center gap-3" style={{ padding: '1.5rem', fontSize: '1.8rem' }}>
                                            <span style={{ fontSize: '2.5rem' }}>{student.avatar}</span>
                                            <span>{student.id}</span>
                                        </td>
                                        <td className="font-black text-center" style={{ padding: '1.5rem', fontSize: '2.2rem', color: student.avgCpm > 0 ? '#9B59B6' : '#999' }}>
                                            {student.avgCpm}
                                        </td>
                                        <td className="font-bold text-center" style={{ padding: '1.5rem', fontSize: '1.8rem', color: '#4B5563' }}>
                                            {student.playCount}회
                                        </td>
                                        <td className="text-center" style={{ padding: '1.5rem' }}>
                                            {student.playCount > 0 ? (
                                                <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-black border-2 border-green-300" style={{ fontSize: '1.4rem' }}>✅ 활동중</span>
                                            ) : (
                                                <span className="px-4 py-2 bg-gray-100 text-gray-400 rounded-full font-black border-2 border-gray-300" style={{ fontSize: '1.4rem' }}>💤 미접속</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* 최근 활동 로그 */}
                <div className="bg-white shadow-lg overflow-hidden mt-8" style={{ borderRadius: '20px' }}>
                    <div className="border-b border-gray-100" style={{ padding: '1.5rem' }}>
                        <h2 className="font-bold text-gray-800" style={{ fontSize: '2.5rem' }}>최근 활동 로그 (최근 20개)</h2>
                        <p className="text-gray-500 mt-1" style={{ fontSize: '1.25rem' }}>학생들의 최근 학습 활동 내역</p>
                    </div>
                    <table className="w-full text-left">
                        <thead>
                            <tr style={{
                                background: 'linear-gradient(135deg, #9B59B6 0%, #FF6B9D 100%)'
                            }}>
                                <th className="text-white font-bold" style={{ padding: '1.25rem', fontSize: '1.75rem' }}>시간</th>
                                <th className="text-white font-bold" style={{ padding: '1.25rem', fontSize: '1.75rem' }}>학생</th>
                                <th className="text-white font-bold" style={{ padding: '1.25rem', fontSize: '1.75rem' }}>활동</th>
                                <th className="text-white font-bold" style={{ padding: '1.25rem', fontSize: '1.75rem' }}>결과</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredResults.slice(0, 20).map((log, i) => (
                                <tr key={i} className="hover:bg-gray-50 transition-colors">
                                    <td className="text-gray-500" style={{ padding: '1.25rem', fontSize: '1.25rem' }}>{new Date(log.createdAt).toLocaleString()}</td>
                                    <td className="font-bold flex items-center gap-1.5" style={{ padding: '1.25rem', fontSize: '1.5rem' }}>
                                        <span style={{ fontSize: '2rem' }}>{log.avatar}</span>
                                        <span>{log.username}</span>
                                    </td>
                                    <td style={{ padding: '1.25rem' }}>
                                        <div className="flex flex-col gap-1">
                                            <span className="px-4 py-2 rounded-xl font-black border-2" style={{ 
                                                fontSize: '1.5rem',
                                                backgroundColor: log.mode === 'vowel' || log.mode === 'consonant' || log.mode === 'word' || log.mode === 'sentence' ? '#DBEAFE' :
                                                                 log.mode === 'falling' || log.mode === 'timeattack' ? '#D1FAE5' :
                                                                 log.mode === 'story' ? '#FED7AA' : '#F3F4F6',
                                                borderColor: log.mode === 'vowel' || log.mode === 'consonant' || log.mode === 'word' || log.mode === 'sentence' ? '#3B82F6' :
                                                            log.mode === 'falling' || log.mode === 'timeattack' ? '#10B981' :
                                                            log.mode === 'story' ? '#F97316' : '#D1D5DB',
                                                color: log.mode === 'vowel' || log.mode === 'consonant' || log.mode === 'word' || log.mode === 'sentence' ? '#1E40AF' :
                                                       log.mode === 'falling' || log.mode === 'timeattack' ? '#065F46' :
                                                       log.mode === 'story' ? '#9A3412' : '#6B7280'
                                            }}>
                                                {log.mode === 'vowel' ? '📝 모음' :
                                                 log.mode === 'consonant' ? '📝 자음' :
                                                 log.mode === 'word' ? '📝 단어' :
                                                 log.mode === 'sentence' ? '📝 문장' :
                                                 log.mode === 'falling' ? '⬇️ 떨어지는 글자' :
                                                 log.mode === 'timeattack' ? '⏱️ 시간 공격' :
                                                 log.mode === 'story' ? '🤖 AI 스토리' :
                                                 log.mode}
                                            </span>
                                            {log.mode === 'story' && log.keywords && (
                                                <div className="mt-2 px-3 py-1.5 bg-orange-50 border-2 border-orange-200 rounded-lg">
                                                    <span className="text-orange-700 font-black" style={{ fontSize: '1.4rem' }}>
                                                        💡 주제: {log.keywords}
                                                    </span>
                                                </div>
                                            )}
                                            {log.mode === 'falling' && (
                                                <span className="text-gray-500 font-medium" style={{ fontSize: '1.1rem' }}>
                                                    자음/모음 연습
                                                </span>
                                            )}
                                            {log.mode === 'timeattack' && (
                                                <span className="text-gray-500 font-medium" style={{ fontSize: '1.1rem' }}>
                                                    단어 타자 속도
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem', fontSize: '1.5rem' }}>
                                        <span className="font-medium text-gray-700">{log.cpm} CPM</span>
                                        <span className="text-gray-400 mx-2">|</span>
                                        <span className="text-gray-500">{log.accuracy}%</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
