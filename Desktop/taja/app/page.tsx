'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center py-12 px-8"
      style={{ backgroundColor: '#FAF9F6', minHeight: 'auto' }}>
      <div className="text-center max-w-4xl mx-auto flex flex-col gap-8 w-full">
        {/* 메인 타이틀 */}
        <div className="space-y-4 mb-8">
          <div className="text-5xl mb-4">👑</div>
          <h1 className="text-4xl font-bold text-gray-800">
            AI와 함께하는 재미있는 한글 타자 연습
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            동화, 시, 게임으로 즐겁게 배우는 타자 연습! 친구들과 경쟁하고 멋진 배지도 모아보세요 ✨
          </p>
        </div>

        {/* 메인 시작 버튼 (카드형) */}
        <div className="flex justify-center items-center w-full mb-8">
          <div
            onClick={() => {
              const userStr = localStorage.getItem('current_user');
              const user = userStr ? JSON.parse(userStr) : null;
              if (user) {
                router.push('/dashboard');
              } else {
                router.push('/login');
              }
            }}
            className="group relative bg-white p-12 shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1 w-full text-center"
            style={{
              borderRadius: '32px',
              border: '3px solid #9B59B6'
            }}
          >
            <div className="text-5xl mb-6">👑</div>
            <h2 className="text-3xl font-bold mb-4 text-gray-800">시작하기</h2>
            <p className="text-lg text-gray-600 mb-6">재미있는 타자 왕국으로 입장하세요!</p>
            <div className="py-4 px-8 font-bold text-xl text-white shadow-md inline-block transform group-hover:scale-105 transition-all"
              style={{ 
                borderRadius: '24px',
                background: 'linear-gradient(135deg, #FF6B9D 0%, #4ECDC4 100%)' 
              }}>
              입장하기 →
            </div>
          </div>
        </div>

        {/* 기능 소개 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <div className="bg-white p-6 shadow-md hover:shadow-lg transition-all border-2 border-purple-300" style={{ borderRadius: '24px' }}>
            <div className="text-4xl mb-4">📚</div>
            <h3 className="font-bold text-xl mb-3 text-gray-800">
              단계별 연습
            </h3>
            <p className="text-base text-gray-600 leading-relaxed">
              모음, 자음부터 문장까지 차근차근
            </p>
          </div>

          <div className="bg-white p-6 shadow-md hover:shadow-lg transition-all border-2 border-purple-300" style={{ borderRadius: '24px' }}>
            <div className="text-4xl mb-4">🎮</div>
            <h3 className="font-bold text-xl mb-3 text-gray-800">
              재미있는 게임
            </h3>
            <p className="text-base text-gray-600 leading-relaxed">
              5가지 타자 게임으로 즐겁게 연습
            </p>
          </div>

          <div className="bg-white p-6 shadow-md hover:shadow-lg transition-all border-2 border-purple-300" style={{ borderRadius: '24px' }}>
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="font-bold text-xl mb-3 text-gray-800">
              AI 스토리
            </h3>
            <p className="text-base text-gray-600 leading-relaxed">
              내가 원하는 주제로 AI가 글 생성
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
