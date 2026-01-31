'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center py-16 px-8"
      style={{ backgroundColor: '#FAF9F6' }}>
      <div className="text-center max-w-6xl mx-auto flex flex-col gap-0 w-full">
        {/* 메인 타이틀 */}
        <div className="space-y-10 mb-20">
          <div className="flex items-center justify-center gap-10">
            <span style={{ fontSize: '10rem' }}>👑</span>
            <h1 className="font-bold" style={{ color: '#5D4E6D', fontSize: '8rem', lineHeight: '1.2' }}>
              AI와 함께하는 재미있는 한글 타자 연습
            </h1>
            <span style={{ fontSize: '10rem' }}>👑</span>
          </div>
          <p className="font-semibold" style={{ color: '#5D4E6D', fontSize: '4rem' }}>
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
            className="bg-white p-16 cursor-pointer hover:bg-gray-50 transition-colors border-b-2"
            style={{ borderColor: '#9B59B6' }}
          >
            <div className="flex items-start gap-12">
              <span style={{ fontSize: '10rem' }}>👑</span>
              <div className="flex-1 text-left">
                <h2 className="font-bold mb-8" style={{ color: '#5D4E6D', fontSize: '7rem' }}>시작하기</h2>
                <p className="mb-10 font-semibold" style={{ color: '#5D4E6D', fontSize: '4rem' }}>재미있는 타자 왕국으로 입장하세요!</p>
                <span className="px-16 py-8 inline-block rounded-full font-bold" style={{ 
                  backgroundColor: '#FFE5F0',
                  color: '#9B59B6',
                  fontSize: '4rem'
                }}>
                  입장하기 →
                </span>
              </div>
            </div>
          </div>

          {/* 섹션 2: 단계별 연습 */}
          <div className="bg-white p-16 border-b-2" style={{ borderColor: '#9B59B6' }}>
            <div className="flex items-start gap-12">
              <span style={{ fontSize: '10rem' }}>📚</span>
              <div className="flex-1 text-left">
                <h3 className="font-bold mb-6" style={{ color: '#5D4E6D', fontSize: '7rem' }}>
                  단계별 연습
                </h3>
                <p className="font-semibold" style={{ color: '#5D4E6D', fontSize: '4rem' }}>
                  모음, 자음부터 문장까지 차근차근
                </p>
              </div>
            </div>
          </div>

          {/* 섹션 3: 재미있는 게임 */}
          <div className="bg-white p-16 border-b-2" style={{ borderColor: '#9B59B6' }}>
            <div className="flex items-start gap-12">
              <span style={{ fontSize: '10rem' }}>🎮</span>
              <div className="flex-1 text-left">
                <h3 className="font-bold mb-6" style={{ color: '#5D4E6D', fontSize: '7rem' }}>
                  재미있는 게임
                </h3>
                <p className="font-semibold" style={{ color: '#5D4E6D', fontSize: '4rem' }}>
                  5가지 타자 게임으로 즐겁게 연습
                </p>
              </div>
            </div>
          </div>

          {/* 섹션 4: AI 스토리 */}
          <div className="bg-white p-16">
            <div className="flex items-start gap-12">
              <span style={{ fontSize: '10rem' }}>🤖</span>
              <div className="flex-1 text-left">
                <h3 className="font-bold mb-6" style={{ color: '#5D4E6D', fontSize: '7rem' }}>
                  AI 스토리
                </h3>
                <p className="font-semibold" style={{ color: '#5D4E6D', fontSize: '4rem' }}>
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
