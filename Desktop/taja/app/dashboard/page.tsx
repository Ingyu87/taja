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
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

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
        <div className="min-h-screen" style={{ backgroundColor: '#FAF9F6' }}>
            {/* 상단 네비게이션 바 */}
            <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto">
                    {/* 상단 헤더 */}
                    <div className="px-8 py-4 flex justify-between items-center border-b border-gray-100">
                        <div className="flex items-center gap-4">
                            <span className="text-4xl">{user.avatar}</span>
                            <div>
                                <p className="text-xl font-bold text-gray-800">{user.username}</p>
                                <p className="text-sm text-gray-500">🎓 학생</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.push('/ranking')}
                                className="px-8 py-4 font-bold text-xl bg-white text-gray-600 hover:bg-gray-50 transition-all"
                                style={{ borderRadius: '24px', border: '3px solid #E0E0E0', minHeight: '56px' }}
                            >
                                랭킹
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-8 py-4 font-bold text-xl bg-white text-gray-600 hover:bg-gray-50 transition-all"
                                style={{ borderRadius: '24px', border: '3px solid #E0E0E0', minHeight: '56px' }}
                            >
                                로그아웃
                            </button>
                        </div>
                    </div>
                    {/* 네비게이션 메뉴 바 */}
                    <nav className="px-8">
                        <div className="flex gap-2 border-b-2 border-gray-200">
                            <button
                                onClick={() => setSelectedCategory('all')}
                                className={`px-8 py-5 font-bold text-xl whitespace-nowrap transition-all relative ${
                                    selectedCategory === 'all'
                                        ? 'text-pink-600'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                                style={{ minHeight: '64px' }}
                            >
                                전체
                                {selectedCategory === 'all' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-400 to-cyan-400" style={{ transform: 'translateY(2px)' }}></div>
                                )}
                            </button>
                            <button
                                onClick={() => setSelectedCategory('vowel')}
                                className={`px-8 py-5 font-bold text-xl whitespace-nowrap transition-all relative ${
                                    selectedCategory === 'vowel'
                                        ? 'text-pink-600'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                                style={{ minHeight: '64px' }}
                            >
                                🎨 모음
                                {selectedCategory === 'vowel' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-400 to-cyan-400" style={{ transform: 'translateY(2px)' }}></div>
                                )}
                            </button>
                            <button
                                onClick={() => setSelectedCategory('consonant')}
                                className={`px-8 py-5 font-bold text-xl whitespace-nowrap transition-all relative ${
                                    selectedCategory === 'consonant'
                                        ? 'text-pink-600'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                                style={{ minHeight: '64px' }}
                            >
                                📚 자음
                                {selectedCategory === 'consonant' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-400 to-cyan-400" style={{ transform: 'translateY(2px)' }}></div>
                                )}
                            </button>
                            <button
                                onClick={() => setSelectedCategory('word')}
                                className={`px-8 py-5 font-bold text-xl whitespace-nowrap transition-all relative ${
                                    selectedCategory === 'word'
                                        ? 'text-pink-600'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                                style={{ minHeight: '64px' }}
                            >
                                🎁 단어
                                {selectedCategory === 'word' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-400 to-cyan-400" style={{ transform: 'translateY(2px)' }}></div>
                                )}
                            </button>
                            <button
                                onClick={() => setSelectedCategory('sentence')}
                                className={`px-8 py-5 font-bold text-xl whitespace-nowrap transition-all relative ${
                                    selectedCategory === 'sentence'
                                        ? 'text-pink-600'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                                style={{ minHeight: '64px' }}
                            >
                                📖 문장
                                {selectedCategory === 'sentence' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-400 to-cyan-400" style={{ transform: 'translateY(2px)' }}></div>
                                )}
                            </button>
                        </div>
                    </nav>
                </div>
            </div>

            {/* 메인 콘텐츠 */}
            <div className="max-w-5xl mx-auto px-8 py-12">
                <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">
                    {selectedCategory === 'all' ? `${PRACTICE_MODES.length}개의 앱` : 
                     selectedCategory === 'vowel' ? '모음 연습 앱' :
                     selectedCategory === 'consonant' ? '자음 연습 앱' :
                     selectedCategory === 'word' ? '단어 연습 앱' : '문장 연습 앱'}
                </h2>

                {/* 연습 모드 카드 그리드 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center">
                    {PRACTICE_MODES
                        .filter(mode => selectedCategory === 'all' || mode.id === selectedCategory)
                        .map((mode) => (
                        <div
                            key={mode.id}
                            onClick={() => router.push(`/practice/${mode.id}`)}
                            className="group relative bg-white p-6 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                            style={{
                                borderRadius: '24px',
                                border: '2px solid #E0E0E0',
                                width: '100%',
                                maxWidth: '380px'
                            }}
                        >
                            {/* 카드 내용 */}
                            <div className="flex flex-col items-center text-center">
                                {/* 이모지 아이콘 */}
                                <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                                    {mode.emoji}
                                </div>

                                {/* 제목 */}
                                <h3 className="text-xl font-bold mb-2 text-gray-800">
                                    {mode.title}
                                </h3>

                                {/* 설명 */}
                                <p className="text-base text-gray-600 mb-4 leading-relaxed">
                                    {mode.description}
                                </p>

                                {/* 카테고리 태그 */}
                                <div className="mt-auto w-full">
                                    <div className="px-4 py-2 font-bold text-base text-white text-center transition-all duration-300 transform group-hover:scale-105 shadow-sm"
                                        style={{
                                            borderRadius: '16px',
                                            background: 'linear-gradient(135deg, #FF6B9D 0%, #4ECDC4 100%)',
                                            minHeight: '40px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        {mode.id === 'vowel' ? '🎨 모음' :
                                         mode.id === 'consonant' ? '📚 자음' :
                                         mode.id === 'word' ? '🎁 단어' : '📖 문장'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function TeacherDashboard({ user, onLogout }: { user: User, onLogout: () => void }) {
    const router = useRouter();
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

    const totalPracticeCount = results.length;
    const avgCpm = results.length > 0
        ? Math.round(results.reduce((acc, curr) => acc + curr.cpm, 0) / results.length)
        : 0;
    const participatingStudents = studentStats.filter(s => s.playCount > 0).length;
    const participationRate = Math.round((participatingStudents / 30) * 100);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#FAF9F6' }}>
            {/* 상단 네비게이션 바 */}
            <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-8 py-4">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-4">
                            <span className="text-4xl">👨‍🏫</span>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">교사 대시보드</h1>
                                <p className="text-sm text-gray-500">학생들의 학습 현황을 확인하세요</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.push('/ranking')}
                                className="px-8 py-4 font-bold text-xl bg-white text-gray-600 hover:bg-gray-50 transition-all"
                                style={{ borderRadius: '24px', border: '3px solid #E0E0E0', minHeight: '56px' }}
                            >
                                랭킹
                            </button>
                            <button
                                onClick={onLogout}
                                className="px-8 py-4 font-bold text-xl bg-white text-gray-600 hover:bg-gray-50 transition-all"
                                style={{ borderRadius: '24px', border: '3px solid #E0E0E0', minHeight: '56px' }}
                            >
                                로그아웃
                            </button>
                        </div>
                    </div>
                    {/* 탭 네비게이션 */}
                    <nav className="px-8">
                        <div className="flex gap-2 border-b-2 border-gray-200">
                            <button
                                onClick={() => setView('students')}
                                className={`px-8 py-5 font-bold text-xl whitespace-nowrap transition-all relative ${
                                    view === 'students'
                                        ? 'text-pink-600'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                                style={{ minHeight: '64px' }}
                            >
                                학생별 현황
                                {view === 'students' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-400 to-cyan-400" style={{ transform: 'translateY(2px)' }}></div>
                                )}
                            </button>
                            <button
                                onClick={() => setView('recent')}
                                className={`px-8 py-5 font-bold text-xl whitespace-nowrap transition-all relative ${
                                    view === 'recent'
                                        ? 'text-pink-600'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                                style={{ minHeight: '64px' }}
                            >
                                최근 활동 로그
                                {view === 'recent' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-400 to-cyan-400" style={{ transform: 'translateY(2px)' }}></div>
                                )}
                            </button>
                        </div>
                    </nav>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-8 py-12">
                {/* 통계 카드 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white p-6 shadow-lg" style={{ borderRadius: '24px' }}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-600 font-bold text-lg">총 연습 횟수</h3>
                            <span className="text-3xl">📊</span>
                        </div>
                        <p className="text-4xl font-bold text-blue-600">{totalPracticeCount}회</p>
                    </div>
                    <div className="bg-white p-6 shadow-lg" style={{ borderRadius: '24px' }}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-600 font-bold text-lg">참여율</h3>
                            <span className="text-3xl">✅</span>
                        </div>
                        <p className="text-4xl font-bold text-green-600">{participationRate}%</p>
                    </div>
                    <div className="bg-white p-6 shadow-lg" style={{ borderRadius: '24px' }}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-600 font-bold text-lg">평균 타자 속도</h3>
                            <span className="text-3xl">⚡</span>
                        </div>
                        <p className="text-4xl font-bold text-purple-600">{avgCpm} CPM</p>
                    </div>
                    <div className="bg-white p-6 shadow-lg" style={{ borderRadius: '24px' }}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-600 font-bold text-lg">참여 학생 수</h3>
                            <span className="text-3xl">👥</span>
                        </div>
                        <p className="text-4xl font-bold text-orange-600">{participatingStudents} / 30명</p>
                    </div>
                </div>

                {/* 학생 현황 테이블 */}
                {view === 'students' && (
                    <div className="bg-white shadow-lg overflow-hidden" style={{ borderRadius: '32px' }}>
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-800">학생별 현황</h2>
                            <p className="text-sm text-gray-500 mt-1">개별 학생의 학습 패턴을 확인하세요</p>
                        </div>
                        <table className="w-full text-left">
                            <thead>
                                <tr style={{
                                    background: 'linear-gradient(135deg, #9B59B6 0%, #FF6B9D 100%)'
                                }}>
                                    <th className="p-4 text-white font-bold">학생</th>
                                    <th className="p-4 text-white font-bold">최근 활동</th>
                                    <th className="p-4 text-white font-bold">연습 횟수</th>
                                    <th className="p-4 text-white font-bold">평균 속도</th>
                                    <th className="p-4 text-white font-bold">총 연습 시간</th>
                                    <th className="p-4 text-white font-bold">최근 접속</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {studentStats.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-bold text-gray-700 flex items-center gap-3">
                                            <span className="text-2xl">{student.avatar}</span>
                                            <span>{student.id}</span>
                                        </td>
                                        <td className="p-4">
                                            {student.playCount > 0 ? (
                                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">활동중</span>
                                            ) : (
                                                <span className="px-3 py-1 bg-gray-100 text-gray-400 rounded-full text-sm font-bold">미접속</span>
                                            )}
                                        </td>
                                        <td className="p-4 font-medium">{student.playCount}회</td>
                                        <td className="p-4 font-medium">{student.avgCpm} CPM</td>
                                        <td className="p-4 font-medium">{student.totalTime}초</td>
                                        <td className="p-4 text-gray-500 text-sm">{student.lastLogin}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* 최근 활동 로그 */}
                {view === 'recent' && (
                    <div className="bg-white shadow-lg overflow-hidden" style={{ borderRadius: '32px' }}>
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-800">최근 활동 로그</h2>
                            <p className="text-sm text-gray-500 mt-1">학생들의 최근 학습 활동 내역</p>
                        </div>
                        <table className="w-full text-left">
                            <thead>
                                <tr style={{
                                    background: 'linear-gradient(135deg, #9B59B6 0%, #FF6B9D 100%)'
                                }}>
                                    <th className="p-4 text-white font-bold">시간</th>
                                    <th className="p-4 text-white font-bold">학생</th>
                                    <th className="p-4 text-white font-bold">활동</th>
                                    <th className="p-4 text-white font-bold">결과</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {results.slice(0, 50).map((log, i) => (
                                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 text-gray-500">{new Date(log.createdAt).toLocaleString()}</td>
                                        <td className="p-4 font-bold flex items-center gap-2">
                                            <span>{log.avatar}</span>
                                            <span>{log.username}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold border border-blue-100">
                                                {log.mode}
                                            </span>
                                        </td>
                                        <td className="p-4">
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

