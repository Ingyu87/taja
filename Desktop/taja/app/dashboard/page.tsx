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
                                {user.role === 'teacher' ? '👨‍🏫 교사' : '🎓 학생'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-6 py-2 rounded-xl font-bold text-lg transition-all duration-200 hover:opacity-80"
                        style={{
                            backgroundColor: '#FF6B9D',
                            color: 'white',
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

            {/* 연습 모드 리스트 */}
            <div className="max-w-5xl mx-auto px-8 pb-20">
                <div className="space-y-0">
                    {PRACTICE_MODES.map((mode, index) => (
                        <div
                            key={mode.id}
                            className="relative"
                            style={{
                                borderBottom: index < PRACTICE_MODES.length - 1 ? '1px solid #E0E0E0' : 'none'
                            }}
                        >
                            <div className="flex items-center justify-between py-8 px-6 hover:bg-gray-50 transition-colors duration-200">
                                {/* 왼쪽: 아이콘 + 텍스트 */}
                                <div className="flex items-center gap-6">
                                    {/* 아이콘 */}
                                    <div className="text-5xl">
                                        {mode.emoji}
                                    </div>

                                    {/* 텍스트 */}
                                    <div>
                                        <h2 className="text-3xl font-bold mb-1" style={{ color: '#333' }}>
                                            {mode.title}
                                        </h2>
                                        <p className="text-lg text-gray-600">
                                            {mode.description}
                                        </p>
                                    </div>
                                </div>

                                {/* 오른쪽: 입장 버튼 */}
                                <button
                                    onClick={() => router.push(`/practice/${mode.id}`)}
                                    className="px-16 py-4 rounded-xl font-bold text-xl transition-all duration-200 hover:opacity-90 flex-shrink-0"
                                    style={{
                                        background: 'linear-gradient(135deg, #FF6B9D 0%, #FFA8C5 100%)',
                                        color: 'white',
                                    }}
                                >
                                    입장
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 하단 버튼 */}
            <div className="text-center pb-16">
                <button
                    onClick={() => router.push('/')}
                    className="px-12 py-4 text-xl font-medium rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-200"
                    style={{ color: '#666', border: '2px solid #E0E0E0' }}
                >
                    ← 홈으로 돌아가기
                </button>
            </div>
        </div>
    );
}
