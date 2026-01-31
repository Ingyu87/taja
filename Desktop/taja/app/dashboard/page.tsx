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

const NAV_TABS = [
    { id: 'changche', label: '창체', icon: '🎭', active: true },
    { id: 'math', label: '수학', icon: '1234' },
    { id: 'korean', label: '국어', icon: '📖' },
    { id: 'social', label: '사회', icon: '🌍' },
    { id: 'class', label: '학급운영', icon: '🏠' },
    { id: 'manage', label: '관리', icon: '⚙️' },
];

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [activeTab, setActiveTab] = useState<string>('changche');

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
                    <nav className="px-6 py-3">
                        <div className="flex items-center justify-between">
                            {/* 왼쪽 탭들 */}
                            <div className="flex items-center gap-2">
                                {NAV_TABS.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-4 py-2 font-semibold text-base whitespace-nowrap transition-all rounded-xl ${
                                            activeTab === tab.id
                                                ? 'text-white'
                                                : 'text-gray-600 bg-white hover:bg-gray-50'
                                        }`}
                                        style={
                                            activeTab === tab.id
                                                ? {
                                                      background: 'linear-gradient(135deg, #FF6B9D 0%, #4ECDC4 100%)',
                                                  }
                                                : {}
                                        }
                                    >
                                        <span className="mr-1.5 text-sm">{tab.icon}</span>
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                            {/* 오른쪽 버튼들 */}
                            <div className="flex items-center gap-2">
                                <button
                                    className="px-4 py-2 font-semibold text-base bg-white text-gray-600 hover:bg-gray-50 transition-all rounded-xl"
                                    style={{ border: '2px solid #E0E0E0' }}
                                >
                                    👤 선생님
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 font-semibold text-base bg-white text-gray-600 hover:bg-gray-50 transition-all rounded-xl"
                                    style={{ border: '2px solid #E0E0E0' }}
                                >
                                    로그아웃
                                </button>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>

            {/* 메인 콘텐츠 */}
            <div className="max-w-6xl mx-auto px-8 py-10">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold mb-1 text-gray-900">창체 웹앱</h1>
                    <p className="text-lg text-gray-500 mt-1">{PRACTICE_MODES.length}개의 앱</p>
                </div>

                {/* 앱 카드 그리드 - 3개 위, 2개 아래 */}
                <div className="grid grid-cols-3 gap-5 mb-5">
                    {PRACTICE_MODES.slice(0, 3).map((mode) => (
                        <div
                            key={mode.id}
                            onClick={() => router.push(`/practice/${mode.id}`)}
                            className="bg-white p-5 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer rounded-2xl"
                            style={{
                                border: '1px solid #E0E0E0',
                            }}
                        >
                            <div className="flex flex-col items-center text-center">
                                {/* 아이콘 */}
                                <div className="text-6xl mb-3">{mode.emoji}</div>
                                {/* 제목 */}
                                <h3 className="text-xl font-bold mb-2 text-gray-800">{mode.title}</h3>
                                {/* 설명 */}
                                <p className="text-sm text-gray-600 mb-3 leading-relaxed">{mode.description}</p>
                                {/* 하단 태그 버튼 */}
                                <div className="mt-auto w-full">
                                    <div
                                        className="px-3 py-1.5 font-semibold text-sm text-white text-center rounded-xl"
                                        style={{
                                            background: 'linear-gradient(135deg, #FF6B9D 0%, #4ECDC4 100%)',
                                        }}
                                    >
                                        창체
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 아래 2개 카드 */}
                <div className="grid grid-cols-2 gap-5 max-w-4xl mx-auto">
                    {PRACTICE_MODES.slice(3, 5).map((mode) => (
                        <div
                            key={mode.id}
                            onClick={() => router.push(`/practice/${mode.id}`)}
                            className="bg-white p-5 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer rounded-2xl"
                            style={{
                                border: '1px solid #E0E0E0',
                            }}
                        >
                            <div className="flex flex-col items-center text-center">
                                {/* 아이콘 */}
                                <div className="text-6xl mb-3">{mode.emoji}</div>
                                {/* 제목 */}
                                <h3 className="text-xl font-bold mb-2 text-gray-800">{mode.title}</h3>
                                {/* 설명 */}
                                <p className="text-sm text-gray-600 mb-3 leading-relaxed">{mode.description}</p>
                                {/* 하단 태그 버튼 */}
                                <div className="mt-auto w-full">
                                    <div
                                        className="px-3 py-1.5 font-semibold text-sm text-white text-center rounded-xl"
                                        style={{
                                            background: 'linear-gradient(135deg, #FF6B9D 0%, #4ECDC4 100%)',
                                        }}
                                    >
                                        창체
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
    const [activeTab, setActiveTab] = useState<string>('changche');

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
            {/* 상단 네비게이션 바 */}
            <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto">
                    <nav className="px-6 py-3">
                        <div className="flex items-center justify-between">
                            {/* 왼쪽 탭들 */}
                            <div className="flex items-center gap-2">
                                {NAV_TABS.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-4 py-2 font-semibold text-base whitespace-nowrap transition-all rounded-xl ${
                                            activeTab === tab.id
                                                ? 'text-white'
                                                : 'text-gray-600 bg-white hover:bg-gray-50'
                                        }`}
                                        style={
                                            activeTab === tab.id
                                                ? {
                                                      background: 'linear-gradient(135deg, #FF6B9D 0%, #4ECDC4 100%)',
                                                  }
                                                : {}
                                        }
                                    >
                                        <span className="mr-1.5 text-sm">{tab.icon}</span>
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                            {/* 오른쪽 버튼들 */}
                            <div className="flex items-center gap-2">
                                <button
                                    className="px-4 py-2 font-semibold text-base bg-white text-gray-600 hover:bg-gray-50 transition-all rounded-xl"
                                    style={{ border: '2px solid #E0E0E0' }}
                                >
                                    👤 선생님
                                </button>
                                <button
                                    onClick={onLogout}
                                    className="px-4 py-2 font-semibold text-base bg-white text-gray-600 hover:bg-gray-50 transition-all rounded-xl"
                                    style={{ border: '2px solid #E0E0E0' }}
                                >
                                    로그아웃
                                </button>
                            </div>
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
