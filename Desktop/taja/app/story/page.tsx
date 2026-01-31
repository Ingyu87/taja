'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useTyping } from '@/hooks/useTyping';
import { StoryPracticeDisplay } from '@/components/practice/StoryPracticeDisplay';
import { saveResultToFirestore } from '@/lib/firestore';

export default function StoryPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [keywords, setKeywords] = useState('');
    const [story, setStory] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showTypingPractice, setShowTypingPractice] = useState(false);
    const [completedStats, setCompletedStats] = useState<{ cpm: number; accuracy: number; time: number } | null>(null);

    const {
        inputText,
        status,
        cpm,
        accuracy,
        inputProps,
        reset
    } = useTyping({
        targetText: story,
        onFinish: async (stats) => {
            setCompletedStats(stats);
            
            // Firestore에 결과 저장
            if (user) {
                await saveResultToFirestore({
                    userId: user.id,
                    username: user.username,
                    avatar: user.avatar,
                    mode: 'story',
                    cpm: stats.cpm,
                    accuracy: stats.accuracy,
                    time: stats.time
                });
            }
        }
    });

    useEffect(() => {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            router.replace('/login');
        } else {
            setUser(currentUser);
        }
    }, [router]);

    const generateStory = async () => {
        if (!keywords.trim()) {
            setError('키워드를 입력해주세요!');
            return;
        }

        setLoading(true);
        setError('');
        setStory('');
        setShowTypingPractice(false);
        setCompletedStats(null);

        try {
            const response = await fetch('/api/story', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ keywords: keywords.trim().split(/\s+/) })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || '이야기 생성에 실패했습니다');
            }

            // 마크다운 문법 제거 (만약 남아있다면)
            const cleanStory = data.story
                .replace(/\*\*/g, '')
                .replace(/\*/g, '')
                .replace(/_/g, '')
                .replace(/#{1,6}\s/g, '')
                .trim();

            setStory(cleanStory);
            setShowTypingPractice(true);
        } catch (err: any) {
            setError(err.message || '이야기를 만들 수 없습니다. 다시 시도해주세요.');
        } finally {
            setLoading(false);
        }
    };

    const handleNewStory = () => {
        setStory('');
        setShowTypingPractice(false);
        setKeywords('');
        setCompletedStats(null);
        reset();
    };

    // 현재 진행 중인 글자 인덱스 계산
    const currentIndex = inputText.length;

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAF9F6' }}>
            {/* 상단 헤더 */}
            <div className="bg-white shadow-md py-4 px-8">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="px-8 py-4 font-black bg-white hover:bg-gray-50 transition-all rounded-3xl shadow-md"
                        style={{ border: '3px solid #9B59B6', fontSize: '2rem', color: '#666' }}
                    >
                        ← 뒤로가기
                    </button>
                    <h1 className="text-4xl font-black text-purple-600">🤖 AI 이야기 생성기</h1>
                    <div style={{ width: '150px' }}></div>
                </div>
            </div>

            {/* 메인 콘텐츠 */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-6xl">
                    {!showTypingPractice && status !== 'finished' && (
                        <>
                            {/* 설명 */}
                            <div className="text-center mb-12">
                                <div className="flex items-center justify-center gap-6 mb-6">
                                    <span style={{ fontSize: '5rem' }}>✨</span>
                                    <h2 style={{ fontSize: '4rem' }} className="font-black text-pink-500">
                                        마법의 이야기 만들기
                                    </h2>
                                    <span style={{ fontSize: '5rem' }}>✨</span>
                                </div>
                                <p style={{ fontSize: '2rem' }} className="font-bold text-gray-700">
                                    좋아하는 단어들을 입력하면 AI가 신나는 이야기를 만들어줘요!
                                </p>
                            </div>

                            {/* 입력 영역 */}
                            <div className="bg-white p-12 shadow-2xl mb-8" style={{ borderRadius: '40px' }}>
                                <label className="block font-black mb-6 text-center" style={{ fontSize: '2.5rem', color: '#333' }}>
                                    키워드를 입력하세요 (띄어쓰기로 구분)
                                </label>
                                <div className="flex justify-center mb-12">
                                    <input
                                        type="text"
                                        value={keywords}
                                        onChange={(e) => setKeywords(e.target.value)}
                                        placeholder="예: 토끼 거북이 달리기 경주"
                                        className="px-8 text-center border-4 focus:outline-none focus:ring-4 focus:ring-pink-200 font-bold rounded-full"
                                        style={{ 
                                            borderColor: '#9B59B6',
                                            fontSize: '2rem',
                                            color: '#000000',
                                            width: '50%',
                                            paddingTop: '2rem',
                                            paddingBottom: '2rem'
                                        }}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter' && !loading) {
                                                generateStory();
                                            }
                                        }}
                                    />
                                </div>

                                {error && (
                                    <div className="mb-8 p-6 rounded-3xl text-center bg-red-50 text-red-600 font-black border-4 border-red-200" style={{ fontSize: '1.8rem' }}>
                                        {error}
                                    </div>
                                )}

                                <div className="flex justify-center">
                                    <button
                                        onClick={generateStory}
                                        disabled={loading || !keywords.trim()}
                                        className="px-12 py-6 font-black text-white rounded-full shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                                        style={{
                                            background: 'linear-gradient(135deg, #FF6B9D 0%, #9B59B6 100%)',
                                            fontSize: '2rem',
                                            width: '40%'
                                        }}
                                    >
                                        {loading ? '✨ 이야기를 만들고 있어요...' : '🎨 이야기 만들어줘!'}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {/* 타자 연습 화면 */}
                    {showTypingPractice && status !== 'finished' && story && (
                        <div className="bg-white p-12 shadow-2xl" style={{ borderRadius: '40px' }}>
                            <div className="text-center mb-8">
                                <h2 className="font-black text-purple-600 mb-4" style={{ fontSize: '3rem' }}>
                                    📖 이야기를 따라 쳐보세요!
                                </h2>
                                <div className="flex justify-center gap-8 mb-6">
                                    <div className="bg-gradient-to-r from-green-100 to-green-50 px-6 py-3 rounded-3xl">
                                        <span className="font-black" style={{ fontSize: '1.8rem', color: '#333' }}>
                                            ⚡ {cpm} CPM
                                        </span>
                                    </div>
                                    <div className="bg-gradient-to-r from-purple-100 to-purple-50 px-6 py-3 rounded-3xl">
                                        <span className="font-black" style={{ fontSize: '1.8rem', color: '#333' }}>
                                            ✨ {accuracy}%
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <StoryPracticeDisplay
                                targetText={story}
                                inputText={inputText}
                            />

                            <div className="mt-6">
                                <input
                                    {...inputProps}
                                    className="w-full px-8 py-6 text-center border-4 rounded-3xl focus:outline-none focus:ring-4 focus:ring-purple-300 font-black text-black placeholder-gray-700"
                                    style={{ 
                                        borderColor: '#9B59B6',
                                        fontSize: '2.5rem'
                                    }}
                                    placeholder="여기에 입력하세요"
                                />
                            </div>
                        </div>
                    )}

                    {/* 완료 화면 */}
                    {status === 'finished' && completedStats && (
                        <div className="bg-white p-12 shadow-2xl text-center" style={{ borderRadius: '40px' }}>
                            <div className="mb-8">
                                <h2 className="font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4" style={{ fontSize: '4rem' }}>
                                    🎉 완료했어요!
                                </h2>
                                <p className="font-bold text-gray-700" style={{ fontSize: '2rem' }}>
                                    멋진 타자 실력이에요!
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-10 rounded-3xl mb-10">
                                <div className="grid grid-cols-3 gap-8">
                                    <div className="bg-white p-8 rounded-3xl shadow-md">
                                        <div className="font-black mb-3" style={{ fontSize: '1.8rem', color: '#666' }}>
                                            ⏱️ 소요 시간
                                        </div>
                                        <div className="font-black text-blue-600" style={{ fontSize: '3rem' }}>
                                            {Math.floor(completedStats.time / 60)}분 {Math.round(completedStats.time % 60)}초
                                        </div>
                                    </div>
                                    <div className="bg-white p-8 rounded-3xl shadow-md">
                                        <div className="font-black mb-3" style={{ fontSize: '1.8rem', color: '#666' }}>
                                            ⚡ 타자 속도
                                        </div>
                                        <div className="font-black text-green-600" style={{ fontSize: '3rem' }}>
                                            {completedStats.cpm} CPM
                                        </div>
                                    </div>
                                    <div className="bg-white p-8 rounded-3xl shadow-md">
                                        <div className="font-black mb-3" style={{ fontSize: '1.8rem', color: '#666' }}>
                                            ✨ 정확도
                                        </div>
                                        <div className="font-black text-purple-600" style={{ fontSize: '3rem' }}>
                                            {completedStats.accuracy}%
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center gap-6">
                                <button
                                    onClick={handleNewStory}
                                    className="px-12 py-6 font-black text-white rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
                                    style={{
                                        background: 'linear-gradient(135deg, #FF6B9D 0%, #9B59B6 100%)',
                                        fontSize: '2rem'
                                    }}
                                >
                                    🎨 새 이야기 만들기
                                </button>
                                <button
                                    onClick={() => router.push('/dashboard')}
                                    className="px-12 py-6 font-black text-white rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
                                    style={{
                                        background: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
                                        fontSize: '2rem'
                                    }}
                                >
                                    🏠 홈으로
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
