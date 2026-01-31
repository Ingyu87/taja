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
    const [activeTab, setActiveTab] = useState<'practice' | 'game' | 'story'>('practice');
    const [deleting, setDeleting] = useState(false);

    const fetchData = async () => {
        const { getAllResultsFromFirestore } = await import('@/lib/firestore');
        const data = await getAllResultsFromFirestore();
        // 교사 계정 제외
        const studentData = data.filter(r => r.userId !== 'teacher' && !r.userId?.startsWith('teacher'));
        setResults(studentData);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteData = async () => {
        let confirmMessage = '';
        let deleteFunction: () => Promise<any>;

        if (activeTab === 'practice') {
            confirmMessage = '연습 모드의 모든 데이터를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.';
            const { deletePracticeData } = await import('@/lib/firestore');
            deleteFunction = deletePracticeData;
        } else if (activeTab === 'game') {
            confirmMessage = '게임 모드의 모든 데이터를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.';
            const { deleteGameData } = await import('@/lib/firestore');
            deleteFunction = deleteGameData;
        } else {
            confirmMessage = 'AI 스토리의 모든 데이터를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.';
            const { deleteStoryData } = await import('@/lib/firestore');
            deleteFunction = deleteStoryData;
        }

        if (!window.confirm(confirmMessage)) {
            return;
        }

        setDeleting(true);
        try {
            const result = await deleteFunction();
            if (result.success) {
                alert(`${result.count}개의 데이터가 삭제되었습니다.`);
                // 데이터 다시 불러오기
                await fetchData();
            } else {
                alert('데이터 삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('데이터 삭제 중 오류가 발생했습니다.');
        } finally {
            setDeleting(false);
        }
    };

    // 실제 활동한 학생들만 추출
    const uniqueStudents = Array.from(new Set(results.map(r => r.userId)));
    
    const studentStats = uniqueStudents
        .map(studentId => {
            const studentLogs = results.filter(r => r.userId === studentId);
            const lastLog = studentLogs.length > 0 ? studentLogs[0] : null;
            const totalTime = studentLogs.reduce((acc, curr) => acc + (curr.time || 0), 0);
            const avgCpm = studentLogs.length > 0
                ? Math.round(studentLogs.reduce((acc, curr) => acc + (curr.cpm || 0), 0) / studentLogs.length)
                : 0;

            // 최근 활동 시간 계산
            const now = new Date();
            const lastActiveTime = lastLog ? new Date(lastLog.createdAt) : null;
            let lastActiveText = '-';
            
            if (lastActiveTime) {
                const diffMs = now.getTime() - lastActiveTime.getTime();
                const diffMins = Math.floor(diffMs / (1000 * 60));
                const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                
                if (diffMins < 1) {
                    lastActiveText = '방금 전';
                } else if (diffMins < 60) {
                    lastActiveText = `${diffMins}분 전`;
                } else if (diffHours < 24) {
                    lastActiveText = `${diffHours}시간 전`;
                } else if (diffDays < 7) {
                    lastActiveText = `${diffDays}일 전`;
                } else {
                    lastActiveText = lastActiveTime.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
                }
            }

            return {
                id: studentId,
                name: lastLog?.username || studentId,
                avatar: lastLog?.avatar || '👤',
                playCount: studentLogs.length,
                lastLogin: lastLog ? new Date(lastLog.createdAt).toLocaleString() : '-',
                totalTime: Math.round(totalTime),
                avgCpm,
                lastActiveText,
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
        if (activeTab === 'practice') return ['vowel', 'consonant', 'word', 'sentence'].includes(r.mode);
        if (activeTab === 'game') return ['falling', 'timeattack'].includes(r.mode);
        if (activeTab === 'story') return r.mode === 'story';
        return false;
    });

    const totalPracticeCount = filteredResults.length;
    const avgCpm = filteredResults.length > 0
        ? Math.round(filteredResults.reduce((acc, curr) => acc + curr.cpm, 0) / filteredResults.length)
        : 0;
    const participatingStudents = studentStats.length;
    
    // 주의 필요 학생 (정확도 낮거나 CPM 낮음)
    const studentsNeedHelp = studentStats.filter(s => {
        const recentLogs = results.filter(r => r.userId === s.id).slice(0, 5);
        const avgAccuracy = recentLogs.length > 0 
            ? recentLogs.reduce((acc, curr) => acc + curr.accuracy, 0) / recentLogs.length 
            : 100;
        return s.avgCpm < 100 || avgAccuracy < 80;
    });
    
    // 우수 학생 (CPM 높고 꾸준함)
    const topStudents = studentStats.filter(s => s.avgCpm >= 200 && s.playCount >= 10).slice(0, 5);

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
                    
                    {/* 데이터 초기화 버튼 */}
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={handleDeleteData}
                            disabled={deleting}
                            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-black rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ fontSize: '1.5rem' }}
                        >
                            {deleting ? '삭제 중...' : '🗑️ 데이터 초기화'}
                        </button>
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
                                <th className="text-white font-bold text-center" style={{ padding: '1.5rem', fontSize: '2rem' }}>최근 접속</th>
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
                                        <td className="text-center font-bold text-gray-600" style={{ padding: '1.5rem', fontSize: '1.4rem' }}>
                                            {student.lastActiveText}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* 인사이트 대시보드 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    {/* 주의 필요 학생 */}
                    {studentsNeedHelp.length > 0 && (
                        <div className="bg-white shadow-lg overflow-hidden" style={{ borderRadius: '20px' }}>
                            <div className="border-b border-gray-100" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #EF4444 0%, #F97316 100%)' }}>
                                <h2 className="font-black text-white" style={{ fontSize: '2.5rem' }}>🚨 주의 필요</h2>
                                <p className="text-white mt-1" style={{ fontSize: '1.25rem' }}>도움이 필요한 학생</p>
                            </div>
                            <div className="p-6">
                                {studentsNeedHelp.slice(0, 5).map((student, i) => {
                                    const recentLogs = results.filter(r => r.userId === student.id).slice(0, 5);
                                    const avgAccuracy = recentLogs.length > 0 
                                        ? Math.round(recentLogs.reduce((acc, curr) => acc + curr.accuracy, 0) / recentLogs.length)
                                        : 0;
                                    
                                    return (
                                        <div key={i} className="flex items-center justify-between p-4 mb-3 bg-red-50 rounded-2xl border-2 border-red-200">
                                            <div className="flex items-center gap-3">
                                                <span style={{ fontSize: '2rem' }}>{student.avatar}</span>
                                                <div>
                                                    <p className="font-black text-gray-800" style={{ fontSize: '1.6rem' }}>{student.id}</p>
                                                    <p className="text-gray-600" style={{ fontSize: '1.2rem' }}>
                                                        {student.avgCpm < 100 && `CPM ${student.avgCpm} (낮음)`}
                                                        {student.avgCpm >= 100 && avgAccuracy < 80 && `정확도 ${avgAccuracy}% (낮음)`}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* 우수 학생 */}
                    {topStudents.length > 0 && (
                        <div className="bg-white shadow-lg overflow-hidden" style={{ borderRadius: '20px' }}>
                            <div className="border-b border-gray-100" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)' }}>
                                <h2 className="font-black text-white" style={{ fontSize: '2.5rem' }}>⭐ 우수 학생</h2>
                                <p className="text-white mt-1" style={{ fontSize: '1.25rem' }}>칭찬해주세요!</p>
                            </div>
                            <div className="p-6">
                                {topStudents.map((student, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 mb-3 bg-green-50 rounded-2xl border-2 border-green-200">
                                        <div className="flex items-center gap-3">
                                            <span style={{ fontSize: '2rem' }}>{student.avatar}</span>
                                            <div>
                                                <p className="font-black text-gray-800" style={{ fontSize: '1.6rem' }}>{student.id}</p>
                                                <p className="text-gray-600" style={{ fontSize: '1.2rem' }}>
                                                    {student.playCount}회 연습, 평균 {student.avgCpm} CPM
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-3xl">🏆</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* 탭별 상세 정보 */}
                {activeTab === 'practice' && (
                    <div className="bg-white shadow-lg overflow-hidden mt-8" style={{ borderRadius: '20px' }}>
                        <div className="border-b border-gray-100" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)' }}>
                            <h2 className="font-black text-white" style={{ fontSize: '2.5rem' }}>📝 연습 모드 상세</h2>
                            <p className="text-white mt-1" style={{ fontSize: '1.25rem' }}>학생별 연습 유형과 횟수</p>
                        </div>
                        <div className="p-6">
                            {uniqueStudents.map(studentId => {
                                const studentLogs = results.filter(r => r.userId === studentId && ['vowel', 'consonant', 'word', 'sentence'].includes(r.mode));
                                if (studentLogs.length === 0) return null;

                                const vowelCount = studentLogs.filter(l => l.mode === 'vowel').length;
                                const consonantCount = studentLogs.filter(l => l.mode === 'consonant').length;
                                const wordCount = studentLogs.filter(l => l.mode === 'word').length;
                                const sentenceCount = studentLogs.filter(l => l.mode === 'sentence').length;

                                const avgCpm = Math.round(studentLogs.reduce((acc, curr) => acc + curr.cpm, 0) / studentLogs.length);
                                const avgAccuracy = Math.round(studentLogs.reduce((acc, curr) => acc + curr.accuracy, 0) / studentLogs.length);

                                return (
                                    <div key={studentId} className="mb-4 p-5 bg-blue-50 rounded-2xl border-2 border-blue-200">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <span style={{ fontSize: '2.5rem' }}>{studentLogs[0]?.avatar || '👤'}</span>
                                                <div>
                                                    <p className="font-black text-gray-800" style={{ fontSize: '1.8rem' }}>{studentId}</p>
                                                    <p className="text-gray-600" style={{ fontSize: '1.3rem' }}>평균 {avgCpm} CPM · {avgAccuracy}% 정확도</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-black text-blue-600" style={{ fontSize: '2rem' }}>총 {studentLogs.length}회</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-4 gap-3">
                                            <div className="bg-white p-3 rounded-xl text-center border-2 border-blue-100">
                                                <p className="text-gray-600 font-bold mb-1" style={{ fontSize: '1.2rem' }}>📚 모음</p>
                                                <p className="font-black text-blue-600" style={{ fontSize: '1.8rem' }}>{vowelCount}회</p>
                                            </div>
                                            <div className="bg-white p-3 rounded-xl text-center border-2 border-blue-100">
                                                <p className="text-gray-600 font-bold mb-1" style={{ fontSize: '1.2rem' }}>🔤 자음</p>
                                                <p className="font-black text-blue-600" style={{ fontSize: '1.8rem' }}>{consonantCount}회</p>
                                            </div>
                                            <div className="bg-white p-3 rounded-xl text-center border-2 border-blue-100">
                                                <p className="text-gray-600 font-bold mb-1" style={{ fontSize: '1.2rem' }}>📖 단어</p>
                                                <p className="font-black text-blue-600" style={{ fontSize: '1.8rem' }}>{wordCount}회</p>
                                            </div>
                                            <div className="bg-white p-3 rounded-xl text-center border-2 border-blue-100">
                                                <p className="text-gray-600 font-bold mb-1" style={{ fontSize: '1.2rem' }}>📄 문장</p>
                                                <p className="font-black text-blue-600" style={{ fontSize: '1.8rem' }}>{sentenceCount}회</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {activeTab === 'game' && (
                    <div className="bg-white shadow-lg overflow-hidden mt-8" style={{ borderRadius: '20px' }}>
                        <div className="border-b border-gray-100" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)' }}>
                            <h2 className="font-black text-white" style={{ fontSize: '2.5rem' }}>🎮 게임 모드 상세</h2>
                            <p className="text-white mt-1" style={{ fontSize: '1.25rem' }}>학생별 게임 기록과 순위</p>
                        </div>
                        <div className="p-6">
                            {uniqueStudents.map(studentId => {
                                const studentLogs = results.filter(r => r.userId === studentId && ['falling', 'timeattack'].includes(r.mode));
                                if (studentLogs.length === 0) return null;

                                const fallingLogs = studentLogs.filter(l => l.mode === 'falling');
                                const timeattackLogs = studentLogs.filter(l => l.mode === 'timeattack');

                                const fallingBestScore = fallingLogs.length > 0 ? Math.max(...fallingLogs.map(l => l.cpm)) : 0;
                                const timeattackBestScore = timeattackLogs.length > 0 ? Math.max(...timeattackLogs.map(l => l.cpm)) : 0;

                                // 각 게임별 순위 계산
                                const allFallingScores = results.filter(r => r.mode === 'falling')
                                    .reduce((acc, curr) => {
                                        if (!acc[curr.userId]) acc[curr.userId] = [];
                                        acc[curr.userId].push(curr.cpm);
                                        return acc;
                                    }, {} as Record<string, number[]>);
                                
                                const fallingRankings = Object.entries(allFallingScores)
                                    .map(([userId, scores]) => ({ userId, bestScore: Math.max(...(scores as number[])) }))
                                    .sort((a, b) => b.bestScore - a.bestScore);
                                
                                const fallingRank = fallingRankings.findIndex(r => r.userId === studentId) + 1;

                                const allTimeattackScores = results.filter(r => r.mode === 'timeattack')
                                    .reduce((acc, curr) => {
                                        if (!acc[curr.userId]) acc[curr.userId] = [];
                                        acc[curr.userId].push(curr.cpm);
                                        return acc;
                                    }, {} as Record<string, number[]>);
                                
                                const timeattackRankings = Object.entries(allTimeattackScores)
                                    .map(([userId, scores]) => ({ userId, bestScore: Math.max(...(scores as number[])) }))
                                    .sort((a, b) => b.bestScore - a.bestScore);
                                
                                const timeattackRank = timeattackRankings.findIndex(r => r.userId === studentId) + 1;

                                return (
                                    <div key={studentId} className="mb-4 p-5 bg-green-50 rounded-2xl border-2 border-green-200">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span style={{ fontSize: '2.5rem' }}>{studentLogs[0]?.avatar || '👤'}</span>
                                            <div>
                                                <p className="font-black text-gray-800" style={{ fontSize: '1.8rem' }}>{studentId}</p>
                                                <p className="text-gray-600" style={{ fontSize: '1.3rem' }}>총 {studentLogs.length}회 플레이</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            {/* 떨어지는 글자 */}
                                            <div className="bg-white p-4 rounded-xl border-2 border-green-200">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span style={{ fontSize: '2rem' }}>⬇️</span>
                                                    <p className="font-black text-gray-800" style={{ fontSize: '1.5rem' }}>떨어지는 글자</p>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-600 font-bold" style={{ fontSize: '1.2rem' }}>플레이 횟수</span>
                                                        <span className="font-black text-green-600" style={{ fontSize: '1.5rem' }}>{fallingLogs.length}회</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-600 font-bold" style={{ fontSize: '1.2rem' }}>최고 점수</span>
                                                        <span className="font-black text-green-600" style={{ fontSize: '1.5rem' }}>{fallingBestScore} CPM</span>
                                                    </div>
                                                    {fallingRank > 0 && (
                                                        <div className="flex justify-between items-center pt-2 border-t border-green-100">
                                                            <span className="text-gray-600 font-bold" style={{ fontSize: '1.2rem' }}>순위</span>
                                                            <span className="font-black text-yellow-600" style={{ fontSize: '1.8rem' }}>
                                                                {fallingRank === 1 ? '🥇' : fallingRank === 2 ? '🥈' : fallingRank === 3 ? '🥉' : `${fallingRank}등`}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* 시간 공격 */}
                                            <div className="bg-white p-4 rounded-xl border-2 border-green-200">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span style={{ fontSize: '2rem' }}>⏱️</span>
                                                    <p className="font-black text-gray-800" style={{ fontSize: '1.5rem' }}>시간 공격</p>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-600 font-bold" style={{ fontSize: '1.2rem' }}>플레이 횟수</span>
                                                        <span className="font-black text-green-600" style={{ fontSize: '1.5rem' }}>{timeattackLogs.length}회</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-600 font-bold" style={{ fontSize: '1.2rem' }}>최고 점수</span>
                                                        <span className="font-black text-green-600" style={{ fontSize: '1.5rem' }}>{timeattackBestScore} CPM</span>
                                                    </div>
                                                    {timeattackRank > 0 && (
                                                        <div className="flex justify-between items-center pt-2 border-t border-green-100">
                                                            <span className="text-gray-600 font-bold" style={{ fontSize: '1.2rem' }}>순위</span>
                                                            <span className="font-black text-yellow-600" style={{ fontSize: '1.8rem' }}>
                                                                {timeattackRank === 1 ? '🥇' : timeattackRank === 2 ? '🥈' : timeattackRank === 3 ? '🥉' : `${timeattackRank}등`}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {activeTab === 'story' && (
                    <div className="bg-white shadow-lg overflow-hidden mt-8" style={{ borderRadius: '20px' }}>
                        <div className="border-b border-gray-100" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #F97316 0%, #EC4899 100%)' }}>
                            <h2 className="font-black text-white" style={{ fontSize: '2.5rem' }}>🤖 AI 스토리 상세</h2>
                            <p className="text-white mt-1" style={{ fontSize: '1.25rem' }}>학생별 작성 주제와 기록</p>
                        </div>
                        <div className="p-6">
                            {uniqueStudents.map(studentId => {
                                const studentLogs = results.filter(r => r.userId === studentId && r.mode === 'story');
                                if (studentLogs.length === 0) return null;

                                const avgCpm = Math.round(studentLogs.reduce((acc, curr) => acc + curr.cpm, 0) / studentLogs.length);
                                const avgAccuracy = Math.round(studentLogs.reduce((acc, curr) => acc + curr.accuracy, 0) / studentLogs.length);

                                return (
                                    <div key={studentId} className="mb-4 p-5 bg-orange-50 rounded-2xl border-2 border-orange-200">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <span style={{ fontSize: '2.5rem' }}>{studentLogs[0]?.avatar || '👤'}</span>
                                                <div>
                                                    <p className="font-black text-gray-800" style={{ fontSize: '1.8rem' }}>{studentId}</p>
                                                    <p className="text-gray-600" style={{ fontSize: '1.3rem' }}>평균 {avgCpm} CPM · {avgAccuracy}% 정확도</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-black text-orange-600" style={{ fontSize: '2rem' }}>총 {studentLogs.length}회</p>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <p className="font-black text-gray-700" style={{ fontSize: '1.4rem' }}>💡 작성한 주제들</p>
                                            {studentLogs.map((log, i) => (
                                                <div key={i} className="bg-white p-4 rounded-xl border-2 border-orange-200">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <p className="font-black text-orange-600 mb-2" style={{ fontSize: '1.5rem' }}>{log.keywords || '주제 없음'}</p>
                                                            <div className="flex gap-4 text-gray-600" style={{ fontSize: '1.2rem' }}>
                                                                <span>⚡ {log.cpm} CPM</span>
                                                                <span>🎯 {log.accuracy}%</span>
                                                                <span>⏱️ {log.time}초</span>
                                                            </div>
                                                        </div>
                                                        <span className="text-gray-400" style={{ fontSize: '1rem' }}>
                                                            {new Date(log.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
