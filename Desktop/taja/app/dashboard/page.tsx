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
        description: '나만의 캐릭터로 만들고 꾸며보세요!',
    },
    {
        id: 'consonant',
        title: '자음 연습',
        emoji: '📚',
        description: 'AI와 함께 나만의 그림책을 만들어요!',
    },
    {
        id: 'word',
        title: '단어 연습',
        emoji: '🎁',
        description: '나만의 캐릭터로 굿즈를 디자인해요!',
    },
    {
        id: 'sentence',
        title: '문장 연습',
        emoji: '📖',
        description: '글로이와 함께 AI 온라인 어드벤처!',
    },
];

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            router.push('/login');
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
        <div className="min-h-screen" style={{ backgroundColor: '#FAF9F6' }}>
            {/* 헤더 */}
            <div className="text-center pt-12 pb-8">
                <div className="flex justify-between items-center max-w-5xl mx-auto px-8 mb-4">
                    <div className="flex items-center gap-3">
                        <span className="text-4xl">{user.avatar}</span>
                        <div className="text-left">
                            <p className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
                                {user.username}
                            </p>
                            <p className="text-sm text-gray-500">
                                🎓 학생
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-10 py-5 font-bold text-2xl transition-all duration-200 hover:opacity-80 shadow-lg"
                        style={{ borderRadius: '32px' }}
                        style={{
                            backgroundColor: '#FF6B9D',
                            color: 'white',
                            minHeight: '70px'
                        }}
                    >
                        로그아웃
                    </button>
                </div>
                <h1 className="text-6xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>
                    🏰 타자왕국
                </h1>
                <p className="text-2xl text-gray-500">
                    5개의 앱
                </p>
            </div>

            {/* 연습 모드 카드 그리드 */}
            <div className="max-w-7xl mx-auto px-8 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {PRACTICE_MODES.map((mode) => (
                        <div
                            key={mode.id}
                            onClick={() => router.push(`/practice/${mode.id}`)}
                            className="group relative bg-white p-8 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border-2 border-transparent hover:border-pink-200"
                            style={{
                                borderRadius: '48px',
                                background: 'linear-gradient(135deg, #ffffff 0%, #fff5f8 100%)'
                            }}
                        >
                            {/* 카드 내용 */}
                            <div className="flex flex-col items-center text-center">
                                {/* 이모지 아이콘 */}
                                <div className="text-8xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                                    {mode.emoji}
                                </div>

                                {/* 제목 */}
                                <h2 className="text-4xl font-bold mb-4" style={{ color: '#333' }}>
                                    {mode.title}
                                </h2>

                                {/* 설명 */}
                                <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                                    {mode.description}
                                </p>

                                {/* 입장 버튼 스타일 */}
                                <div className="mt-auto w-full">
                                    <div className="px-12 py-6 font-black text-3xl text-white text-center transition-all duration-300 transform group-hover:scale-105 shadow-lg"
                                        style={{
                                            borderRadius: '40px',
                                            background: 'linear-gradient(135deg, #FF6B9D 0%, #4ECDC4 100%)',
                                            minHeight: '80px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        입장하기 →
                                    </div>
                                </div>
                            </div>

                            {/* 호버 효과 - 그라데이션 오버레이 */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                                style={{ borderRadius: '48px' }}
                                style={{
                                    background: 'linear-gradient(135deg, #FF6B9D 0%, #4ECDC4 100%)'
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* 하단 버튼 */}
            <div className="text-center pb-16">
                <button
                    onClick={() => router.push('/')}
                    className="px-16 py-6 text-3xl font-bold bg-white shadow-lg hover:shadow-xl transition-all duration-200"
                    style={{ borderRadius: '40px' }}
                    style={{ 
                        color: '#666', 
                        border: '4px solid #E0E0E0',
                        minHeight: '80px'
                    }}
                >
                    ← 홈으로 돌아가기
                </button>
            </div>
        </div>
    );
}

function TeacherDashboard({ user, onLogout }: { user: User, onLogout: () => void }) {
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'students' | 'recent' | 'stats'>('students');

    useEffect(() => {
        const fetchData = async () => {
            // 동적 임포트로 순환 참조 방지 및 클라이언트 전용 로드
            const { getAllResultsFromFirestore } = await import('@/lib/firestore');
            const data = await getAllResultsFromFirestore();
            setResults(data);
            setLoading(false);
        };
        fetchData();
    }, []);

    // 데이터 가공
    const studentStats = Array.from({ length: 30 }, (_, i) => `a${i + 1}`).map(studentId => {
        const studentLogs = results.filter(r => r.userId === studentId);
        const lastLog = studentLogs.length > 0 ? studentLogs[0] : null; // 최신순 정렬되어 있음
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

    if (loading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#F0F4F8' }}>
            {/* 교사 헤더 */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <span className="text-3xl">👨‍🏫</span>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">교사 대시보드</h1>
                            <p className="text-sm text-gray-500">학생들의 학습 현황을 확인하세요</p>
                        </div>
                    </div>
                    <button
                        onClick={onLogout}
                        className="px-6 py-2 rounded-lg bg-gray-100 font-bold text-gray-600 hover:bg-gray-200"
                    >
                        로그아웃
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-8 py-12">
                {/* 통계 카드 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-gray-500 mb-2 font-bold">총 연습 횟수</h3>
                        <p className="text-4xl font-bold text-blue-600">{results.length}회</p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-gray-500 mb-2 font-bold">평균 타자 속도</h3>
                        <p className="text-4xl font-bold text-green-600">
                            {results.length > 0
                                ? Math.round(results.reduce((acc, curr) => acc + curr.cpm, 0) / results.length)
                                : 0} CPM
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-gray-500 mb-2 font-bold">참여 학생 수</h3>
                        <p className="text-4xl font-bold text-purple-600">
                            {studentStats.filter(s => s.playCount > 0).length} / 30명
                        </p>
                    </div>
                </div>

                {/* 탭 네비게이션 */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setView('students')}
                        className={`px-6 py-3 rounded-xl font-bold transition-all ${view === 'students' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-500'}`}
                    >
                        학생별 현황
                    </button>
                    <button
                        onClick={() => setView('recent')}
                        className={`px-6 py-3 rounded-xl font-bold transition-all ${view === 'recent' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-500'}`}
                    >
                        최근 활동 로그
                    </button>
                </div>

                {/* 학생 현황 테이블 */}
                {view === 'students' && (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="p-6 text-gray-500 font-bold">ID</th>
                                    <th className="p-6 text-gray-500 font-bold">이름</th>
                                    <th className="p-6 text-gray-500 font-bold">접속 여부</th>
                                    <th className="p-6 text-gray-500 font-bold">연습 횟수</th>
                                    <th className="p-6 text-gray-500 font-bold">평균 속도</th>
                                    <th className="p-6 text-gray-500 font-bold">총 연습 시간</th>
                                    <th className="p-6 text-gray-500 font-bold">최근 접속</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {studentStats.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-6 font-bold text-gray-700">{student.id}</td>
                                        <td className="p-6 flex items-center gap-3">
                                            <span className="text-2xl">{student.avatar}</span>
                                            <span className="font-medium">{student.name === student.id ? '-' : student.name}</span>
                                        </td>
                                        <td className="p-6">
                                            {student.playCount > 0 ? (
                                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">활동중</span>
                                            ) : (
                                                <span className="px-3 py-1 bg-gray-100 text-gray-400 rounded-full text-sm font-bold">미접속</span>
                                            )}
                                        </td>
                                        <td className="p-6 font-medium">{student.playCount}회</td>
                                        <td className="p-6 font-medium">{student.avgCpm} CPM</td>
                                        <td className="p-6 font-medium">{student.totalTime}초</td>
                                        <td className="p-6 text-gray-500 text-sm">{student.lastLogin}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* 최근 활동 로그 */}
                {view === 'recent' && (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="p-6 text-gray-500 font-bold">시간</th>
                                    <th className="p-6 text-gray-500 font-bold">학생</th>
                                    <th className="p-6 text-gray-500 font-bold">활동</th>
                                    <th className="p-6 text-gray-500 font-bold">결과</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {results.slice(0, 50).map((log, i) => (
                                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-6 text-gray-500">{new Date(log.createdAt).toLocaleString()}</td>
                                        <td className="p-6 font-bold flex items-center gap-2">
                                            <span>{log.avatar}</span>
                                            <span>{log.username}</span>
                                        </td>
                                        <td className="p-6">
                                            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold border border-blue-100">
                                                {log.mode}
                                            </span>
                                        </td>
                                        <td className="p-6">
                                            <span className="font-medium text-gray-700">{log.cpm} CPM</span>
                                            <span className="text-gray-400 mx-2">|</span>
                                            <span className="text-gray-500">{log.accuracy}%</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}

