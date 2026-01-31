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
        id: 'bomb',
        title: '폭탄 피하기',
        emoji: '💣',
        description: '폭탄은 피해요!',
        color: '#FF6B9D',
        bgGradient: 'linear-gradient(135deg, #FFE5EC 0%, #FFD4E0 100%)',
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
                            fontSize: '4rem',
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
                            <span style={{ fontSize: '5rem' }}>📚</span>
                            <h2 style={{ fontSize: '4.5rem' }} className="font-black text-pink-500 drop-shadow-lg leading-none">
                                타자 연습
                            </h2>
                            <span style={{ fontSize: '5rem' }}>📚</span>
                        </div>
                        <p style={{ fontSize: '2.5rem' }} className="font-black text-gray-700">
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
                                            <div style={{ fontSize: '6rem', lineHeight: '1' }}>{mode.emoji}</div>
                                        </div>
                                        {/* 텍스트 오른쪽 */}
                                        <div className="flex-1 text-left">
                                            <h3 className="font-black mb-4 drop-shadow-md leading-tight" style={{ fontSize: '3.5rem', color: mode.color }}>
                                                {mode.title}
                                            </h3>
                                            <p style={{ fontSize: '2.5rem' }} className="font-black text-gray-800 leading-snug">
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
                                                fontSize: '2.5rem',
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

                {/* 게임 모드 섹션 */}
                <div className="mb-12 w-full">
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center gap-8 mb-6">
                            <span style={{ fontSize: '5rem' }}>🎮</span>
                            <h2 style={{ fontSize: '4.5rem' }} className="font-black text-purple-500 drop-shadow-lg leading-none">
                                재미있는 게임
                            </h2>
                            <span style={{ fontSize: '5rem' }}>🎮</span>
                        </div>
                        <p style={{ fontSize: '2.5rem' }} className="font-black text-gray-700">
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
                                            <div style={{ fontSize: '6rem', lineHeight: '1' }}>{game.emoji}</div>
                                        </div>
                                        {/* 텍스트 */}
                                        <div>
                                            <h3 className="font-black mb-4 drop-shadow-md leading-tight" style={{ fontSize: '3rem', color: game.color }}>
                                                {game.title}
                                            </h3>
                                            <p style={{ fontSize: '2rem' }} className="font-black text-gray-800 leading-snug">
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
                                                fontSize: '2rem',
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

    useEffect(() => {
        const fetchData = async () => {
            const { getAllResultsFromFirestore } = await import('@/lib/firestore');
            const data = await getAllResultsFromFirestore();
            setResults(data);
            setLoading(false);
        };
        fetchData();
    }, []);

    const studentStats = Array.from({ length: 30 }, (_, i) => `a${i + 1}`).map(studentId => {
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
    });

    const totalPracticeCount = results.length;
    const avgCpm = results.length > 0
        ? Math.round(results.reduce((acc, curr) => acc + curr.cpm, 0) / results.length)
        : 0;
    const participatingStudents = studentStats.filter(s => s.playCount > 0).length;
    const participationRate = Math.round((participatingStudents / 30) * 100);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#FAF9F6' }}>
            {/* 상단 헤더 - 로그아웃 버튼만 */}
            <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-full mx-auto px-12 py-8">
                    <div className="flex items-center justify-between">
                        <h1 className="font-black" style={{ fontSize: '6rem', color: '#000000' }}>
                            👨‍🏫 교사 대시보드
                        </h1>
                        <button
                            onClick={onLogout}
                            className="font-black text-white hover:opacity-90 transition-all rounded-3xl shadow-lg hover:shadow-xl transform hover:scale-105"
                            style={{ 
                                background: 'linear-gradient(135deg, #FF6B9D 0%, #FF8FB9 100%)',
                                padding: '2rem 3rem',
                                fontSize: '4rem'
                            }}
                        >
                            👋 로그아웃
                        </button>
                    </div>
                </div>
            </div>

            <main className="max-w-full mx-auto px-12 py-16">
                {/* 통계 카드 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
                    <div className="bg-white shadow-lg" style={{ borderRadius: '40px', padding: '3rem' }}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-gray-600 font-bold" style={{ fontSize: '3rem' }}>총 연습 횟수</h3>
                            <span style={{ fontSize: '6rem' }}>📊</span>
                        </div>
                        <p className="font-bold text-blue-600" style={{ fontSize: '6rem' }}>{totalPracticeCount}회</p>
                    </div>
                    <div className="bg-white shadow-lg" style={{ borderRadius: '40px', padding: '3rem' }}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-gray-600 font-bold" style={{ fontSize: '3rem' }}>참여율</h3>
                            <span style={{ fontSize: '6rem' }}>✅</span>
                        </div>
                        <p className="font-bold text-green-600" style={{ fontSize: '6rem' }}>{participationRate}%</p>
                    </div>
                    <div className="bg-white shadow-lg" style={{ borderRadius: '40px', padding: '3rem' }}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-gray-600 font-bold" style={{ fontSize: '3rem' }}>평균 타자 속도</h3>
                            <span style={{ fontSize: '6rem' }}>⚡</span>
                        </div>
                        <p className="font-bold text-purple-600" style={{ fontSize: '6rem' }}>{avgCpm} CPM</p>
                    </div>
                    <div className="bg-white shadow-lg" style={{ borderRadius: '40px', padding: '3rem' }}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-gray-600 font-bold" style={{ fontSize: '3rem' }}>참여 학생 수</h3>
                            <span style={{ fontSize: '6rem' }}>👥</span>
                        </div>
                        <p className="font-bold text-orange-600" style={{ fontSize: '6rem' }}>{participatingStudents} / 30명</p>
                    </div>
                </div>

                {/* 학생 현황 테이블 */}
                <div className="bg-white shadow-lg overflow-hidden" style={{ borderRadius: '40px' }}>
                        <div className="border-b border-gray-100" style={{ padding: '3rem' }}>
                            <h2 className="font-bold text-gray-800" style={{ fontSize: '5rem' }}>학생별 현황</h2>
                            <p className="text-gray-500 mt-2" style={{ fontSize: '2.5rem' }}>개별 학생의 학습 패턴을 확인하세요</p>
                        </div>
                        <table className="w-full text-left">
                            <thead>
                                <tr style={{
                                    background: 'linear-gradient(135deg, #9B59B6 0%, #FF6B9D 100%)'
                                }}>
                                    <th className="text-white font-bold" style={{ padding: '2.5rem', fontSize: '3.5rem' }}>학생</th>
                                    <th className="text-white font-bold" style={{ padding: '2.5rem', fontSize: '3.5rem' }}>최근 활동</th>
                                    <th className="text-white font-bold" style={{ padding: '2.5rem', fontSize: '3.5rem' }}>연습 횟수</th>
                                    <th className="text-white font-bold" style={{ padding: '2.5rem', fontSize: '3.5rem' }}>평균 속도</th>
                                    <th className="text-white font-bold" style={{ padding: '2.5rem', fontSize: '3.5rem' }}>총 연습 시간</th>
                                    <th className="text-white font-bold" style={{ padding: '2.5rem', fontSize: '3.5rem' }}>최근 접속</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {studentStats.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="font-bold text-gray-700 flex items-center gap-4" style={{ padding: '2.5rem', fontSize: '3rem' }}>
                                            <span style={{ fontSize: '4rem' }}>{student.avatar}</span>
                                            <span>{student.id}</span>
                                        </td>
                                        <td style={{ padding: '2.5rem' }}>
                                            {student.playCount > 0 ? (
                                                <span className="px-6 py-3 bg-green-100 text-green-700 rounded-full font-bold" style={{ fontSize: '2.5rem' }}>활동중</span>
                                            ) : (
                                                <span className="px-6 py-3 bg-gray-100 text-gray-400 rounded-full font-bold" style={{ fontSize: '2.5rem' }}>미접속</span>
                                            )}
                                        </td>
                                        <td className="font-medium" style={{ padding: '2.5rem', fontSize: '3rem' }}>{student.playCount}회</td>
                                        <td className="font-medium" style={{ padding: '2.5rem', fontSize: '3rem' }}>{student.avgCpm} CPM</td>
                                        <td className="font-medium" style={{ padding: '2.5rem', fontSize: '3rem' }}>{student.totalTime}초</td>
                                        <td className="text-gray-500" style={{ padding: '2.5rem', fontSize: '2.5rem' }}>{student.lastLogin}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                {/* 최근 활동 로그 */}
                <div className="bg-white shadow-lg overflow-hidden mt-16" style={{ borderRadius: '40px' }}>
                        <div className="border-b border-gray-100" style={{ padding: '3rem' }}>
                            <h2 className="font-bold text-gray-800" style={{ fontSize: '5rem' }}>최근 활동 로그</h2>
                            <p className="text-gray-500 mt-2" style={{ fontSize: '2.5rem' }}>학생들의 최근 학습 활동 내역</p>
                        </div>
                        <table className="w-full text-left">
                            <thead>
                                <tr style={{
                                    background: 'linear-gradient(135deg, #9B59B6 0%, #FF6B9D 100%)'
                                }}>
                                    <th className="text-white font-bold" style={{ padding: '2.5rem', fontSize: '3.5rem' }}>시간</th>
                                    <th className="text-white font-bold" style={{ padding: '2.5rem', fontSize: '3.5rem' }}>학생</th>
                                    <th className="text-white font-bold" style={{ padding: '2.5rem', fontSize: '3.5rem' }}>활동</th>
                                    <th className="text-white font-bold" style={{ padding: '2.5rem', fontSize: '3.5rem' }}>결과</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {results.slice(0, 50).map((log, i) => (
                                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                                        <td className="text-gray-500" style={{ padding: '2.5rem', fontSize: '2.5rem' }}>{new Date(log.createdAt).toLocaleString()}</td>
                                        <td className="font-bold flex items-center gap-3" style={{ padding: '2.5rem', fontSize: '3rem' }}>
                                            <span style={{ fontSize: '4rem' }}>{log.avatar}</span>
                                            <span>{log.username}</span>
                                        </td>
                                        <td style={{ padding: '2.5rem' }}>
                                            <span className="px-6 py-3 bg-blue-50 text-blue-600 rounded-lg font-bold border border-blue-100" style={{ fontSize: '2.5rem' }}>
                                                {log.mode}
                                            </span>
                                        </td>
                                        <td style={{ padding: '2.5rem', fontSize: '3rem' }}>
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
