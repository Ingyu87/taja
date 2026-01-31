'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center py-16 px-8"
      style={{ backgroundColor: '#FAF9F6' }}>
      <div className="text-center max-w-3xl mx-auto flex flex-col gap-6 w-full">
        {/* 메인 타이틀 */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-3xl">👑</span>
            <h1 className="text-3xl font-bold text-gray-800">
              AI와 함께하는 재미있는 한글 타자 연습
            </h1>
            <span className="text-3xl">👑</span>
          </div>
          <p className="text-base text-gray-600 leading-relaxed">
            동화, 시, 게임으로 즐겁게 배우는 타자 연습! 친구들과 경쟁하고 멋진 배지도 모아보세요 <span className="text-2xl">✨</span>
          </p>
        </div>

        {/* 메인 시작 버튼 (카드형) */}
        <div className="w-full mb-6">
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
            className="group relative bg-white p-8 shadow-md hover:shadow-lg transition-all cursor-pointer w-full text-left"
            style={{
              borderRadius: '20px',
              border: '2px solid #9B59B6'
            }}
          >
            <div className="flex items-start gap-4 mb-4">
              <span className="text-3xl">👑</span>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2 text-gray-800">시작하기</h2>
                <p className="text-base text-gray-600 mb-4">재미있는 타자 왕국으로 입장하세요!</p>
                <div className="py-3 px-6 font-bold text-base text-white shadow-sm inline-block transform group-hover:scale-105 transition-all"
                  style={{ 
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #FF6B9D 0%, #4ECDC4 100%)' 
                  }}>
                  입장하기 →
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 기능 소개 카드 - 세로로 배치 */}
        <div className="flex flex-col gap-4 w-full">
          <div className="bg-white p-6 shadow-sm hover:shadow-md transition-all border-2 border-purple-500 text-left" style={{ borderRadius: '16px' }}>
            <div className="flex items-start gap-4">
              <span className="text-3xl">📚</span>
              <div>
                <h3 className="font-bold text-lg mb-1 text-gray-800">
                  단계별 연습
                </h3>
                <p className="text-sm text-gray-600">
                  모음, 자음부터 문장까지 차근차근
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 shadow-sm hover:shadow-md transition-all border-2 border-purple-500 text-left" style={{ borderRadius: '16px' }}>
            <div className="flex items-start gap-4">
              <span className="text-3xl">🎮</span>
              <div>
                <h3 className="font-bold text-lg mb-1 text-gray-800">
                  재미있는 게임
                </h3>
                <p className="text-sm text-gray-600">
                  5가지 타자 게임으로 즐겁게 연습
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 shadow-sm hover:shadow-md transition-all border-2 border-purple-500 text-left" style={{ borderRadius: '16px' }}>
            <div className="flex items-start gap-4">
              <span className="text-3xl">🤖</span>
              <div>
                <h3 className="font-bold text-lg mb-1 text-gray-800">
                  AI 스토리
                </h3>
                <p className="text-sm text-gray-600">
                  내가 원하는 주제로 AI가 글 생성
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
