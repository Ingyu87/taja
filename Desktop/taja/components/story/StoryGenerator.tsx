'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface StoryGeneratorProps {
    keywords: string[];
}

export default function StoryGenerator({ keywords }: StoryGeneratorProps) {
    const [story, setStory] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [generated, setGenerated] = useState(false);

    const generateStory = async () => {
        setLoading(true);
        setError('');
        setStory('');

        try {
            const res = await fetch('/api/story', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ keywords }),
            });

            const data = await res.json();

            if (data.success) {
                setStory(data.story);
                setGenerated(true);
            } else {
                setError(data.error || '이야기를 만들지 못했어요. 😢');
            }
        } catch (err) {
            setError('무언가 잘못되었어요. 다시 시도해주세요.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-8 p-6 bg-white shadow-lg border-2 border-pink-100" style={{ borderRadius: '32px' }}>
            {!generated ? (
                <div className="text-center">
                    <h3 className="text-2xl font-bold mb-4" style={{ color: '#5D4E6D' }}>
                        ✍️ AI 작가님에게 이야기 부탁하기
                    </h3>
                    <p className="mb-6 text-gray-600">
                        방금 연습한 단어들로 재미있는 이야기를 만들어볼까요?
                    </p>

                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                        {keywords.slice(0, 5).map((word, i) => (
                            <span key={i} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                                {word}
                            </span>
                        ))}
                        {keywords.length > 5 && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-sm">
                                +{keywords.length - 5}
                            </span>
                        )}
                    </div>

                    <button
                        onClick={generateStory}
                        disabled={loading}
                        className={`
                            px-12 py-6 font-black text-2xl text-white transition-all shadow-lg
                            ${loading
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 hover:shadow-xl transform hover:-translate-y-1'}
                        `}
                        style={{ 
                            borderRadius: '32px',
                            minHeight: '70px'
                        }}
                    >
                        {loading ? '이야기를 짓는 중... 🤔' : '🪄 이야기 만들어줘!'}
                    </button>

                    {error && (
                        <p className="mt-4 text-red-500 font-medium animate-pulse">
                            {error}
                        </p>
                    )}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="prose prose-lg max-w-none"
                >
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-pink-500">✨ AI가 지은 이야기</h3>
                        <button
                            onClick={() => setGenerated(false)}
                            className="text-sm text-gray-400 hover:text-gray-600 underline"
                        >
                            다시 만들기
                        </button>
                    </div>

                    <div className="p-6 bg-pink-50 leading-relaxed whitespace-pre-wrap font-medium text-gray-700"
                        style={{ 
                            borderRadius: '32px',
                            fontFamily: 'var(--font-gowun-dodum)'
                        }}>
                        {story}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
