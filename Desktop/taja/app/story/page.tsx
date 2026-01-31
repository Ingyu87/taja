'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function StoryPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [keywords, setKeywords] = useState('');
    const [story, setStory] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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

            setStory(data.story);
        } catch (err: any) {
            setError(err.message || '이야기를 만들 수 없습니다. 다시 시도해주세요.');
        } finally {
            setLoading(false);
        }
    };

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
                <div className="w-full max-w-4xl">
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
                        <label className="block font-black mb-6" style={{ fontSize: '2.5rem', color: '#333' }}>
                            키워드를 입력하세요 (띄어쓰기로 구분)
                        </label>
                        <input
                            type="text"
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                            placeholder="예: 토끼 거북이 달리기 경주"
                            className="mx-auto px-8 text-center border-4 focus:outline-none focus:ring-4 focus:ring-pink-200 font-bold rounded-full"
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

                        {error && (
                            <div className="mt-6 p-6 rounded-3xl text-center bg-red-50 text-red-600 font-black border-4 border-red-200" style={{ fontSize: '1.8rem' }}>
                                {error}
                            </div>
                        )}

                        <button
                            onClick={generateStory}
                            disabled={loading || !keywords.trim()}
                            className="w-full mt-8 px-12 py-6 font-black text-white rounded-full shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                            style={{
                                background: 'linear-gradient(135deg, #FF6B9D 0%, #9B59B6 100%)',
                                fontSize: '2.5rem'
                            }}
                        >
                            {loading ? '✨ 이야기를 만들고 있어요...' : '🎨 이야기 만들어줘!'}
                        </button>
                    </div>

                    {/* 생성된 이야기 */}
                    {story && (
                        <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-12 shadow-2xl" style={{ borderRadius: '40px' }}>
                            <div className="flex items-center gap-4 mb-8">
                                <span style={{ fontSize: '3rem' }}>📖</span>
                                <h3 className="font-black" style={{ fontSize: '2.5rem', color: '#9B59B6' }}>
                                    AI가 만든 이야기
                                </h3>
                            </div>
                            <div 
                                className="bg-white p-8 rounded-3xl shadow-inner"
                                style={{ 
                                    fontSize: '1.8rem',
                                    lineHeight: '2',
                                    color: '#333',
                                    whiteSpace: 'pre-wrap'
                                }}
                            >
                                {story}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
