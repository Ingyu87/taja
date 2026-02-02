'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleStart = () => {
    router.push('/login');
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: '#FAF9F6' }}
    >
      {/* 메인 타이틀 */}
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-6 mb-8">
          <span style={{ fontSize: '6.4rem' }}>👑</span>
        </div>
        <h1 className="font-bold mb-6" style={{ color: '#000000', fontSize: '4rem', lineHeight: '1.2' }}>
          타자왕국
        </h1>
        <p className="font-semibold" style={{ color: '#666666', fontSize: '2rem' }}>
          AI와 게임으로 즐겁게 배우는 타자연습
        </p>
      </div>

      {/* 시작하기 버튼 */}
      <button
        onClick={handleStart}
        className="group relative overflow-hidden rounded-full transition-all duration-300 hover:scale-110 hover:shadow-2xl"
        style={{
          backgroundColor: '#9B59B6',
          padding: '1.6rem 4rem',
        }}
      >
        <div className="flex items-center gap-4">
          <span style={{ fontSize: '2.4rem' }}>✨</span>
          <span className="font-bold" style={{ color: '#FFFFFF', fontSize: '2.4rem' }}>
            시작하기
          </span>
          <span style={{ fontSize: '2.4rem' }}>✨</span>
        </div>
      </button>

      {/* 작은 설명 */}
      <div className="mt-16 flex items-center gap-8">
        <div className="text-center">
          <span style={{ fontSize: '2.4rem' }}>📚</span>
          <p className="mt-2 font-semibold" style={{ color: '#666666', fontSize: '1.2rem' }}>
            단계별 연습
          </p>
        </div>
        <div className="text-center">
          <span style={{ fontSize: '2.4rem' }}>🎮</span>
          <p className="mt-2 font-semibold" style={{ color: '#666666', fontSize: '1.2rem' }}>
            재미있는 게임
          </p>
        </div>
        <div className="text-center">
          <span style={{ fontSize: '2.4rem' }}>🤖</span>
          <p className="mt-2 font-semibold" style={{ color: '#666666', fontSize: '1.2rem' }}>
            AI 스토리
          </p>
        </div>
      </div>
    </div>
  );
}
