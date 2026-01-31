'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center py-12 px-8"
      style={{ backgroundColor: '#FAF9F6' }}>
      <div className="text-center max-w-2xl mx-auto flex flex-col gap-0 w-full">
        {/* 메인 타이틀 */}
        <div className="space-y-2 mb-8">
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">👑</span>
            <h1 className="text-2xl font-bold" style={{ color: '#5D4E6D' }}>
              AI와 함께하는 재미있는 한글 타자 연습
            </h1>
            <span className="text-2xl">👑</span>
          </div>
          <p className="text-sm" style={{ color: '#5D4E6D' }}>
            동화, 시, 게임으로 즐겁게 배우는 타자 연습! 친구들과 경쟁하고 멋진 배지도 모아보세요 ✨
          </p>
        </div>

        {/* 4개 섹션 - 세로로 배치, 보라색 테두리로 구분 */}
        <div className="flex flex-col w-full">
          {/* 섹션 1: 시작하기 */}
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
            className="bg-white p-6 cursor-pointer hover:bg-gray-50 transition-colors border-b-2"
            style={{ borderColor: '#9B59B6' }}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">👑</span>
              <div className="flex-1 text-left">
                <h2 className="text-xl font-bold mb-1" style={{ color: '#5D4E6D' }}>시작하기</h2>
                <p className="text-sm mb-3" style={{ color: '#5D4E6D' }}>재미있는 타자 왕국으로 입장하세요!</p>
                <span className="text-sm px-4 py-2 inline-block rounded-full" style={{ 
                  backgroundColor: '#FFE5F0',
                  color: '#9B59B6'
                }}>
                  입장하기 →
                </span>
              </div>
            </div>
          </div>

          {/* 섹션 2: 단계별 연습 */}
          <div className="bg-white p-6 border-b-2" style={{ borderColor: '#9B59B6' }}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">📚</span>
              <div className="flex-1 text-left">
                <h3 className="text-xl font-bold mb-1" style={{ color: '#5D4E6D' }}>
                  단계별 연습
                </h3>
                <p className="text-sm" style={{ color: '#5D4E6D' }}>
                  모음, 자음부터 문장까지 차근차근
                </p>
              </div>
            </div>
          </div>

          {/* 섹션 3: 재미있는 게임 */}
          <div className="bg-white p-6 border-b-2" style={{ borderColor: '#9B59B6' }}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎮</span>
              <div className="flex-1 text-left">
                <h3 className="text-xl font-bold mb-1" style={{ color: '#5D4E6D' }}>
                  재미있는 게임
                </h3>
                <p className="text-sm" style={{ color: '#5D4E6D' }}>
                  5가지 타자 게임으로 즐겁게 연습
                </p>
              </div>
            </div>
          </div>

          {/* 섹션 4: AI 스토리 */}
          <div className="bg-white p-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🤖</span>
              <div className="flex-1 text-left">
                <h3 className="text-xl font-bold mb-1" style={{ color: '#5D4E6D' }}>
                  AI 스토리
                </h3>
                <p className="text-sm" style={{ color: '#5D4E6D' }}>
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
